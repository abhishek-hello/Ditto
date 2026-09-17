import { StyleSheet, View, type ViewStyle } from 'react-native';
import { useTheme } from '@/theme';

export interface ProgressSegmentsProps {
  /** One entry per segment, 0–1 filled. The handoff states these per screen. */
  fills: readonly number[];
  /** 4pt instead of 5pt: the reset flow and the terms read-through. */
  compact?: boolean;
  style?: ViewStyle;
}

/** The segmented progress bar above an onboarding heading. */
export function ProgressSegments({ fills, compact = false, style }: ProgressSegmentsProps) {
  const { colors, radius, size, spacing } = useTheme();
  const height = compact ? size.progressSegmentSm : size.progressSegment;
  const total = fills.reduce((sum, fill) => sum + fill, 0);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: fills.length, now: Math.round(total * 100) / 100 }}
      style={[styles.row, { gap: compact ? spacing.md : spacing.mdLg }, style]}
    >
      {fills.map((fill, index) => (
        <View
          // The bar is positional and fixed-length per screen: index is the
          // segment's identity, and each segment is a stateless View.
          // biome-ignore lint/suspicious/noArrayIndexKey: positional by definition
          key={index}
          style={[
            styles.track,
            { height, borderRadius: radius.pill, backgroundColor: colors.border },
          ]}
        >
          <View
            style={{
              width: `${Math.min(1, Math.max(0, fill)) * 100}%`,
              height,
              borderRadius: radius.pill,
              backgroundColor: colors.primary,
            }}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  track: { flex: 1, overflow: 'hidden' },
});
