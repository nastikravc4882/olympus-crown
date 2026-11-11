import React from 'react';
import { Animated, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { assets } from '../assets';
import { theme } from '../constants/theme';
import { HIT_SLOP, usePressScale } from '../hooks/usePressScale';

/** Any lucide icon component. */
export type IconComp = React.ComponentType<any>;

type Props = {
  label: string;
  Icon?: IconComp;
  onPress: () => void;
  disabled?: boolean;
  height?: number;
  testID?: string;
};

const ICON = 24;

/**
 * The primary metal button. Pressable is the PARENT, the Animated.View is its
 * CHILD and carries pointerEvents="box-none" so a tap always reaches onPress.
 */
export function GoldButton({ label, Icon, onPress, disabled, height = 60, testID }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.96);

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      hitSlop={HIT_SLOP}
      disabled={disabled}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[styles.press, { height }]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.inner, { height, transform: [{ scale }] }, disabled ? styles.flat : null]}>
        <ImageBackground
          source={assets.buttonRect}
          resizeMode="stretch"
          style={styles.plate}
          imageStyle={styles.plateImage}>
          <LinearGradient
            colors={(disabled ? theme.gradients.grey : theme.gradients.gold) as string[]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={[StyleSheet.absoluteFill, styles.grad]}
          />
          <View style={styles.row}>
            {Icon ? <Icon size={ICON} color={theme.colors.onGold} strokeWidth={2.4} /> : null}
            <Text style={styles.label} numberOfLines={1}>
              {label}
            </Text>
          </View>
        </ImageBackground>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: '100%', borderRadius: theme.radius.lg },
  flat: { opacity: 0.45 },
  inner: {
    width: '100%',
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderBottomWidth: 2,
    borderColor: theme.colors.goldEdge,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.gold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 10,
  },
  plate: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  plateImage: { borderRadius: theme.radius.lg },
  grad: { opacity: 0.8, borderRadius: theme.radius.lg },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  label: {
    fontSize: 18,
    lineHeight: ICON,
    fontWeight: '900',
    letterSpacing: 2,
    color: theme.colors.onGold,
  },
});
