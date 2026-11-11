import * as fs from 'fs';
import * as path from 'path';
import { DISCLAIMER, DISCLAIMER_LONG, BET, START_COINS } from '../src/constants/config';

const BANNED = [
  'in-app purchase',
  'inapppurchase',
  'react-native-iap',
  'billingclient',
  'paywall',
  'subscription',
  'admob',
  'applovin',
];

function walk(dir: string, out: string[]): string[] {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) {
      walk(full, out);
    } else if (/\.(ts|tsx)$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

describe('no real money, no monetization', () => {
  it('keeps the currency a fictional integer counter', () => {
    expect(Number.isInteger(BET)).toBe(true);
    expect(Number.isInteger(START_COINS)).toBe(true);
    expect(DISCLAIMER).toContain('18+');
    expect(DISCLAIMER_LONG).toContain('NO REAL MONEY');
  });

  it('has no purchase, billing or ad path in src', () => {
    const files = walk(path.join(__dirname, '..', 'src'), []);
    for (const file of files) {
      const text = fs.readFileSync(file, 'utf8').toLowerCase();
      for (const needle of BANNED) {
        expect(text.indexOf(needle)).toBe(-1);
      }
    }
  });
});
