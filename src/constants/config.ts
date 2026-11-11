/** Single place for every tunable number of OlympusCrown. */

/** Splash hold. EXACTLY 8000 ms - product rule, never shorten. */
export const LOADER_DURATION_MS = 8000;

/** Economy - fictional coins only. No purchase, billing or payout path exists. */
export const BET = 50;
export const START_COINS = 10000;
export const RESTORE_COINS = 2000;
export const START_TOKENS = 2;

/** Board. 6 columns x 5 rows = 30 cells, one shared symbol pool for every cell. */
export const COLS = 6;
export const ROWS = 5;
export const CELLS = COLS * ROWS;
export const BOARD_PAD = 6;
export const BOARD_BORDER = 2;
export const BOARD_FRAME = BOARD_PAD + BOARD_BORDER;
export const BOARD_MAX_W = 380;
export const CELL_INSET = 4;

/** Session. */
export const SESSION_SPINS = 5;
export const AEGIS_BONUS_SPINS = 1;

/** Scatter pay. */
export const PAY_MIN = 8;

/** Spin timing (NORMAL / QUICK). */
export const SPIN_STAGGER_MS = 140;
export const SPIN_DROP_MS = 620;
export const QUICK_STAGGER_MS = 70;
export const QUICK_DROP_MS = 320;
export const SHATTER_MS = 320;
export const TUMBLE_MS = 260;
export const BANNER_MS = 700;
export const ORB_FLY_MS = 420;
export const REDUCED_MOTION_MS = 120;

/** Divine Favour meter and the Gate of Olympus round. */
export const FAVOUR_MAX = 500;
export const FAVOUR_PER_TUMBLE = 40;
export const FAVOUR_PER_ORB = 25;
export const GATE_SPINS = 3;

/** Soft pity bias. */
export const DRY_SPINS_FOR_PITY = 5;
export const PITY_MULT = 1.4;
export const BIG_WIN_MULT = 20;

/** Orbs. */
export const ORB_BASE_CHANCE = 0.055;
export const ORB_VALUES = [2, 3, 5, 10, 25, 50, 100];
export const ORB_WEIGHTS = [30, 24, 18, 12, 8, 5, 3];

/** Daily bonus ladder, 7 days. */
export const DAILY_LADDER = [250, 350, 500, 750, 1000, 1500, 3000];
export const DAILY_WINDOW_MS = 24 * 60 * 60 * 1000;

/** XP bands used by the Profile title. */
export const XP_PER_SPIN = 2;
export const XP_PER_CASCADE = 3;

export const DISCLAIMER = '18+ · FICTIONAL COINS · NO CASH PRIZES';
export const DISCLAIMER_LONG = '18+ · ENTERTAINMENT ONLY · NO REAL MONEY · NO PURCHASES';
