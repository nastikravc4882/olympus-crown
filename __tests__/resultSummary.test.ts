import { BET } from '../src/constants/config';
import { levelAt } from '../src/game/levels';
import { VERDICT_TEXT, verdictOf } from '../src/game/session';

describe('result verdicts', () => {
  it('opens the gates when the target is reached', () => {
    const target = levelAt(0).target;
    expect(verdictOf(target, 0, 5000)).toBe('GATES');
  });

  it('fades when the session falls short', () => {
    expect(verdictOf(10, 0, 5000)).toBe('FADES');
  });

  it('withholds when the purse cannot pay the bet', () => {
    expect(verdictOf(99999, 0, BET - 1)).toBe('WITHHOLDS');
  });

  it('never uses a generic win or lose caption', () => {
    const titles = Object.keys(VERDICT_TEXT).map(k => VERDICT_TEXT[k as never].title);
    for (const title of titles) {
      expect(title.toLowerCase()).not.toContain('you win');
      expect(title.toLowerCase()).not.toContain('game over');
    }
  });
});
