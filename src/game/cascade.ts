import { cloneGrid, type Grid } from './grid';
import { evaluate, type PayResult } from './scatterPay';
import { tumble, type DropOptions, DEFAULT_DROP } from './spinEngine';

export type CascadeStep = {
  /** board as it looked when this step was evaluated */
  grid: Grid;
  pay: PayResult;
  /** board after the shatter + fall + refill */
  next: Grid;
};

export type ChainResult = {
  steps: CascadeStep[];
  /** number of paying tumbles - 0 means a dry spin */
  cascades: number;
  chainWin: number;
  finalGrid: Grid;
};

const MAX_STEPS = 12;

/** Tumble until a drop produces no win. Orbs stay on the board the whole chain. */
export function resolveChain(
  start: Grid,
  bet: number,
  seed: number,
  opts: DropOptions = DEFAULT_DROP,
): ChainResult {
  const steps: CascadeStep[] = [];
  let grid = cloneGrid(start);
  let chainWin = 0;
  let guard = 0;

  while (guard < MAX_STEPS) {
    const pay = evaluate(grid, bet);
    if (pay.wins.length === 0) {
      break;
    }
    const next = tumble(grid, pay.removed, (seed + guard * 7919) >>> 0, opts);
    steps.push({ grid: cloneGrid(grid), pay, next: cloneGrid(next) });
    chainWin += pay.total;
    grid = next;
    guard++;
  }

  return { steps, cascades: steps.length, chainWin, finalGrid: grid };
}
