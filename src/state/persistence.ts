/**
 * Storage ADAPTER. The allowed dependency list contains no key-value package and
 * RN core no longer ships AsyncStorage, so the shipped driver keeps the save in
 * module memory: progress survives every navigation and screen remount inside a
 * run. This file is the single place where a real store can be plugged in later,
 * and tests inject a fake driver so no test imports a native module.
 */
export type StorageDriver = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

function memoryDriver(): StorageDriver {
  const map: Record<string, string> = {};
  return {
    getItem: key => (Object.prototype.hasOwnProperty.call(map, key) ? map[key] : null),
    setItem: (key, value) => {
      map[key] = value;
    },
    removeItem: key => {
      delete map[key];
    },
  };
}

let driver: StorageDriver = memoryDriver();

export function setDriver(next: StorageDriver): void {
  driver = next;
}

export const STORE_KEY = 'olympuscrown.save.v1';

/** A corrupt record falls back to the default instead of throwing (rule 8.1). */
export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = driver.getItem(key);
    if (!raw) {
      return fallback;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return fallback;
    }
    return { ...fallback, ...(parsed as object) } as T;
  } catch (e) {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown): void {
  try {
    driver.setItem(key, JSON.stringify(value));
  } catch (e) {
    // a full or unavailable store must never take the game down
  }
}

export function clearKey(key: string): void {
  try {
    driver.removeItem(key);
  } catch (e) {
    // ignored on purpose
  }
}
