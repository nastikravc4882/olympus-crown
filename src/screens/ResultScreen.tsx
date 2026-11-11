import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Crown, Home, Layers, Medal, RotateCcw, Zap } from 'lucide-react-native';
import { AppBackground } from '../components/AppBackground';
import { BalanceBadge, formatCoins } from '../components/BalanceBadge';
import { Disclaimer } from '../components/Disclaimer';
import { GhostButton } from '../components/GhostButton';
import { GoldButton } from '../components/GoldButton';
import { ProgressBar } from '../components/ProgressBar';
import { ScreenHeader } from '../components/ScreenHeader';
import { StatCard, StatSlot } from '../components/StatCard';
import { BET, DISCLAIMER, RESTORE_COINS } from '../constants/config';
import { theme } from '../constants/theme';
import { levelAt } from '../game/levels';
import { VERDICT_TEXT, verdictOf } from '../game/session';
import { useCountUp } from '../hooks/useCountUp';
import type { SessionSummary } from '../hooks/useGameSession';
import { useStoreValue } from '../hooks/useStore';
import { addCoins } from '../state/store';
import type { Go } from './types';

type Props = {
  go: Go;
  summary: SessionSummary;
  onAgain: () => void;
};

const STAR_ON = '★';
const STAR_OFF = '★';

/** The session verdict, in the game's own words - never "You win" / "Game over". */
export function ResultScreen({ go, summary, onAgain }: Props) {
  const coins = useStoreValue(s => s.coins);
  const level = levelAt(summary.levelIndex);
  const verdict = verdictOf(summary.score, summary.levelIndex, coins);
  const copy = VERDICT_TEXT[verdict];
  const score = useCountUp(summary.score, 900);

  const panel = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(panel, {
      toValue: 1,
      tension: 46,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [panel]);

  const scale = panel.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] });
  const broke = coins < BET;

  return (
    <AppBackground variant="result" blobs dust={16}>
      <ScreenHeader
        title="SESSION SEALED"
        subtitle={'LEVEL ' + (summary.levelIndex + 1) + ' · ' + level.name}
        accent={theme.colors.purple}
        rightSlot={<BalanceBadge coins={coins} compact />}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Animated.View
          pointerEvents="box-none"
          style={[styles.hero, { opacity: panel, transform: [{ scale }] }]}>
          <Text style={styles.verdict} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
            {copy.title}
          </Text>
          <Text style={styles.verdictHint} numberOfLines={1}>
            {copy.hint}
          </Text>
          <View style={styles.laurelRule} />

          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel} numberOfLines={1}>
              SESSION SCORE
            </Text>
            <Text style={styles.score} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.5}>
              {formatCoins(score)}
            </Text>
            <Text style={styles.target} numberOfLines={1}>
              {'TARGET ' + formatCoins(level.target)}
            </Text>
            <View style={styles.bar}>
              <ProgressBar value={summary.score} max={level.target} height={8} />
            </View>
            <View style={styles.stars}>
              <Text
                style={[styles.star, summary.stars >= 1 ? styles.starOn : styles.starOff]}>
                {summary.stars >= 1 ? STAR_ON : STAR_OFF}
              </Text>
              <Text
                style={[styles.star, summary.stars >= 2 ? styles.starOn : styles.starOff]}>
                {summary.stars >= 2 ? STAR_ON : STAR_OFF}
              </Text>
              <Text
                style={[styles.star, summary.stars >= 3 ? styles.starOn : styles.starOff]}>
                {summary.stars >= 3 ? STAR_ON : STAR_OFF}
              </Text>
            </View>
          </View>
        </Animated.View>

        <View style={styles.statRow}>
          <StatSlot>
            <StatCard Icon={Crown} value={summary.spins} label="SPINS" accent={theme.colors.gold} />
          </StatSlot>
          <StatSlot>
            <StatCard
              Icon={Crown}
              value={summary.cascades}
              label="CASCADES"
              accent={theme.colors.purple}
            />
          </StatSlot>
          <StatSlot>
            <StatCard
              Icon={Crown}
              value={summary.bestMulti}
              label="BEST MULTI"
              accent={theme.colors.win}
              prefix="x"
            />
          </StatSlot>
        </View>

        {summary.tokens > 0 ? (
          <View style={styles.tokenBanner}>
            <Medal size={20} color={theme.colors.goldLight} strokeWidth={2.4} />
            <Text style={styles.tokenText} numberOfLines={1}>
              {'CHALLENGE COMPLETE · +' + summary.tokens + ' RELIC TOKENS'}
            </Text>
          </View>
        ) : null}

        {broke ? (
          <View style={styles.restore}>
            <Text style={styles.restoreText} numberOfLines={2}>
              {'THE PURSE IS EMPTY. ZEUS GRANTS ' + formatCoins(RESTORE_COINS) + ' COINS.'}
            </Text>
            <GhostButton
              label="DIVINE RESTORE"
              Icon={Zap}
              tone="gold"
              onPress={() => addCoins(RESTORE_COINS)}
            />
          </View>
        ) : null}

        <View style={styles.actions}>
          <GoldButton label="PLAY AGAIN" Icon={RotateCcw} onPress={onAgain} height={60} />
          <View style={styles.sideBySide}>
            <View style={styles.half}>
              <GhostButton label="LEVEL SELECT" Icon={Layers} onPress={() => go('levels')} tone="gold" />
            </View>
            <View style={styles.half}>
              <GhostButton label="CHALLENGE" Icon={Zap} onPress={() => go('challenge')} tone="purple" />
            </View>
          </View>
          <GhostButton label="MENU" Icon={Home} onPress={() => go('menu')} tone="neutral" />
        </View>

        <Disclaimer text={DISCLAIMER} />
      </ScrollView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 28, gap: 14 },
  hero: { alignItems: 'center', marginTop: 8 },
  verdict: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '900',
    letterSpacing: 2,
    color: theme.colors.goldLight,
    textAlign: 'center',
  },
  verdictHint: {
    marginTop: 6,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.textSec,
    textAlign: 'center',
  },
  laurelRule: {
    marginTop: 12,
    width: 120,
    height: 2,
    borderRadius: 1,
    backgroundColor: theme.colors.borderGold,
  },
  scoreCard: {
    marginTop: 16,
    width: '100%',
    backgroundColor: theme.colors.raised,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.borderGold,
    paddingVertical: 18,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.textMuted,
  },
  score: {
    marginTop: 4,
    fontSize: 44,
    lineHeight: 52,
    fontWeight: '900',
    color: theme.colors.goldLight,
    fontVariant: ['tabular-nums'],
  },
  target: {
    marginTop: 2,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: theme.colors.textSec,
  },
  bar: { width: '100%', marginTop: 12 },
  stars: { marginTop: 12, flexDirection: 'row', gap: 10 },
  star: { fontSize: 22, lineHeight: 26 },
  starOn: { color: theme.colors.goldLight },
  starOff: { color: '#2A2822' },
  statRow: { flexDirection: 'row', gap: 10 },
  tokenBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(212,175,55,0.12)',
    borderWidth: 1,
    borderColor: theme.colors.borderGold,
  },
  tokenText: {
    fontSize: 12,
    lineHeight: 20,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: theme.colors.goldLight,
  },
  restore: {
    gap: 10,
    padding: 14,
    borderRadius: theme.radius.lg,
    backgroundColor: 'rgba(226,71,74,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(226,71,74,0.4)',
  },
  restoreText: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: theme.colors.textSec,
    textAlign: 'center',
  },
  actions: { gap: 10 },
  sideBySide: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
});
