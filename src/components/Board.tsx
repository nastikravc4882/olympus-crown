import React, { useMemo } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import {
  BOARD_BORDER,
  BOARD_FRAME,
  BOARD_MAX_W,
  BOARD_PAD,
  COLS,
  ROWS,
} from '../constants/config';
import { theme } from '../constants/theme';
import { at, type Grid } from '../game/grid';
import { SymbolCell } from './SymbolCell';

const SCREEN_W = Dimensions.get('window').width;
const SCREEN_H = Dimensions.get('window').height;

/**
 * Board geometry - the frame is counted once, so nothing can overflow it, and
 * the tile is capped by the height too so the controls block never leaves the
 * screen on a short device.
 */
export const BOARD_W_MAX = Math.min(SCREEN_W - 32, BOARD_MAX_W);
const TILE_BY_W = Math.floor((BOARD_W_MAX - 2 * BOARD_FRAME) / COLS);
const TILE_BY_H = Math.floor((SCREEN_H * 0.42 - 2 * BOARD_FRAME) / ROWS);
export const TILE = Math.max(40, Math.min(TILE_BY_W, TILE_BY_H));
export const BOARD_W = TILE * COLS + 2 * BOARD_FRAME;
export const BOARD_H = TILE * ROWS + 2 * BOARD_FRAME;

type Props = {
  grid: Grid;
  winCells: number[];
  dimmed: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  /** one value per column, -1 = above the board, 0 = landed */
  colAnims: Animated.Value[];
  hint?: string;
};

export function Board({
  grid,
  winCells,
  dimmed,
  highContrast,
  reducedMotion,
  colAnims,
  hint,
}: Props) {
  const winSet = useMemo(() => {
    const s: Record<number, boolean> = {};
    for (const i of winCells) {
      s[i] = true;
    }
    return s;
  }, [winCells]);

  const columns = useMemo(() => {
    const out: number[] = [];
    for (let c = 0; c < COLS; c++) {
      out.push(c);
    }
    return out;
  }, []);

  const rows = useMemo(() => {
    const out: number[] = [];
    for (let r = 0; r < ROWS; r++) {
      out.push(r);
    }
    return out;
  }, []);

  return (
    <View style={styles.slab}>
      <View style={styles.inner}>
        {columns.map(c => {
          const translateY = colAnims[c].interpolate({
            inputRange: [-1, 0],
            outputRange: [-BOARD_H, 0],
          });
          return (
            <Animated.View
              key={c}
              pointerEvents="none"
              style={[styles.column, { transform: [{ translateY }] }]}>
              {rows.map(r => {
                const idx = at(c, r);
                const cell = grid[idx] || { id: 'SAPPHIRE', orb: 0 };
                return (
                  <SymbolCell
                    key={r}
                    id={cell.id}
                    orb={cell.orb}
                    size={TILE}
                    state={winSet[idx] ? 'win' : 'idle'}
                    dimmed={dimmed}
                    highContrast={highContrast}
                    reducedMotion={reducedMotion}
                  />
                );
              })}
            </Animated.View>
          );
        })}
      </View>

      <View pointerEvents="none" style={[styles.stud, { top: BOARD_PAD, left: BOARD_PAD }]} />
      <View pointerEvents="none" style={[styles.stud, { top: BOARD_PAD, right: BOARD_PAD }]} />
      <View pointerEvents="none" style={[styles.stud, { bottom: BOARD_PAD, left: BOARD_PAD }]} />
      <View pointerEvents="none" style={[styles.stud, { bottom: BOARD_PAD, right: BOARD_PAD }]} />

      {hint ? (
        <View pointerEvents="none" style={styles.hintWrap}>
          <View style={styles.hintCard}>
            <Text style={styles.hintText} numberOfLines={2}>
              {hint}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  slab: {
    width: BOARD_W,
    height: BOARD_H,
    alignSelf: 'center',
    backgroundColor: theme.colors.boardIn,
    borderRadius: theme.radius.lg,
    borderWidth: BOARD_BORDER,
    borderColor: theme.colors.gold,
    padding: BOARD_PAD,
    shadowColor: theme.colors.purple,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 22,
    elevation: 12,
  },
  inner: {
    width: TILE * COLS,
    height: TILE * ROWS,
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius: 10,
  },
  column: { width: TILE, height: TILE * ROWS },
  stud: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.gold,
    opacity: 0.85,
  },
  hintWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintCard: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(11,11,15,0.84)',
    borderWidth: 1,
    borderColor: theme.colors.borderGold,
    maxWidth: BOARD_W - 48,
  },
  hintText: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: theme.colors.textSec,
    textAlign: 'center',
  },
});
