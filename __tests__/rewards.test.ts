import { canAfford, effectsOf, relicAt, RELICS } from '../src/game/rewards';

describe('relics', () => {
  it('lists five relics with a cost and an effect line', () => {
    expect(RELICS).toHaveLength(5);
    for (const r of RELICS) {
      expect(r.cost).toBeGreaterThan(0);
      expect(r.effect.length).toBeGreaterThan(0);
    }
  });

  it('turns unlocked relics into real gameplay effects', () => {
    const none = effectsOf([]);
    expect(none.extraSpins).toBe(0);
    expect(none.wildPerColumn).toBe(1);
    expect(none.orbBonus).toBe(0);

    const all = effectsOf(['AEGIS', 'COIL', 'LAUREL', 'ORACLE', 'CROWN']);
    expect(all.extraSpins).toBe(1);
    expect(all.orbChanceBonus).toBeCloseTo(0.05);
    expect(all.wildPerColumn).toBe(2);
    expect(all.revealTop).toBe(true);
    expect(all.orbBonus).toBe(1);
  });

  it('blocks an unaffordable unlock', () => {
    const crown = relicAt('CROWN');
    expect(canAfford(crown, crown.cost - 1)).toBe(false);
    expect(canAfford(crown, crown.cost)).toBe(true);
  });
});
