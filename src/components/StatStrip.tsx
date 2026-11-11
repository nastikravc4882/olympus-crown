import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FAVOUR_MAX } from '../constants/config';
import { theme } from '../constants/theme';
import { ProgressBar } from './ProgressBar';

type Props = {
  bet: number;
  favour: number;
  multi: number;
};

/** The three-segment strip above the controls: bet, favour meter, multiplier. */
export function StatStrip({ bet, favour, multi }: Props) {
  const multiColor = multi > 1 ? theme.colors.purpleSoft : theme.colors.textMuted;

  return (
    <View style={styles.strip}>
      <View style={styles.seg}>
        <Text style={styles.label} numberOfLines={1}>
          BET
        </Text>
        <Text style={[styles.value, { color: theme.colors.goldLight }]} numberOfLines={1}>
          {bet}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={[styles.seg, styles.wide]}>
        <Text style={styles.label} numberOfLines={1}>
          DIVINE FAVOUR
        </Text>
        <Text style={[styles.value, { color: theme.colors.gold }]} numberOfLines={1}>
          {favour + ' / ' + FAVOUR_MAX}
        </Text>
        <View style={styles.bar}>
          <ProgressBar value={favour} max={FAVOUR_MAX} height={5} />
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.seg}>
        <Text style={styles.label} numberOfLines={1}>
          MULTI
        </Text>
        <Text style={[styles.value, { color: multiColor }]} numberOfLines={1}>
          {'x' + multi}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 62,
    backgroundColor: theme.colors.boardIn,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
  },
  seg: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  wide: { flex: 1.5 },
  divider: { width: 1, height: 34, backgroundColor: 'rgba(255,255,255,0.08)' },
  label: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.textMuted,
  },
  value: {
    marginTop: 2,
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  bar: { width: '86%', marginTop: 4 },
});
