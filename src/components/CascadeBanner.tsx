import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { theme } from '../constants/theme';

type Props = {
  text: string;
  reducedMotion: boolean;
};

/**
 * The storm banner above the board. It is purely decorative, carries no touch
 * target, and only opacity / translateY are animated.
 */
export function CascadeBanner({ text, reducedMotion }: Props) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!text) {
      anim.setValue(0);
      return;
    }
    Animated.timing(anim, {
      toValue: 1,
      duration: reducedMotion ? 120 : 220,
      useNativeDriver: true,
    }).start();
  }, [text, anim, reducedMotion]);

  if (!text) {
    return null;
  }

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [-10, 0] });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.wrap, { opacity: anim, transform: [{ translateY }] }]}>
      <Text style={styles.text} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
        {text}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(138,92,240,0.20)',
    borderWidth: 1,
    borderColor: 'rgba(138,92,240,0.6)',
    maxWidth: '92%',
  },
  text: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
    letterSpacing: 1.6,
    color: theme.colors.purpleSoft,
    textAlign: 'center',
  },
});
