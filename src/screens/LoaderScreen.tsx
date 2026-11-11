import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { assets } from '../assets';
import { AppBackground } from '../components/AppBackground';
import { Disclaimer } from '../components/Disclaimer';
import { DISCLAIMER_LONG, LOADER_DURATION_MS } from '../constants/config';
import { theme } from '../constants/theme';

const BAR_W = 220;

/**
 * The brand card. No PLAY button, no stat chips, no touch handler anywhere:
 * App.tsx leaves this screen on its own 8000 ms timer.
 */
export function LoaderScreen() {
  const medallion = useRef(new Animated.Value(0)).current;
  const titleIn = useRef(new Animated.Value(0)).current;
  const storm = useRef(new Animated.Value(0)).current;
  const bar = useRef(new Animated.Value(0)).current;
  const [dots, setDots] = useState('.');

  useEffect(() => {
    Animated.parallel([
      Animated.spring(medallion, {
        toValue: 1,
        tension: 42,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(titleIn, {
        toValue: 1,
        duration: 520,
        delay: 260,
        useNativeDriver: true,
      }),
    ]).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(storm, { toValue: 1, duration: 1600, useNativeDriver: true }),
        Animated.timing(storm, { toValue: 0, duration: 1600, useNativeDriver: true }),
      ]),
    );
    loop.start();

    // width is a layout property - this one animation stays on the JS driver.
    Animated.timing(bar, {
      toValue: 1,
      duration: LOADER_DURATION_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    const tick = setInterval(() => {
      setDots(d => (d.length >= 3 ? '.' : d + '.'));
    }, 420);

    return () => {
      loop.stop();
      clearInterval(tick);
    };
  }, [medallion, titleIn, storm, bar]);

  const scale = medallion.interpolate({ inputRange: [0, 1], outputRange: [0.82, 1] });
  const titleY = titleIn.interpolate({ inputRange: [0, 1], outputRange: [18, 0] });
  const stormOpacity = storm.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0.95] });
  const barWidth = bar.interpolate({ inputRange: [0, 1], outputRange: [0, BAR_W] });

  return (
    <AppBackground variant="loader" blobs dust={18}>
      <Animated.View pointerEvents="none" style={[styles.storm, { opacity: stormOpacity }]} />

      <View style={styles.body}>
        <Animated.View
          pointerEvents="none"
          style={[styles.medallion, { opacity: medallion, transform: [{ scale }] }]}>
          <Image source={assets.logo} style={styles.logo} />
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={[styles.titleBlock, { opacity: titleIn, transform: [{ translateY: titleY }] }]}>
          <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
            OLYMPUS CROWN
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            RELICS OF THE STORM
          </Text>
        </Animated.View>

        <View style={styles.barTrack}>
          <Animated.View style={[styles.barFillWrap, { width: barWidth }]}>
            <LinearGradient
              colors={theme.gradients.favour as string[]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.barFill}
            />
          </Animated.View>
        </View>

        <Text style={styles.loading} numberOfLines={1}>
          {'LOADING' + dots}
        </Text>
      </View>

      <View style={styles.footer}>
        <Disclaimer text={DISCLAIMER_LONG} />
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  storm: {
    position: 'absolute',
    top: '26%',
    alignSelf: 'center',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(138,92,240,0.16)',
  },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  medallion: {
    width: 168,
    height: 168,
    borderRadius: 84,
    backgroundColor: '#1C1C24',
    borderWidth: 2,
    borderColor: theme.colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 28,
    elevation: 14,
  },
  logo: { width: 120, height: 120, resizeMode: 'contain' },
  titleBlock: { marginTop: 28, alignItems: 'center' },
  title: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '900',
    letterSpacing: 4,
    color: theme.colors.goldLight,
    textAlign: 'center',
    textShadowColor: 'rgba(212,175,55,0.55)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 3,
    color: theme.colors.textSec,
  },
  barTrack: {
    marginTop: 36,
    width: BAR_W,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  barFillWrap: { height: 6, borderRadius: 3, overflow: 'hidden' },
  barFill: { flex: 1, borderRadius: 3 },
  loading: {
    marginTop: 14,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.textMuted,
  },
  footer: { position: 'absolute', left: 24, right: 24, bottom: 28 },
});
