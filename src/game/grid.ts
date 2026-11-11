import { COLS, ROWS } from '../constants/config';
import type { SymbolId } from './symbols';

/** One board cell. `orb` is 0 for everything that is not a Zeus orb. */
export type Cell = {
  id: SymbolId;
  orb: number;
};

export type Grid = Cell[];

/** Row-major index of a column/row pair. */
export function at(col: number, row: number): number {
  return row * COLS + col;
}

export function colOf(index: number): number {
  return index % COLS;
}

export function rowOf(index: number): number {
  return Math.floor(index / COLS);
}

export function emptyGrid(): Grid {
  const out: Grid = [];
  for (let i = 0; i < COLS * ROWS; i++) {
    out.push({ id: 'SAPPHIRE', orb: 0 });
  }
  return out;
}

export function cloneGrid(grid: Grid): Grid {
  return grid.map(c => ({ id: c.id, orb: c.orb }));
}
