import { useEffect, useRef, useState } from 'react';

/** Count-up for score / balance readouts. Plain JS timer, no layout animation. */
export function useCountUp(target: number, duration: number = 800): number {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const rafRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    if (from === target || duration <= 0) {
      fromRef.current = target;
      setValue(target);
      return;
    }
    const started = Date.now();
    const id = setInterval(() => {
      const t = Math.min(1, (Date.now() - started) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (t >= 1) {
        clearInterval(id);
        fromRef.current = target;
      }
    }, 32);
    rafRef.current = id;
    return () => {
      clearInterval(id);
      fromRef.current = target;
    };
  }, [target, duration]);

  return value;
}
