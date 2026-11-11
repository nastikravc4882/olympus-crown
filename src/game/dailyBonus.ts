import { DAILY_LADDER, DAILY_WINDOW_MS } from '../constants/config';

export type DailyState = {
  /** 1..7 */
  day: number;
  lastClaimAt: number;
};

export function rewardForDay(day: number): number {
  const i = Math.max(1, Math.min(DAILY_LADDER.length, day)) - 1;
  return DAILY_LADDER[i];
}

export function canClaim(state: DailyState, now: number): boolean {
  if (!state.lastClaimAt) {
    return true;
  }
  return now - state.lastClaimAt >= DAILY_WINDOW_MS;
}

/** A missed window resets the streak to day 1 - never a blank board. */
export function nextDay(state: DailyState, now: number): number {
  if (!state.lastClaimAt) {
    return 1;
  }
  const gap = now - state.lastClaimAt;
  if (gap >= DAILY_WINDOW_MS * 2) {
    return 1;
  }
  return state.day >= DAILY_LADDER.length ? 1 : state.day + 1;
}

export function claim(state: DailyState, now: number): { state: DailyState; coins: number; blessing: boolean } {
  if (!canClaim(state, now)) {
    return { state, coins: 0, blessing: false };
  }
  const day = Number.isFinite(state.day) && state.day > 0 ? state.day : 1;
  const coins = rewardForDay(day);
  const blessing = day >= DAILY_LADDER.length;
  const after: DailyState = { day, lastClaimAt: now };
  return { state: { day: nextDay(after, now + DAILY_WINDOW_MS), lastClaimAt: now }, coins, blessing };
}

export function msUntilNext(state: DailyState, now: number): number {
  if (!state.lastClaimAt) {
    return 0;
  }
  return Math.max(0, state.lastClaimAt + DAILY_WINDOW_MS - now);
}

export function formatCountdown(ms: number): string {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => (n < 10 ? '0' + n : String(n));
  return pad(h) + ':' + pad(m) + ':' + pad(s);
}
