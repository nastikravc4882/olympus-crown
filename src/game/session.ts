import { BET, SESSION_SPINS } from '../constants/config';
import { levelAt, starsFor } from './levels';

export type SessionStats = {
  levelIndex: number;
  spinsPlayed: number;
  spinsAllowed: number;
  score: number;
  cascades: number;
  orbsCollected: number;
  bestMulti: number;
  gateRounds: number;
  dryStreak: number;
  bonusSpinsLeft: number;
};

export function newSession(levelIndex: number, extraSpins: number = 0): SessionStats {
  return {
    levelIndex,
    spinsPlayed: 0,
    spinsAllowed: SESSION_SPINS + extraSpins,
    score: 0,
    cascades: 0,
    orbsCollected: 0,
    bestMulti: 1,
    gateRounds: 0,
    dryStreak: 0,
    bonusSpinsLeft: 0,
  };
}

export function canSpin(s: SessionStats, balance: number): boolean {
  if (balance < BET) {
    return false;
  }
  return s.bonusSpinsLeft > 0 || s.spinsPlayed < s.spinsAllowed;
}

export function isSessionOver(s: SessionStats): boolean {
  return s.bonusSpinsLeft === 0 && s.spinsPlayed >= s.spinsAllowed;
}

export type Verdict = 'GATES' | 'FADES' | 'WITHHOLDS';

/** Verdicts in the game's own words - never "You win" / "Game over". */
export function verdictOf(score: number, levelIndex: number, balance: number): Verdict {
  if (balance < BET) {
    return 'WITHHOLDS';
  }
  return score >= levelAt(levelIndex).target ? 'GATES' : 'FADES';
}

export const VERDICT_TEXT: Record<Verdict, { title: string; hint: string }> = {
  GATES: { title: 'THE GATES OPEN', hint: 'OLYMPUS ANSWERS THE STORM' },
  FADES: { title: 'THE STORM FADES', hint: 'THE RELICS REST FOR NOW' },
  WITHHOLDS: { title: 'ZEUS WITHHOLDS', hint: 'THE PURSE IS EMPTY' },
};

export function sessionStars(s: SessionStats): number {
  return starsFor(s.score, levelAt(s.levelIndex).target);
}
