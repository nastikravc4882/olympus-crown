import React, { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Zap } from 'lucide-react-native';
import { AppBackground } from '../components/AppBackground';
import { BalanceBadge } from '../components/BalanceBadge';
import { EmptyState } from '../components/EmptyState';
import { GhostButton } from '../components/GhostButton';
import { GoldButton } from '../components/GoldButton';
import { ProgressBar } from '../components/ProgressBar';
import { ScreenHeader } from '../components/ScreenHeader';
import { theme } from '../constants/theme';
import { dailyChallenges, isComplete, type Challenge } from '../game/challenges';
import { useStoreValue } from '../hooks/useStore';
import { setState } from '../state/store';
import type { Go } from './types';

type Props = { go: Go };

/** Three daily trials, tracked live during a session. */
export function ChallengeScreen({ go }: Props) {
  const coins = useStoreValue(s => s.coins);
  const progress = useStoreValue(s => s.challenges);
  const tokens = useStoreValue(s => s.tokens);

  const active: Challenge[] = useMemo(
    () => dailyChallenges(Math.floor(Date.now() / 86400000) % 5),
    [],
  );
  const allDone = active.every(c => isComplete(c, progress));

  const start = useCallback(() => {
    const first = active.filter(c => !isComplete(c, progress))[0];
    setState({ activeChallenge: first ? first.id : '' });
    go('game');
  }, [active, progress, go]);

  return (
    <AppBackground variant="panel" dust={12}>
      <ScreenHeader
        title="CHALLENGE"
        subtitle={tokens + ' RELIC TOKENS IN THE PURSE'}
        accent={theme.colors.purple}
        leftSlot={<GhostButton label="MENU" onPress={() => go('menu')} tone="gold" height={44} />}
        rightSlot={<BalanceBadge coins={coins} compact />}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {allDone ? (
          <EmptyState
            title="ALL TRIALS CLEARED"
            hint="NEW TRIALS AT MIDNIGHT · SPEND YOUR TOKENS ON RELICS"
            actionLabel="REWARDS"
            onAction={() => go('rewards')}
          />
        ) : (
          active.map(c => {
            const have = Math.min(progress[c.id] || 0, c.goal);
            const done = have >= c.goal;
            return (
              <View key={c.id} style={[styles.card, done ? styles.cardDone : null]}>
                <View style={styles.cardHead}>
                  <View style={styles.iconTile}>
                    <Zap size={22} color={theme.colors.purpleSoft} strokeWidth={2.4} />
                  </View>
                  <View style={styles.cardText}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                      {c.title}
                    </Text>
                    <Text style={styles.cardHint} numberOfLines={2}>
                      {c.hint}
                    </Text>
                  </View>
                  <Text style={styles.reward} numberOfLines={1}>
                    {'+' + c.reward}
                  </Text>
                </View>
                <View style={styles.barRow}>
                  <View style={styles.bar}>
                    <ProgressBar
                      value={have}
                      max={c.goal}
                      height={6}
                      colors={theme.gradients.purple}
                    />
                  </View>
                  <Text style={styles.count} numberOfLines={1}>
                    {done ? '✓' : have + ' / ' + c.goal}
                  </Text>
                </View>
              </View>
            );
          })
        )}

        <GoldButton label="START CHALLENGE" Icon={Zap} onPress={start} height={60} />
        <Text style={styles.foot} numberOfLines={2}>
          THE ACTIVE TRIAL RAISES THE ORB CHANCE DURING THE NEXT SESSION
        </Text>
        <GhostButton label="MENU" onPress={() => go('menu')} tone="neutral" />
      </ScrollView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 28, gap: 12 },
  card: {
    backgroundColor: theme.colors.raised,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 14,
    gap: 12,
  },
  cardDone: { opacity: 0.7, borderColor: theme.colors.borderGold },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(138,92,240,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(138,92,240,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: { flex: 1 },
  cardTitle: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
    letterSpacing: 1.3,
    color: theme.colors.text,
  },
  cardHint: {
    marginTop: 3,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 0.9,
    color: theme.colors.textMuted,
  },
  reward: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '900',
    color: theme.colors.goldLight,
    fontVariant: ['tabular-nums'],
  },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bar: { flex: 1 },
  count: {
    minWidth: 52,
    textAlign: 'right',
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
    color: theme.colors.purpleSoft,
    fontVariant: ['tabular-nums'],
  },
  foot: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
});
