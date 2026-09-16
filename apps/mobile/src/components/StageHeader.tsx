import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';

const STAGE_COUNT = 4;

export interface StageHeaderProps {
  /** 1-based stage number. */
  stage: number;
  label: string;
}

/** Onboarding "Stage N of 4 · Label" header with a simple progress bar. */
export function StageHeader({ stage, label }: StageHeaderProps) {
  const insets = useSafeAreaInsets();
  const { colors, spacing, radius, text } = useTheme();

  return (
    <View
      style={{
        paddingTop: insets.top + spacing.lg,
        paddingHorizontal: spacing.gutter,
        paddingBottom: spacing.lg,
        gap: spacing.md,
        backgroundColor: colors.background,
      }}
    >
      <Text style={[text.overline, { color: colors.textMuted }]}>
        Stage {stage} of {STAGE_COUNT} · {label}
      </Text>
      <View style={[styles.track, { borderRadius: radius.pill, backgroundColor: colors.surface }]}>
        <View
          style={[
            styles.fill,
            { width: `${(stage / STAGE_COUNT) * 100}%`, backgroundColor: colors.primary },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 4, overflow: 'hidden' },
  fill: { height: 4 },
});
