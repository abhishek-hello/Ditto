/**
 * Type scale, mined from `DittoPay Light.dc.html`. The handoff sets everything
 * in Clash Grotesk at three weights — 400, 500 and 600 — so each style below
 * carries its own `fontFamily`: React Native will not synthesise a weight for a
 * custom family, and asking for `fontWeight: '600'` on Regular silently renders
 * Regular on Android.
 *
 * Half-point sizes in the handoff (14.5, 15.5, 16.5) are kept as-is; they round
 * consistently and there are too many of them to merge without visible drift.
 */
import type { TextStyle } from 'react-native';
import medium from '../../assets/fonts/ClashGrotesk-Medium.otf';
import regular from '../../assets/fonts/ClashGrotesk-Regular.otf';
import semibold from '../../assets/fonts/ClashGrotesk-Semibold.otf';

export const fontFamily = {
  regular: 'ClashGrotesk-Regular',
  medium: 'ClashGrotesk-Medium',
  semibold: 'ClashGrotesk-Semibold',
} as const;

/** The three faces loaded by `useFonts` in the root layout. */
export const fontAssets = {
  [fontFamily.regular]: regular,
  [fontFamily.medium]: medium,
  [fontFamily.semibold]: semibold,
} as const;

type Weight = 400 | 500 | 600;

const family: Record<Weight, string> = {
  400: fontFamily.regular,
  500: fontFamily.medium,
  600: fontFamily.semibold,
};

const style = (
  fontSize: number,
  lineHeight: number,
  weight: Weight,
  extra: Pick<TextStyle, 'letterSpacing' | 'textTransform'> = {},
): TextStyle => ({ fontSize, lineHeight, fontFamily: family[weight], ...extra });

export const typography = {
  // ── Headings ──────────────────────────────────────────────────────────────
  /** "Sign in" — the one 32px title. */
  h1Lg: style(32, 35, 600, { letterSpacing: -0.32 }),
  /** Standard screen title: "Your legal name", "Link your bank account". */
  h1: style(30, 35, 600, { letterSpacing: -0.3 }),
  /** Long title that has to wrap tighter: "Automated customer rewards". */
  h1Sm: style(28, 32, 600, { letterSpacing: -0.28 }),
  /** Status screen title: "You're all set". */
  h1Status: style(29, 35, 600),
  /** Payment-result title. */
  h2: style(24, 30, 600),
  /** Geo sheet title. */
  h2Sm: style(23, 29, 600),
  /** Handoff / confirming spinner title, share-sheet title. */
  h3: style(22, 28, 600),
  /** Share-sheet heading. */
  h3Sm: style(20, 25, 600),
  /** Option-card title: "Sole Merchant". */
  h4: style(18, 22, 600),
  /** Reward-card title: "Points". */
  h4Sm: style(17, 20, 600),
  /** Terms clause heading, bank-help card title. */
  h5: style(16.5, 21, 600),

  // ── Amounts ───────────────────────────────────────────────────────────────
  /** "£45.00" on the trading-name preview. */
  amount: style(40, 40, 600, { letterSpacing: -0.8 }),
  /** Customer-facing trading name under the amount. */
  amountCaption: style(19, 24, 600),

  // ── Body ──────────────────────────────────────────────────────────────────
  /** Welcome tagline. */
  bodyLg: style(17, 24, 400),
  /** Subtitle under a screen heading, status-screen body. */
  lead: style(15.5, 23, 400),
  /** Terms paragraph, fee-table label, summary panel. */
  body: style(15, 23, 400),
  /** Input and select text. */
  input: style(16, 20, 500),
  /** Stage label, "Code expires in", reward-card copy. */
  bodySm: style(14.5, 20, 400),
  /** Option-card description, share-sheet copy, bank-help copy. */
  bodyXs: style(14, 20, 400),
  /** Password-rule label, read-only row value. */
  bodyTight: style(15, 20, 400),

  // ── Labels and captions ───────────────────────────────────────────────────
  /** Field label above an input. */
  label: style(13, 13, 500),
  /** Helper and error copy under a field. */
  caption: style(13.5, 20, 400),
  /** Tighter caption: "House name OR number — not both". */
  captionSm: style(13, 18, 400),
  /** Prototype footnote / "Payments securely processed by Stripe." */
  captionXs: style(12.5, 19, 400),
  /** Section overline: "CARD DETAILS", "SUMMARY". */
  overline: style(11.5, 12, 600, { letterSpacing: 1.04, textTransform: 'uppercase' }),
  /** Value on the right of a fee row. */
  value: style(15, 18, 600),
  /** Link or toggle inside a row: "Forgot password?", "Show". */
  link: style(13.5, 18, 600),
  /** Larger inline link: "Show" / "Hide" on a password field, "Share ↗". */
  linkLg: style(14.5, 18, 600),
  /** Reward-card example line: "Eg. 10 points = 1 free coffee". */
  hint: style(13.5, 18, 600),

  // ── Controls ──────────────────────────────────────────────────────────────
  button: style(17, 21, 600),
  buttonMd: style(16.5, 20, 600),
  buttonSm: style(16, 20, 600),
  buttonXs: style(15.5, 19, 600),
  /** OTP cell digit. */
  codeCell: style(24, 28, 600),
  /** Sort-code cell digit. */
  sortCell: style(22, 26, 600),
  /** Account-number cell digit. */
  accountCell: style(19, 23, 600),
  /** Glyph inside a status circle. */
  statusGlyph: style(34, 40, 600),
  statusGlyphSm: style(28, 34, 600),
} as const satisfies Record<string, TextStyle>;
