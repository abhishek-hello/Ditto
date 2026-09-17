import { Text, View } from 'react-native';
import { useTheme } from '@/theme';

type HeadingSize = 'lg' | 'md' | 'sm';

export interface ScreenHeadingProps {
  title: string;
  /** A phrase inside `title` drawn in the brand colour ("merchant", "in"). */
  highlight?: string;
  subtitle?: string;
  /** lg 32 ("Sign in"), md 30 (most screens), sm 28 (long titles that wrap). */
  size?: HeadingSize;
}

/**
 * The heading block that opens every auth and onboarding screen: a title with
 * one phrase in brand cyan, and an optional lead paragraph under it.
 */
export function ScreenHeading({ title, highlight, subtitle, size = 'md' }: ScreenHeadingProps) {
  const { colors, spacing, text } = useTheme();
  const at = highlight ? title.indexOf(highlight) : -1;
  const titleStyle = { lg: text.h1Lg, md: text.h1, sm: text.h1Sm }[size];

  return (
    <View style={{ gap: spacing.md }}>
      <Text accessibilityRole="header" style={[titleStyle, { color: colors.textPrimary }]}>
        {highlight && at >= 0 ? (
          <>
            {title.slice(0, at)}
            <Text style={{ color: colors.accentText }}>{highlight}</Text>
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
