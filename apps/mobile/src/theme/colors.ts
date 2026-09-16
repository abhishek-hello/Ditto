/**
 * Colour palettes, mined from the Figma file (see docs/design-language.md for
 * the node each value came from and which near-duplicate shades were merged).
 * Screens never use hex literals; they read these through useTheme().
 */

export interface ThemeColors {
  /** Screen background. */
  background: string;
  /** Cards, inputs, chips, list rows. */
  surface: string;
  /** Raised element on a surface: icon circle inside a row, tab bar, sheet. */
  surfaceRaised: string;
  /** Hairline border on surfaces, inputs, rows, tab bar. */
  border: string;
  /** Outline for secondary buttons and the sheet grabber. */
  borderStrong: string;

  textPrimary: string;
  /** Row labels, sheet body copy. */
  textSecondary: string;
  /** Field labels, captions, section overlines, inactive tab icons. */
  textMuted: string;
  textPlaceholder: string;

  /** Brand cyan: primary buttons, active tab pill, status chips, switches. */
  primary: string;
  /** 1px border on a primary button. */
  primaryBorder: string;
  /** Text and icons on a primary background. */
  onPrimary: string;
  /** Tinted background for an info icon circle or a highlighted area. */
  primarySoft: string;
  /** Inline links ("Forgot password?", "Show", "Change Email"). */
  link: string;
  /** Emphasised cyan numbers on a surface (outstanding £120.00). */
  accentText: string;

  buttonDisabled: string;
  onButtonDisabled: string;

  error: string;
  errorBorder: string;
  errorSoft: string;
  success: string;
  successSoft: string;

  /** Bottom-sheet scrim. */
  scrim: string;
  /** Drag handle on a sheet and the home indicator. */
  handle: string;
}

export const lightColors: ThemeColors = {
  background: '#ffffff',
  surface: '#eef2f3',
  surfaceRaised: '#ffffff',
  border: '#d3dbde',
  borderStrong: '#afbbc0',

  textPrimary: '#0a1418',
  textSecondary: '#33424a',
  textMuted: '#647178',
  textPlaceholder: '#8a979e',

  primary: '#30f1fb',
  primaryBorder: '#93def5',
  onPrimary: '#001014',
  primarySoft: 'rgba(48, 241, 251, 0.16)',
  link: '#03c3fd',
  accentText: '#0a737d',

  buttonDisabled: '#dde4e6',
  onButtonDisabled: '#9aa5aa',

  error: '#c22b2b',
  errorBorder: '#c22b2b',
  // Provisional: the light-mode error background is not in the Figma file yet.
  errorSoft: 'rgba(194, 43, 43, 0.08)',
  success: '#0f7a46',
  successSoft: '#e3f6eb',

  scrim: 'rgba(0, 13, 20, 0.72)',
  handle: '#afbbc0',
};

export const darkColors: ThemeColors = {
  background: '#000d14',
  surface: '#16232b',
  surfaceRaised: '#16232b',
  border: '#2b3a43',
  borderStrong: '#3d4c56',

  textPrimary: '#ffffff',
  textSecondary: '#c3cdd2',
  textMuted: '#8a979e',
  // Provisional: no dark-mode placeholder text in the Figma file yet.
  textPlaceholder: '#647178',

  primary: '#30f1fb',
  primaryBorder: '#8ff6fb',
  onPrimary: '#000d14',
  primarySoft: '#0a3b42',
  link: '#30f1fb',
  accentText: '#30f1fb',

  buttonDisabled: '#0c1a22',
  onButtonDisabled: '#5a676e',

  error: '#ff5a5f',
  errorBorder: '#ff5a5f',
  errorSoft: '#2e1214',
  success: '#46d97a',
  successSoft: '#0c2a1d',

  scrim: 'rgba(0, 13, 20, 0.72)',
  handle: '#3d4c56',
};
