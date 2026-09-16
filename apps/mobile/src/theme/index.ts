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
 * The design language for the current colour scheme. Follows the OS setting
 * (app.config.ts sets userInterfaceStyle: 'automatic'). The Account → Theme
 * screen will add a manual override on top of this later.
 */
export function useTheme(): Theme {
  const scheme = useColorScheme();
  return themes[scheme === 'dark' ? 'dark' : 'light'];
}
