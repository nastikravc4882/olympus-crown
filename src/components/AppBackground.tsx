import React, { useMemo } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { assets } from '../assets';
import { theme } from '../constants/theme';

export type BgVariant = 'loader' | 'menu' | 'game' | 'result' | 'panel';

type Props = {
  variant: BgVariant;
  /** purple storm blobs - the Loader and the Result use them */
  blobs?: boolean;
  dust?: number;
  children?: React.ReactNode;
};

const OVERLAY: Record<BgVariant, readonly string[]> = {
  loader: theme.gradients.loader,
  menu: theme.gradients.menu,
  game: theme.gradients.game,
  result: theme.gradients.result,
  panel: theme.gradients.panel,
};

/** Gold dust positions are computed once, never per frame. */
function dustField(count: number) {
  const out: Array<{ left: string; top: string; size: number; opacity: number }> = [];
  let s = 1337;
  for (let i = 0; i < count; i++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const a = 4 + (s % 90);
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const b = 6 + (s % 86);
    out.push({
      left: a + '%',
      top: b + '%',
      size: 2 + (s % 3),
      opacity: 0.18 + (s % 10) / 50,
    });
  }
  return out;
}

/**
 * bg_game is the ONLY background image in the app - the gradient overlay is what
 * tells the screens apart (rule 14 / 2.3).
 */
export function AppBackground({ variant, blobs = false, dust = 14, children }: Props) {
  const specks = useMemo(() => dustField(dust), [dust]);

  return (
    <ImageBackground source={assets.bgGame} style={styles.fill} resizeMode="cover">
      <LinearGradient
        colors={OVERLAY[variant] as string[]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {blobs ? (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <View style={[styles.blob, { top: -70, left: -70 }]} />
          <View style={[styles.blob, { top: 250, right: -90 }]} />
          <View style={[styles.blob, { bottom: -50, left: 30 }]} />
        </View>
      ) : null}
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {specks.map((d, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: d.left as never,
              top: d.top as never,
              width: d.size,
              height: d.size,
              borderRadius: d.size,
              backgroundColor: theme.colors.goldLight,
              opacity: d.opacity,
            }}
          />
        ))}
      </View>
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: theme.colors.bg },
  blob: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(138,92,240,0.14)',
  },
});
