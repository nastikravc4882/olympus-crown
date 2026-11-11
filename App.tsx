import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, BackHandler, StatusBar, StyleSheet, View } from 'react-native';
import { LOADER_DURATION_MS } from './src/constants/config';
import { theme } from './src/constants/theme';
import type { SessionSummary } from './src/hooks/useGameSession';
import { hydrate } from './src/state/store';
import { ChallengeScreen } from './src/screens/ChallengeScreen';
import { DailyBonusScreen } from './src/screens/DailyBonusScreen';
import { GameScreen } from './src/screens/GameScreen';
import { LevelSelectScreen } from './src/screens/LevelSelectScreen';
import { LoaderScreen } from './src/screens/LoaderScreen';
import { MenuScreen } from './src/screens/MenuScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { ResultScreen } from './src/screens/ResultScreen';
import { RewardsScreen } from './src/screens/RewardsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import type { ScreenName } from './src/screens/types';

const EMPTY_SUMMARY: SessionSummary = {
  score: 0,
  spins: 0,
  cascades: 0,
  bestMulti: 1,
  orbs: 0,
  stars: 0,
  levelIndex: 0,
  tokens: 0,
  gateRounds: 0,
};

/** One place owns the current screen. No navigation library anywhere. */
export default function App() {
  const [screen, setScreen] = useState<ScreenName>('loader');
  const [summary, setSummary] = useState<SessionSummary>(EMPTY_SUMMARY);
  const screenRef = useRef<ScreenName>('loader');
  const fade = useRef(new Animated.Value(0)).current;

  const go = useCallback((next: ScreenName) => {
    screenRef.current = next;
    setScreen(next);
  }, []);

  // Rehydrate the local save before the hub is drawn.
  useEffect(() => {
    hydrate();
  }, []);

  // The splash hold is a plain timer - never a tap, never an animation callback.
  useEffect(() => {
    const id = setTimeout(() => go('menu'), LOADER_DURATION_MS);
    return () => clearTimeout(id);
  }, [go]);

  // Animated screen entry - opacity and transform only.
  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, {
      toValue: 1,
      duration: screen === 'menu' ? 320 : 260,
      useNativeDriver: true,
    }).start();
  }, [screen, fade]);

  // System Back: a sub-screen returns to the hub, the hub closes the app,
  // the loader is never on the back stack.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      const current = screenRef.current;
      if (current === 'loader') {
        return true;
      }
      if (current === 'menu') {
        return false;
      }
      go('menu');
      return true;
    });
    return () => sub.remove();
  }, [go]);

  const onGameOver = useCallback(
    (next: SessionSummary) => {
      setSummary(next);
      go('result');
    },
    [go],
  );

  const onAgain = useCallback(() => go('game'), [go]);

  const scale = fade.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] });

  const render = () => {
    switch (screen) {
      case 'loader':
        return <LoaderScreen />;
      case 'menu':
        return <MenuScreen go={go} />;
      case 'game':
        return <GameScreen go={go} onGameOver={onGameOver} />;
      case 'result':
        return <ResultScreen go={go} summary={summary} onAgain={onAgain} />;
      case 'daily':
        return <DailyBonusScreen go={go} />;
      case 'levels':
        return <LevelSelectScreen go={go} />;
      case 'challenge':
        return <ChallengeScreen go={go} />;
      case 'rewards':
        return <RewardsScreen go={go} />;
      case 'profile':
        return <ProfileScreen go={go} />;
      case 'settings':
        return <SettingsScreen go={go} />;
      default:
        return <MenuScreen go={go} />;
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.bg} />
      <Animated.View
        pointerEvents="box-none"
        style={[styles.layer, { opacity: fade, transform: [{ scale }] }]}>
        {render()}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  layer: { flex: 1 },
});
