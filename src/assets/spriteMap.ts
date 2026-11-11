import { SPRITES } from './index';
import { symbolDef, type SymbolId } from '../game/symbols';

/**
 * UI-only bridge between a symbol id and its PNG. It lives next to the asset
 * module so the pure game logic never has to require an image.
 */
export function spriteSource(id: SymbolId) {
  const def = symbolDef(id);
  return def && def.sprite >= 0 ? SPRITES[def.sprite] : null;
}
