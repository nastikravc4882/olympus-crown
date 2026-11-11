import { PAY_MIN } from '../constants/config';
import type { Grid } from './grid';
import { countBonus, symbolDef, type SymbolId } from './symbols';

export type PayLine = {
  id: SymbolId;
  count: number;
  /** cells that shatter - includes the wilds consumed by this set */
  indices: number[];
  amount: number;
};

export type PayResult = {
  wins: PayLine[];
  total: number;
  /** every index that shatters this step */
  removed: number[];
};

/**
 * Scatter pay: 8 or more copies ANYWHERE on the board pay, position does not
 * matter. The Crown Wild substitutes for one paying set - the best-paying one -
 * and is consumed with it.
 */
export function evaluate(grid: Grid, bet: number): PayResult {
  const counts: Record<string, number[]> = {};
  const wildIdx: number[] = [];

  for (let i = 0; i < grid.length; i++) {
    const cell = grid[i];
    if (cell.id === 'ORB') {
      continue;
    }
    if (cell.id === 'WILD') {
      wildIdx.push(i);
      continue;
    }
    if (!counts[cell.id]) {
      counts[cell.id] = [];
    }
    counts[cell.id].push(i);
  }

  // The wilds join the set with the highest payout that they can complete.
  const ids = Object.keys(counts) as SymbolId[];
  let wildTarget: SymbolId | null = null;
  let bestPay = -1;
  for (const id of ids) {
    const def = symbolDef(id);
    if (!def || def.pay <= 0) {
      continue;
    }
    const effective = counts[id].length + wildIdx.length;
    if (effective >= PAY_MIN && def.pay > bestPay) {
      bestPay = def.pay;
      wildTarget = id;
    }
  }

  const wins: PayLine[] = [];
  const removed: number[] = [];
  let total = 0;

  for (const id of ids) {
    const def = symbolDef(id);
    if (!def || def.pay <= 0) {
      continue;
    }
    const own = counts[id];
    const useWilds = id === wildTarget ? wildIdx : [];
    const count = own.length + useWilds.length;
    if (count < PAY_MIN) {
      continue;
    }
    const amount = Math.round(bet * def.pay * countBonus(count));
    const indices = own.concat(useWilds);
    wins.push({ id, count, indices, amount });
    total += amount;
    for (const idx of indices) {
      removed.push(idx);
    }
  }

  wins.sort((a, b) => b.amount - a.amount);
  return { wins, total, removed };
}
