import { Image, type ImageStyle, type StyleProp } from 'react-native';
import logoInline from '../../assets/brand/logo-inline.png';
import logoStacked from '../../assets/brand/logo-stacked.png';

/** Intrinsic pixel sizes of the two handoff exports, used to keep the ratio. */
const LOCKUPS = {
  /** Splash. Drawn 186 wide in the handoff. */
  stacked: { source: logoStacked, width: 891, height: 560, defaultWidth: 186 },
  /** Welcome. Drawn 236 wide in the handoff. */
  inline: { source: logoInline, width: 1351, height: 299, defaultWidth: 236 },
} as const;

export interface BrandLogoProps {
  /** `stacked` is the splash mark, `inline` the Welcome wordmark. */
  variant?: keyof typeof LOCKUPS;
  /** Rendered width; height follows the export's ratio. */
  width?: number;
  style?: StyleProp<ImageStyle>;
}

/**
 * The DittoPay lockup. Both exports are transparent PNGs from the Claude Design
 * handoff, drawn in the dark brand ink — they read on `background` in light mode
 * only. A dark-mode pair has to land alongside the dark palette.
 */
export function BrandLogo({ variant = 'inline', width, style }: BrandLogoProps) {
  const lockup = LOCKUPS[variant];
  const renderedWidth = width ?? lockup.defaultWidth;
  const height = Math.round((renderedWidth * lockup.height) / lockup.width);

  return (
    <Image
      source={lockup.source}
      accessibilityRole="image"
      accessibilityLabel="DittoPay"
      style={[{ width: renderedWidth, height }, style]}
      resizeMode="contain"
    />
  );
}
