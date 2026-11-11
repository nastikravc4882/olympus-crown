import {
  BIG_WIN_MULT,
  DRY_SPINS_FOR_PITY,
  PITY_MULT,
  RESTORE_COINS,
  BET,
} from '../src/constants/config';
import { spinSeed } from '../src/game/rng';
import { buildGrid, DEFAULT_DROP } from '../src/game/spinEngine';
import { verdictOf } from '../src/game/session';

describe('soft pity and divine restore', () => {
  it('keeps the pity bias and the reset threshold configured', () => {
    expect(DRY_SPINS_FOR_PITY).toBe(5);
    expect(PITY_MULT).toBeCloseTo(1.4);
    expect(BIG_WIN_MULT).toBe(20);
  });

  it('changes the drawn board when the bias is on', () => {
    const cold = buildGrid(spinSeed(0, 3, 11), DEFAULT_DROP);
    const warm = buildGrid(spinSeed(0, 3, 11), { ...DEFAULT_DROP, pity: true });
    expect(cold.map(c => c.id)).not.toEqual(warm.map(c => c.id));
  });

  it('offers the restore instead of dead-ending an empty purse', () => {
    expect(verdictOf(0, 0, BET - 1)).toBe('WITHHOLDS');
    expect(RESTORE_COINS).toBeGreaterThan(BET);
  });
});
