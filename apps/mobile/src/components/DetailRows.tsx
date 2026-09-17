import { Fragment, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme';

interface DetailRow {
  /** Stable key. Rows can repeat a value ("£5.00 + VAT" twice), so the value
   *  alone will not do. */
  id: string;
  /** A node so a label can carry a muted "(one-off)" qualifier. */
  label: ReactNode;
  value: string;
  /** Total row: subtle fill and a heavier label. */
  total?: boolean;
}

export interface DetailRowsProps {
  rows: DetailRow[];
}

/** The bordered fee table: label on the left, value on the right, hairlines between. */
export function DetailRows({ rows }: DetailRowsProps) {
  const { border, colors, radius, spacing, text } = useTheme();

  return (
    <View
      style={{
        borderRadius: radius.xl,
        borderWidth: border.hairline,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        overflow: 'hidden',
      }}
    >
      {rows.map((row, index) => (
        <Fragment key={row.id}>
          {index > 0 ? (
            <View style={{ height: border.hairline, backgroundColor: colors.divider }} />
          ) : null}
          <View
            style={[
              styles.row,
              {
                gap: spacing.lg,
                paddingVertical: spacing.xl,
                paddingHorizontal: spacing.xlXxl,
                backgroundColor: row.total ? colors.surfaceSubtle : colors.surface,
              },
            ]}
          >
            {typeof row.label === 'string' ? (
              <Text
                style={[
                  row.total ? text.value : text.body,
                  styles.label,
                  { color: row.total ? colors.textPrimary : colors.textSecondary },
                ]}
              >
                {row.label}
              </Text>
            ) : (
              <View style={styles.label}>{row.label}</View>
            )}
            <Text style={[text.value, { color: colors.textPrimary }]}>{row.value}</Text>
          </View>
        </Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  label: { flex: 1 },
});
