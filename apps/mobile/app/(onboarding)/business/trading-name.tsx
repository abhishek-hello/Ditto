import { formatPence, pence } from '@ditto/core';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { FormScreen } from '@/components/FormScreen';
import { Overline } from '@/components/Overline';
import { ScreenHeading } from '@/components/ScreenHeading';
import { StageHeader } from '@/components/StageHeader';
import { TextField } from '@/components/TextField';
import { useTheme } from '@/theme';

const MAX_LENGTH = 34;
/** Illustrative amount on the preview card. Integer pence, per AGENTS.md rule 1. */
const SAMPLE_AMOUNT = pence(4500);
/** Shown when the field is empty — the handoff falls back to the legal name. */
const FALLBACK_NAME = 'Jo Marlow';

/**
 * Stage 3, step 2: the customer-facing trading name, with a live preview of the
 * payment screen a customer sees.
 */
export default function TradingNameScreen() {
  const { border, colors, radius, spacing, text } = useTheme();
  const router = useRouter();
  const [tradingName, setTradingName] = useState('');
  const preview = tradingName.trim() || FALLBACK_NAME;

  return (
    <FormScreen
      header={
        <StageHeader
          fills={[1, 1, 0.66, 0]}
          label="Stage 3 of 4 · Business details — step 2 of 3"
        />
      }
    >
      <ScreenHeading
        title="Your trading name"
        highlight="trading name"
        subtitle="This is the name your customers will see. Leave it blank if you don't have one."
      />

      <TextField
        label="Trading name (optional)"
        value={tradingName}
        onChangeText={(next) => setTradingName(next.slice(0, MAX_LENGTH))}
        placeholder="Marlow Electrical"
        maxLength={MAX_LENGTH}
        containerStyle={{ marginTop: spacing.xxl }}
      />
      <Text style={[text.link, { color: colors.link, marginTop: spacing.md }]}>
        {MAX_LENGTH - tradingName.length} characters left
      </Text>

      <Overline style={{ marginTop: spacing.xxlXxxl, marginBottom: spacing.mdLg }}>
        How this looks to a paying customer
      </Overline>

      <View
        style={[
          styles.preview,
          {
            paddingTop: spacing.xxlXxxl,
            paddingHorizontal: spacing.xxl,
            paddingBottom: spacing.huge,
            borderRadius: radius.xxl,
            borderWidth: border.hairline,
            borderColor: colors.border,
            backgroundColor: colors.surface,
          },
        ]}
      >
        <Overline>Amount to pay</Overline>
        <Text style={[text.amount, { color: colors.accentText, marginTop: spacing.md }]}>
          {formatPence(SAMPLE_AMOUNT)}
        </Text>
        <Text
          style={[
            styles.centred,
            text.amountCaption,
            { color: colors.textPrimary, marginTop: spacing.mdLg },
          ]}
        >
          {preview}
        </Text>
      </View>

      <View style={styles.spacer} />

      <Button label="Continue" onPress={() => router.push('/(onboarding)/business/complete')} />
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  preview: { alignItems: 'center' },
  centred: { textAlign: 'center' },
  spacer: { flex: 1, minHeight: 24 },
});
