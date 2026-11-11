import React, { useCallback, useRef, useState } from 'react';
import { Animated, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Crown, Lock } from 'lucide-react-native';
import { AppBackground } from '../components/AppBackground';
import { BalanceBadge, formatCoins } from '../components/BalanceBadge';
import { GhostButton } from '../components/GhostButton';
import { GoldButton } from '../components/GoldButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { theme } from '../constants/theme';
import { LEVELS, type Level } from '../game/levels';
import { HIT_SLOP } from '../hooks/usePressScale';
import { useStoreValue } from '../hooks/useStore';
import { selectLevel } from '../state/store';
import type { Go } from './types';

type Props = { go: Go };

type CardProps = {
  level: Level;
  locked: boolean;
  selected: boolean;
  stars: number;
  onPick: (index: number) => void;
};

/** One marble level card. A locked card shakes and never navigates. */
function LevelCard({ level, locked, selected, stars, onPick }: CardProps) {
  const shake = useRef(new Animated.Value(0)).current;

  const press = useCallback(() => {
    if (!locked) {
      onPick(level.index);
      return;
    }
    Animated.sequence([
      Animated.timing(shake, { toValue: 1, duration: 55, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -1, duration: 55, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 1, duration: 55, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 55, useNativeDriver: true }),
    ]).start();
  }, [locked, onPick, level.index, shake]);

  const translateX = shake.interpolate({ inputRange: [-1, 1], outputRange: [-6, 6] });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={level.name}
      hitSlop={HIT_SLOP}
      onPress={press}
      style={styles.cardPress}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.card,
          selected ? styles.cardSelected : null,
          locked ? styles.cardLocked : null,
          { transform: [{ translateX }] },
        ]}>
        <View style={styles.cardTop}>
          <Text style={styles.cardIndex} numberOfLines={1}>
            {level.index + 1}
          </Text>
          {locked ? <Lock size={18} color={theme.colors.textMuted} strokeWidth={2.4} /> : null}
        </View>
        <Text style={styles.cardName} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
          {level.name}
        </Text>
        <Text style={styles.cardTarget} numberOfLines={1}>
          {locked ? 'CLEAR LEVEL ' + level.index : 'TARGET ' + formatCoins(level.target)}
        </Text>
        <View style={styles.starRow}>
          <Text style={[styles.star, stars >= 1 ? styles.starOn : styles.starOff]}>★</Text>
          <Text style={[styles.star, stars >= 2 ? styles.starOn : styles.starOff]}>★</Text>
          <Text style={[styles.star, stars >= 3 ? styles.starOn : styles.starOff]}>★</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export function LevelSelectScreen({ go }: Props) {
  const coins = useStoreValue(s => s.coins);
  const unlocked = useStoreValue(s => s.unlockedLevel);
  const starsMap = useStoreValue(s => s.stars);
  const current = useStoreValue(s => s.levelIndex);
  const [picked, setPicked] = useState(current);

  const onPick = useCallback((index: number) => {
    setPicked(index);
    selectLevel(index);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Level }) => (
      <View style={styles.cell}>
        <LevelCard
          level={item}
          locked={item.index > unlocked}
          selected={item.index === picked}
          stars={starsMap[item.index] || 0}
          onPick={onPick}
        />
      </View>
    ),
    [unlocked, picked, starsMap, onPick],
  );

  const keyExtractor = useCallback((item: Level) => String(item.index), []);

  return (
    <AppBackground variant="panel" dust={12}>
      <ScreenHeader
        title="LEVEL SELECT"
        subtitle={'UNLOCKED ' + (unlocked + 1) + ' OF ' + LEVELS.length}
        accent={theme.colors.purple}
        leftSlot={<GhostButton label="MENU" onPress={() => go('menu')} tone="gold" height={44} />}
        rightSlot={<BalanceBadge coins={coins} compact />}
      />

      <FlatList
        data={LEVELS}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.column}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <Text style={styles.footerHint} numberOfLines={1}>
          {'SELECTED · ' + LEVELS[picked].name}
        </Text>
        <GoldButton label="PLAY NOW" Icon={Crown} onPress={() => go('game')} height={60} />
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 10 },
  column: { gap: 12 },
  cell: { flex: 1, marginBottom: 12 },
  cardPress: { width: '100%', height: 120 },
  card: {
    width: '100%',
    height: 120,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.raised,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 12,
    justifyContent: 'center',
  },
  cardSelected: { borderWidth: 2, borderColor: theme.colors.gold },
  cardLocked: { opacity: 0.45 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardIndex: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '900',
    color: theme.colors.goldLight,
    fontVariant: ['tabular-nums'],
  },
  cardName: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: theme.colors.text,
  },
  cardTarget: {
    marginTop: 4,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.textMuted,
  },
  starRow: { flexDirection: 'row', gap: 6, marginTop: 8 },
  star: { fontSize: 14, lineHeight: 18 },
  starOn: { color: theme.colors.goldLight },
  starOff: { color: '#2A2822' },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderColor: theme.colors.borderGold,
  },
  footerHint: {
    marginBottom: 10,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: theme.colors.textSec,
    textAlign: 'center',
  },
});
