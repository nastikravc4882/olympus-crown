import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

type Props = {
  title?: string;
  subtitle?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  /** colour of the 3 px accent strip under the header - one per screen */
  accent?: string;
};

/**
 * The ONE header of the app. Every screen uses it and differs only by the slots
 * and the accent strip - no screen hand-rolls its own header markup.
 */
export function ScreenHeader({ title, subtitle, leftSlot, rightSlot, accent }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <View style={styles.side}>{leftSlot}</View>
        <View style={styles.center}>
          {title ? (
            <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
              {title}
            </Text>
          ) : null}
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        <View style={[styles.side, styles.right]}>{rightSlot}</View>
      </View>
      <View style={[styles.strip, { backgroundColor: accent || theme.colors.borderGold }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 44,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: theme.colors.scrim,
  },
  row: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  side: { width: 92, flexDirection: 'row', alignItems: 'center' },
  right: { justifyContent: 'flex-end' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '900',
    letterSpacing: 2,
    color: theme.colors.goldLight,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 2,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: theme.colors.textSec,
    textAlign: 'center',
  },
  strip: {
    marginTop: 10,
    height: 3,
    borderRadius: 2,
    opacity: 0.9,
  },
});
