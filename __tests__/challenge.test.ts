import {
  CHALLENGE_POOL,
  dailyChallenges,
  isComplete,
  tokensEarned,
  trackSession,
} from '../src/game/challenges';

const SIGNALS = {
  maxChainInSpin: 3,
  orbsCollected: 2,
  crownSets: 1,
  favourBursts: 0,
  bestMulti: 8,
};

describe('daily challenges', () => {
  it('offers three distinct goals a day', () => {
    const list = dailyChallenges(0);
    expect(list).toHaveLength(3);
    expect(new Set(list.map(c => c.id)).size).toBe(3);
    expect(CHALLENGE_POOL.length).toBeGreaterThanOrEqual(5);
  });

  it('tracks progress and never passes the goal', () => {
    const active = dailyChallenges(0);
    const next = trackSession(active, {}, SIGNALS);
    for (const c of active) {
      expect(next[c.id]).toBeLessThanOrEqual(c.goal);
    }
  });

  it('pays tokens only the first time a goal completes', () => {
    const active = [CHALLENGE_POOL[0]];
    const before = trackSession(active, {}, SIGNALS);
    expect(isComplete(active[0], before)).toBe(true);
    expect(tokensEarned(active, {}, before)).toBe(active[0].reward);
    expect(tokensEarned(active, before, before)).toBe(0);
  });
});
