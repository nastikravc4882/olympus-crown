import { readJson, setDriver, STORE_KEY, writeJson } from '../src/state/persistence';
import { defaultState } from '../src/state/store';

function driverWith(raw: string | null) {
  return {
    getItem: () => raw,
    setItem: () => undefined,
    removeItem: () => undefined,
  };
}

describe('loading, empty and error states', () => {
  it('falls back to the defaults when nothing is stored', () => {
    setDriver(driverWith(null));
    expect(readJson(STORE_KEY, defaultState()).coins).toBe(defaultState().coins);
  });

  it('falls back instead of throwing on a corrupt record', () => {
    setDriver(driverWith('{not json at all'));
    expect(() => readJson(STORE_KEY, defaultState())).not.toThrow();
    expect(readJson(STORE_KEY, defaultState()).tokens).toBe(defaultState().tokens);
  });

  it('merges a partial record over the defaults', () => {
    setDriver(driverWith('{"coins":77}'));
    const loaded = readJson(STORE_KEY, defaultState());
    expect(loaded.coins).toBe(77);
    expect(loaded.settings).toEqual(defaultState().settings);
  });

  it('survives a write on an unavailable driver', () => {
    setDriver({
      getItem: () => null,
      setItem: () => {
        throw new Error('store is full');
      },
      removeItem: () => undefined,
    });
    expect(() => writeJson(STORE_KEY, defaultState())).not.toThrow();
  });
});
