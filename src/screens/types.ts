/** The whole navigation surface of the app - one union, no navigation library. */
export type ScreenName =
  | 'loader'
  | 'menu'
  | 'game'
  | 'result'
  | 'daily'
  | 'levels'
  | 'challenge'
  | 'rewards'
  | 'profile'
  | 'settings';

export type Go = (next: ScreenName) => void;
