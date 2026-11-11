import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { Play, Settings, Home } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { GhostButton } from './GhostButton';
import { GoldButton } from './GoldButton';

type Props = {
  visible: boolean;
  onResume: () => void;
  onSettings: () => void;
  onMenu: () => void;
};

/** The pause overlay. Every row is captioned by meaning, never icon-only. */
export function PauseSheet({ visible, onResume, onSettings, onMenu }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onResume}>
      <View style={styles.scrim}>
        <View style={styles.sheet}>
          <View style={styles.chrome} />
          <Text style={styles.title} numberOfLines={1}>
            THE STORM HOLDS
          </Text>
          <Text style={styles.hint} numberOfLines={2}>
            THE BOARD KEEPS ITS RELICS UNTIL YOU RETURN
          </Text>
          <View style={styles.actions}>
            <GoldButton label="RESUME" Icon={Play} onPress={onResume} height={56} />
            <GhostButton label="SETTINGS" Icon={Settings} onPress={onSettings} tone="gold" />
            <GhostButton label="MENU" Icon={Home} onPress={onMenu} tone="neutral" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: 'rgba(5,5,10,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  sheet: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.borderGold,
    padding: 20,
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
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '900',
    letterSpacing: 2,
    color: theme.colors.goldLight,
    textAlign: 'center',
  },
  hint: {
    marginTop: 6,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  actions: { marginTop: 18, gap: 10 },
});
