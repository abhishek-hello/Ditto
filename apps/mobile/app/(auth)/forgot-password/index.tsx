import { isEmail } from '@ditto/core';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '@/components/Button';
import { FormScreen } from '@/components/FormScreen';
import { ScreenHeading } from '@/components/ScreenHeading';
import { StageHeader } from '@/components/StageHeader';
import { TextField } from '@/components/TextField';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/theme';

/**
 * Reset step 1: take the email and send a 6-digit code.
 *
 * The request is fired and the flow continues either way — telling the user
 * whether an address has an account here would let anyone enumerate merchants.
 */
export default function ForgotPasswordScreen() {
  const { spacing } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSendCode = async () => {
    if (busy) return;
    if (!isEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }
    setBusy(true);
    await supabase.auth.resetPasswordForEmail(email.trim()).catch(() => undefined);
    setBusy(false);
    router.push({ pathname: '/(auth)/forgot-password/code', params: { email: email.trim() } });
  };

  return (
    <FormScreen header={<StageHeader />}>
      <ScreenHeading
        title="Reset your password"
        highlight="password"
        subtitle="Enter the email on your account and we'll send a 6-digit code."
      />

      <TextField
        label="Email"
        value={email}
        onChangeText={(next) => {
          setEmail(next);
          setError('');
        }}
        placeholder="you@business.co.uk"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        error={error || undefined}
        containerStyle={{ marginTop: spacing.huge }}
      />

      <View style={styles.spacer} />

      <Button label="Send code" onPress={onSendCode} disabled={busy} />
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  spacer: { flex: 1, minHeight: 24 },
});
