import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Gift, Home, Sparkles } from 'lucide-react-native';
import { AppBackground } from '../components/AppBackground';
import { BalanceBadge, formatCoins } from '../components/BalanceBadge';
import { GhostButton } from '../components/GhostButton';
import { GoldButton } from '../components/GoldButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionPanel } from '../components/SectionPanel';
import { DAILY_LADDER } from '../constants/config';
import { theme } from '../constants/theme';
import { canClaim, claim, formatCountdown, msUntilNext, rewardForDay } from '../game/dailyBonus';
import { useStoreValue } from '../hooks/useStore';
import { addCoins, setState } from '../state/store';
import type { Go } from './types';

type Props = { go: Go };

/** Seven-day streak track. A missed window resets to day 1 - never a blank board. */
export function DailyBonusScreen({ go }: Props) {
  const coins = useStoreValue(s => s.coins);
  const daily = useStoreValue(s => s.daily);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const day = Number.isFinite(daily.day) && daily.day > 0 ? daily.day : 1;
  const claimable = useMemo(() => canClaim(daily, now), [daily, now]);
  const corrupt = !Number.isFinite(daily.day) || daily.day < 1;

  const onClaim = useCallback(() => {
    const result = claim({ day, lastClaimAt: daily.lastClaimAt }, Date.now());
    if (result.coins <= 0) {
      return;
    }
    addCoins(result.coins);
    setState({ daily: result.state, orbBlessing: result.blessing });
  }, [day, daily.lastClaimAt]);

  const rows = [
    [1, 2, 3, 4],
    [5, 6, 7],
  ];

  return (
    <AppBackground variant="panel" dust={12}>
      <ScreenHeader
        title="DAILY BONUS"
        subtitle={corrupt ? 'STREAK RESTORED TO DAY 1' : 'DAY ' + day + ' OF 7'}
        accent={theme.colors.gold}
        leftSlot={<GhostButton label="MENU" onPress={() => go('menu')} tone="gold" height={44} />}
        rightSlot={<BalanceBadge coins={coins} compact />}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <SectionPanel title="STREAK TRACK" accent={theme.colors.gold}>
          {rows.map((row, ri) => (
            <View key={ri} style={styles.row}>
              {row.map(d => {
                const claimed = d < day;
                const today = d === day;
                return (
                  <View
                    key={d}
                    style={[
                      styles.tile,
                      claimed ? styles.tileClaimed : null,
                      today ? styles.tileToday : null,
                    ]}>
                    <Text style={styles.tileDay} numberOfLines={1}>
                      {'DAY ' + d}
                    </Text>
                    <Text
                      style={[styles.tileCoins, claimed ? styles.tileCoinsClaimed : null]}
                      numberOfLines={1}>
                      {claimed ? '✓' : '+' + formatCoins(DAILY_LADDER[d - 1])}
                    </Text>
                  </View>
                );
              })}
            </View>
          ))}
          <Text style={styles.note} numberOfLines={2}>
            DAY 7 ALSO GRANTS THE ORB BLESSING · ONE EXTRA ORB CHANCE EVERY SPIN
          </Text>
        </SectionPanel>

        <SectionPanel title="TODAY" accent={theme.colors.purple}>
          <View style={styles.today}>
            <Sparkles size={28} color={theme.colors.goldLight} strokeWidth={2.2} />
            <Text style={styles.todayValue} numberOfLines={1}>
              {'+' + formatCoins(rewardForDay(day)) + ' COINS'}
            </Text>
            <Text style={styles.todayHint} numberOfLines={1}>
              {claimable ? 'THE GATE IS OPEN' : 'COME BACK TOMORROW'}
            </Text>
            {claimable ? null : (
              <Text style={styles.countdown} numberOfLines={1}>
                {formatCountdown(msUntilNext(daily, now))}
              </Text>
            )}
          </View>
          <GoldButton
            label={claimable ? 'CLAIM' : 'COME BACK TOMORROW'}
            Icon={Gift}
            onPress={onClaim}
            disabled={!claimable}
            height={58}
          />
        </SectionPanel>

        <GhostButton label="MENU" Icon={Home} onPress={() => go('menu')} tone="neutral" />
      </ScrollView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 28, gap: 14 },
  row: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  tile: {
    flex: 1,
    height: 72,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.bg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    opacity: 0.6,
  },
  tileClaimed: {
    opacity: 1,
    backgroundColor: 'rgba(212,175,55,0.16)',
    borderColor: theme.colors.borderGold,
  },
  tileToday: { opacity: 1, borderWidth: 2, borderColor: theme.colors.gold },
  tileDay: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '800',
    letterSpacing: 1,
    color: theme.colors.textMuted,
  },
  tileCoins: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900',
    color: theme.colors.goldLight,
    fontVariant: ['tabular-nums'],
  },
  tileCoinsClaimed: { fontSize: 18, lineHeight: 22, color: theme.colors.gold },
  note: {
    marginTop: 4,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  today: { alignItems: 'center', gap: 4, marginBottom: 14 },
  todayValue: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '900',
    letterSpacing: 1,
    color: theme.colors.goldLight,
    fontVariant: ['tabular-nums'],
  },
  todayHint: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: theme.colors.textSec,
  },
  countdown: {
    marginTop: 2,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '900',
    color: theme.colors.purpleSoft,
    fontVariant: ['tabular-nums'],
  },
});
