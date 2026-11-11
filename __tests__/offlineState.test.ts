import * as fs from 'fs';
import * as path from 'path';

const NETWORK = ['fetch(', 'xmlhttprequest', 'websocket(', 'axios'];

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

describe('fully offline', () => {
  it('never opens a network connection from src', () => {
    const files = walk(path.join(__dirname, '..', 'src'), []);
    expect(files.length).toBeGreaterThan(10);
    for (const file of files) {
      const text = fs.readFileSync(file, 'utf8').toLowerCase();
      for (const needle of NETWORK) {
        expect(text.indexOf(needle)).toBe(-1);
      }
    }
  });

  it('never pulls in a navigation library', () => {
    const files = walk(path.join(__dirname, '..', 'src'), []);
    for (const file of files) {
      const text = fs.readFileSync(file, 'utf8');
      expect(text).not.toContain('@react-navigation');
      expect(text).not.toContain('react-native-gesture-handler');
    }
  });
});
