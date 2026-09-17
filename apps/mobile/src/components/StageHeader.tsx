import { useRouter } from 'expo-router';
import { Text, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackButton } from '@/components/BackButton';
import { ProgressSegments } from '@/components/ProgressSegments';
import { useTheme } from '@/theme';

export interface StageHeaderProps {
  /** One entry per stage, 0–1 filled. Omit on screens the handoff draws without a bar. */
  fills?: readonly number[];
  /** "Stage 1 of 4 · Account creation — step 1 of 10". Written out, not derived:
   *  the handoff's own captions disagree with a formula in several places. */
  label?: string;
  /** Overrides going back in history — used where the handoff jumps elsewhere. */
  onBack?: () => void;
  style?: ViewStyle;
}

/**
 * Back button, stage progress and caption: the block that opens every
 * onboarding screen. Each screen passes its own fills and caption because the
 * handoff varies both per step, and two screens relabel the stage entirely.
 */
export function StageHeader({ fills, label, onBack, style }: StageHeaderProps) {
  const { colors, spacing, text } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // A deep link straight into a step has no history; the index route decides where to go.
  const goBack = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')));

  return (
    <View style={[{ paddingTop: insets.top + spacing.md }, style]}>
      <BackButton onPress={goBack} />
      {fills ? <ProgressSegments fills={fills} style={{ marginTop: spacing.xlXxl }} /> : null}
      {label ? (
        <Text
          style={[
            text.bodySm,
            { color: colors.textMuted, marginTop: fills ? spacing.mdLg : spacing.xl },
          ]}
        >
          {label}
        </Text>
      ) : null}
    </View>
  );
}
