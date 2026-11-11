import {
  COLS,
  ROWS,
  ORB_BASE_CHANCE,
  ORB_VALUES,
  ORB_WEIGHTS,
  PITY_MULT,
} from '../constants/config';
import { at, cloneGrid, type Cell, type Grid } from './grid';
import { makeRng, pickWeighted, type Rng } from './rng';
import { SYMBOLS, type SymbolId } from './symbols';

export type DropOptions = {
  /** soft pity: raise orb and high-tier weights after a cold streak */
  pity: boolean;
  /** Gilded Laurel relic lifts the wild cap from 1 to 2 columns */
  wildPerColumn: number;
  /** Storm Coil relic adds to the orb spawn chance */
  orbChanceBonus: number;
};

export const DEFAULT_DROP: DropOptions = {
  pity: false,
  wildPerColumn: 1,
  orbChanceBonus: 0,
};

const DRAWABLE = SYMBOLS.filter(s => s.id !== 'ORB');

function weightsFor(opts: DropOptions): number[] {
  return DRAWABLE.map(s => {
    if (opts.pity && (s.tier === 'high' || s.id === 'WILD')) {
      return s.weight * PITY_MULT;
    }
    return s.weight;
  });
}

export function rollOrbValue(rng: Rng): number {
  return pickWeighted(rng, ORB_VALUES.slice(), ORB_WEIGHTS.slice());
}

/** One fresh symbol for a cell, honouring the per-column wild cap. */
export function drawSymbol(rng: Rng, opts: DropOptions, wildsInColumn: number): Cell {
  const orbChance = ORB_BASE_CHANCE + opts.orbChanceBonus + (opts.pity ? 0.02 : 0);
  if (rng() < orbChance) {
    return { id: 'ORB', orb: rollOrbValue(rng) };
  }
  const weights = weightsFor(opts);
  const ids = DRAWABLE.map(s => s.id);
  let id: SymbolId = pickWeighted(rng, ids, weights);
  if (id === 'WILD' && wildsInColumn >= opts.wildPerColumn) {
    const noWild = DRAWABLE.filter(s => s.id !== 'WILD');
    id = pickWeighted(
      rng,
      noWild.map(s => s.id),
      noWild.map(s => (opts.pity && s.tier === 'high' ? s.weight * PITY_MULT : s.weight)),
    );
  }
  return { id, orb: 0 };
}

/** A complete 6x5 drop from the one shared pool. */
export function buildGrid(seed: number, opts: DropOptions = DEFAULT_DROP): Grid {
  const rng = makeRng(seed);
  const grid: Grid = new Array(COLS * ROWS);
  for (let col = 0; col < COLS; col++) {
    let wilds = 0;
    for (let row = 0; row < ROWS; row++) {
      const cell = drawSymbol(rng, opts, wilds);
      if (cell.id === 'WILD') {
        wilds++;
      }
      grid[at(col, row)] = cell;
    }
  }
  return grid;
}

/**
 * Tumble: the given indices shatter, survivors fall down inside their column and
 * fresh symbols refill from the top. Orbs never shatter.
 */
export function tumble(grid: Grid, removed: number[], seed: number, opts: DropOptions = DEFAULT_DROP): Grid {
  const rng = makeRng(seed);
  const gone = new Set(removed);
  const next = cloneGrid(grid);

  for (let col = 0; col < COLS; col++) {
    const survivors: Cell[] = [];
    for (let row = ROWS - 1; row >= 0; row--) {
      const idx = at(col, row);
      if (!gone.has(idx)) {
        survivors.push(next[idx]);
      }
    }
    let wilds = survivors.filter(c => c.id === 'WILD').length;
    let write = ROWS - 1;
    for (const cell of survivors) {
      next[at(col, write)] = cell;
      write--;
    }
    while (write >= 0) {
      const cell = drawSymbol(rng, opts, wilds);
      if (cell.id === 'WILD') {
        wilds++;
      }
      next[at(col, write)] = cell;
      write--;
    }
  }
  return next;
}
