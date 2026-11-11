import { LOADER_DURATION_MS, BET, SESSION_SPINS } from '../src/constants/config';

describe('loader and session constants', () => {
  it('holds the splash for exactly 8000 ms', () => {
    expect(LOADER_DURATION_MS).toBe(8000);
  });

  it('keeps the fixed bet and the five-spin session', () => {
    expect(BET).toBe(50);
    expect(SESSION_SPINS).toBe(5);
  });
});
