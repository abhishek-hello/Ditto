import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '@/theme';

/** Grows the touch target of the 34pt circle to the 44pt minimum. */
const HIT_SLOP = 5;

export interface BackButtonProps {
  onPress: () => void;
}

/**
 * Circular back button: surface fill, hairline border, "‹" glyph. The glyph is
 * text in Figma (Sign In 1:164310, onboarding 1:165000), not an icon.
 */
export function BackButton({ onPress }: BackButtonProps) {
  const { border, colors, radius, size, text } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel="Back"
      style={({ pressed }) => [
        styles.base,
        {
          width: size.backButton,
          height: size.backButton,
          borderRadius: radius.pill,
          borderWidth: border.hairline,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <Text style={[text.body, { color: colors.textSecondary }]}>‹</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
});
