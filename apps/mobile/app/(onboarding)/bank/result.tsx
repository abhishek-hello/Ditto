import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { StatusScreen } from '@/components/StatusScreen';
import { useTheme } from '@/theme';

/** After this many failed name checks the automatic path is closed. */
const MAX_ATTEMPTS = 3;

/**
 * Stage 4: the account holder name did not match.
 *
 * The match itself belongs to the bank's Confirmation of Payee check, which has
 * no API here yet, so this screen currently renders the failure the previous one
 * routes to. The attempt number arrives as a param so the count survives going
 * back and retrying.
 */
export default function BankResultScreen() {
  const { colors, radius, spacing, text } = useTheme();
  const router = useRouter();
  const { attempt = '1' } = useLocalSearchParams<{ attempt?: string }>();
  const attemptNumber = Math.min(MAX_ATTEMPTS, Math.max(1, Number(attempt) || 1));
  const lastAttempt = attemptNumber >= MAX_ATTEMPTS;

  return (
    <StatusScreen
      tone="error"
      title="That name didn't match"
      highlight="match"
      body="The account holder name you entered doesn't match the name on that bank account. Double-check it's spelled exactly as your bank has it."
    >
      <View
        style={{
          paddingVertical: spacing.mdLg,
          paddingHorizontal: spacing.xlXxl,
          borderRadius: radius.md,
          backgroundColor: colors.surfaceMuted,
        }}
      >
        <Text style={[text.bodyXs, { color: colors.textPrimary }]}>
          Attempt {attemptNumber} of {MAX_ATTEMPTS}
        </Text>
      </View>

      <View style={{ alignSelf: 'stretch', gap: spacing.xxl }}>
        <Button
          label="Try again"
          onPress={() =>
            lastAttempt
              ? router.replace('/(onboarding)/bank/help')
              : router.replace({
                  pathname: '/(onboarding)/bank/link',
                  params: { attempt: String(attemptNumber + 1), state: 'mismatch' },
                })
          }
        />
        <Button
          label="Get help before I try again"
          variant="plain"
          size="sm"
          onPress={() => router.push('/(onboarding)/bank/help')}
        />
      </View>
    </StatusScreen>
  );
}
