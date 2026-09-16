import { Image, type ImageStyle, type StyleProp } from 'react-native';
import { useTheme } from '@/theme';
import logoDark from '../../assets/brand/logo-dark.png';
import logoLight from '../../assets/brand/logo-light.png';

/** Figma export size (nodes 1:164166 / 1:164182) at 1x. */
const LOGO_WIDTH = 247;
const LOGO_HEIGHT = 139;

export interface BrandLogoProps {
  /** Rendered width; height keeps the 247:139 ratio. Defaults to the Figma size. */
  width?: number;
  style?: StyleProp<ImageStyle>;
}

/**
 * The "dittopay" lockup. Two raster exports from Figma, one per colour scheme,
 * each with its background baked in — they only sit cleanly on `background`.
 * Replace with an SVG once the designer supplies one (docs/design-language.md).
 */
export function BrandLogo({ width = LOGO_WIDTH, style }: BrandLogoProps) {
  const { scheme } = useTheme();
  const height = Math.round((width * LOGO_HEIGHT) / LOGO_WIDTH);

  return (
    <Image
      source={scheme === 'dark' ? logoDark : logoLight}
      accessibilityRole="image"
      accessibilityLabel="dittopay"
      style={[{ width, height }, style]}
      resizeMode="contain"
    />
  );
}
