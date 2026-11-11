import { isUnlocked, LEVELS, levelAt } from '../src/game/levels';

describe('level select', () => {
  it('defines eight named levels with rising targets', () => {
    expect(LEVELS).toHaveLength(8);
    for (let i = 1; i < LEVELS.length; i++) {
      expect(LEVELS[i].target).toBeGreaterThan(LEVELS[i - 1].target);
      expect(LEVELS[i].name.length).toBeGreaterThan(0);
    }
  });

  it('locks every level above the cleared one', () => {
    expect(isUnlocked(0, 0)).toBe(true);
    expect(isUnlocked(1, 0)).toBe(false);
    expect(isUnlocked(3, 3)).toBe(true);
  });

  it('clamps an out-of-range index instead of throwing', () => {
    expect(levelAt(-5).index).toBe(0);
    expect(levelAt(99).index).toBe(7);
  });
});
