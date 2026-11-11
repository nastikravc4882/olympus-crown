import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Coins } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { useCountUp } from '../hooks/useCountUp';

export function formatCoins(n: number): string {
  return String(Math.max(0, Math.round(n))).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

type Props = {
  coins: number;
  caption?: string;
  compact?: boolean;
};

/** Gold pill with the fictional coin balance; the number counts up on change. */
export function BalanceBadge({ coins, caption = 'COINS', compact = false }: Props) {
  const shown = useCountUp(coins, 650);

  return (
    <View style={[styles.pill, compact ? styles.compact : null]}>
      <Coins size={18} color={theme.colors.gold} strokeWidth={2.4} />
      <Text style={styles.value} numberOfLines={1}>
        {formatCoins(shown)}
      </Text>
      {compact ? null : (
        <Text style={styles.caption} numberOfLines={1}>
          {caption}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    height: 38,
    minWidth: 110,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 14,
    borderRadius: 19,
    backgroundColor: 'rgba(28,28,36,0.86)',
    borderWidth: 1,
    borderColor: theme.colors.borderGold,
  },
  compact: { minWidth: 86, paddingHorizontal: 10 },
  value: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '800',
    color: theme.colors.goldLight,
    fontVariant: ['tabular-nums'],
  },
  caption: {
    fontSize: 10,
    lineHeight: 20,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.textSec,
  },
});
