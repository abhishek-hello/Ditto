import { useState } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { BottomSheet } from '@/components/BottomSheet';
import { useTheme } from '@/theme';

export interface SelectOption {
  value: string;
  /** Shown in the list. Defaults to `value`. */
  label?: string;
  /** "coming soon" entries: listed, greyed, not selectable. */
  disabled?: boolean;
}

export interface SelectFieldProps {
  label?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  /** Message under the field. */
  helper?: string;
  /** Narrow variant: the +44 dial-code field sits beside the phone number. */
  width?: number;
  containerStyle?: ViewStyle;
  /** Title announced on the sheet. Defaults to `label`. */
  sheetTitle?: string;
}

/**
 * A select drawn as the handoff's input box. React Native has no native select
 * and the picker packages are a dependency we do not need, so the options open
 * in the app's own bottom sheet — which also gives the "— coming soon" entries
 * somewhere to say so.
 *
 * The handoff sets `appearance:none` with no replacement arrow, leaving the
 * field with no affordance at all. The chevron below is the one addition: a
 * control the user cannot tell is a control is a usability bug, not a style.
 */
export function SelectField({
  label,
  value,
  options,
  onChange,
  helper,
  width,
  containerStyle,
  sheetTitle,
}: SelectFieldProps) {
  const { border, colors, radius, size, spacing, text } = useTheme();
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <View style={[width === undefined ? null : { width }, containerStyle]}>
      {label ? (
        <Text style={[text.label, { color: colors.textMuted, marginBottom: spacing.md }]}>
          {label}
        </Text>
      ) : null}

      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityValue={{ text: selected?.label ?? value }}
        style={({ pressed }) => [
          styles.field,
          {
            height: size.input,
            paddingHorizontal: spacing.xl,
            borderRadius: radius.lg,
            borderWidth: border.hairline,
            borderColor: colors.border,
            backgroundColor: colors.surface,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <Text numberOfLines={1} style={[text.input, styles.value, { color: colors.textPrimary }]}>
          {selected?.label ?? value}
        </Text>
        <Text style={[text.label, { color: colors.textMuted }]}>▾</Text>
      </Pressable>

      {helper ? (
        <Text style={[text.caption, { color: colors.textMuted, marginTop: spacing.md }]}>
          {helper}
        </Text>
      ) : null}

      <BottomSheet
        visible={open}
        onClose={() => setOpen(false)}
        accessibilityLabel={sheetTitle ?? label}
      >
        {(sheetTitle ?? label) ? (
          <Text style={[text.h3Sm, { color: colors.textPrimary }]}>{sheetTitle ?? label}</Text>
        ) : null}

        <View accessibilityRole="radiogroup" style={{ gap: spacing.md }}>
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <Pressable
                key={option.value}
                disabled={option.disabled}
                onPress={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                accessibilityRole="radio"
                aria-checked={isSelected}
                aria-disabled={option.disabled}
                style={({ pressed }) => [
                  styles.option,
                  {
                    paddingVertical: spacing.lgXl,
                    paddingHorizontal: spacing.xl,
                    borderRadius: radius.lg,
                    borderWidth: isSelected ? border.strong : border.hairline,
                    borderColor: isSelected ? colors.primary : colors.border,
                    backgroundColor: isSelected ? colors.primarySoft : colors.surface,
                    opacity: option.disabled ? 0.5 : pressed ? 0.85 : 1,
                  },
                ]}
              >
                <Text style={[text.input, styles.value, { color: colors.textPrimary }]}>
                  {option.label ?? option.value}
                </Text>
                {isSelected ? <Text style={[text.value, { color: colors.primary }]}>✓</Text> : null}
              </Pressable>
            );
          })}
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { flexDirection: 'row', alignItems: 'center' },
  option: { flexDirection: 'row', alignItems: 'center' },
  value: { flex: 1 },
});
