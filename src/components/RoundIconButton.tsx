import React from 'react';
import { Animated, Image, ImageBackground, Pressable, StyleSheet } from 'react-native';
import { assets } from '../assets';
import { theme } from '../constants/theme';
import { HIT_SLOP, usePressScale } from '../hooks/usePressScale';

type Props = {
  icon: number;
  onPress: () => void;
  label: string;
  size?: number;
  testID?: string;
};

/** Marble disc used for the header glyphs (home / pause). */
export function RoundIconButton({ icon, onPress, label, size = 48, testID }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.92);

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={HIT_SLOP}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[styles.press, { width: size, height: size, borderRadius: size / 2 }]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.inner,
          { width: size, height: size, borderRadius: size / 2, transform: [{ scale }] },
        ]}>
        <ImageBackground
          source={assets.buttonRound}
          resizeMode="contain"
          style={styles.plate}
          imageStyle={styles.plateImage}>
          <Image source={icon} style={styles.glyph} />
        </ImageBackground>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { alignItems: 'center', justifyContent: 'center' },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  plate: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  plateImage: {},
  glyph: { width: 24, height: 24, resizeMode: 'contain' },
});
