import {
  FAVOUR_MAX,
  FAVOUR_PER_ORB,
  FAVOUR_PER_TUMBLE,
  GATE_SPINS,
} from '../src/constants/config';
import { addFavour, favourPercent } from '../src/game/favour';

describe('divine favour meter', () => {
  it('adds 40 per tumble and 25 per orb', () => {
    const r = addFavour(0, 2, 1);
    expect(r.value).toBe(2 * FAVOUR_PER_TUMBLE + FAVOUR_PER_ORB);
    expect(r.burst).toBe(false);
  });

  it('bursts at the maximum and keeps the overflow', () => {
    const r = addFavour(FAVOUR_MAX - 10, 1, 0);
    expect(r.burst).toBe(true);
    expect(r.value).toBe(FAVOUR_PER_TUMBLE - 10);
    expect(GATE_SPINS).toBe(3);
  });

  it('clamps the display percentage', () => {
    expect(favourPercent(-5)).toBe(0);
    expect(favourPercent(FAVOUR_MAX * 2)).toBe(1);
  });
});
