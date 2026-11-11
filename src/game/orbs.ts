import type { Grid } from './grid';

/** Zeus orbs never pay and never shatter - they only sum at the end of a chain. */
export function orbIndices(grid: Grid): number[] {
  const out: number[] = [];
  for (let i = 0; i < grid.length; i++) {
    if (grid[i].id === 'ORB') {
      out.push(i);
    }
  }
  return out;
}

export function orbSum(grid: Grid): number {
  let sum = 0;
  for (const cell of grid) {
    if (cell.id === 'ORB') {
      sum += cell.orb;
    }
  }
  return sum;
}

/** spinWin = chainWin x max(1, sum(orbs)); carry is the Gate round accumulator. */
export function applyOrbs(chainWin: number, orbTotal: number, carry: number = 0): number {
  const multi = Math.max(1, orbTotal + carry);
  return Math.round(chainWin * multi);
}
