import React from 'react';
import Svg, { Circle, Path, Polygon } from 'react-native-svg';
import { theme } from '../constants/theme';

export type GemKind = 'RUBY' | 'AMETHYST' | 'EMERALD' | 'SAPPHIRE' | 'WILD';

const FILL: Record<GemKind, string> = {
  RUBY: theme.colors.ruby,
  AMETHYST: theme.colors.purple,
  EMERALD: theme.colors.emerald,
  SAPPHIRE: theme.colors.sapphire,
  WILD: theme.colors.goldLight,
};

/**
 * The low-tier gems and the Crown Wild as vector art - every outline is a
 * different shape, so no two symbols can read as the same glyph.
 */
export function GemIcon({ kind, size }: { kind: GemKind; size: number }) {
  const fill = FILL[kind];
  const edge = 'rgba(255,255,255,0.55)';

  if (kind === 'RUBY') {
    return (
      <Svg width={size} height={size} viewBox="0 0 48 48">
        <Polygon points="24,4 42,15 42,33 24,44 6,33 6,15" fill={fill} stroke={edge} strokeWidth={1.6} />
        <Polygon points="24,12 34,18 34,30 24,36 14,30 14,18" fill="#FFFFFF" opacity={0.16} />
      </Svg>
    );
  }
  if (kind === 'AMETHYST') {
    return (
      <Svg width={size} height={size} viewBox="0 0 48 48">
        <Polygon points="24,3 44,24 24,45 4,24" fill={fill} stroke={edge} strokeWidth={1.6} />
        <Polygon points="24,11 36,24 24,37 12,24" fill="#FFFFFF" opacity={0.16} />
      </Svg>
    );
  }
  if (kind === 'EMERALD') {
    return (
      <Svg width={size} height={size} viewBox="0 0 48 48">
        <Polygon points="24,3 45,19 37,44 11,44 3,19" fill={fill} stroke={edge} strokeWidth={1.6} />
        <Polygon points="24,13 36,22 31,36 17,36 12,22" fill="#FFFFFF" opacity={0.16} />
      </Svg>
    );
  }
  if (kind === 'SAPPHIRE') {
    return (
      <Svg width={size} height={size} viewBox="0 0 48 48">
        <Path
          d="M24 3 C34 16 42 24 42 31 A18 18 0 0 1 6 31 C6 24 14 16 24 3 Z"
          fill={fill}
          stroke={edge}
          strokeWidth={1.6}
        />
        <Circle cx={19} cy={31} r={6} fill="#FFFFFF" opacity={0.18} />
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Circle cx={24} cy={25} r={16} fill="none" stroke={fill} strokeWidth={3.4} />
      <Path
        d="M10 25 C12 14 18 8 24 6 C30 8 36 14 38 25"
        fill="none"
        stroke={fill}
        strokeWidth={2.6}
        strokeLinecap="round"
      />
      <Polygon points="24,16 27,23 34,23 28,28 30,35 24,31 18,35 20,28 14,23 21,23" fill={fill} />
    </Svg>
  );
}
