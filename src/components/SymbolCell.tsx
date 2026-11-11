import React, { memo, useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { spriteSource } from '../assets/spriteMap';
import type { SymbolId } from '../game/symbols';
import { GemIcon, type GemKind } from './GemIcon';

type Props = {
  id: SymbolId;
  orb: number;
  size: number;
  /** 'idle' | 'win' - a winning cell pulses and then shatters */
  state: 'idle' | 'win';
  dimmed: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
};

const GEMS: SymbolId[] = ['RUBY', 'AMETHYST', 'EMERALD', 'SAPPHIRE', 'WILD'];

/**
 * One board cell. Props are primitives only so the memo actually holds, and the
 * sprite is a plain contain-fitted Image - no circle crop, no oversizing.
 */
function SymbolCellBase({ id, orb, size, state, dimmed, highContrast, reducedMotion }: Props) {
  const pulse = useRef(new Animated.Value(0)).current;
  const art = Math.round(size * 0.78);

  useEffect(() => {
    if (state !== 'win' || reducedMotion) {
      pulse.setValue(0);
      return;
    }
    Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 160, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0.2, duration: 160, useNativeDriver: true }),
    ]).start();
  }, [state, pulse, reducedMotion]);

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.14] });
  const isGem = GEMS.indexOf(id) >= 0;
  const sprite = spriteSource(id);
  const isOrb = id === 'ORB';

  return (
    <View
      style={[
        styles.cell,
        {
          width: size,
          height: size,
          backgroundColor: highContrast ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.03)',
          opacity: dimmed ? 0.45 : 1,
        },
        state === 'win' ? styles.winCell : null,
        isOrb ? styles.orbCell : null,
      ]}>
      <Animated.View pointerEvents="none" style={{ transform: [{ scale }] }}>
        {isGem ? (
          <GemIcon kind={id as GemKind} size={art} />
        ) : sprite ? (
          <Image source={sprite} style={{ width: art, height: art, resizeMode: 'contain' }} />
        ) : null}
      </Animated.View>
      {isOrb && orb > 0 ? (
        <View style={styles.orbTag}>
          <Text style={styles.orbText} numberOfLines={1}>
            {'x' + orb}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

export const SymbolCell = memo(SymbolCellBase);

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  winCell: {
    borderWidth: 2,
    borderColor: theme.colors.goldLight,
    backgroundColor: 'rgba(245,215,122,0.18)',
  },
  orbCell: {
    borderWidth: 1.5,
    borderColor: 'rgba(138,92,240,0.75)',
    backgroundColor: 'rgba(138,92,240,0.16)',
  },
  orbTag: {
    position: 'absolute',
    bottom: 3,
    right: 3,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 6,
    backgroundColor: 'rgba(11,11,15,0.82)',
    borderWidth: 1,
    borderColor: 'rgba(138,92,240,0.7)',
  },
  orbText: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '900',
    color: theme.colors.purpleSoft,
    fontVariant: ['tabular-nums'],
  },
});
