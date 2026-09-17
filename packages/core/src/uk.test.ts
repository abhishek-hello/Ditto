import { describe, expect, it } from 'vitest';
import {
  ageInYears,
  formatSortCode,
  normalisePostcode,
  normaliseSortCode,
  normaliseUkMobile,
  parseUkDate,
} from './uk';

describe('uk validators', () => {
  it('normalises sort codes', () => {
    expect(normaliseSortCode('12-34-56')).toBe('123456');
    expect(normaliseSortCode('12 34 56')).toBe('123456');
    expect(normaliseSortCode('1234567')).toBeNull();
    expect(formatSortCode('123456')).toBe('12-34-56');
  });

  it('normalises UK mobiles to E.164', () => {
    expect(normaliseUkMobile('07700 900123')).toBe('+447700900123');
    expect(normaliseUkMobile('+44 7700 900123')).toBe('+447700900123');
    expect(normaliseUkMobile('02079460000')).toBeNull();
  });

  it('normalises postcodes', () => {
    expect(normalisePostcode('sw1a1aa')).toBe('SW1A 1AA');
    expect(normalisePostcode('EC1A 1BB')).toBe('EC1A 1BB');
    expect(normalisePostcode('12345')).toBeNull();
  });
});

describe('parseUkDate', () => {
  it('reads DD/MM/YYYY', () => {
    const date = parseUkDate('14/06/1988');
    expect(date?.getDate()).toBe(14);
    expect(date?.getMonth()).toBe(5);
    expect(date?.getFullYear()).toBe(1988);
  });

  it('tolerates the spacing the input mask produces', () => {
    expect(parseUkDate(' 14 / 06 / 1988 ')?.getDate()).toBe(14);
  });

  it('rejects a day that does not exist in that month', () => {
    expect(parseUkDate('31/02/1990')).toBeNull();
    expect(parseUkDate('31/04/1990')).toBeNull();
  });

  it('accepts a real leap day and rejects a fake one', () => {
    expect(parseUkDate('29/02/2020')).not.toBeNull();
    expect(parseUkDate('29/02/2019')).toBeNull();
  });

  it.each(['', '1/6/1988', '14-06-1988', '06/14/1988', '14/06/88', 'not a date'])(
    'rejects %j',
    (value) => {
      expect(parseUkDate(value)).toBeNull();
    },
  );
});

describe('ageInYears', () => {
  const now = new Date(2026, 8, 17); // 17 Sep 2026

  it('counts whole years', () => {
    expect(ageInYears(new Date(2000, 8, 17), now)).toBe(26);
  });

  it('does not count a birthday that has not happened yet', () => {
    expect(ageInYears(new Date(2000, 8, 18), now)).toBe(25);
    expect(ageInYears(new Date(2000, 9, 1), now)).toBe(25);
  });

  it('counts a birthday that passed earlier this year', () => {
    expect(ageInYears(new Date(2000, 7, 31), now)).toBe(26);
  });

  it('turns 18 exactly on the birthday', () => {
    expect(ageInYears(new Date(2008, 8, 17), now)).toBe(18);
    expect(ageInYears(new Date(2008, 8, 18), now)).toBe(17);
  });
});
