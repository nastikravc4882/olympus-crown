import { emptyGrid } from '../src/game/grid';
import { evaluate } from '../src/game/scatterPay';
import { countBonus, type SymbolId } from '../src/game/symbols';

function gridOf(id: SymbolId, count: number) {
  const grid = emptyGrid();
  for (let i = 0; i < grid.length; i++) {
    grid[i] = { id: i < count ? id : 'RING', orb: 0 };
  }
  return grid;
}

describe('scatter pay', () => {
  it('pays 8 or more of a kind anywhere on the board', () => {
    const result = evaluate(gridOf('CROWN', 8), 50);
    const crown = result.wins.filter(w => w.id === 'CROWN')[0];
    expect(crown).toBeDefined();
    expect(crown.amount).toBe(50 * 50 * countBonus(8));
  });

  it('pays nothing for 7 copies', () => {
    const result = evaluate(gridOf('CROWN', 7), 50);
    expect(result.wins.filter(w => w.id === 'CROWN')).toHaveLength(0);
  });

  it('applies the count bonus bands', () => {
    expect(countBonus(8)).toBe(1);
    expect(countBonus(10)).toBe(1.6);
    expect(countBonus(12)).toBe(3);
  });
});
