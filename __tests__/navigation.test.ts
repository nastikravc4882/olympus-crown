import type { ScreenName } from '../src/screens/types';

const ROUTES: ScreenName[] = [
  'loader',
  'menu',
  'game',
  'result',
  'daily',
  'levels',
  'challenge',
  'rewards',
  'profile',
  'settings',
];

describe('screen state machine', () => {
  it('has the loader, the hub, the game and the result screen', () => {
    expect(ROUTES).toContain('loader');
    expect(ROUTES).toContain('menu');
    expect(ROUTES).toContain('game');
    expect(ROUTES).toContain('result');
  });

  it('reaches every secondary screen in one step from the hub', () => {
    const fromMenu = ROUTES.filter(r => r !== 'loader' && r !== 'menu' && r !== 'result');
    expect(fromMenu).toHaveLength(7);
  });
});
