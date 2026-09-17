import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';

export interface StatusScreenProps {
  /** `success` is a brand circle with a tick, `error` a pink circle with a bang. */
  tone?: 'success' | 'error';
  /** Glyph in the circle. Defaults to ✓ for success and ! for error. */
  glyph?: string;
  /** 82pt circle, or 64pt inside the payment states. */
  compact?: boolean;
  title: string;
  /** A phrase inside `title` drawn in brand cyan (or the error colour). */
  highlight?: string;
  body?: string;
  /** Progress bar, stage caption, buttons — whatever the screen adds below. */
  children?: ReactNode;
}

/**
 * The centred "you're all set" / "that didn't match" layout: a circle, a title
 * with one highlighted phrase, a paragraph, and whatever the screen stacks
 * under it. Six screens in the handoff share this shape.
 */
export function StatusScreen({
  tone = 'success',
  glyph,
  compact = false,
  title,
  highlight,
  body,
  children,
}: StatusScreenProps) {
  const { colors, radius, size, spacing, text } = useTheme();
  const insets = useSafeAreaInsets();
  const at = highlight ? title.indexOf(highlight) : -1;
  const diameter = compact ? size.statusCircleSm : size.statusCircle;
  const accent = tone === 'success' ? colors.accentText : colors.error;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingHorizontal: spacing.huge + spacing.sm,
          paddingTop: insets.top,
          paddingBottom: insets.bottom + spacing.xxl,
          gap: spacing.xxlXxxl,
        },
      ]}
    >
      <View
        style={[
          styles.circle,
          {
            width: diameter,
            height: diameter,
            borderRadius: radius.pill,
            backgroundColor: tone === 'success' ? colors.primary : colors.errorSoft,
          },
        ]}
      >
        <Text
          style={[
            compact ? text.statusGlyphSm : text.statusGlyph,
            { color: tone === 'success' ? colors.onPrimary : colors.error },
          ]}
        >
          {glyph ?? (tone === 'success' ? '✓' : '!')}
        </Text>
      </View>

      <Text
        accessibilityRole="header"
        style={[compact ? text.h2 : text.h1Status, styles.centred, { color: colors.textPrimary }]}
      >
        {highlight && at >= 0 ? (
          <>
            {title.slice(0, at)}
            <Text style={{ color: accent }}>{highlight}</Text>
            {title.slice(at + highlight.length)}
          </>
        ) : (
          title
        )}
      </Text>

      {body ? (
        <Text
          style={[compact ? text.bodySm : text.lead, styles.centred, { color: colors.textMuted }]}
        >
          {body}
        </Text>
      ) : null}

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  circle: { alignItems: 'center', justifyContent: 'center' },
  centred: { textAlign: 'center' },
});
