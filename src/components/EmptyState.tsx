import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { theme } from '../constants/theme';
import { GhostButton } from './GhostButton';
import type { IconComp } from './GoldButton';

type Props = {
  title: string;
  hint: string;
  Icon?: IconComp;
  actionLabel?: string;
  onAction?: () => void;
};

/** Laurel mark drawn as SVG - never an emoji, never a chevron glyph. */
function Laurel() {
  return (
    <Svg width={54} height={54} viewBox="0 0 48 48">
      <Path
        d="M24 6 C14 12 10 22 12 34 C18 32 22 26 24 18 C26 26 30 32 36 34 C38 22 34 12 24 6 Z"
        fill="none"
        stroke={theme.colors.gold}
        strokeWidth={2}
        opacity={0.8}
      />
      <Path d="M24 38 L24 44" stroke={theme.colors.gold} strokeWidth={2} opacity={0.5} />
    </Svg>
  );
}

/** No list and no panel is ever left blank - this is the themed stand-in. */
export function EmptyState({ title, hint, Icon, actionLabel, onAction }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.mark}>
        {Icon ? <Icon size={28} color={theme.colors.gold} strokeWidth={2.2} /> : <Laurel />}
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      <Text style={styles.hint} numberOfLines={3}>
        {hint}
      </Text>
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <GhostButton label={actionLabel} onPress={onAction} tone="gold" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 26,
    paddingHorizontal: 18,
  },
  mark: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(212,175,55,0.08)',
    borderWidth: 1,
    borderColor: theme.colors.borderGold,
  },
  title: {
    marginTop: 14,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '900',
    letterSpacing: 1.4,
    color: theme.colors.goldLight,
    textAlign: 'center',
  },
  hint: {
    marginTop: 6,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  action: { marginTop: 14, width: 200 },
});
