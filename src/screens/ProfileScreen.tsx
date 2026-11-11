import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Crown } from 'lucide-react-native';
import { assets } from '../assets';
import { AppBackground } from '../components/AppBackground';
import { BalanceBadge, formatCoins } from '../components/BalanceBadge';
import { EmptyState } from '../components/EmptyState';
import { GhostButton } from '../components/GhostButton';
import { ProgressBar } from '../components/ProgressBar';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionPanel } from '../components/SectionPanel';
import { StatCard, StatSlot } from '../components/StatCard';
import { theme } from '../constants/theme';
import { RELICS } from '../game/rewards';
import { useStoreValue } from '../hooks/useStore';
import { titleFor } from '../state/store';
import type { Go } from './types';

type Props = { go: Go };

/** Lifetime stats and the title earned from experience. */
export function ProfileScreen({ go }: Props) {
  const coins = useStoreValue(s => s.coins);
  const stats = useStoreValue(s => s.stats);
  const owned = useStoreValue(s => s.relics);
  const streak = useStoreValue(s => s.daily.day);

  const band = titleFor(stats.xp);
  const span = Math.max(1, band.to - band.from);
  const into = Math.max(0, Math.min(span, stats.xp - band.from));

  return (
    <AppBackground variant="panel" dust={12}>
      <ScreenHeader
        title="PROFILE"
        subtitle={band.name}
        accent={theme.colors.purple}
        leftSlot={<GhostButton label="MENU" onPress={() => go('menu')} tone="gold" height={44} />}
        rightSlot={<BalanceBadge coins={coins} compact />}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.ring}>
            <Image source={assets.logo} style={styles.avatar} />
          </View>
          <Text style={styles.title} numberOfLines={1}>
            {band.name}
          </Text>
          <Text style={styles.xp} numberOfLines={1}>
            {formatCoins(into) + ' / ' + formatCoins(span) + ' XP'}
          </Text>
          <View style={styles.bar}>
            <ProgressBar value={into} max={span} height={8} />
          </View>
        </View>

        {stats.totalSpins === 0 ? (
          <SectionPanel title="LIFETIME" accent={theme.colors.purple}>
            <EmptyState
              title="NO SESSIONS RECORDED YET"
              hint="PLAY ONE SESSION AND YOUR SPINS, CASCADES AND BEST MULTIPLIER APPEAR HERE"
              Icon={Crown}
              actionLabel="PLAY NOW"
              onAction={() => go('game')}
            />
          </SectionPanel>
        ) : null}

        {stats.totalSpins > 0 ? (
        <View style={styles.row}>
          <StatSlot>
            <StatCard
              Icon={Crown}
              value={stats.totalSpins}
              label="TOTAL SPINS"
              accent={theme.colors.gold}
            />
          </StatSlot>
          <StatSlot>
            <StatCard
              Icon={Crown}
              value={stats.bestSession}
              label="BEST SESSION"
              accent={theme.colors.purple}
              format={formatCoins}
            />
          </StatSlot>
          <StatSlot>
            <StatCard
              Icon={Crown}
              value={stats.biggestMulti}
              label="BIGGEST MULTI"
              accent={theme.colors.win}
              prefix="x"
            />
          </StatSlot>
        </View>
        ) : null}

        {stats.totalSpins > 0 ? (
        <View style={styles.row}>
          <StatSlot>
            <StatCard
              Icon={Crown}
              value={stats.cascades > 0 ? stats.cascades : stats.totalSpins}
              label={stats.cascades > 0 ? 'CASCADES' : 'DROPS PLAYED'}
              accent={theme.colors.purple}
            />
          </StatSlot>
          <StatSlot>
            <StatCard
              Icon={Crown}
              value={stats.levelsCleared > 0 ? stats.levelsCleared : stats.xp}
              label={stats.levelsCleared > 0 ? 'LEVELS CLEARED' : 'EXPERIENCE'}
              accent={theme.colors.gold}
            />
          </StatSlot>
          <StatSlot>
            <StatCard
              Icon={Crown}
              value={streak}
              label="DAY STREAK"
              accent={theme.colors.win}
            />
          </StatSlot>
        </View>
        ) : null}

        <SectionPanel title="RELIC SHELF" accent={theme.colors.gold}>
          <View style={styles.shelf}>
            {RELICS.map(relic => {
              const has = owned.indexOf(relic.id) >= 0;
              return (
                <View key={relic.id} style={[styles.slot, has ? styles.slotFilled : null]}>
                  <Crown
                    size={20}
                    color={has ? theme.colors.goldLight : theme.colors.textMuted}
                    strokeWidth={2.4}
                  />
                </View>
              );
            })}
          </View>
          <Text style={styles.shelfHint} numberOfLines={2}>
            {owned.length > 0
              ? owned.length + ' OF ' + RELICS.length + ' RELICS EQUIPPED'
              : 'NO RELICS YET · CLEAR TRIALS TO EARN TOKENS'}
          </Text>
        </SectionPanel>

        <GhostButton label="REWARDS" onPress={() => go('rewards')} tone="gold" />
        <GhostButton label="MENU" onPress={() => go('menu')} tone="neutral" />
      </ScrollView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 28, gap: 12 },
  hero: { alignItems: 'center', marginBottom: 2 },
  ring: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: theme.colors.gold,
    backgroundColor: theme.colors.raised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: { width: 74, height: 74, resizeMode: 'contain' },
  title: {
    marginTop: 10,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '900',
    letterSpacing: 2.4,
    color: theme.colors.goldLight,
  },
  xp: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: theme.colors.textSec,
    fontVariant: ['tabular-nums'],
  },
  bar: { width: '70%', marginTop: 10 },
  row: { flexDirection: 'row', gap: 10 },
  shelf: { flexDirection: 'row', gap: 10, justifyContent: 'center' },
  slot: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotFilled: {
    borderStyle: 'solid',
    borderColor: theme.colors.borderGold,
    backgroundColor: 'rgba(212,175,55,0.16)',
  },
  shelfHint: {
    marginTop: 12,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
});
