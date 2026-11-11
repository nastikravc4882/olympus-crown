export type ChallengeId = 'CHAIN3' | 'ORBS6' | 'CROWNED' | 'FAVOUR' | 'HIGHSTORM';

export type Challenge = {
  id: ChallengeId;
  title: string;
  hint: string;
  goal: number;
  reward: number;
};

export const CHALLENGE_POOL: Challenge[] = [
  { id: 'CHAIN3', title: 'CHAIN OF THREE', hint: '3 CASCADES IN ONE SPIN', goal: 3, reward: 2 },
  { id: 'ORBS6', title: 'ORB HUNTER', hint: 'COLLECT 6 ORBS IN A SESSION', goal: 6, reward: 2 },
  { id: 'CROWNED', title: 'CROWNED', hint: 'LAND 8 OR MORE CROWNS', goal: 1, reward: 3 },
  { id: 'FAVOUR', title: 'FAVOUR RUSH', hint: 'FILL THE FAVOUR METER ONCE', goal: 1, reward: 2 },
  { id: 'HIGHSTORM', title: 'HIGH STORM', hint: 'REACH A TOTAL MULTIPLIER OF 20', goal: 20, reward: 3 },
];

export type ChallengeProgress = Record<string, number>;

/** Three goals a day, rotated deterministically by the day number. */
export function dailyChallenges(dayNumber: number): Challenge[] {
  const out: Challenge[] = [];
  for (let i = 0; i < 3; i++) {
    out.push(CHALLENGE_POOL[(dayNumber + i * 2) % CHALLENGE_POOL.length]);
  }
  return out;
}

export function isComplete(c: Challenge, progress: ChallengeProgress): boolean {
  return (progress[c.id] || 0) >= c.goal;
}

export type SessionSignals = {
  maxChainInSpin: number;
  orbsCollected: number;
  crownSets: number;
  favourBursts: number;
  bestMulti: number;
};

/** Live tracking during a session; returns the updated progress map. */
export function trackSession(
  active: Challenge[],
  progress: ChallengeProgress,
  s: SessionSignals,
): ChallengeProgress {
  const next: ChallengeProgress = { ...progress };
  for (const c of active) {
    const have = next[c.id] || 0;
    let value = have;
    if (c.id === 'CHAIN3') {
      value = Math.max(have, s.maxChainInSpin);
    } else if (c.id === 'ORBS6') {
      value = Math.max(have, s.orbsCollected);
    } else if (c.id === 'CROWNED') {
      value = Math.max(have, s.crownSets > 0 ? 1 : 0);
    } else if (c.id === 'FAVOUR') {
      value = Math.max(have, s.favourBursts > 0 ? 1 : 0);
    } else if (c.id === 'HIGHSTORM') {
      value = Math.max(have, s.bestMulti);
    }
    next[c.id] = Math.min(value, c.goal);
  }
  return next;
}

export function tokensEarned(active: Challenge[], before: ChallengeProgress, after: ChallengeProgress): number {
  let tokens = 0;
  for (const c of active) {
    if (!isComplete(c, before) && isComplete(c, after)) {
      tokens += c.reward;
    }
  }
  return tokens;
}
