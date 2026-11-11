import { defaultState, recordSession, getState, titleFor, __setStateForTest } from '../src/state/store';
import { setDriver } from '../src/state/persistence';

const DRIVER = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

describe('profile stats', () => {
  beforeEach(() => {
    setDriver(DRIVER);
    __setStateForTest(defaultState());
  });

  it('accumulates lifetime numbers from a session', () => {
    recordSession({
      score: 4200,
      spins: 5,
      cascades: 7,
      bestMulti: 12,
      stars: 2,
      levelIndex: 0,
      tokens: 2,
      challenges: {},
    });
    const s = getState();
    expect(s.stats.totalSpins).toBe(5);
    expect(s.stats.bestSession).toBe(4200);
    expect(s.stats.biggestMulti).toBe(12);
    expect(s.stats.cascades).toBe(7);
    expect(s.stats.levelsCleared).toBe(1);
    expect(s.tokens).toBe(defaultState().tokens + 2);
    expect(s.unlockedLevel).toBe(1);
    expect(s.stars[0]).toBe(2);
  });

  it('does not unlock the next level without a star', () => {
    recordSession({
      score: 10,
      spins: 5,
      cascades: 0,
      bestMulti: 1,
      stars: 0,
      levelIndex: 0,
      tokens: 0,
      challenges: {},
    });
    expect(getState().unlockedLevel).toBe(0);
  });

  it('maps experience to a title band', () => {
    expect(titleFor(0).name).toBe('ACOLYTE');
    expect(titleFor(500).name).toBe('HERALD');
    expect(titleFor(5000).name).toBe('CHOSEN');
    expect(titleFor(0).to).toBeGreaterThan(titleFor(0).from);
  });
});
