import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { ProgressSegments } from '@/components/ProgressSegments';
import { StatusScreen } from '@/components/StatusScreen';
import { useTheme } from '@/theme';

/** Stage 3 complete: the hand-off into bank verification. */
export default function BusinessCompleteScreen() {
  const { colors, spacing, text } = useTheme();
  const router = useRouter();

  return (
    <StatusScreen
      title="Fantastic!"
      highlight="!"
      body="Now let's connect your bank account so you can receive payments. It's very quick."
    >
      <View style={{ alignSelf: 'stretch', gap: spacing.xxlXxxl, marginTop: spacing.sm }}>
        <ProgressSegments fills={[1, 1, 1, 0]} />
        <Text style={[text.caption, { color: colors.textMuted, textAlign: 'center' }]}>
          Stage 3 of 4 complete · Business details
        </Text>
        <Button
          label="Connect Bank Account"
          onPress={() => router.push('/(onboarding)/bank/link')}
        />
      </View>
    </StatusScreen>
  );
}
