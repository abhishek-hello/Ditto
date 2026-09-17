import { describe, expect, it } from 'vitest';
import { formatCountdown, isEmail, maskEmail } from './format';

describe('isEmail', () => {
  it('accepts an ordinary address', () => {
    expect(isEmail('jo@marlowelectrical.co.uk')).toBe(true);
  });

  it('ignores surrounding whitespace', () => {
    expect(isEmail('  jo@marlow.co.uk  ')).toBe(true);
  });

  it.each(['', 'jo', 'jo@', '@marlow.co.uk', 'jo@marlow', 'jo @marlow.co.uk', 'jo@mar low.co.uk'])(
    'rejects %j',
    (value) => {
      expect(isEmail(value)).toBe(false);
    },
  );
});

describe('maskEmail', () => {
  it('keeps the first two characters and the domain', () => {
    expect(maskEmail('jodie@marlowelectrical.co.uk')).toBe('jo···@marlowelectrical.co.uk');
  });

  it('leaves a local part with nothing left to hide', () => {
    // The handoff masks at length >= 2, which renders "jo···@" for "jo@" and
    // implies characters that are not there. Two and under are left alone.
    expect(maskEmail('jo@marlow.co.uk')).toBe('jo@marlow.co.uk');
    expect(maskEmail('j@marlow.co.uk')).toBe('j@marlow.co.uk');
  });

  it('leaves a string with no @ alone', () => {
    expect(maskEmail('not an email')).toBe('not an email');
  });
});

describe('formatCountdown', () => {
  it.each([
    [161, '2:41'],
    [180, '3:00'],
    [59, '0:59'],
    [9, '0:09'],
    [0, '0:00'],
    [-5, '0:00'],
    [3600, '60:00'],
  ])('formats %i as %s', (seconds, expected) => {
    expect(formatCountdown(seconds)).toBe(expected);
  });
});
