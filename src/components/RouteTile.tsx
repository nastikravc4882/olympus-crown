import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { HIT_SLOP, usePressScale } from '../hooks/usePressScale';
import type { IconComp } from './GoldButton';

type Props = {
  label: string;
  Icon: IconComp;
  onPress: () => void;
  badge?: boolean;
  accent?: string;
};

/** Menu route tile. The label text is what the QA harness taps. */
export function RouteTile({ label, Icon, onPress, badge, accent }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.95);
  const color = accent || theme.colors.gold;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={HIT_SLOP}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={styles.press}>
      <Animated.View pointerEvents="box-none" style={[styles.tile, { transform: [{ scale }] }]}>
        <Icon size={20} color={color} strokeWidth={2.4} />
        <Text style={styles.label} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
          {label}
        </Text>
        {badge ? <View style={styles.badge} /> : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { flex: 1, height: 58 },
  tile: {
    width: '100%',
    height: 58,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(28,28,36,0.92)',
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 4,
  },
  label: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#E8DFC8',
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.danger,
  },
});
