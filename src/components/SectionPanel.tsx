import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

type Props = {
  title: string;
  accent?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
};

/** Marble slab with an engraved title row - the panel of every secondary screen. */
export function SectionPanel({ title, accent, right, children }: Props) {
  const color = accent || theme.colors.gold;
  return (
    <View style={styles.panel}>
      <View style={styles.chrome} />
      <View style={styles.head}>
        <View style={[styles.mark, { backgroundColor: color }]} />
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.spacer} />
        {right}
      </View>
      <View style={styles.rule} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: theme.colors.raised,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderGold,
    padding: 14,
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
  head: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  mark: { width: 4, height: 16, borderRadius: 2 },
  title: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: theme.colors.text,
  },
  spacer: { flex: 1 },
  rule: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginTop: 10,
    marginBottom: 12,
  },
});
