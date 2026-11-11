import {
  START_COINS,
  START_TOKENS,
  XP_PER_CASCADE,
  XP_PER_SPIN,
} from '../constants/config';
import type { ChallengeProgress } from '../game/challenges';
import type { DailyState } from '../game/dailyBonus';
import type { RelicId } from '../game/rewards';
import { clearKey, readJson, STORE_KEY, writeJson } from './persistence';

export type Settings = {
  quickSpin: boolean;
  winHighlight: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  autoCollect: boolean;
};

export type Stats = {
  totalSpins: number;
  bestSession: number;
  biggestMulti: number;
  cascades: number;
  levelsCleared: number;
  xp: number;
};

export type SaveState = {
  coins: number;
  tokens: number;
  levelIndex: number;
  unlockedLevel: number;
  stars: number[];
  relics: RelicId[];
  daily: DailyState;
  challenges: ChallengeProgress;
  settings: Settings;
  stats: Stats;
  orbBlessing: boolean;
  /** id of the challenge started from the Challenge screen, '' when none */
  activeChallenge: string;
};

const DEFAULT_STATE: SaveState = {
  coins: START_COINS,
  tokens: START_TOKENS,
  levelIndex: 0,
  unlockedLevel: 0,
  stars: [0, 0, 0, 0, 0, 0, 0, 0],
  relics: [],
  daily: { day: 1, lastClaimAt: 0 },
  challenges: {},
  settings: {
    quickSpin: false,
    winHighlight: true,
    reducedMotion: false,
    highContrast: false,
    autoCollect: false,
  },
  stats: {
    totalSpins: 0,
    bestSession: 0,
    biggestMulti: 1,
    cascades: 0,
    levelsCleared: 0,
    xp: 0,
  },
  orbBlessing: false,
  activeChallenge: '',
};

export function defaultState(): SaveState {
  return JSON.parse(JSON.stringify(DEFAULT_STATE)) as SaveState;
}

let state: SaveState = defaultState();
const listeners = new Set<() => void>();

export function getState(): SaveState {
  return state;
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function emit(): void {
  listeners.forEach(fn => fn());
}

export function setState(patch: Partial<SaveState> | ((s: SaveState) => Partial<SaveState>)): void {
  const delta = typeof patch === 'function' ? patch(state) : patch;
  state = { ...state, ...delta };
  writeJson(STORE_KEY, state);
  emit();
}

/** Rehydrate once at app start; a corrupt record falls back to defaults. */
export function hydrate(): void {
  state = readJson<SaveState>(STORE_KEY, defaultState());
  emit();
}

export function resetProgress(): void {
  clearKey(STORE_KEY);
  state = defaultState();
  writeJson(STORE_KEY, state);
  emit();
}

/** Test seam: replace the whole state without touching the driver. */
export function __setStateForTest(next: SaveState): void {
  state = next;
  emit();
}

// ---------------------------------------------------------------- actions

export function addCoins(delta: number): void {
  setState(s => ({ coins: Math.max(0, s.coins + delta) }));
}

export function setSetting<K extends keyof Settings>(key: K, value: Settings[K]): void {
  setState(s => ({ settings: { ...s.settings, [key]: value } }));
}

export function unlockRelic(id: RelicId, cost: number): boolean {
  if (state.tokens < cost || state.relics.indexOf(id) >= 0) {
    return false;
  }
  setState(s => ({ tokens: s.tokens - cost, relics: s.relics.concat([id]) }));
  return true;
}

export function selectLevel(index: number): void {
  setState({ levelIndex: index });
}

export function recordSession(input: {
  score: number;
  spins: number;
  cascades: number;
  bestMulti: number;
  stars: number;
  levelIndex: number;
  tokens: number;
  challenges: ChallengeProgress;
}): void {
  setState(s => {
    const cleared = input.stars > 0 && input.levelIndex >= s.unlockedLevel;
    const stars = s.stars.slice();
    stars[input.levelIndex] = Math.max(stars[input.levelIndex] || 0, input.stars);
    return {
      tokens: s.tokens + input.tokens,
      unlockedLevel: cleared ? Math.min(s.stars.length - 1, s.unlockedLevel + 1) : s.unlockedLevel,
      stars,
      challenges: input.challenges,
      orbBlessing: false,
      stats: {
        totalSpins: s.stats.totalSpins + input.spins,
        bestSession: Math.max(s.stats.bestSession, input.score),
        biggestMulti: Math.max(s.stats.biggestMulti, input.bestMulti),
        cascades: s.stats.cascades + input.cascades,
        levelsCleared: cleared ? s.stats.levelsCleared + 1 : s.stats.levelsCleared,
        xp: s.stats.xp + input.spins * XP_PER_SPIN + input.cascades * XP_PER_CASCADE,
      },
    };
  });
}

// ---------------------------------------------------------------- derived

export const TITLES = [
  { name: 'ACOLYTE', from: 0 },
  { name: 'HERALD', from: 400 },
  { name: 'STORMBORN', from: 1200 },
  { name: 'CHOSEN', from: 2000 },
];

export function titleFor(xp: number): { name: string; from: number; to: number } {
  let i = 0;
  for (let k = 0; k < TITLES.length; k++) {
    if (xp >= TITLES[k].from) {
      i = k;
    }
  }
  const next = TITLES[i + 1];
  return { name: TITLES[i].name, from: TITLES[i].from, to: next ? next.from : TITLES[i].from + 800 };
}
