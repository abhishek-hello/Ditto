import { describe, expect, it } from 'vitest';
import { formatSortCode, normalisePostcode, normaliseSortCode, normaliseUkMobile } from './uk';

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
