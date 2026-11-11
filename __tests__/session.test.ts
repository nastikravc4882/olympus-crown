import { BET, SESSION_SPINS } from '../src/constants/config';
import { starsFor, levelAt, LEVELS } from '../src/game/levels';
import { canSpin, isSessionOver, newSession } from '../src/game/session';

describe('session', () => {
  it('starts with five spins on the chosen level', () => {
    const s = newSession(2);
    expect(s.spinsAllowed).toBe(SESSION_SPINS);
    expect(s.levelIndex).toBe(2);
    expect(isSessionOver(s)).toBe(false);
  });

  it('grants the extra spin of the Aegis Shard', () => {
    expect(newSession(0, 1).spinsAllowed).toBe(SESSION_SPINS + 1);
  });

  it('ends once every spin is played', () => {
    const s = newSession(0);
    s.spinsPlayed = SESSION_SPINS;
    expect(isSessionOver(s)).toBe(true);
    expect(canSpin(s, 10000)).toBe(false);
  });

  it('refuses a spin below the bet', () => {
    expect(canSpin(newSession(0), BET - 1)).toBe(false);
  });

  it('awards stars at the target, x1.5 and x2.5', () => {
    const target = levelAt(0).target;
    expect(starsFor(target - 1, target)).toBe(0);
    expect(starsFor(target, target)).toBe(1);
    expect(starsFor(target * 1.5, target)).toBe(2);
    expect(starsFor(target * 2.5, target)).toBe(3);
    expect(LEVELS).toHaveLength(8);
  });
});
