import { defaultState, resetProgress, setSetting, getState, __setStateForTest } from '../src/state/store';
import { setDriver } from '../src/state/persistence';

function fakeDriver() {
  const map: Record<string, string> = {};
  return {
    getItem: (k: string) => (k in map ? map[k] : null),
    setItem: (k: string, v: string) => {
      map[k] = v;
    },
    removeItem: (k: string) => {
      delete map[k];
    },
  };
}

describe('settings', () => {
  beforeEach(() => {
    setDriver(fakeDriver());
    __setStateForTest(defaultState());
  });

  it('ships five behaviour options and no audio control', () => {
    const keys = Object.keys(getState().settings);
    expect(keys).toEqual([
      'quickSpin',
      'winHighlight',
      'reducedMotion',
      'highContrast',
      'autoCollect',
    ]);
    expect(keys.join(' ').toLowerCase()).not.toContain('sound');
    expect(keys.join(' ').toLowerCase()).not.toContain('music');
  });

  it('stores a changed option', () => {
    setSetting('quickSpin', true);
    expect(getState().settings.quickSpin).toBe(true);
    setSetting('highContrast', true);
    expect(getState().settings.highContrast).toBe(true);
    expect(getState().settings.quickSpin).toBe(true);
  });

  it('wipes progression on reset', () => {
    setSetting('reducedMotion', true);
    resetProgress();
    expect(getState().settings.reducedMotion).toBe(false);
    expect(getState().tokens).toBe(defaultState().tokens);
    expect(getState().unlockedLevel).toBe(0);
  });
});
