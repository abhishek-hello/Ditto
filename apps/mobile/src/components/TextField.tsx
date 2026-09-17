import { type ReactNode, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '@/theme';

/** Room the "Show" / "Hide" toggle needs inside the field. */
const TRAILING_WIDTH = 60;

export interface TextFieldProps extends Omit<TextInputProps, 'style' | 'secureTextEntry'> {
  label?: string;
  /** Message under the field. Drawn in the error colour and outlines the input. */
  error?: string;
  /** Outlines the input without a message — the sign-in password, whose message
   *  sits in the row below it alongside "Forgot password?". */
  invalid?: boolean;
  /** Also fills the errored field with the error tint. The handoff does this on
   *  the mobile-number field only. */
  tinted?: boolean;
  /** Draws the border in brand cyan — the handoff marks a password field that
   *  has been typed into this way, before the rules below say whether it passes. */
  accent?: boolean;
  /** Message under the field when there is no error. Drawn muted. */
  helper?: string;
  /** Adds a "Show" / "Hide" toggle and starts the field masked. */
  password?: boolean;
  /** Anything else that sits inside the field, right-aligned. */
  trailing?: ReactNode;
  /** 52 instead of 56 — the set-up fee card fields. */
  compact?: boolean;
  containerStyle?: ViewStyle;
}

/**
 * Label, input, and a helper or error line: the form row the handoff repeats on
 * every onboarding screen. An error swaps the border to the error colour and
 * the message under it; the geometry never changes, so nothing jumps.
 */
export function TextField({
  label,
  error,
  invalid = false,
  tinted = false,
  accent = false,
  helper,
  password = false,
  trailing,
  compact = false,
  containerStyle,
  ...inputProps
}: TextFieldProps) {
  const { border, colors, radius, size, spacing, text } = useTheme();
  const [revealed, setRevealed] = useState(false);
  const hasTrailing = password || trailing !== undefined;
  const message = error ?? helper;
  const showsError = Boolean(error) || invalid;

  return (
    <View style={containerStyle}>
      {label ? (
        <Text style={[text.label, { color: colors.textMuted, marginBottom: spacing.md }]}>
          {label}
        </Text>
      ) : null}

      <View style={styles.field}>
        <TextInput
          {...inputProps}
          secureTextEntry={password && !revealed}
          placeholderTextColor={colors.textPlaceholder}
          accessibilityLabel={inputProps.accessibilityLabel ?? label}
          style={[
            text.input,
            {
              height: compact ? size.inputSm : size.input,
              paddingLeft: spacing.xl,
              paddingRight: hasTrailing ? TRAILING_WIDTH + spacing.xl : spacing.xl,
              borderRadius: radius.lg,
              borderWidth: accent ? border.strong : border.hairline,
              borderColor: showsError
                ? colors.errorBorder
                : accent
                  ? colors.primary
                  : colors.border,
              backgroundColor: showsError && tinted ? colors.errorSoft : colors.surface,
              color: showsError && tinted ? colors.error : colors.textPrimary,
            },
          ]}
        />

        {password ? (
          <Pressable
            onPress={() => setRevealed((on) => !on)}
            hitSlop={spacing.md}
            accessibilityRole="button"
            style={[styles.trailing, { right: spacing.lgXl }]}
          >
            <Text style={[text.linkLg, { color: colors.link }]}>{revealed ? 'Hide' : 'Show'}</Text>
          </Pressable>
        ) : null}
        {trailing ? (
          <View style={[styles.trailing, { right: spacing.lgXl }]}>{trailing}</View>
        ) : null}
      </View>

      {message ? (
        <Text
          style={[
            text.caption,
            { color: error ? colors.error : colors.textMuted, marginTop: spacing.md },
          ]}
        >
          {message}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { justifyContent: 'center' },
  trailing: { position: 'absolute' },
});
