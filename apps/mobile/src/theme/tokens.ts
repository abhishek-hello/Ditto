/**
 * Mode-independent tokens: spacing, radii, fixed sizes, borders, shadows.
 * Values come from `DittoPay Light.dc.html` in the Claude Design handoff.
 */
import type { ViewStyle } from 'react-native';

/** 2px base. The handoff's gaps cluster at 6 / 8 / 10 / 12 / 14 / 18 / 20 / 22 / 24. */
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 6,
  md: 8,
  /** Button stacks, cell gaps, sheet grid. */
  mdLg: 10,
  lg: 12,
  /** Sheet content stack, option-card icon gap. */
  lgXl: 14,
  xl: 16,
  /** Gap between form fields on a scrolling screen. */
  xlXxl: 18,
  xxl: 20,
  /** Heading → first field. */
  xxlXxxl: 22,
  xxxl: 24,
  huge: 26,
  /** Splash logo → progress bar. */
  giant: 34,
  /** Horizontal screen gutter. Every frame uses 24. */
  gutter: 24,
} as const;

export const radius = {
  /** Checkbox. */
  xs: 7,
  /** Time badge on the video poster. */
  sm: 8,
  /** Account-number cell. */
  smMd: 11,
  /** OTP / sort-code cell, "Attempt 2 of 3" chip. */
  md: 12,
  /** Inputs, selects, list rows, notes, summary panels. */
  lg: 14,
  /** Buttons, cards, option cards. */
  xl: 16,
  /** Trading-name preview card, video poster. */
  xxl: 18,
  /** Bottom-sheet top corners. */
  sheet: 26,
  /** Chips, avatars, icon circles, progress segments. */
  pill: 999,
} as const;

export const size = {
  /** Full-width CTA. */
  button: 56,
  /** Sheet CTA, secondary action under a status screen. */
  buttonMd: 54,
  /** "Watch later", "Apply", card inputs. */
  buttonSm: 52,
  /** Inline outlined button: splash "Retry". */
  buttonXs: 46,
  input: 56,
  /** Set-up fee card fields. */
  inputSm: 52,
  backButton: 42,
  /** OTP cell. */
  codeCell: { width: 48, height: 58 },
  /** Sort-code cell (flexes to fill). */
  sortCell: 58,
  /** Account-number cell (flexes to fill). */
  accountCell: 54,
  checkbox: 24,
  radio: 26,
  /** Tick beside a password rule. */
  ruleDot: 22,
  /** Success / error circle on a status screen. */
  statusCircle: 82,
  /** Smaller status circle, inside the payment states. */
  statusCircleSm: 64,
  /** Icon tile on a reward card, info circle on a sheet. */
  iconTile: 46,
  /** Video play button. */
  playButton: 64,
  sheetHandle: { width: 44, height: 5 },
  /** Stage progress segment. */
  progressSegment: 5,
  /** Sub-step progress segment (reset flow, terms read-through). */
  progressSegmentSm: 4,
  icon: 20,
  iconSm: 16,
} as const;

export const border = {
  hairline: 1,
  /** Selected cards, focused cells, checkboxes — the handoff draws these at 1.5. */
  strong: 1.5,
} as const;

export const shadow = {
  /** Brand glow under an enabled primary button: 0 6px 18px. */
  primary: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 6,
  },
  /** Sticky footer above a scrolling form: 0 -6px 18px at 5%. */
  footer: {
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 8,
  },
  /** Bottom sheet: 0 -10px 40px at 18%. */
  sheet: {
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.18,
    shadowRadius: 40,
    elevation: 12,
  },
} as const satisfies Record<string, Omit<ViewStyle, 'shadowColor'>>;
