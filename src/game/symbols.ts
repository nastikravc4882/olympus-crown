export type SymbolId =
  | 'CROWN'
  | 'CHALICE'
  | 'HOURGLASS'
  | 'RING'
  | 'RUBY'
  | 'AMETHYST'
  | 'EMERALD'
  | 'SAPPHIRE'
  | 'WILD'
  | 'ORB';

export type SymbolKind = 'sprite' | 'gem' | 'wild' | 'orb';

export type SymbolDef = {
  id: SymbolId;
  label: string;
  kind: SymbolKind;
  /** index into SPRITES for kind === 'sprite' | 'orb' */
  sprite: number;
  weight: number;
  /** multiplier of the bet for a set of 8+; 0 = does not pay on its own */
  pay: number;
  color: string;
  tier: 'high' | 'low' | 'special';
};

/** ONE shared pool - every cell of every column draws from this list. */
export const SYMBOLS: SymbolDef[] = [
  { id: 'CROWN', label: 'CROWN', kind: 'sprite', sprite: 0, weight: 5, pay: 50, color: '#F5D77A', tier: 'high' },
  { id: 'CHALICE', label: 'CHALICE', kind: 'sprite', sprite: 1, weight: 7, pay: 25, color: '#D4AF37', tier: 'high' },
  { id: 'HOURGLASS', label: 'HOURGLASS', kind: 'sprite', sprite: 2, weight: 9, pay: 15, color: '#D4AF37', tier: 'high' },
  { id: 'RING', label: 'RING', kind: 'sprite', sprite: 3, weight: 11, pay: 10, color: '#D4AF37', tier: 'high' },
  { id: 'RUBY', label: 'RUBY', kind: 'gem', sprite: -1, weight: 14, pay: 5, color: '#E2474A', tier: 'low' },
  { id: 'AMETHYST', label: 'AMETHYST', kind: 'gem', sprite: -1, weight: 15, pay: 4, color: '#8A5CF0', tier: 'low' },
  { id: 'EMERALD', label: 'EMERALD', kind: 'gem', sprite: -1, weight: 16, pay: 3, color: '#5FD38A', tier: 'low' },
  { id: 'SAPPHIRE', label: 'SAPPHIRE', kind: 'gem', sprite: -1, weight: 17, pay: 2, color: '#3E8FD4', tier: 'low' },
  { id: 'WILD', label: 'CROWN WILD', kind: 'wild', sprite: -1, weight: 3, pay: 0, color: '#F5D77A', tier: 'special' },
  { id: 'ORB', label: 'ZEUS ORB', kind: 'orb', sprite: 4, weight: 3, pay: 0, color: '#8A5CF0', tier: 'special' },
];

const BY_ID: Record<string, SymbolDef> = {};
for (const s of SYMBOLS) {
  BY_ID[s.id] = s;
}

export function symbolDef(id: SymbolId): SymbolDef {
  return BY_ID[id];
}

/** Symbols that can form a paying set of 8 or more. */
export const PAYING: SymbolId[] = SYMBOLS.filter(s => s.pay > 0).map(s => s.id);

/** Count bonus on top of the symbol pay: 8-9 / 10-11 / 12+. */
export function countBonus(count: number): number {
  if (count >= 12) {
    return 3;
  }
  if (count >= 10) {
    return 1.6;
  }
  return 1;
}
