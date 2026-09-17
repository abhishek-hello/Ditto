import { normaliseUkMobile } from '@ditto/core';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { FormScreen } from '@/components/FormScreen';
import { ScreenHeading } from '@/components/ScreenHeading';
import { SelectField, type SelectOption } from '@/components/SelectField';
import { StageHeader } from '@/components/StageHeader';
import { TextField } from '@/components/TextField';
import { useTheme } from '@/theme';

const INVALID = "That doesn't look like a valid UK mobile number.";
/** Width of the dial-code field in the handoff. */
const DIAL_WIDTH = 118;

/** UK only, like the country step — the rest are listed and disabled. */
const DIAL_CODES: SelectOption[] = [
  { value: '+44', label: '🇬🇧 +44' },
  { value: '+61', label: '+61 — coming soon', disabled: true },
  { value: '+353', label: '+353 — coming soon', disabled: true },
  { value: '+64', label: '+64 — coming soon', disabled: true },
  { value: '+1', label: '+1 — coming soon', disabled: true },
];

/** Stage 1, step 4: the mobile number a verification code can reach. */
export default function MobileScreen() {
  const { colors, spacing, text } = useTheme();
  const router = useRouter();
  // Carried forward so the verification step can address the code to it.
  const { email = '' } = useLocalSearchParams<{ email?: string }>();
  const [dialCode, setDialCode] = useState('+44');
  const [phone, setPhone] = useState('');

  const valid = normaliseUkMobile(phone) !== null;
  const invalid = phone.length > 0 && !valid;

  return (
    <FormScreen
      header={
        <StageHeader
          fills={[0.4, 0, 0, 0]}
          label="Stage 1 of 4 · Account creation — step 4 of 10"
        />
      }
    >
      <ScreenHeading title="Your mobile number" highlight="mobile number" />

      <Text style={[text.label, { color: colors.textMuted, marginTop: spacing.xxl }]}>
        Mobile number
      </Text>

      <View style={[styles.row, { gap: spacing.mdLg, marginTop: spacing.md }]}>
        <SelectField
          value={dialCode}
          options={DIAL_CODES}
          onChange={setDialCode}
          width={DIAL_WIDTH}
          sheetTitle="Country dialling code"
        />
        <TextField
          value={phone}
          onChangeText={setPhone}
          placeholder="07700 900123"
          keyboardType="phone-pad"
          autoComplete="tel"
          textContentType="telephoneNumber"
          accessibilityLabel="Mobile number"
          invalid={invalid}
          tinted={invalid}
          containerStyle={styles.phone}
        />
      </View>

      {invalid ? (
        <Text style={[text.caption, { color: colors.error, marginTop: spacing.md }]}>
          {INVALID}
        </Text>
      ) : null}

      <View style={styles.spacer} />

      <Button
        label="Continue"
        disabled={!valid}
        onPress={() =>
          router.push({
            pathname: '/(onboarding)/create-account/verify-mobile',
            params: { email, mobile: normaliseUkMobile(phone) ?? '' },
          })
        }
      />
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  phone: { flex: 1, minWidth: 0 },
  spacer: { flex: 1, minHeight: 24 },
});
