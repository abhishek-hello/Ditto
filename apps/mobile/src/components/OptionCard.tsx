import { Pressable, Text } from 'react-native';
import { useTheme } from '@/theme';

export interface OptionCardProps {
  title: string;
  description: string;
  selected: boolean;
  /** Not selectable ("Coming soon"). Keeps the unselected look, as the frame does. */
  disabled?: boolean;
  onPress?: () => void;
}

/**
 * Single-choice card (Figma 1:165000, "What kind of merchant are you?").
 * Selected: tinted fill and accent border. Unselected: surface and hairline border.
 */
export function OptionCard({
  title,
  description,
  selected,
  disabled = false,
  onPress,
}: OptionCardProps) {
  const { border, colors, radius, spacing, text } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="radio"
      // aria-* rather than accessibilityState: react-native-web only reads these.
      aria-checked={selected}
      aria-disabled={disabled}
      style={({ pressed }) => ({
        // Figma strokes sit inside the frame without adding to its size; RN
        // borders do add, so the padding gives the border's width back.
        padding: spacing.xl - border.hairline,
        gap: spacing.sm,
        borderRadius: radius.xl,
        borderWidth: border.hairline,
        borderColor: selected ? colors.accentText : colors.border,
        backgroundColor: selected ? colors.primarySoft : colors.surface,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <Text style={[text.h3, { color: colors.textPrimary }]}>{title}</Text>
      <Text style={[text.detail, { color: colors.textMuted }]}>{description}</Text>
    </Pressable>
  );
}
