import { useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type ViewStyle } from 'react-native';
import { useTheme } from '@/theme';

type CodeVariant = 'otp' | 'sortCode' | 'accountNumber';

export interface CodeInputProps {
  value: string;
  onChangeText: (value: string) => void;
  /**
   * otp — 6 fixed-width cells (email and mobile codes).
   * sortCode — 6 cells that flex to the gutter.
   * accountNumber — 8 shorter cells that flex to the gutter.
   */
  variant?: CodeVariant;
  /** Paints every cell in the error colours (a rejected code). */
  error?: boolean;
  accessibilityLabel?: string;
  style?: ViewStyle;
}

/**
 * Digit cells backed by one hidden input, as the handoff builds it: the cells
 * are decoration and a single transparent `TextInput` stretched across them owns
 * the caret, the keyboard and paste. Per-cell inputs would fight autofill and
 * break "paste a 6-digit code" on both platforms.
 */
export function CodeInput({
  value,
  onChangeText,
  variant = 'otp',
  error = false,
  accessibilityLabel,
  style,
}: CodeInputProps) {
  const { border, colors, radius, size, spacing, text } = useTheme();
  const input = useRef<TextInput>(null);

  const preset = {
    otp: {
      count: 6,
      gap: 9,
      cell: { width: size.codeCell.width, height: size.codeCell.height },
      borderRadius: radius.md,
      textStyle: text.codeCell,
    },
    sortCode: {
      count: 6,
      gap: spacing.md,
      cell: { flex: 1, height: size.sortCell },
      borderRadius: radius.md,
      textStyle: text.sortCell,
    },
    accountNumber: {
      count: 8,
      gap: spacing.sm,
      cell: { flex: 1, height: size.accountCell },
      borderRadius: radius.smMd,
      textStyle: text.accountCell,
    },
  }[variant];

  const digits = [...Array(preset.count).keys()];

  return (
    <View style={style}>
      <View style={[styles.row, { gap: preset.gap }]}>
        {digits.map((index) => {
          // The cell the next digit lands in gets the brand outline.
          const active = index === value.length;
          return (
            <View
              key={index}
              style={[
                styles.cell,
                preset.cell,
                {
                  borderRadius: preset.borderRadius,
                  borderWidth: border.strong,
                  borderColor: error ? colors.errorBorder : active ? colors.primary : colors.border,
                  backgroundColor: error ? colors.errorSoft : colors.surface,
                },
              ]}
            >
              <Text
                style={[
                  preset.textStyle,
                  { color: error ? colors.onErrorSoft : colors.textPrimary },
                ]}
              >
                {value[index] ?? ''}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Sits over the cells so a tap anywhere on the row focuses the one input. */}
      <Pressable style={StyleSheet.absoluteFill} onPress={() => input.current?.focus()}>
        <TextInput
          ref={input}
          value={value}
          onChangeText={(next) => onChangeText(next.replace(/\D/g, '').slice(0, preset.count))}
          keyboardType="number-pad"
          inputMode="numeric"
          textContentType="oneTimeCode"
          autoComplete="one-time-code"
          maxLength={preset.count}
          accessibilityLabel={accessibilityLabel}
          style={[StyleSheet.absoluteFill, styles.hidden]}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  cell: { alignItems: 'center', justifyContent: 'center' },
  // Transparent rather than unmounted: it still has to take focus and input.
  hidden: { opacity: 0 },
});
