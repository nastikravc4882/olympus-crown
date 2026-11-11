/** Local deterministic PRNG - never the global Math.random for a spin. */
export type Rng = () => number;

export function makeRng(seed: number): Rng {
  let s = seed >>> 0;
  if (s === 0) {
    s = 0x9e3779b9;
  }
  return () => {
    s ^= s << 13;
    s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 0x100000000;
  };
}

/** One seed per attempt: levelIndex * 7919 ^ spinIndex * 104729, salted per session. */
export function spinSeed(levelIndex: number, spinIndex: number, salt: number = 0): number {
  return (((levelIndex * 7919) ^ (spinIndex * 104729)) ^ (salt >>> 0)) >>> 0;
}

/** Weighted pick over a parallel weights array. */
export function pickWeighted<T>(rng: Rng, items: T[], weights: number[]): T {
  let total = 0;
  for (let i = 0; i < weights.length; i++) {
    total += weights[i];
  }
  let roll = rng() * total;
  for (let i = 0; i < items.length; i++) {
    roll -= weights[i];
    if (roll <= 0) {
      return items[i];
    }
  }
  return items[items.length - 1];
}
