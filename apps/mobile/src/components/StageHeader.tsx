import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackButton } from '@/components/BackButton';
import { useTheme } from '@/theme';

const STAGE_NUMBERS = [1, 2, 3, 4] as const;
/** Figma 1:165000: progress segment height. */
const SEGMENT_HEIGHT = 4;

export interface StageHeaderProps {
  /** 1-based stage number. */
  stage: number;
  label: string;
  /** 1-based step within the stage. Omitted until a screen's frame confirms it. */
  step?: number;
  stepCount?: number;
  onBack: () => void;
}

/** Earlier stages are full, the current one shows step progress, later ones are empty. */
function segmentFill(segment: number, stage: number, currentFill: number): number {
  if (segment < stage) return 1;
  return segment === stage ? currentFill : 0;
}

/**
 * Onboarding header (Figma 1:165000): back button, one progress segment per
 * stage, and "Stage N of 4 · Label — step N of M".
 */
export function StageHeader({ stage, label, step, stepCount, onBack }: StageHeaderProps) {
  const insets = useSafeAreaInsets();
  const { colors, radius, spacing, text } = useTheme();
  const hasStep = step !== undefined && stepCount !== undefined;
  const currentFill = hasStep ? step / stepCount : 0;

  return (
    <View
      style={{
        // The frame reserves a 44pt status bar and sits the back button 4 below it.
        paddingTop: insets.top + spacing.xs,
        paddingHorizontal: spacing.gutter,
        paddingBottom: spacing.xl,
        backgroundColor: colors.background,
      }}
    >
      <BackButton onPress={onBack} />

      <View style={[styles.segments, { gap: spacing.xs, marginTop: spacing.sm }]}>
        {STAGE_NUMBERS.map((segment) => (
          <View
            key={segment}
            style={[styles.segment, { borderRadius: radius.pill, backgroundColor: colors.surface }]}
          >
            <View
              style={[
                styles.fill,
                {
                  width: `${segmentFill(segment, stage, currentFill) * 100}%`,
                  backgroundColor: colors.accentText,
                },
              ]}
            />
          </View>
        ))}
      </View>

      <Text style={[text.detail, { color: colors.textMuted, marginTop: spacing.sm }]}>
        Stage {stage} of {STAGE_NUMBERS.length} · {label}
        {hasStep ? ` — step ${step} of ${stepCount}` : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  segments: { flexDirection: 'row' },
  segment: { flex: 1, height: SEGMENT_HEIGHT, overflow: 'hidden' },
  fill: { height: SEGMENT_HEIGHT },
});
