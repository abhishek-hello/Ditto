import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '@/theme';

export interface BackButtonProps {
  onPress: () => void;
}

/**
 * Circular back button: white fill, hairline border, "‹" glyph. The glyph is
 * text in the handoff, not an icon, so it stays text here.
 */
export function BackButton({ onPress }: BackButtonProps) {
  const { border, colors, radius, size, text } = useTheme();

  return (
    <Pressable
      onPress={onPress}
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
      <Text style={[text.h4Sm, styles.glyph, { color: colors.textPrimary }]}>‹</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  // The glyph's own sidebearing sits it right of centre; nudge it back.
  glyph: { marginBottom: 2 },
});
