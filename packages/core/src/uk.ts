/**
 * UK-specific validators. Ditto Pay is UK-only, so these are the only formats
 * accepted at the API boundary.
 */

/** UK sort code: 6 digits, optionally hyphen/space separated (12-34-56). */
export function normaliseSortCode(input: string): string | null {
  const digits = input.replace(/[\s-]/g, '');
  return /^\d{6}$/.test(digits) ? digits : null;
}

/** UK domestic account number: exactly 8 digits. */
export function isValidAccountNumber(input: string): boolean {
  return /^\d{8}$/.test(input.trim());
}

/** UK mobile number: 07xxxxxxxxx or +447xxxxxxxxx. Returns E.164 or null. */
export function normaliseUkMobile(input: string): string | null {
  const digits = input.replace(/[\s()-]/g, '');
  if (/^07\d{9}$/.test(digits)) return `+44${digits.slice(1)}`;
  if (/^\+447\d{9}$/.test(digits)) return digits;
  if (/^447\d{9}$/.test(digits)) return `+${digits}`;
  return null;
}

/** UK postcode (loose but practical). Returns upper-cased "OUTWARD INWARD" or null. */
export function normalisePostcode(input: string): string | null {
  const compact = input.toUpperCase().replace(/\s+/g, '');
  const match = /^([A-Z]{1,2}\d[A-Z\d]?)(\d[A-Z]{2})$/.exec(compact);
  return match ? `${match[1]} ${match[2]}` : null;
}

/** Format a sort code for display: 123456 → 12-34-56 */
export function formatSortCode(sortCode: string): string {
  const s = normaliseSortCode(sortCode);
  if (!s) throw new TypeError(`Invalid sort code: ${sortCode}`);
  return `${s.slice(0, 2)}-${s.slice(2, 4)}-${s.slice(4, 6)}`;
}

/**
 * UK-ordered date of birth, `DD/MM/YYYY`, with any spacing around the slashes.
 * Returns null when the text is not that shape or the date does not exist
 * (31/02/1990 rolls over in `Date`, so the day is checked back).
 */
export function parseUkDate(input: string): Date | null {
  const match = /^\s*(\d{2})\s*\/\s*(\d{2})\s*\/\s*(\d{4})\s*$/.exec(input);
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  const real =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  return real ? date : null;
}

/** Whole years elapsed since `date`. */
export function ageInYears(date: Date, now: Date = new Date()): number {
  const age = now.getFullYear() - date.getFullYear();
  const beforeBirthday =
    now.getMonth() < date.getMonth() ||
    (now.getMonth() === date.getMonth() && now.getDate() < date.getDate());
  return beforeBirthday ? age - 1 : age;
}
