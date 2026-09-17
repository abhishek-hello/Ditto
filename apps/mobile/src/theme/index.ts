import { useColorScheme } from 'react-native';
import { darkColors, lightColors, type ThemeColors } from './colors';
import { border, radius, shadow, size, spacing } from './tokens';
import { fontFamily, typography } from './typography';

export interface Theme {
  scheme: 'light' | 'dark';
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  size: typeof size;
  border: typeof border;
  shadow: typeof shadow;
  text: typeof typography;
  fontFamily: typeof fontFamily;
}

const base = { spacing, radius, size, border, shadow, text: typography, fontFamily } as const;

const themes: Record<Theme['scheme'], Theme> = {
  light: { scheme: 'light', colors: lightColors, ...base },
  dark: { scheme: 'dark', colors: darkColors, ...base },
};

/**
 * Dark mode is paused. The Claude Design handoff is light-only, so `darkColors`
 * is a placeholder copy of light (see ./colors.ts) and this pin is what keeps it
 * off screen. Set to `null` to follow the OS again — but only once the dark
 * palette is real. The root layout applies the same value to native chrome.
 */
export const PINNED_SCHEME: Theme['scheme'] | null = 'light';

/**
 * The design language for the current colour scheme: `PINNED_SCHEME` when
 * set, otherwise the OS setting (app.config.ts sets userInterfaceStyle:
 * 'automatic'). The Account → Theme screen will add a manual override later.
 */
export function useTheme(): Theme {
  const system = useColorScheme();
  return themes[PINNED_SCHEME ?? (system === 'dark' ? 'dark' : 'light')];
}
