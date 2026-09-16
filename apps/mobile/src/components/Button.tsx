import { Pressable, type StyleProp, StyleSheet, Text, type ViewStyle } from 'react-native';
import { useTheme } from '@/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 'lg' | 'md' | 'sm';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  /**
   * primary — cyan fill (Sign In, Create Account).
   * secondary — neutral outline, primary text (Welcome "Sign In", sheet "Got it").
   * outline — cyan outline and label (splash "Retry").
   */
  variant?: ButtonVariant;
  /** lg 56 (full-width CTA), md 48 (sheet / inline CTA), sm 44 (inline). */
  size?: ButtonSize;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Design-system button. Geometry and colours come from Figma via the theme. */
export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  disabled = false,
  style,
}: ButtonProps) {
  const { colors, radius, size: sizes, spacing, text, border } = useTheme();

  const geometry = {
    lg: { height: sizes.button, borderRadius: radius.xl, textStyle: text.button },
    md: { height: sizes.buttonSm, borderRadius: radius.lg, textStyle: text.buttonSm },
    sm: { height: sizes.buttonXs, borderRadius: radius.md, textStyle: text.buttonXs },
  }[size];

  const palette = disabled
    ? {
        backgroundColor: colors.buttonDisabled,
        borderColor: colors.buttonDisabled,
        color: colors.onButtonDisabled,
      }
    : {
        primary: {
          backgroundColor: colors.primary,
          borderColor: colors.primaryBorder,
          color: colors.onPrimary,
        },
        secondary: {
          backgroundColor: 'transparent',
          borderColor: colors.borderStrong,
          color: colors.textPrimary,
        },
        outline: {
          backgroundColor: 'transparent',
          borderColor: colors.primaryBorder,
          color: colors.link,
        },
      }[variant];

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
          borderWidth: border.hairline,
          paddingHorizontal: spacing.xxxl,
          backgroundColor: palette.backgroundColor,
          borderColor: palette.borderColor,
          opacity: pressed ? 0.85 : 1,
        },
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
