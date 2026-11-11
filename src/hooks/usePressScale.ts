import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import { theme } from '../constants/theme';

/**
 * The only press feedback that survives an Android release build on this stack:
 * Pressable is the PARENT, the Animated.View is its CHILD, and only `transform`
 * is driven natively. No gesture-handler anywhere in this project.
 */
export function usePressScale(to: number = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: to,
      tension: theme.anim.press.tension,
      friction: theme.anim.press.friction,
      useNativeDriver: true,
    }).start();
  }, [scale, to]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: 140,
      friction: 9,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return { scale, onPressIn, onPressOut };
}

export const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
