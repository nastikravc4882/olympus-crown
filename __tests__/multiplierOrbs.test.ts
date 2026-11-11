import { BET } from '../src/constants/config';
import { resolveChain } from '../src/game/cascade';
import { emptyGrid } from '../src/game/grid';
import { applyOrbs, orbIndices, orbSum } from '../src/game/orbs';

describe('zeus orbs', () => {
  it('sums the orbs on the board and multiplies the chain win', () => {
    const grid = emptyGrid();
    grid[0] = { id: 'ORB', orb: 5 };
    grid[1] = { id: 'ORB', orb: 10 };
    expect(orbSum(grid)).toBe(15);
    expect(orbIndices(grid)).toEqual([0, 1]);
    expect(applyOrbs(100, 15)).toBe(1500);
  });

  it('leaves the win untouched when no orb landed', () => {
    expect(applyOrbs(240, 0)).toBe(240);
  });

  it('never shatters an orb during a cascade', () => {
    const grid = emptyGrid();
    for (let i = 0; i < grid.length; i++) {
      grid[i] = { id: 'CROWN', orb: 0 };
    }
    grid[0] = { id: 'ORB', orb: 25 };
    const chain = resolveChain(grid, BET, 4242);
    for (const step of chain.steps) {
      expect(step.pay.removed).not.toContain(0);
    }
  });
});
