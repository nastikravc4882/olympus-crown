import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TriangleAlert } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { GhostButton } from './GhostButton';

type Props = {
  label: string;
  confirmLabel: string;
  hint: string;
  onConfirm: () => void;
};

/** Two-step destructive action - the first tap only arms the second. */
export function ConfirmRow({ label, confirmLabel, hint, onConfirm }: Props) {
  const [armed, setArmed] = useState(false);

  const press = useCallback(() => {
    if (armed) {
      setArmed(false);
      onConfirm();
      return;
    }
    setArmed(true);
  }, [armed, onConfirm]);

  return (
    <View style={styles.wrap}>
      <View style={styles.note}>
        <TriangleAlert size={16} color={theme.colors.danger} strokeWidth={2.4} />
        <Text style={styles.hint} numberOfLines={2}>
          {armed ? 'TAP AGAIN TO WIPE EVERY RELIC AND LEVEL' : hint}
        </Text>
      </View>
      <GhostButton label={armed ? confirmLabel : label} onPress={press} tone="danger" height={48} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  note: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  hint: {
    flex: 1,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.textMuted,
  },
});
