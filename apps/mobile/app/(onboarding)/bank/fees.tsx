import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { DetailRows } from '@/components/DetailRows';
import { FormScreen } from '@/components/FormScreen';
import { ScreenHeading } from '@/components/ScreenHeading';
import { StageHeader } from '@/components/StageHeader';
import { useTheme } from '@/theme';

/**
 * Stage 4, step 5: the fee schedule and the two authorisations it needs — the
 * terms themselves, and the Variable Direct Debit that collects the usage fee.
 * Both have to be ticked; neither is pre-ticked.
 */
export default function FeesScreen() {
  const { colors, spacing, text } = useTheme();
  const router = useRouter();
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedDirectDebit, setAgreedDirectDebit] = useState(false);

  const qualifier = (label: string, note: string) => (
    <Text style={[text.body, { color: colors.textSecondary }]}>
      {label} <Text style={{ color: colors.textMuted }}>{note}</Text>
    </Text>
  );

  return (
    <FormScreen header={<StageHeader label="Stage 4 of 4 · Bank verification — step 5 of 11" />}>
      <View style={{ gap: spacing.sm }}>
        <ScreenHeading
          title="Please authorise account fees"
          highlight="account fees"
          subtitle="There are no fixed transaction-based fees."
        />
      </View>

      <View style={{ marginTop: spacing.xlXxl, marginBottom: spacing.xxl }}>
        <DetailRows
          rows={[
            { id: 'usage', label: 'Usage fee', value: '0.90% of payments' },
            {
              id: 'team-member',
              label: qualifier('New team member', '(one-off)'),
              value: '£5.00 + VAT',
            },
            {
              id: 'rewards',
              label: qualifier('Rewards programme', '(monthly)'),
              value: '£5.00 + VAT',
            },
          ]}
        />
      </View>

      <Checkbox
        checked={agreedTerms}
        onToggle={() => setAgreedTerms((on) => !on)}
        accessibilityLabel="I agree to the DittoPay Terms and Conditions"
      >
        <Text style={[text.bodyXs, styles.consent, { color: colors.textSecondary }]}>
          I agree to the DittoPay{' '}
          <Text style={[text.hint, { color: colors.link }]}>Terms and Conditions</Text>.
        </Text>
      </Checkbox>

      <View style={{ height: spacing.lgXl }} />

      <Checkbox
        checked={agreedDirectDebit}
        onToggle={() => setAgreedDirectDebit((on) => !on)}
        accessibilityLabel="I authorise the weekly usage fee by Variable Direct Debit"
      >
        <Text style={[text.bodyXs, styles.consent, { color: colors.textSecondary }]}>
          I authorise DittoPay to collect the weekly usage fee by Variable Direct Debit under the
          terms of the{' '}
          <Text style={[text.hint, { color: colors.link }]}>Variable Direct Debit Guarantee</Text>.
        </Text>
      </Checkbox>

      <View style={styles.spacer} />

      <Button
        label="Authorise & Confirm"
        disabled={!agreedTerms || !agreedDirectDebit}
        onPress={() => router.push('/(onboarding)/bank/setup-fee')}
      />
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  consent: { lineHeight: 22 },
  spacer: { flex: 1, minHeight: 24 },
});
