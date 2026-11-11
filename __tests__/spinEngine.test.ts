import { CELLS, COLS, ROWS } from '../src/constants/config';
import { colOf } from '../src/game/grid';
import { spinSeed } from '../src/game/rng';
import { buildGrid, DEFAULT_DROP } from '../src/game/spinEngine';

describe('spin engine', () => {
  it('fills every cell of the 6x5 board', () => {
    const grid = buildGrid(spinSeed(0, 1, 7));
    expect(grid).toHaveLength(CELLS);
    expect(CELLS).toBe(COLS * ROWS);
    expect(grid.every(c => typeof c.id === 'string')).toBe(true);
  });

  it('is deterministic for one seed and different across spins', () => {
    const a = buildGrid(spinSeed(0, 1, 7));
    const b = buildGrid(spinSeed(0, 1, 7));
    const c = buildGrid(spinSeed(0, 2, 7));
    expect(a.map(x => x.id)).toEqual(b.map(x => x.id));
    expect(a.map(x => x.id)).not.toEqual(c.map(x => x.id));
  });

  it('never puts more wilds in a column than the cap allows', () => {
    for (let s = 1; s < 40; s++) {
      const grid = buildGrid(spinSeed(1, s, 3), DEFAULT_DROP);
      const perColumn = new Array(COLS).fill(0);
      grid.forEach((cell, i) => {
        if (cell.id === 'WILD') {
          perColumn[colOf(i)] += 1;
        }
      });
      expect(Math.max.apply(null, perColumn)).toBeLessThanOrEqual(DEFAULT_DROP.wildPerColumn);
    }
  });
});
