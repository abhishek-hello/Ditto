import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { ProgressSegments } from '@/components/ProgressSegments';
import { StatusScreen } from '@/components/StatusScreen';
import { useTheme } from '@/theme';

/** Stage 1 complete: the hand-off into identity verification. */
export default function CreateAccountCompleteScreen() {
  const { colors, spacing, text } = useTheme();
  const router = useRouter();

  return (
    <StatusScreen
      title="You're all set"
      highlight="set"
      body="Fantastic — your account setup stage is complete. Next we'll verify your identity. It only takes a moment."
    >
      <View style={{ alignSelf: 'stretch', gap: spacing.xxlXxxl, marginTop: spacing.sm }}>
        <ProgressSegments fills={[1, 0, 0, 0]} />
        <Text style={[text.caption, { color: colors.textMuted, textAlign: 'center' }]}>
          Stage 1 of 4 complete · Account creation
        </Text>
        <Button
          label="Continue"
          onPress={() => router.push('/(onboarding)/create-account/home-address')}
        />
      </View>
    </StatusScreen>
  );
}
