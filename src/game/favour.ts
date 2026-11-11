import { FAVOUR_MAX, FAVOUR_PER_ORB, FAVOUR_PER_TUMBLE } from '../constants/config';

export type FavourResult = {
  value: number;
  /** true when the meter filled and the Gate of Olympus round triggers */
  burst: boolean;
};

/** Every tumble step adds 40 favour, every orb adds 25. At 500 the gate opens. */
export function addFavour(current: number, tumbles: number, orbs: number): FavourResult {
  const gained = tumbles * FAVOUR_PER_TUMBLE + orbs * FAVOUR_PER_ORB;
  const raw = current + gained;
  if (raw >= FAVOUR_MAX) {
    return { value: raw - FAVOUR_MAX, burst: true };
  }
  return { value: raw, burst: false };
}

export function favourPercent(value: number): number {
  return Math.max(0, Math.min(1, value / FAVOUR_MAX));
}
