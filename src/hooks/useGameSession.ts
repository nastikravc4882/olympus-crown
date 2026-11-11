import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import {
  BANNER_MS,
  BET,
  COLS,
  GATE_SPINS,
  QUICK_DROP_MS,
  QUICK_STAGGER_MS,
  REDUCED_MOTION_MS,
  SHATTER_MS,
  SPIN_DROP_MS,
  SPIN_STAGGER_MS,
  TUMBLE_MS,
} from '../constants/config';
import { resolveChain, type ChainResult } from '../game/cascade';
import { dailyChallenges, tokensEarned, trackSession, type Challenge } from '../game/challenges';
import { addFavour } from '../game/favour';
import type { Grid } from '../game/grid';
import { levelAt } from '../game/levels';
import { applyOrbs, orbIndices, orbSum } from '../game/orbs';
import { effectsOf } from '../game/rewards';
import { spinSeed } from '../game/rng';
import {
  canSpin as canSpinOf,
  newSession,
  sessionStars,
  type SessionStats,
} from '../game/session';
import { buildGrid, type DropOptions } from '../game/spinEngine';
import { symbolDef, type SymbolId } from '../game/symbols';
import { addCoins, getState, recordSession } from '../state/store';
import { useStoreValue } from './useStore';
import { useTimers } from './useTimers';

export type Phase = 'idle' | 'spinning' | 'resolving' | 'over';

export type SessionSummary = {
  score: number;
  spins: number;
  cascades: number;
  bestMulti: number;
  orbs: number;
  stars: number;
  levelIndex: number;
  tokens: number;
  gateRounds: number;
};

/**
 * The whole round loop of OlympusCrown. The loop is started by a player action,
 * every deferred step goes through useTimers so nothing survives the screen, and
 * the busy flag is reset in the completion path of every branch.
 */
export function useGameSession(onFinish: (s: SessionSummary) => void) {
  const { after, clearAll, alive } = useTimers();

  const levelIndex = useStoreValue(s => s.levelIndex);
  const relics = useStoreValue(s => s.relics);
  const quickSpin = useStoreValue(s => s.settings.quickSpin);
  const reducedMotion = useStoreValue(s => s.settings.reducedMotion);
  const autoCollect = useStoreValue(s => s.settings.autoCollect);
  const orbBlessing = useStoreValue(s => s.orbBlessing);
  const coins = useStoreValue(s => s.coins);

  const fx = useMemo(() => effectsOf(relics), [relics]);
  const level = levelAt(levelIndex);

  const salt = useRef(((Date.now() & 0x7fffffff) ^ 0x5bf03635) >>> 0).current;
  const [session, setSession] = useState<SessionStats>(() => newSession(levelIndex, fx.extraSpins));
  const [grid, setGrid] = useState<Grid>(() => buildGrid(spinSeed(levelIndex, 0, salt)));
  const [winCells, setWinCells] = useState<number[]>([]);
  const [phase, setPhase] = useState<Phase>('idle');
  const [banner, setBanner] = useState('');
  const [lastWin, setLastWin] = useState(0);
  const [multi, setMulti] = useState(1);
  const [favour, setFavour] = useState(0);
  const [started, setStarted] = useState(false);

  const busy = useRef(false);
  const carry = useRef(0);
  const favourRef = useRef(0);
  const sessionRef = useRef(session);
  sessionRef.current = session;
  const signalsRef = useRef({
    maxChainInSpin: 0,
    orbsCollected: 0,
    crownSets: 0,
    favourBursts: 0,
    bestMulti: 1,
  });

  const activeChallenges: Challenge[] = useMemo(
    () => dailyChallenges(Math.floor(Date.now() / 86400000) % 5),
    [],
  );

  const colAnims = useMemo(() => Array.from({ length: COLS }, () => new Animated.Value(0)), []);

  const timing = useMemo(() => {
    if (reducedMotion) {
      return {
        stagger: 0,
        drop: REDUCED_MOTION_MS,
        shatter: REDUCED_MOTION_MS,
        tumble: REDUCED_MOTION_MS,
        banner: 240,
      };
    }
    if (quickSpin) {
      return { stagger: QUICK_STAGGER_MS, drop: QUICK_DROP_MS, shatter: 180, tumble: 150, banner: 420 };
    }
    return {
      stagger: SPIN_STAGGER_MS,
      drop: SPIN_DROP_MS,
      shatter: SHATTER_MS,
      tumble: TUMBLE_MS,
      banner: BANNER_MS,
    };
  }, [quickSpin, reducedMotion]);

  const dropOpts: DropOptions = useMemo(
    () => ({
      pity: false,
      wildPerColumn: fx.wildPerColumn,
      orbChanceBonus: fx.orbChanceBonus + (orbBlessing ? 0.06 : 0),
    }),
    [fx.wildPerColumn, fx.orbChanceBonus, orbBlessing],
  );

  // The loop never outlives the screen.
  useEffect(() => {
    return () => {
      busy.current = false;
      clearAll();
    };
  }, [clearAll]);

  const finish = useCallback(
    (reason: 'spins' | 'collect') => {
      const s = sessionRef.current;
      const before = getState().challenges;
      const nextProgress = trackSession(activeChallenges, before, signalsRef.current);
      const earned = tokensEarned(activeChallenges, before, nextProgress);
      const stars = sessionStars(s);
      const summary: SessionSummary = {
        score: s.score,
        spins: s.spinsPlayed,
        cascades: s.cascades,
        bestMulti: s.bestMulti,
        orbs: s.orbsCollected,
        stars,
        levelIndex: s.levelIndex,
        tokens: earned,
        gateRounds: s.gateRounds,
      };
      recordSession({
        score: s.score,
        spins: s.spinsPlayed,
        cascades: s.cascades,
        bestMulti: s.bestMulti,
        stars,
        levelIndex: s.levelIndex,
        tokens: earned,
        challenges: nextProgress,
      });
      busy.current = false;
      setPhase('over');
      setBanner(reason === 'collect' ? 'FAVOUR COLLECTED' : 'THE SESSION ENDS');
      after(reason === 'collect' ? 240 : 520, () => onFinish(summary));
    },
    [activeChallenges, after, onFinish],
  );

  const settleSpin = useCallback(
    (chain: ChainResult) => {
      const finalGrid = chain.finalGrid;
      const orbCells = orbIndices(finalGrid);
      const rawOrbs = orbSum(finalGrid) + orbCells.length * fx.orbBonus;
      const inGate = sessionRef.current.bonusSpinsLeft > 0;
      carry.current = inGate ? carry.current + rawOrbs : rawOrbs;
      const orbTotal = carry.current;
      const spinWin = applyOrbs(chain.chainWin, orbTotal);
      const appliedMulti = Math.max(1, orbTotal);

      setMulti(appliedMulti);
      setLastWin(spinWin);
      setWinCells([]);
      setGrid(finalGrid);

      if (spinWin > 0) {
        addCoins(spinWin);
      }

      const fav = addFavour(favourRef.current, chain.cascades, orbCells.length);
      favourRef.current = fav.value;
      setFavour(fav.value);

      const sig = signalsRef.current;
      sig.maxChainInSpin = Math.max(sig.maxChainInSpin, chain.cascades);
      sig.orbsCollected += orbCells.length;
      sig.bestMulti = Math.max(sig.bestMulti, appliedMulti);
      for (const step of chain.steps) {
        for (const w of step.pay.wins) {
          if (w.id === 'CROWN') {
            sig.crownSets += 1;
          }
        }
      }
      if (fav.burst) {
        sig.favourBursts += 1;
        carry.current = 0;
      }

      const prev = sessionRef.current;
      const bonusLeft = prev.bonusSpinsLeft > 0 ? prev.bonusSpinsLeft - 1 : 0;
      const nextSession: SessionStats = {
        ...prev,
        score: prev.score + spinWin,
        cascades: prev.cascades + chain.cascades,
        orbsCollected: prev.orbsCollected + orbCells.length,
        bestMulti: Math.max(prev.bestMulti, appliedMulti),
        dryStreak: spinWin > 0 ? 0 : prev.dryStreak + 1,
        bonusSpinsLeft: fav.burst ? bonusLeft + GATE_SPINS : bonusLeft,
        gateRounds: fav.burst ? prev.gateRounds + 1 : prev.gateRounds,
      };
      sessionRef.current = nextSession;
      setSession(nextSession);

      if (fav.burst) {
        setBanner('THE GATE OPENS · ' + GATE_SPINS + ' FREE SPINS');
      } else if (chain.cascades === 0) {
        setBanner('THE SKY IS QUIET');
      } else {
        setBanner('CASCADE x' + chain.cascades + ' · +' + spinWin);
      }

      busy.current = false;
      setPhase('idle');

      const sessionDone = nextSession.bonusSpinsLeft === 0 && nextSession.spinsPlayed >= nextSession.spinsAllowed;
      if (sessionDone) {
        if (autoCollect) {
          after(680, () => finish('spins'));
        } else {
          after(timing.banner + 200, () => setBanner('TAP COLLECT TO CLAIM'));
        }
      } else {
        after(timing.banner + 200, () => setBanner(''));
      }
    },
    [after, autoCollect, finish, fx.orbBonus, timing.banner],
  );

  const playStep = useCallback(
    (chain: ChainResult, i: number) => {
      if (!alive.current) {
        return;
      }
      if (i >= chain.steps.length) {
        settleSpin(chain);
        return;
      }
      const step = chain.steps[i];
      setGrid(step.grid);
      setWinCells(step.pay.removed);
      setBanner('CASCADE x' + (i + 1));
      after(timing.shatter, () => {
        setGrid(step.next);
        setWinCells([]);
        after(timing.tumble, () => playStep(chain, i + 1));
      });
    },
    [after, alive, settleSpin, timing.shatter, timing.tumble],
  );

  const spin = useCallback(() => {
    if (busy.current) {
      return;
    }
    const s = sessionRef.current;
    if (!canSpinOf(s, getState().coins)) {
      finish('spins');
      return;
    }
    busy.current = true;
    setStarted(true);
    setPhase('spinning');
    setBanner('');
    setLastWin(0);
    setWinCells([]);
    addCoins(-BET);

    const spinNo = s.spinsPlayed + 1;
    const seed = spinSeed(s.levelIndex, spinNo, salt);
    const opts: DropOptions = { ...dropOpts, pity: s.dryStreak >= 5 };
    const fresh = buildGrid(seed, opts);

    const nextSession: SessionStats = { ...s, spinsPlayed: s.spinsPlayed + 1 };
    sessionRef.current = nextSession;
    setSession(nextSession);
    setGrid(fresh);

    if (fx.revealTop) {
      const counts: Record<string, number> = {};
      for (const cell of fresh) {
        counts[cell.id] = (counts[cell.id] || 0) + 1;
      }
      const top = Object.keys(counts)
        .filter(k => symbolDef(k as SymbolId) && symbolDef(k as SymbolId).pay > 0)
        .sort((a, b) => counts[b] - counts[a])[0];
      if (top) {
        setBanner('ORACLE EYE · ' + symbolDef(top as SymbolId).label);
      }
    }

    const chain = resolveChain(fresh, BET, seed, opts);

    // Columns drop left to right; evaluation runs only after the LAST one lands.
    const anims = colAnims.map(v => {
      v.setValue(-1);
      return Animated.timing(v, {
        toValue: 0,
        duration: timing.drop,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      });
    });
    Animated.stagger(timing.stagger, anims).start();

    const settleAt = timing.stagger * (COLS - 1) + timing.drop + 80;
    after(settleAt, () => {
      setPhase('resolving');
      playStep(chain, 0);
    });
  }, [after, colAnims, dropOpts, finish, fx.revealTop, playStep, salt, timing.drop, timing.stagger]);

  const collect = useCallback(() => {
    if (busy.current || !started) {
      return;
    }
    finish('collect');
  }, [finish, started]);

  const spinsLeft = Math.max(0, session.spinsAllowed - session.spinsPlayed) + session.bonusSpinsLeft;
  const canSpinNow = phase === 'idle' && canSpinOf(session, coins);

  return {
    grid,
    winCells,
    phase,
    banner,
    lastWin,
    multi,
    favour,
    session,
    started,
    level,
    colAnims,
    spinsLeft,
    canSpinNow,
    reducedMotion,
    activeChallenges,
    spin,
    collect,
  };
}
