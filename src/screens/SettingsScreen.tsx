import React, { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { AppBackground } from '../components/AppBackground';
import { BalanceBadge } from '../components/BalanceBadge';
import { ConfirmRow } from '../components/ConfirmRow';
import { Disclaimer } from '../components/Disclaimer';
import { GhostButton } from '../components/GhostButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionPanel } from '../components/SectionPanel';
import { DISCLAIMER_LONG } from '../constants/config';
import { theme } from '../constants/theme';
import { HIT_SLOP } from '../hooks/usePressScale';
import { useStoreValue } from '../hooks/useStore';
import { resetProgress, setSetting, type Settings as SettingsShape } from '../state/store';
import type { Go } from './types';

type Props = { go: Go };

type RowProps = {
  label: string;
  hint: string;
  value: boolean;
  onChange: (next: boolean) => void;
};

function ToggleRow({ label, hint, value, onChange }: RowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel} numberOfLines={1}>
          {label}
        </Text>
        <Text style={styles.rowHint} numberOfLines={2}>
          {hint}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        thumbColor={value ? theme.colors.goldLight : '#6A6458'}
        trackColor={{ false: '#2A2822', true: 'rgba(212,175,55,0.45)' }}
        accessibilityLabel={label}
      />
    </View>
  );
}

function SegmentedRow({
  label,
  hint,
  options,
  index,
  onPick,
}: {
  label: string;
  hint: string;
  options: string[];
  index: number;
  onPick: (i: number) => void;
}) {
  return (
    <View style={styles.segmentWrap}>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel} numberOfLines={1}>
          {label}
        </Text>
        <Text style={styles.rowHint} numberOfLines={2}>
          {hint}
        </Text>
      </View>
      <View style={styles.segments}>
        {options.map((opt, i) => (
          <Pressable
            key={opt}
            accessibilityRole="button"
            accessibilityLabel={opt}
            accessibilityState={{ selected: i === index }}
            hitSlop={HIT_SLOP}
            onPress={() => onPick(i)}
            style={[styles.segment, i === index ? styles.segmentOn : null]}>
            <Text
              style={[styles.segmentText, i === index ? styles.segmentTextOn : null]}
              numberOfLines={1}>
              {opt}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

/** Every option here changes real behaviour and is persisted. No audio controls. */
export function SettingsScreen({ go }: Props) {
  const coins = useStoreValue(s => s.coins);
  const settings = useStoreValue(s => s.settings);

  const toggle = useCallback(
    (key: keyof SettingsShape) => (next: boolean) => setSetting(key, next),
    [],
  );

  const onReset = useCallback(() => {
    resetProgress();
    go('menu');
  }, [go]);

  return (
    <AppBackground variant="panel" dust={12}>
      <ScreenHeader
        title="SETTINGS"
        subtitle="EVERY OPTION CHANGES REAL BEHAVIOUR"
        accent={theme.colors.textMuted}
        leftSlot={<GhostButton label="MENU" onPress={() => go('menu')} tone="gold" height={44} />}
        rightSlot={<BalanceBadge coins={coins} compact />}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <SectionPanel title="SPIN" accent={theme.colors.gold}>
          <SegmentedRow
            label="SPIN SPEED"
            hint="QUICK HALVES THE COLUMN STAGGER AND THE DROP TIME"
            options={['NORMAL', 'QUICK']}
            index={settings.quickSpin ? 1 : 0}
            onPick={i => setSetting('quickSpin', i === 1)}
          />
          <View style={styles.rule} />
          <ToggleRow
            label="AUTO COLLECT"
            hint="AFTER THE LAST SPIN GO STRAIGHT TO THE RESULT SCREEN"
            value={settings.autoCollect}
            onChange={toggle('autoCollect')}
          />
        </SectionPanel>

        <SectionPanel title="BOARD" accent={theme.colors.purple}>
          <ToggleRow
            label="WIN HIGHLIGHT"
            hint="GOLD RING AND FILL ON EVERY PAYING CELL"
            value={settings.winHighlight}
            onChange={toggle('winHighlight')}
          />
          <View style={styles.rule} />
          <ToggleRow
            label="HIGH CONTRAST"
            hint="RAISES THE CELL CONTRAST OF THE WHOLE BOARD"
            value={settings.highContrast}
            onChange={toggle('highContrast')}
          />
          <View style={styles.rule} />
          <ToggleRow
            label="REDUCED MOTION"
            hint="STOPS LOOPING DECOR AND CLAMPS EVERY TRANSITION"
            value={settings.reducedMotion}
            onChange={toggle('reducedMotion')}
          />
        </SectionPanel>

        <SectionPanel title="DANGER" accent={theme.colors.danger}>
          <ConfirmRow
            label="RESET PROGRESS"
            confirmLabel="CONFIRM RESET"
            hint="CLEARS LEVELS, RELICS, TOKENS AND THE DAILY STREAK"
            onConfirm={onReset}
          />
        </SectionPanel>

        <Text style={styles.version} numberOfLines={1}>
          OLYMPUS CROWN · BUILD 1.0.0
        </Text>
        <Disclaimer text={DISCLAIMER_LONG} />
        <GhostButton label="MENU" onPress={() => go('menu')} tone="neutral" />
      </ScrollView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 28, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48 },
  rowText: { flex: 1 },
  rowLabel: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '900',
    letterSpacing: 1.3,
    color: theme.colors.text,
  },
  rowHint: {
    marginTop: 3,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 0.9,
    color: theme.colors.textMuted,
  },
  rule: { height: 1, backgroundColor: theme.colors.border, marginVertical: 12 },
  segmentWrap: { gap: 10 },
  segments: {
    flexDirection: 'row',
    gap: 8,
    padding: 4,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.bg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  segment: {
    flex: 1,
    height: 48,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentOn: { backgroundColor: 'rgba(212,175,55,0.22)' },
  segmentText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: theme.colors.textMuted,
  },
  segmentTextOn: { color: theme.colors.goldLight },
  version: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
});
