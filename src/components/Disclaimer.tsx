import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { theme } from '../constants/theme';

/** The 18+ line. Visual style only - this game has no real money anywhere. */
export function Disclaimer({ text }: { text: string }) {
  return (
    <Text style={styles.line} numberOfLines={2}>
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  line: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
});
