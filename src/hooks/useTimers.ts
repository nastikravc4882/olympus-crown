import { useCallback, useEffect, useRef } from 'react';

/**
 * Every deferred callback of a screen goes through here: the alive flag is read
 * before the callback runs and every pending timer is cleared on unmount, so no
 * animation callback can fire into a dead screen (rule 12.3).
 */
export function useTimers() {
  const alive = useRef(true);
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  const after = useCallback((ms: number, fn: () => void) => {
    const id = setTimeout(() => {
      if (!alive.current) {
        return;
      }
      fn();
    }, ms);
    timers.current.push(id);
    return id;
  }, []);

  const clearAll = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  return { after, clearAll, alive };
}
