import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '@/components/Button';
import { FormScreen } from '@/components/FormScreen';
import { PasswordRules, passwordMeetsPolicy } from '@/components/PasswordRules';
import { ScreenHeading } from '@/components/ScreenHeading';
import { StageHeader } from '@/components/StageHeader';
import { TextField } from '@/components/TextField';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/theme';

/** Stage 1, step 6: choose a password, with the policy ticking live. */
export default function CreatePasswordScreen() {
  const { spacing } = useTheme();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const valid = passwordMeetsPolicy(password);

  const onContinue = async () => {
    if (!valid || busy) return;
    setBusy(true);
    // The verification step left a session behind, so this sets the password on
    // the account that was just created.
    await supabase.auth.updateUser({ password }).catch(() => undefined);
    setBusy(false);
    router.push('/(onboarding)/create-account/complete');
  };

  return (
    <FormScreen
      header={
        <StageHeader
          fills={[0.6, 0, 0, 0]}
          label="Stage 1 of 4 · Account creation — step 6 of 10"
        />
      }
    >
      <ScreenHeading title="Create a password" highlight="password" />

      <TextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Choose a password"
        password
        accent={password.length > 0}
        autoComplete="new-password"
        textContentType="newPassword"
        containerStyle={{ marginTop: spacing.xxl, marginBottom: spacing.xxlXxxl }}
      />

      <PasswordRules password={password} />

      <View style={styles.spacer} />

      <Button label="Continue" disabled={!valid || busy} onPress={onContinue} />
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  spacer: { flex: 1, minHeight: 24 },
});
