import { ageInYears, parseUkDate } from '@ditto/core';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button } from '@/components/Button';
import { FormScreen } from '@/components/FormScreen';
import { ScreenHeading } from '@/components/ScreenHeading';
import { StageHeader } from '@/components/StageHeader';
import { TextField } from '@/components/TextField';
import { useTheme } from '@/theme';

const MINIMUM_AGE = 18;
/** Above this a date of birth is almost certainly a typo, not a customer. */
const MAXIMUM_AGE = 110;
const UNDERAGE = `You must be ${MINIMUM_AGE} or over to open a DittoPay account.`;

/** null until the field holds a complete date — nothing to complain about yet. */
function dateOfBirthError(value: string): string | null {
  const date = parseUkDate(value);
  if (!date) return null;
  const age = ageInYears(date);
  return age >= MINIMUM_AGE && age < MAXIMUM_AGE ? null : UNDERAGE;
}

/** Stage 1, step 2: the name and date of birth on the merchant's ID. */
export default function LegalNameScreen() {
  const { spacing } = useTheme();
  const router = useRouter();
  const [first, setFirst] = useState('');
  const [middle, setMiddle] = useState('');
  const [last, setLast] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  const dobError = dateOfBirthError(dateOfBirth);
  const complete =
    first.trim().length > 0 && last.trim().length > 0 && parseUkDate(dateOfBirth) !== null;

  return (
    <FormScreen
      header={
        <StageHeader
          fills={[0.2, 0, 0, 0]}
          label="Stage 1 of 4 · Account creation — step 2 of 10"
        />
      }
      gap={spacing.xl}
    >
      <ScreenHeading title="Your legal name" highlight="legal name" />

      <TextField
        label="First name"
        value={first}
        onChangeText={setFirst}
        placeholder="Jo"
        autoComplete="given-name"
        textContentType="givenName"
        containerStyle={{ marginTop: spacing.xs }}
      />
      <TextField
        label="Middle name (optional)"
        value={middle}
        onChangeText={setMiddle}
        autoComplete="name-middle"
        textContentType="middleName"
      />
      <TextField
        label="Last name"
        value={last}
        onChangeText={setLast}
        placeholder="Marlow"
        autoComplete="family-name"
        textContentType="familyName"
      />
      <TextField
        label="Date of birth"
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
        placeholder="DD / MM / YYYY"
        keyboardType="numbers-and-punctuation"
        autoComplete="birthdate-full"
        error={dobError ?? undefined}
        tinted={dobError !== null}
        helper="Autofill from your device is supported for name and date of birth."
      />

      <Button
        label="Continue"
        disabled={!complete || dobError !== null}
        onPress={() => router.push('/(onboarding)/create-account/email')}
        style={{ marginTop: spacing.md }}
      />
    </FormScreen>
  );
}
