import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../constants/theme';

type Props = {
  value: number;
  max: number;
  height?: number;
  colors?: readonly string[];
};

/** Plain layout bar - width is a style value, never a native-driver animation. */
export function ProgressBar({ value, max, height = 8, colors }: Props) {
  const pct = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }]}>
      <LinearGradient
        colors={(colors || theme.gradients.favour) as string[]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={{
          width: (pct * 100 + '%') as never,
          height,
          borderRadius: height / 2,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
});
