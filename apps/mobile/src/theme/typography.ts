/**
 * Type scale. Figma uses Clash Grotesk (600/700) for headings and the
 * wordmark, Inter for everything else. Half-point sizes from the file were
 * rounded; the merges are listed in docs/design-language.md.
 *
 * Font files are not bundled yet, so these styles carry no fontFamily and the
 * system font renders until the loader lands (see the doc, "Fonts"). Adding
 * fontFamily here is the only change needed once fonts load.
 */
import type { TextStyle } from 'react-native';

export const fontFamily = {
  heading: 'ClashGrotesk-Semibold',
  headingBold: 'ClashGrotesk-Bold',
  body: 'Inter-Regular',
  bodyMedium: 'Inter-Medium',
  bodySemibold: 'Inter-SemiBold',
  bodyBold: 'Inter-Bold',
} as const;

const style = (
  fontSize: number,
  lineHeight: number,
  fontWeight: TextStyle['fontWeight'],
  extra: Pick<TextStyle, 'letterSpacing' | 'textTransform'> = {},
): TextStyle => ({ fontSize, lineHeight, fontWeight, ...extra });

export const typography = {
  // ── Headings (Clash Grotesk) ──────────────────────────────────────────────
  /** Wordmark "dittopay" on Splash / Welcome. */
  display: style(32, 39, '700'),
  /** Screen title: "Sign in", "Merchant Account". */
  h1: style(26, 30, '600', { letterSpacing: -0.5 }),
  /** Sheet / section title: "Not available in your region yet", "Transaction Logs". */
  h2: style(22, 26, '600', { letterSpacing: -0.4 }),
  /** Card title: "Take your first payment". */
  h3: style(18, 22, '600'),
  /** Name in the account header. */
  h4: style(17, 21, '600'),

  // ── Amounts (Inter) ───────────────────────────────────────────────────────
  /** Hero amount "£752.00". */
  amountLg: style(34, 41, '600'),
  amountMd: style(24, 29, '600'),

  // ── Body (Inter) ──────────────────────────────────────────────────────────
  /** Input text, back chevron, tagline. */
  body: style(15, 20, '400'),
  /** Subtitle under a screen heading: "This decides which documents we'll ask for next." */
  lead: style(15, 22, '400'),
  /** Row labels, sheet body copy, avatar initials. */
  bodySm: style(14, 20, '400'),
  /** Captions, helper and error copy under a field. */
  caption: style(13, 18, '400'),
  /** Option-card descriptions and the onboarding stage label. */
  detail: style(13, 16, '400'),
  /** Footnotes: "Available in the UK", row subtitles, timestamps. */
  captionSm: style(12, 16, '400'),

  // ── Labels (Inter) ────────────────────────────────────────────────────────
  /** Field label above an input. */
  label: style(13, 16, '500'),
  /** Links, "Show", tab label, chips with text. */
  labelStrong: style(13, 16, '600'),
  /** Small chips and badges: "ID Verified", "Active", "Unread". */
  labelSm: style(11, 14, '600'),
  /** Section overline: "ACCOUNT", "PAYMENT SETTINGS", trading name under a heading. */
  overline: style(11, 13, '600', { letterSpacing: 0.6, textTransform: 'uppercase' }),
  /** Row value on the right: "£540.00", "3", "15 mins". */
  value: style(15, 18, '600'),

  // ── Buttons (Inter) ───────────────────────────────────────────────────────
  button: style(17, 21, '600'),
  buttonSm: style(15, 18, '600'),
  /** 44-tall inline button: splash "Retry". */
  buttonXs: style(14, 18, '600'),
} as const satisfies Record<string, TextStyle>;
