import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../constants/theme';
import type { IconComp } from './GoldButton';

type Props = {
  Icon: IconComp;
  value: number;
  label: string;
  accent?: string;
  prefix?: string;
  suffix?: string;
  format?: (v: number) => string;
};

/**
 * The ONE stat pill of the app. Every pill in a row has the same width, height,
 * padding and radius and the SAME icon component - only the accent colour, the
 * number and the label differ. A card with no value renders nothing at all.
 */
export function StatCard({ Icon, value, label, accent, prefix, suffix, format }: Props) {
  if (!value) {
    return null;
  }
  const color = accent || theme.colors.goldLight;
  const text = (prefix || '') + (format ? format(value) : String(value)) + (suffix || '');

  return (
    <LinearGradient
      colors={theme.gradients.tile as string[]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.card, { borderColor: color + '55' }]}>
      <View style={styles.chrome} />
      <View style={[styles.dot, { backgroundColor: color }]} />
      <View style={[styles.iconWrap, { backgroundColor: color + '22', borderColor: color + '55' }]}>
        <Icon size={22} color={color} strokeWidth={2.4} />
      </View>
      <Text style={[styles.value, { color }]} numberOfLines={1}>
        {text}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </LinearGradient>
  );
}

/**
 * Equal-width slot. The slot owns flex:1, the card inside owns width:'100%' -
 * never flex:1 inside flex:1, that collapses the card to a sliver.
 */
export function StatSlot({ children }: { children: React.ReactNode }) {
  return <View style={styles.slot}>{children}</View>;
}

const styles = StyleSheet.create({
  slot: { flex: 1 },
  card: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  chrome: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: theme.colors.chrome,
  },
  dot: { position: 'absolute', top: 8, left: 8, width: 8, height: 8, borderRadius: 4 },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    marginTop: 10,
    fontSize: 19,
    lineHeight: 23,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  label: {
    marginTop: 2,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
});
