import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme';

export interface CheckboxProps {
  checked: boolean;
  /** Omitted for the read-only tick beside the terms progress line. */
  onToggle?: () => void;
  /** Label beside the box. A node so a label can carry an inline link. */
  children?: ReactNode;
  accessibilityLabel?: string;
}

/** Square tick box: brand fill when checked, white with a 1.5 outline when not. */
export function Checkbox({ checked, onToggle, children, accessibilityLabel }: CheckboxProps) {
  const { border, colors, radius, size, spacing, text } = useTheme();

  const box = (
    <View
      style={[
        styles.box,
        {
          width: size.checkbox,
          height: size.checkbox,
          borderRadius: radius.xs,
          borderWidth: border.strong,
          borderColor: checked ? colors.primary : colors.borderStrong,
          backgroundColor: checked ? colors.primary : colors.surface,
        },
      ]}
    >
      {checked ? <Text style={[text.label, { color: colors.onPrimary }]}>✓</Text> : null}
    </View>
  );

  if (!onToggle) return box;

  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [styles.row, { gap: spacing.lg, opacity: pressed ? 0.85 : 1 }]}
    >
      {box}
      {children ? <View style={styles.label}>{children}</View> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  label: { flex: 1 },
});
