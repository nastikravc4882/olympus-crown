export type RelicId = 'AEGIS' | 'COIL' | 'LAUREL' | 'ORACLE' | 'CROWN';

export type Relic = {
  id: RelicId;
  name: string;
  effect: string;
  cost: number;
};

/** Five relics, every one of them a real gameplay upgrade. */
export const RELICS: Relic[] = [
  { id: 'AEGIS', name: 'AEGIS SHARD', effect: 'SESSION LENGTH 5 SPINS BECOMES 6', cost: 3 },
  { id: 'COIL', name: 'STORM COIL', effect: 'ORB SPAWN CHANCE +5%', cost: 5 },
  { id: 'LAUREL', name: 'GILDED LAUREL', effect: 'THE WILD MAY APPEAR IN 2 COLUMNS', cost: 6 },
  { id: 'ORACLE', name: 'ORACLE EYE', effect: 'THE TOP SYMBOL IS REVEALED BEFORE THE DROP', cost: 8 },
  { id: 'CROWN', name: 'CROWN OF ZEUS', effect: 'ALL ORB MULTIPLIERS +1', cost: 12 },
];

export type RelicEffects = {
  extraSpins: number;
  orbChanceBonus: number;
  wildPerColumn: number;
  revealTop: boolean;
  orbBonus: number;
};

export function effectsOf(unlocked: RelicId[]): RelicEffects {
  const has = (id: RelicId) => unlocked.indexOf(id) >= 0;
  return {
    extraSpins: has('AEGIS') ? 1 : 0,
    orbChanceBonus: has('COIL') ? 0.05 : 0,
    wildPerColumn: has('LAUREL') ? 2 : 1,
    revealTop: has('ORACLE'),
    orbBonus: has('CROWN') ? 1 : 0,
  };
}

export function canAfford(relic: Relic, tokens: number): boolean {
  return tokens >= relic.cost;
}

export function relicAt(id: RelicId): Relic {
  return RELICS.filter(r => r.id === id)[0];
}
