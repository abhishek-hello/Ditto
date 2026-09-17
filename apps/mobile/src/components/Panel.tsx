import type { ReactNode } from 'react';
import { Text, View, type ViewStyle } from 'react-native';
import { useTheme } from '@/theme';

export interface PanelProps {
  /** Body copy. Pass `children` instead when the panel holds more than a paragraph. */
  children: ReactNode;
  style?: ViewStyle;
}

/**
 * The muted rounded block the handoff uses for a summary or an explanatory note
 * ("Skipping turns rewards off…", the points and visits summaries).
 */
export function Panel({ children, style }: PanelProps) {
  const { colors, radius, spacing, text } = useTheme();

  return (
    <View
      style={[
        {
          padding: spacing.xlXxl,
          borderRadius: radius.lg,
          backgroundColor: colors.surfaceMuted,
        },
        style,
      ]}
    >
      {typeof children === 'string' ? (
        <Text style={[text.body, { color: colors.textPrimary }]}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}
