import React, { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Medal } from 'lucide-react-native';
import { AppBackground } from '../components/AppBackground';
import { BalanceBadge } from '../components/BalanceBadge';
import { EmptyState } from '../components/EmptyState';
import { GhostButton } from '../components/GhostButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { theme } from '../constants/theme';
import { RELICS, type Relic } from '../game/rewards';
import { useStoreValue } from '../hooks/useStore';
import { unlockRelic } from '../state/store';
import type { Go } from './types';

type Props = { go: Go };

/** Relic tokens spent on real gameplay upgrades; unlocked relics move to the top. */
export function RewardsScreen({ go }: Props) {
  const coins = useStoreValue(s => s.coins);
  const tokens = useStoreValue(s => s.tokens);
  const owned = useStoreValue(s => s.relics);

  const ordered: Relic[] = useMemo(() => {
    const have = RELICS.filter(r => owned.indexOf(r.id) >= 0);
    const rest = RELICS.filter(r => owned.indexOf(r.id) < 0);
    return have.concat(rest);
  }, [owned]);

  const onUnlock = useCallback((relic: Relic) => {
    unlockRelic(relic.id, relic.cost);
  }, []);

  const nothingToDo = tokens === 0 && owned.length === 0;

  return (
    <AppBackground variant="panel" dust={12}>
      <ScreenHeader
        title="REWARDS"
        subtitle={tokens + ' RELIC TOKENS'}
        accent={theme.colors.gold}
        leftSlot={<GhostButton label="MENU" onPress={() => go('menu')} tone="gold" height={44} />}
        rightSlot={<BalanceBadge coins={coins} compact />}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {nothingToDo ? (
          <EmptyState
            title="EARN TOKENS IN CHALLENGES"
            hint="EVERY CLEARED TRIAL PAYS RELIC TOKENS · SPEND THEM HERE"
            Icon={Medal}
            actionLabel="CHALLENGE"
            onAction={() => go('challenge')}
          />
        ) : (
          ordered.map(relic => {
            const unlocked = owned.indexOf(relic.id) >= 0;
            const affordable = tokens >= relic.cost;
            return (
              <View
                key={relic.id}
                style={[styles.card, unlocked ? styles.cardOwned : null]}>
                <View style={styles.head}>
                  <View
                    style={[
                      styles.iconTile,
                      unlocked ? styles.iconTileOwned : null,
                    ]}>
                    <Medal
                      size={22}
                      color={unlocked ? theme.colors.goldLight : theme.colors.textSec}
                      strokeWidth={2.4}
                    />
                  </View>
                  <View style={styles.text}>
                    <Text style={styles.name} numberOfLines={1}>
                      {relic.name}
                    </Text>
                    <Text style={styles.effect} numberOfLines={2}>
                      {relic.effect}
                    </Text>
                  </View>
                  {unlocked ? (
                    <Text style={styles.tag} numberOfLines={1}>
                      EQUIPPED
                    </Text>
                  ) : (
                    <Text style={styles.cost} numberOfLines={1}>
                      {relic.cost}
                    </Text>
                  )}
                </View>
                {unlocked ? null : (
                  <GhostButton
                    label={affordable ? 'UNLOCK' : 'NEED ' + (relic.cost - tokens) + ' MORE'}
                    tone={affordable ? 'gold' : 'neutral'}
                    disabled={!affordable}
                    height={44}
                    onPress={() => onUnlock(relic)}
                  />
                )}
              </View>
            );
          })
        )}

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
  cardOwned: { borderWidth: 2, borderColor: theme.colors.gold },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconTileOwned: {
    backgroundColor: 'rgba(212,175,55,0.18)',
    borderColor: theme.colors.borderGold,
  },
  text: { flex: 1 },
  name: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
    letterSpacing: 1.3,
    color: theme.colors.text,
  },
  effect: {
    marginTop: 3,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 0.9,
    color: theme.colors.textMuted,
  },
  cost: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '900',
    color: theme.colors.goldLight,
    fontVariant: ['tabular-nums'],
  },
  tag: {
    fontSize: 9,
    lineHeight: 13,
    fontWeight: '900',
    letterSpacing: 1.2,
    color: theme.colors.gold,
  },
});
