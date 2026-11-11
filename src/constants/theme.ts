/**
 * CASINO_GOLD, copied from design-system/presets.ts and adapted for OlympusCrown.
 * Only the secondary accent is overridden: divine purple #8A5CF0.
 */
export const theme = {
  name: 'CASINO_GOLD',

  colors: {
    bg: '#0B0B0F',
    surface: '#141418',
    raised: '#1C1C24',
    warm: '#1E1A14',
    boardIn: '#15131A',

    gold: '#D4AF37',
    goldLight: '#F5D77A',
    goldDark: '#A8821F',
    goldEdge: '#8A6B16',

    purple: '#8A5CF0',
    purpleSoft: '#CBB4FF',

    text: '#F7F1E3',
    textSec: '#B9AE96',
    textMuted: '#7C7363',
    onGold: '#140F04',

    win: '#5FD38A',
    danger: '#E2474A',
    sapphire: '#3E8FD4',
    ruby: '#E2474A',
    emerald: '#5FD38A',

    border: 'rgba(255,255,255,0.08)',
    borderGold: 'rgba(212,175,55,0.38)',
    chrome: 'rgba(255,255,255,0.06)',
    scrim: 'rgba(0,0,0,0.34)',
  },

  gradients: {
    gold: ['#F5D77A', '#D4AF37', '#A8821F'],
    goldFlat: ['#D4AF37', '#B8912A'],
    grey: ['#3A3732', '#2A2824'],
    tile: ['#23232C', '#17171D'],
    purple: ['#8A5CF0', '#5B36B8'],
    favour: ['#D4AF37', '#F5D77A', '#8A5CF0'],
    /**
     * Per-screen overlays on top of bg_game - the ONLY thing that tells the
     * screens apart (rule 14). The Menu keeps the Olympus art open at the top,
     * the Loader covers it with a storm-dark scrim, which is what the
     * Loader-vs-Menu pHash gate measures.
     */
    loader: ['rgba(5,5,10,0.80)', 'rgba(18,11,34,0.86)', 'rgba(11,11,15,0.91)'],
    menu: ['rgba(11,11,15,0.05)', 'rgba(11,11,15,0.45)', 'rgba(11,11,15,0.93)'],
    game: ['rgba(11,11,15,0.72)', 'rgba(20,15,30,0.82)', 'rgba(11,11,15,0.90)'],
    result: ['rgba(26,18,38,0.70)', 'rgba(18,12,28,0.84)', 'rgba(11,11,15,0.92)'],
    panel: ['rgba(11,11,15,0.68)', 'rgba(21,19,26,0.86)', 'rgba(11,11,15,0.93)'],
  },

  radius: { sm: 8, md: 12, lg: 18, xl: 24, pill: 100 },

  space: { xs: 4, sm: 8, md: 14, lg: 20, xl: 28 },

  anim: {
    press: { tension: 300, friction: 12 },
    panel: { tension: 46, friction: 8 },
    fade: 260,
  },

  shadow: {
    gold: {
      shadowColor: '#D4AF37',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.5,
      shadowRadius: 18,
      elevation: 10,
    },
    purple: {
      shadowColor: '#8A5CF0',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 22,
      elevation: 12,
    },
    card: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.55,
      shadowRadius: 20,
      elevation: 8,
    },
  },
};

export type Theme = typeof theme;
