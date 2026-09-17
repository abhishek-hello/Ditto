/**
 * Colour palette, taken from the Claude Design handoff
 * `claude-designs/mobile-app-design-handoff/project/DittoPay Light.dc.html`.
 * Every value below appears as a literal in that file; screens never repeat a
 * hex, they read these through useTheme().
 *
 * DARK MODE IS NOT SPECIFIED. The handoff is the light theme only, and the app
 * is pinned to light (`PINNED_SCHEME` in ./index.ts), so `darkColors` is a
 * placeholder that copies light. Before unpinning, replace every value in it —
 * rendering this as-is would look like a bug, not a dark theme.
 */

export interface ThemeColors {
  /** Screen background. `#F5F7F9` behind every frame. */
  background: string;
  /** Cards, inputs, list rows, sheets — white on the screen background. */
  surface: string;
  /** Kept distinct for sheets and popovers; the handoff draws both white. */
  surfaceRaised: string;
  /** Notes, summary panels, read-only rows, "Attempt 2 of 3" chip. */
  surfaceMuted: string;
  /** Total row of a fee table, the share-link row. One step off white. */
  surfaceSubtle: string;
  /** Video poster / media placeholder. */
  surfacePlaceholder: string;

  /** Hairline around inputs, cards and rows. */
  border: string;
  /** Outline of a secondary button and an unselected checkbox. */
  borderStrong: string;
  /** Separator inside a card and above a sticky footer. */
  divider: string;

  textPrimary: string;
  /** Terms body copy, fee-table labels. */
  textSecondary: string;
  /** Field labels, helper copy, stage labels, overlines. */
  textMuted: string;
  /** Screen footnotes. One step lighter again. */
  textFaint: string;
  textPlaceholder: string;

  /** Brand cyan: primary buttons, progress fill, selected states, links. */
  primary: string;
  /** Border drawn on a primary-filled or primary-outlined control. */
  primaryBorder: string;
  /** Ink on a primary background. */
  onPrimary: string;
  /** 10% brand tint behind a selected card. */
  primarySoft: string;
  /** Inline links and "Show" / "Hide" toggles. */
  link: string;
  /** Highlighted phrase inside a heading, accent numbers. */
  accentText: string;

  /** Near-black fill: the "Apply" and "Pay & Activate" buttons. */
  inverse: string;
  onInverse: string;

  buttonDisabled: string;
  onButtonDisabled: string;

  error: string;
  errorBorder: string;
  /** Tinted panel behind an error message or an errored field. */
  errorSoft: string;
  /** Ink on `errorSoft` — darker than `error` so it holds contrast. */
  onErrorSoft: string;

  /** Bottom-sheet scrim. */
  scrim: string;
  /** Sheet grabber. */
  handle: string;
  /** Shadow colour for the brand glow under a primary button. */
  primaryShadow: string;
  /** Shadow colour for sheets and sticky footers. */
  ambientShadow: string;
}

export const lightColors: ThemeColors = {
  background: '#f5f7f9',
  surface: '#ffffff',
  surfaceRaised: '#ffffff',
  surfaceMuted: '#edf0f2',
  surfaceSubtle: '#f7f9fa',
  surfacePlaceholder: '#dde2e6',

  border: '#e3e7eb',
  borderStrong: '#d7dce1',
  divider: '#ebeef1',

  textPrimary: '#0a141b',
  textSecondary: '#41474d',
  textMuted: '#62676d',
  textFaint: '#7c838a',
  textPlaceholder: '#b4b9bf',

  primary: '#03c3fd',
  primaryBorder: '#03c3fd',
  onPrimary: '#041017',
  primarySoft: 'rgba(3, 195, 253, 0.1)',
  link: '#03c3fd',
  accentText: '#03c3fd',

  inverse: '#0a141b',
  onInverse: '#ffffff',

  buttonDisabled: '#e6e9ec',
  onButtonDisabled: '#a7adb4',

  error: '#c8102e',
  errorBorder: '#c8102e',
  errorSoft: '#fdedf0',
  onErrorSoft: '#a20d25',

  scrim: 'rgba(10, 20, 27, 0.35)',
  handle: '#dce0e5',
  primaryShadow: 'rgba(3, 195, 253, 0.28)',
  ambientShadow: 'rgba(10, 20, 27, 0.18)',
};

/**
 * TODO(dark): placeholder — a copy of `lightColors`. The handoff ships no dark
 * frames, so there is nothing to mine. Unreachable while `PINNED_SCHEME` is
 * 'light'; fill this in from a dark handoff before clearing the pin.
 */
export const darkColors: ThemeColors = { ...lightColors };
