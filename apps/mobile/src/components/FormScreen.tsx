import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';

export interface FormScreenProps {
  /** `StageHeader` or a back button — pinned above the scrolling body. */
  header?: ReactNode;
  /** The sticky CTA. Wrap it in `FooterBar` when the body scrolls under it. */
  footer?: ReactNode;
  /** Vertical gap between children. Defaults to none; most screens set their own. */
  gap?: number;
  children: ReactNode;
}

/**
 * The frame every onboarding and auth form sits in: background, gutters, a
 * pinned header, a scrolling body and a footer that stays above the keyboard.
 *
 * The handoff prototypes a fake on-screen keyboard and lifts the CTA by a fixed
 * 230px. That is a browser workaround — here the real keyboard reports its own
 * height, so `KeyboardAvoidingView` does the same job correctly on both
 * platforms and at every text size.
 */
export function FormScreen({ header, footer, gap, children }: FormScreenProps) {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {header ? <View style={{ paddingHorizontal: spacing.gutter }}>{header}</View> : null}

      <ScrollView
        style={styles.scroll}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          gap,
          paddingHorizontal: spacing.gutter,
          paddingTop: spacing.xl,
          // Without a footer the CTA is the last child, and it needs the inset.
          paddingBottom: footer ? spacing.xxl : insets.bottom + spacing.giant,
        }}
      >
        {children}
      </ScrollView>

      {footer}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
});
