import { formatPence, pence } from '@ditto/core';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { DetailRows } from '@/components/DetailRows';
import { FormScreen } from '@/components/FormScreen';
import { Overline } from '@/components/Overline';
import { ScreenHeading } from '@/components/ScreenHeading';
import { StageHeader } from '@/components/StageHeader';
import { TextField } from '@/components/TextField';
import { useTheme } from '@/theme';

/** Integer pence, per AGENTS.md rule 1. Formatted only where it is drawn. */
const ONBOARDING_FEE = pence(2500);
const WAIVED = pence(0);

/** TODO: validate against the promotions API; hard-coded while there isn't one. */
const VALID_CODE = 'DITTO25';

/** Shortest card number any scheme issues. */
const MIN_CARD_DIGITS = 15;
const MIN_CVC_DIGITS = 3;

/**
 * Stage 4, step 6: the one-off onboarding fee.
 *
 * The card fields are laid out as the handoff draws them. They are not wired to
 * Stripe — the next screen begins at "taking you to secure checkout" because
 * card details must be entered in Stripe's own SDK, never captured here.
 */
export default function SetupFeeScreen() {
  const { colors, spacing, text } = useTheme();
  const router = useRouter();
  const [code, setCode] = useState('');
  const [codeMessage, setCodeMessage] = useState('');
  const [waived, setWaived] = useState(false);
  const [card, setCard] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const payable =
    card.replace(/\s/g, '').length >= MIN_CARD_DIGITS &&
    expiry.length >= 4 &&
    cvc.length >= MIN_CVC_DIGITS;

  const applyCode = () => {
    if (code.trim() === VALID_CODE) {
      setWaived(true);
      setCodeMessage(`${VALID_CODE} applied — onboarding fee waived.`);
      return;
    }
    setWaived(false);
    setCodeMessage(code.trim() ? "That code isn't valid." : 'Enter a code first.');
  };

  return (
    <FormScreen header={<StageHeader label="Stage 4 of 4 · Bank verification — step 6 of 11" />}>
      <View style={{ gap: spacing.xs }}>
        <ScreenHeading
          title="Account set up fee"
          highlight="set up fee"
          subtitle="Thanks for joining DittoPay. This is a one-off fee."
        />
      </View>

      <View style={{ marginTop: spacing.xlXxl, marginBottom: spacing.xxl }}>
        <DetailRows
          rows={[
            {
              id: 'onboarding-fee',
              label: (
                <Text style={[text.body, { color: colors.textSecondary }]}>
                  Onboarding fee <Text style={{ color: colors.textMuted }}>(incl. VAT)</Text>
                </Text>
              ),
              value: formatPence(ONBOARDING_FEE),
            },
            {
              id: 'total',
              label: 'Total due today',
              value: formatPence(waived ? WAIVED : ONBOARDING_FEE),
              total: true,
            },
          ]}
        />
      </View>

      <Overline style={{ marginBottom: spacing.mdLg }}>Discount code</Overline>
      <View style={[styles.row, { gap: spacing.mdLg }]}>
        <TextField
          value={code}
          onChangeText={(next) => {
            setCode(next.toUpperCase());
            setCodeMessage('');
          }}
          placeholder="Enter code"
          autoCapitalize="characters"
          autoCorrect={false}
          accessibilityLabel="Discount code"
          compact
          containerStyle={styles.codeField}
        />
        <Button
          label="Apply"
          variant="inverse"
          size="sm"
          onPress={applyCode}
          style={styles.apply}
        />
      </View>
      {codeMessage ? (
        <Text
          style={[text.link, { color: waived ? colors.link : colors.error, marginTop: spacing.sm }]}
        >
          {codeMessage}
        </Text>
      ) : null}

      <Overline style={{ marginTop: spacing.xlXxl, marginBottom: spacing.mdLg }}>
        Card details
      </Overline>
      <TextField
        value={card}
        onChangeText={(next) => setCard(next.replace(/[^\d ]/g, '').slice(0, 19))}
        placeholder="Card number"
        keyboardType="number-pad"
        autoComplete="cc-number"
        accessibilityLabel="Card number"
        compact
        containerStyle={{ marginBottom: spacing.mdLg }}
      />
      <View style={[styles.row, { gap: spacing.mdLg }]}>
        <TextField
          value={expiry}
          onChangeText={(next) => setExpiry(next.slice(0, 7))}
          placeholder="MM / YY"
          keyboardType="numbers-and-punctuation"
          autoComplete="cc-exp"
          accessibilityLabel="Card expiry"
          compact
          containerStyle={styles.half}
        />
        <TextField
          value={cvc}
          onChangeText={(next) => setCvc(next.replace(/\D/g, '').slice(0, 4))}
          placeholder="CVC"
          keyboardType="number-pad"
          autoComplete="cc-csc"
          accessibilityLabel="Card security code"
          compact
          containerStyle={styles.half}
        />
      </View>
      <Text style={[text.captionXs, { color: colors.textMuted, marginTop: spacing.md }]}>
        Payments securely processed by Stripe.
      </Text>

      <View style={styles.spacer} />

      <Button
        label="Pay & Activate Account"
        variant="inverse"
        disabled={!payable}
        onPress={() => router.push('/(onboarding)/bank/payment')}
      />
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  codeField: { flex: 1, minWidth: 0 },
  apply: { width: 96, alignSelf: 'auto' },
  half: { flex: 1, minWidth: 0 },
  spacer: { flex: 1, minHeight: 24 },
});
