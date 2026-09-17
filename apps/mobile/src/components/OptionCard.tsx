import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme';

export interface OptionCardProps {
  title: string;
  description: string;
  /** Third line, drawn in brand cyan: "Eg. 10 points = 1 free coffee". */
  example?: string;
  /** Glyph in a bordered tile on the left (★, ↻, –). */
  icon?: string;
  /** The "Skip for now" glyph is drawn muted rather than brand. */
  iconMuted?: boolean;
  /** Adds the round tick on the right of the card. */
  showRadio?: boolean;
  selected: boolean;
  /** Listed but not selectable. */
  disabled?: boolean;
  onPress?: () => void;
}

/**
 * Single-choice card: merchant type, and the rewards programme cards with an
 * icon tile and a radio. Selected draws the 10% brand tint and a 1.5 brand
 * border; unselected is white with a hairline.
 */
export function OptionCard({
  title,
  description,
  example,
  icon,
  iconMuted = false,
  showRadio = false,
  selected,
  disabled = false,
  onPress,
}: OptionCardProps) {
  const { border, colors, radius, size, spacing, text } = useTheme();
  // A 1.5 border eats half a point more of the box than the hairline does; give
  // it back in padding so selecting a card does not shift its content.
  const strokeWidth = selected ? border.strong : border.hairline;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="radio"
      // aria-* rather than accessibilityState: react-native-web only reads these.
      aria-checked={selected}
      aria-disabled={disabled}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.lgXl,
        paddingVertical: spacing.xl + border.strong - strokeWidth,
        paddingHorizontal: spacing.xlXxl + border.strong - strokeWidth,
        borderRadius: radius.xl,
        borderWidth: strokeWidth,
        borderColor: selected ? colors.primary : colors.border,
        backgroundColor: selected ? colors.primarySoft : colors.surface,
        opacity: disabled ? 0.55 : pressed ? 0.85 : 1,
      })}
    >
      {icon ? (
        <View
          style={[
            styles.centred,
            {
              width: size.iconTile,
              height: size.iconTile,
              borderRadius: radius.md,
              borderWidth: border.hairline,
              borderColor: colors.border,
              backgroundColor: colors.surface,
            },
          ]}
        >
          <Text style={[text.h4Sm, { color: iconMuted ? colors.textMuted : colors.primary }]}>
            {icon}
          </Text>
        </View>
      ) : null}

      <View style={styles.body}>
        <Text style={[icon ? text.h4Sm : text.h4, { color: colors.textPrimary }]}>{title}</Text>
        <Text style={[text.bodyXs, { color: colors.textMuted, marginTop: spacing.xs }]}>
          {description}
        </Text>
        {example ? (
          <Text style={[text.hint, { color: colors.primary, marginTop: spacing.sm }]}>
            {example}
          </Text>
        ) : null}
      </View>

      {showRadio ? (
        <View
          style={[
            styles.centred,
            {
              width: size.radio,
              height: size.radio,
              borderRadius: radius.pill,
              borderWidth: border.strong,
              borderColor: selected ? colors.primary : colors.borderStrong,
              backgroundColor: selected ? colors.primary : colors.surface,
            },
          ]}
        >
          {selected ? <Text style={[text.label, { color: colors.onPrimary }]}>✓</Text> : null}
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  centred: { alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, minWidth: 0 },
});
