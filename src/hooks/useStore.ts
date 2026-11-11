import { useEffect, useRef, useState } from 'react';
import { getState, subscribe, type SaveState } from '../state/store';

/**
 * One selector per read - a screen never pulls the whole save just to
 * read one number (react-state-minimize).
 */
export function useStoreValue<T>(selector: (s: SaveState) => T): T {
  const selectorRef = useRef(selector);
  selectorRef.current = selector;
  const [value, setValue] = useState<T>(() => selector(getState()));

  useEffect(() => {
    const read = () => {
      const next = selectorRef.current(getState());
      setValue(prev => (Object.is(prev, next) ? prev : next));
    };
    read();
    return subscribe(read);
  }, []);

  return value;
}
