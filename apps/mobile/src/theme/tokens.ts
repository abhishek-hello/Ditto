/**
 * Mode-independent tokens: spacing, radii, fixed sizes, borders, shadows.
 * Values come from the Figma frames listed in docs/design-language.md.
 */
import type { ViewStyle } from 'react-native';

/** 2px base. Figma gaps cluster at 6 / 8 / 12 / 14 / 16; paddings at 13–16 and 19. */
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  xxxl: 24,
  huge: 32,
  /** Horizontal screen gutter. Every frame uses 16 at 375 and 430. */
  gutter: 16,
} as const;

export const radius = {
  /** Annotation chips. */
  xs: 5,
  /** Inputs, error box, small cards. */
  md: 12,
  /** List rows, sheet buttons. */
  lg: 14,
  /** Primary / secondary buttons, home action tiles. */
  xl: 16,
  /** Stat cards ("Payments received last 7 days"). */
  xxl: 18,
  /** Bottom-sheet top corners. */
  sheet: 20,
  /** Chips, avatars, tab pills, icon circles. */
  pill: 999,
} as const;

export const size = {
  button: 56,
  buttonSm: 48,
  /** Inline outlined button: splash "Retry". */
  buttonXs: 44,
  input: 52,
  avatar: 44,
  tabPill: 40,
  rowIcon: 38,
  backButton: 34,
  chip: 24,
  tabBar: 65,
  sheetHandle: { width: 36, height: 4 },
  icon: 20,
  iconSm: 16,
} as const;

export const border = {
  hairline: 1,
  /** Stroke width used by the line icons in the file (~1.6). */
  icon: 1.6,
} as const;

export const shadow = {
  sheet: {
    shadowColor: '#0a1418',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
  },
  modal: {
    shadowColor: '#0a1418',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 32,
    elevation: 16,
  },
} as const satisfies Record<string, ViewStyle>;
