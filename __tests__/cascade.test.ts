import { BET } from '../src/constants/config';
import { resolveChain } from '../src/game/cascade';
import { emptyGrid } from '../src/game/grid';

describe('tumble cascade', () => {
  it('ends on a drop that produces no win', () => {
    const grid = emptyGrid();
    for (let i = 0; i < grid.length; i++) {
      grid[i] = { id: i % 2 === 0 ? 'RING' : 'RUBY', orb: 0 };
    }
    const chain = resolveChain(grid, BET, 12345);
    expect(chain.cascades).toBe(chain.steps.length);
    for (const step of chain.steps) {
      expect(step.pay.wins.length).toBeGreaterThan(0);
    }
  });

  it('accumulates the chain win over every step', () => {
    const grid = emptyGrid();
    for (let i = 0; i < grid.length; i++) {
      grid[i] = { id: 'CROWN', orb: 0 };
    }
    const chain = resolveChain(grid, BET, 999);
    const summed = chain.steps.reduce((acc, s) => acc + s.pay.total, 0);
    expect(chain.chainWin).toBe(summed);
    expect(chain.chainWin).toBeGreaterThan(0);
  });
});
