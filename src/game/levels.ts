export type Level = {
  index: number;
  name: string;
  target: number;
};

/** Eight levels of the climb up Olympus. */
export const LEVELS: Level[] = [
  { index: 0, name: 'FOOTHILLS', target: 2000 },
  { index: 1, name: 'CLOUD GATE', target: 3000 },
  { index: 2, name: 'THUNDER HALL', target: 4000 },
  { index: 3, name: 'AMBER VAULT', target: 6000 },
  { index: 4, name: 'STORM SPIRE', target: 8000 },
  { index: 5, name: 'ORACLE STEPS', target: 11000 },
  { index: 6, name: 'TITAN RUIN', target: 14000 },
  { index: 7, name: 'CROWN SUMMIT', target: 18000 },
];

export function levelAt(index: number): Level {
  const i = Math.max(0, Math.min(LEVELS.length - 1, index));
  return LEVELS[i];
}

/** 1 star at the target, 2 at x1.5, 3 at x2.5. */
export function starsFor(score: number, target: number): number {
  if (score >= target * 2.5) {
    return 3;
  }
  if (score >= target * 1.5) {
    return 2;
  }
  if (score >= target) {
    return 1;
  }
  return 0;
}

export function isUnlocked(index: number, cleared: number): boolean {
  return index <= cleared;
}
