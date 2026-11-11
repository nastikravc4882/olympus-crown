import { emptyGrid } from '../src/game/grid';
import { evaluate } from '../src/game/scatterPay';

describe('crown wild', () => {
  it('completes the best paying set and is consumed with it', () => {
    const grid = emptyGrid();
    for (let i = 0; i < grid.length; i++) {
      grid[i] = { id: 'EMERALD', orb: 0 };
    }
    for (let i = 0; i < 6; i++) {
      grid[i] = { id: 'CROWN', orb: 0 };
    }
    grid[6] = { id: 'WILD', orb: 0 };
    grid[7] = { id: 'WILD', orb: 0 };

    const result = evaluate(grid, 50);
    const crown = result.wins.filter(w => w.id === 'CROWN')[0];
    expect(crown).toBeDefined();
    expect(crown.count).toBe(8);
    expect(crown.indices).toContain(6);
    expect(crown.indices).toContain(7);
  });

  it('never pays for the wild on its own', () => {
    const grid = emptyGrid();
    for (let i = 0; i < grid.length; i++) {
      grid[i] = { id: i < 10 ? 'WILD' : 'RING', orb: 0 };
    }
    const result = evaluate(grid, 50);
    expect(result.wins.filter(w => w.id === 'WILD')).toHaveLength(0);
  });
});
