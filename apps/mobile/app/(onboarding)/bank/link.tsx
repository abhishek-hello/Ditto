import { isValidAccountNumber, normaliseSortCode } from '@ditto/core';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { CodeInput } from '@/components/CodeInput';
import { FormScreen } from '@/components/FormScreen';
import { ScreenHeading } from '@/components/ScreenHeading';
import { StageHeader } from '@/components/StageHeader';
import { TextField } from '@/components/TextField';
import { useTheme } from '@/theme';

/** Shortest name we will send for a match check. */
const MIN_HOLDER_LENGTH = 3;

/**
 * Stage 4, step 1: the account payouts and fees run through.
 *
 * TODO: the holder name is checked against Confirmation of Payee, which has no
 * endpoint yet. Until it does, review moves straight on; the mismatch screen is
 * reachable in dev with `?state=mismatch` and carries the attempt counter.
 */
export default function BankLinkScreen() {
  const { colors, spacing, text } = useTheme();
  const router = useRouter();
  const { attempt = '1', state } = useLocalSearchParams<{ attempt?: string; state?: string }>();
  const forceMismatch = __DEV__ && state === 'mismatch';
  const [sortCode, setSortCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [holder, setHolder] = useState('');

  const complete =
    normaliseSortCode(sortCode) !== null &&
    isValidAccountNumber(accountNumber) &&
    holder.trim().length > MIN_HOLDER_LENGTH;

  return (
    <FormScreen
      header={
        <StageHeader
          fills={[1, 1, 1, 0.09]}
          label="Stage 4 of 4 · Bank verification — step 1 of 11"
        />
      }
    >
      <ScreenHeading
        title="Link your bank account"
        highlight="bank account"
        subtitle="All incoming payments and DittoPay fees will go through this account."
      />

      <Text style={[text.label, { color: colors.textMuted, marginTop: spacing.xxl }]}>
        Sort code
      </Text>
      <CodeInput
        variant="sortCode"
        value={sortCode}
        onChangeText={setSortCode}
        accessibilityLabel="Sort code"
        style={{ marginTop: spacing.md, marginBottom: spacing.xxl }}
      />

      <Text style={[text.label, { color: colors.textMuted }]}>Account number</Text>
      <CodeInput
        variant="accountNumber"
        value={accountNumber}
        onChangeText={setAccountNumber}
        accessibilityLabel="Account number"
        style={{ marginTop: spacing.md, marginBottom: spacing.xxl }}
      />

      <TextField
        label="Account holder name"
        value={holder}
        onChangeText={setHolder}
        placeholder="Jo Marlow"
        autoComplete="name"
        helper="Must exactly match the name on the account — we check this before linking."
      />

      <View style={styles.spacer} />

      <Button
        label="Review details"
        disabled={!complete}
        onPress={() =>
          forceMismatch
            ? router.push({ pathname: '/(onboarding)/bank/result', params: { attempt } })
            : router.push('/(onboarding)/bank/rewards-setup')
        }
      />
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  spacer: { flex: 1, minHeight: 24 },
});
