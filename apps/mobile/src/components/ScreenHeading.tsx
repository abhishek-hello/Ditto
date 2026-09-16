import { Text, View } from 'react-native';
import { useTheme } from '@/theme';

export interface ScreenHeadingProps {
  title: string;
  /** A phrase inside `title` drawn in the link colour ("merchant", "Sign in"). */
  highlight?: string;
  subtitle?: string;
}

/**
 * The heading block that opens auth and onboarding screens: an h1 with one
 * highlighted phrase, and a lead subtitle below it (Figma 1:165000, 1:164310).
 */
export function ScreenHeading({ title, highlight, subtitle }: ScreenHeadingProps) {
  const { colors, spacing, text } = useTheme();
  const at = highlight ? title.indexOf(highlight) : -1;

  return (
    <View style={{ gap: spacing.md }}>
      <Text accessibilityRole="header" style={[text.h1, { color: colors.textPrimary }]}>
        {highlight && at >= 0 ? (
          <>
            {title.slice(0, at)}
            <Text style={{ color: colors.link }}>{highlight}</Text>
            {title.slice(at + highlight.length)}
          </>
        ) : (
          title
        )}
      </Text>
      {subtitle ? <Text style={[text.lead, { color: colors.textMuted }]}>{subtitle}</Text> : null}
    </View>
  );
}
