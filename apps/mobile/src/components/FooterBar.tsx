import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';

export interface FooterBarProps {
  children: ReactNode;
}

/**
 * Sticky CTA under a scrolling form: a hairline, a soft upward shadow, and the
 * safe-area inset. Screens whose content fits on one page put their button in
 * the flow instead — the handoff only pins it where the body scrolls.
 */
export function FooterBar({ children }: FooterBarProps) {
  const { border, colors, shadow, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        shadow.footer,
        {
          shadowColor: colors.textPrimary,
          paddingHorizontal: spacing.gutter,
          paddingTop: spacing.lg,
          paddingBottom: insets.bottom + spacing.lg,
          gap: spacing.mdLg,
          backgroundColor: colors.background,
          borderTopWidth: border.hairline,
          borderTopColor: colors.divider,
        },
      ]}
    >
      {children}
    </View>
  );
}
