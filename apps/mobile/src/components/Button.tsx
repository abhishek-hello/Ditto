import { Pressable, type StyleProp, StyleSheet, Text, type ViewStyle } from 'react-native';
import { useTheme } from '@/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'inverse' | 'plain';
type ButtonSize = 'lg' | 'md' | 'sm' | 'xs';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  /**
   * primary — brand fill with a cyan glow (every screen CTA).
   * secondary — white fill, hairline outline ("Sign In", "Got it", "Try again").
   * outline — transparent with a brand outline and label (splash "Retry").
   * inverse — near-black fill ("Apply", "Pay & Activate Account").
   * plain — no chrome; a text button that still wants a button's height.
   */
  variant?: ButtonVariant;
  /** lg 56 (screen CTA), md 54 (sheet CTA), sm 52 (inline), xs 46 (splash Retry). */
  size?: ButtonSize;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Design-system button. Geometry and colour come from the handoff via the theme. */
export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  disabled = false,
  style,
}: ButtonProps) {
  const { border, colors, radius, size: sizes, shadow, spacing, text } = useTheme();

  const geometry = {
    lg: { height: sizes.button, borderRadius: radius.xl, textStyle: text.button },
    md: { height: sizes.buttonMd, borderRadius: radius.xl, textStyle: text.buttonMd },
    sm: { height: sizes.buttonSm, borderRadius: radius.lg, textStyle: text.buttonSm },
    xs: { height: sizes.buttonXs, borderRadius: radius.lg, textStyle: text.buttonXs },
  }[size];

  const palette = disabled
    ? {
        backgroundColor: colors.buttonDisabled,
        borderColor: colors.buttonDisabled,
        borderWidth: border.hairline,
        color: colors.onButtonDisabled,
      }
    : {
        primary: {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
          borderWidth: border.hairline,
          color: colors.onPrimary,
        },
        secondary: {
          backgroundColor: colors.surface,
          borderColor: colors.borderStrong,
          borderWidth: border.hairline,
          color: colors.textPrimary,
        },
        outline: {
          backgroundColor: 'transparent',
          borderColor: colors.primaryBorder,
          borderWidth: border.strong,
          color: colors.link,
        },
        inverse: {
          backgroundColor: colors.inverse,
          borderColor: colors.inverse,
          borderWidth: border.hairline,
          color: colors.onInverse,
        },
        plain: {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          borderWidth: 0,
          color: colors.textPrimary,
        },
      }[variant];

  // Only the enabled primary fill carries the brand glow.
  const glow = !disabled && variant === 'primary';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        {
          height: geometry.height,
          borderRadius: geometry.borderRadius,
          borderWidth: palette.borderWidth,
          paddingHorizontal: spacing.huge,
          backgroundColor: palette.backgroundColor,
          borderColor: palette.borderColor,
          opacity: pressed ? 0.85 : 1,
        },
        glow ? { ...shadow.primary, shadowColor: colors.primaryShadow } : null,
        style,
      ]}
    >
      <Text style={[geometry.textStyle, { color: palette.color }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch' },
});
