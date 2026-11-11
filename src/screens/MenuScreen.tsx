import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { Crown, Gift, Layers, Medal, Settings, UserRound, Zap } from 'lucide-react-native';
import { assets } from '../assets';
import { AppBackground } from '../components/AppBackground';
import { BalanceBadge } from '../components/BalanceBadge';
import { Disclaimer } from '../components/Disclaimer';
import { GoldButton } from '../components/GoldButton';
import { RouteTile } from '../components/RouteTile';
import { RoundIconButton } from '../components/RoundIconButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { StatCard, StatSlot } from '../components/StatCard';
import { DISCLAIMER } from '../constants/config';
import { theme } from '../constants/theme';
import { canClaim } from '../game/dailyBonus';
import { levelAt } from '../game/levels';
import { useStoreValue } from '../hooks/useStore';
import type { Go } from './types';

type Props = { go: Go };

/** The hub. Every one of the nine other screens is one tap away from here. */
export function MenuScreen({ go }: Props) {
  const coins = useStoreValue(s => s.coins);
  const levelIndex = useStoreValue(s => s.levelIndex);
  const best = useStoreValue(s => s.stats.bestSession);
  const tokens = useStoreValue(s => s.tokens);
  const daily = useStoreValue(s => s.daily);

  const sheet = useRef(new Animated.Value(0)).current;
  const level = levelAt(levelIndex);
  const bonusReady = useMemo(() => canClaim(daily, Date.now()), [daily]);

  useEffect(() => {
    Animated.spring(sheet, {
      toValue: 1,
      tension: 50,
      friction: 9,
      useNativeDriver: true,
    }).start();
  }, [sheet]);

  const translateY = sheet.interpolate({ inputRange: [0, 1], outputRange: [40, 0] });

  return (
    <AppBackground variant="menu" dust={12}>
      <ScreenHeader
        accent={theme.colors.borderGold}
        leftSlot={
          <RoundIconButton
            icon={assets.iconHome}
            label="PROFILE"
            onPress={() => go('profile')}
            size={48}
          />
        }
        rightSlot={<BalanceBadge coins={coins} />}
      />

      <View style={styles.hero}>
        <Image source={assets.logo} style={styles.logo} />
      </View>

      <Animated.View
        pointerEvents="box-none"
        style={[styles.sheet, { transform: [{ translateY }], opacity: sheet }]}>
        <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
          OLYMPUS CROWN
        </Text>
        <Text style={styles.tagline} numberOfLines={1}>
          TUMBLE THE RELICS · CATCH THE ORBS
        </Text>

        <View style={styles.chips}>
          <StatSlot>
            <StatCard
              Icon={Crown}
              value={levelIndex + 1}
              label={level.name}
              accent={theme.colors.gold}
              prefix="LV "
            />
          </StatSlot>
          <StatSlot>
            <StatCard
              Icon={Crown}
              value={best > 0 ? best : level.target}
              label={best > 0 ? 'BEST SESSION' : 'LEVEL TARGET'}
              accent={theme.colors.purple}
              format={v => String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </StatSlot>
          <StatSlot>
            <StatCard
              Icon={Crown}
              value={tokens}
              label="RELIC TOKENS"
              accent={theme.colors.win}
            />
          </StatSlot>
        </View>

        <View style={styles.cta}>
          <GoldButton label="PLAY NOW" Icon={Crown} onPress={() => go('game')} height={62} />
        </View>

        <View style={styles.grid}>
          <View style={styles.gridRow}>
            <RouteTile label="DAILY BONUS" Icon={Gift} onPress={() => go('daily')} badge={bonusReady} />
            <RouteTile label="LEVEL SELECT" Icon={Layers} onPress={() => go('levels')} />
            <RouteTile
              label="CHALLENGE"
              Icon={Zap}
              onPress={() => go('challenge')}
              accent={theme.colors.purple}
            />
          </View>
          <View style={styles.gridRow}>
            <RouteTile label="REWARDS" Icon={Medal} onPress={() => go('rewards')} />
            <RouteTile
              label="PROFILE"
              Icon={UserRound}
              onPress={() => go('profile')}
              accent={theme.colors.purple}
            />
            <RouteTile label="SETTINGS" Icon={Settings} onPress={() => go('settings')} />
          </View>
        </View>

        <View style={styles.footer}>
          <Disclaimer text={DISCLAIMER} />
        </View>
      </Animated.View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 90 },
  logo: { width: 112, height: 112, resizeMode: 'contain' },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: theme.colors.borderGold,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 22,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 18,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '900',
    letterSpacing: 2,
    color: theme.colors.goldLight,
    textAlign: 'center',
  },
  tagline: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: theme.colors.textSec,
    textAlign: 'center',
  },
  chips: { flexDirection: 'row', gap: 10, marginTop: 16 },
  cta: { marginTop: 18 },
  grid: { marginTop: 14, gap: 10 },
  gridRow: { flexDirection: 'row', gap: 10 },
  footer: { marginTop: 14 },
});
