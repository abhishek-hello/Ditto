import { isEmail } from '@ditto/core';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '@/components/Button';
import { FormScreen } from '@/components/FormScreen';
import { ScreenHeading } from '@/components/ScreenHeading';
import { StageHeader } from '@/components/StageHeader';
import { TextField } from '@/components/TextField';
import { useTheme } from '@/theme';

const MISMATCH = 'Your email addresses do not match. Please try again.';

/** Stage 1, step 3: the email, typed twice. */
export default function EmailScreen() {
  const { spacing } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [confirm, setConfirm] = useState('');

  // Silent until there is something to compare — a mismatch on the first
  // keystroke of the second field is noise, not help.
  const mismatch = confirm.length > 0 && confirm !== email;
  const complete = isEmail(email) && email === confirm;

  return (
    <FormScreen
      header={
        <StageHeader
          fills={[0.3, 0, 0, 0]}
          label="Stage 1 of 4 · Account creation — step 3 of 10"
        />
      }
    >
      <ScreenHeading title="Your email" highlight="email" />

      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="you@business.co.uk"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        containerStyle={{ marginTop: spacing.xxl }}
      />

      <TextField
        label="Confirm email"
        value={confirm}
        onChangeText={setConfirm}
        placeholder="Retype your email"
        keyboardType="email-address"
        autoCapitalize="none"
        // No autofill here: the point of the field is that it is typed again.
        autoComplete="off"
        error={mismatch ? MISMATCH : undefined}
        tinted={mismatch}
        containerStyle={{ marginTop: spacing.xlXxl }}
      />

      <View style={styles.spacer} />

      <Button
        label="Continue"
        disabled={!complete}
        onPress={() =>
          router.push({
            pathname: '/(onboarding)/create-account/mobile',
            params: { email: email.trim() },
          })
        }
      />
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  spacer: { flex: 1, minHeight: 24 },
});
