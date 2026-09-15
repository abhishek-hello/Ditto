import { describe, expect, it } from 'vitest';
import { formatPence, parsePounds, pence, splitPence } from './money';

describe('money', () => {
  it('parses pounds strings into pence', () => {
    expect(parsePounds('12.50')).toBe(1250);
    expect(parsePounds('£12')).toBe(1200);
    expect(parsePounds('1,250.05')).toBe(125005);
    expect(parsePounds('0.5')).toBe(50);
    expect(parsePounds('-3.20')).toBe(-320);
  });

  it('rejects malformed amounts', () => {
    expect(() => parsePounds('12.505')).toThrow();
    expect(() => parsePounds('abc')).toThrow();
    expect(() => pence(1.5)).toThrow();
  });

  it('formats with en-GB conventions', () => {
    expect(formatPence(pence(1250))).toBe('£12.50');
    expect(formatPence(pence(125005))).toBe('£1,250.05');
  });

  it('splits without losing pence', () => {
    const shares = splitPence(pence(1000), 3);
    expect(shares).toEqual([334, 333, 333]);
    expect(shares.reduce((a, b) => a + b, 0)).toBe(1000);
  });
});
