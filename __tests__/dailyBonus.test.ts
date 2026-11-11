import { DAILY_LADDER, DAILY_WINDOW_MS } from '../src/constants/config';
import { canClaim, claim, formatCountdown, nextDay, rewardForDay } from '../src/game/dailyBonus';

describe('daily bonus', () => {
  it('pays the ladder value of the day', () => {
    expect(rewardForDay(1)).toBe(DAILY_LADDER[0]);
    expect(rewardForDay(7)).toBe(DAILY_LADDER[6]);
    expect(rewardForDay(99)).toBe(DAILY_LADDER[6]);
  });

  it('allows the first claim and blocks a second one inside the window', () => {
    const now = 1000000;
    expect(canClaim({ day: 1, lastClaimAt: 0 }, now)).toBe(true);
    expect(canClaim({ day: 2, lastClaimAt: now }, now + 1000)).toBe(false);
    expect(canClaim({ day: 2, lastClaimAt: now }, now + DAILY_WINDOW_MS)).toBe(true);
  });

  it('credits coins, stores the date and advances the streak', () => {
    const now = 5000000;
    const r = claim({ day: 1, lastClaimAt: 0 }, now);
    expect(r.coins).toBe(DAILY_LADDER[0]);
    expect(r.state.lastClaimAt).toBe(now);
    expect(r.state.day).toBe(2);
    expect(r.blessing).toBe(false);
  });

  it('grants the orb blessing on day seven', () => {
    const r = claim({ day: 7, lastClaimAt: 0 }, 1);
    expect(r.blessing).toBe(true);
    expect(r.state.day).toBe(1);
  });

  it('resets the streak after a missed window', () => {
    const now = 9000000;
    expect(nextDay({ day: 4, lastClaimAt: now - DAILY_WINDOW_MS * 3 }, now)).toBe(1);
  });

  it('formats the countdown with padded parts', () => {
    expect(formatCountdown(0)).toBe('00:00:00');
    expect(formatCountdown(3661000)).toBe('01:01:01');
  });
});
