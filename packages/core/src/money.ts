import type { Pence } from './types';

const GBP_FORMATTER = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

/** Brand an integer as pence. Throws on non-integers or unsafe magnitudes. */
export function pence(value: number): Pence {
  if (!Number.isInteger(value)) {
    throw new TypeError(`pence() requires an integer, got ${value}`);
  }
  if (!Number.isSafeInteger(value)) {
    throw new RangeError(`pence() value out of safe range: ${value}`);
  }
  return value as Pence;
}

/** Parse a user-typed pounds string ("12.50", "£12", "1,250.00") into pence. */
export function parsePounds(input: string): Pence {
  const cleaned = input.replace(/[£,\s]/g, '');
  if (!/^-?\d+(\.\d{1,2})?$/.test(cleaned)) {
    throw new TypeError(`Invalid pounds amount: "${input}"`);
  }
  const [whole = '0', fraction = ''] = cleaned.split('.');
  const sign = whole.startsWith('-') ? -1 : 1;
  const wholeAbs = Math.abs(Number.parseInt(whole, 10));
  const fractionPadded = fraction.padEnd(2, '0');
  return pence(sign * (wholeAbs * 100 + Number.parseInt(fractionPadded, 10)));
}

/** Format pence as a GBP string using en-GB conventions: 1250 → "£12.50". */
export function formatPence(value: Pence): string {
  return GBP_FORMATTER.format(value / 100);
}

export function addPence(a: Pence, b: Pence): Pence {
  return pence(a + b);
}

export function subtractPence(a: Pence, b: Pence): Pence {
  return pence(a - b);
}

/**
 * Split an amount into `parts` shares that sum exactly to the original.
 * Remainder pence go to the earliest shares (no money is lost or invented).
 */
export function splitPence(total: Pence, parts: number): Pence[] {
  if (!Number.isInteger(parts) || parts <= 0) {
    throw new RangeError('splitPence() parts must be a positive integer');
  }
  const base = Math.floor(total / parts);
  const remainder = total - base * parts;
  return Array.from({ length: parts }, (_, i) => pence(base + (i < remainder ? 1 : 0)));
}
