import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { HIT_SLOP, usePressScale } from '../hooks/usePressScale';
import type { IconComp } from './GoldButton';

export type Tone = 'purple' | 'neutral' | 'danger' | 'gold';

type Props = {
  label: string;
  onPress: () => void;
  Icon?: IconComp;
  tone?: Tone;
  disabled?: boolean;
  height?: number;
  testID?: string;
};

const ICON = 24;

const TONES: Record<Tone, { fill: string; border: string; text: string }> = {
  purple: {
    fill: 'rgba(138,92,240,0.16)',
    border: 'rgba(138,92,240,0.55)',
    text: theme.colors.purpleSoft,
  },
  neutral: {
    fill: 'rgba(255,255,255,0.05)',
    border: 'rgba(255,255,255,0.16)',
    text: theme.colors.text,
  },
  danger: {
    fill: 'rgba(226,71,74,0.14)',
    border: 'rgba(226,71,74,0.55)',
    text: '#FF9A9C',
  },
  gold: {
    fill: 'rgba(212,175,55,0.14)',
    border: 'rgba(212,175,55,0.55)',
    text: theme.colors.goldLight,
  },
};

/** The one secondary button. Same icon geometry as GoldButton: 24 px, gap 10. */
export function GhostButton({
  label,
  onPress,
  Icon,
  tone = 'neutral',
  disabled,
  height = 48,
  testID,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.97);
  const t = TONES[tone];

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      hitSlop={HIT_SLOP}
      disabled={disabled}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[styles.press, { height }]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.inner,
          { height, backgroundColor: t.fill, borderColor: t.border, transform: [{ scale }] },
          disabled ? styles.flat : null,
        ]}>
        <View style={styles.row}>
          {Icon ? <Icon size={ICON} color={t.text} strokeWidth={2.2} /> : null}
          <Text style={[styles.label, { color: t.text }]} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: '100%', borderRadius: theme.radius.md },
  flat: { opacity: 0.4 },
  inner: {
    width: '100%',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  label: { fontSize: 15, lineHeight: ICON, fontWeight: '800', letterSpacing: 1.6 },
});
