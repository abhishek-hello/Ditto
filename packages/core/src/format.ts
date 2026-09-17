/**
 * Validation and display helpers that are not UK-specific. UK formats live in
 * `./uk`; money formatting lives in `./money`.
 */

/**
 * Deliberately loose: enough to catch a typo before we send a code, not a
 * conformance check. The authoritative test is whether the email arrives.
 */
export function isEmail(value: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value.trim());
}

/**
 * Partially hides an address for a "we emailed a code to …" line.
 * `jo@marlowelectrical.co.uk` → `jo···@marlowelectrical.co.uk`.
 * Anything too short to mask usefully is returned unchanged.
 */
export function maskEmail(value: string): string {
  const at = value.indexOf('@');
  return at > 2 ? `${value.slice(0, 2)}···${value.slice(at)}` : value;
}

/** Seconds → `m:ss`, for a code-expiry countdown. Negative input clamps to 0:00. */
export function formatCountdown(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, '0')}`;
}
