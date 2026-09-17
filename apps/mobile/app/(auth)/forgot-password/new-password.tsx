import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/Button';
import { FormScreen } from '@/components/FormScreen';
import { PasswordRules, passwordMeetsPolicy } from '@/components/PasswordRules';
import { ProgressSegments } from '@/components/ProgressSegments';
import { ScreenHeading } from '@/components/ScreenHeading';
import { TextField } from '@/components/TextField';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/theme';

/**
 * Reset step 3 of 3: the new password, with the policy ticking live.
 * The recovery code from step 2 leaves a session in place, so `updateUser` is
 * all that is needed to set the password.
 */
export default function NewPasswordScreen() {
  const { spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const valid = passwordMeetsPolicy(password);

  const onSave = async () => {
    if (!valid || busy) return;
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (!error) router.replace('/(tabs)/home');
  };

  return (
    <FormScreen
      header={
        // The one screen where the back button and the bar share a row.
        <View style={[styles.header, { paddingTop: insets.top + spacing.md, gap: spacing.lgXl }]}>
          <BackButton onPress={() => router.back()} />
          <ProgressSegments fills={[1, 1, 0]} compact style={styles.bar} />
        </View>
      }
    >
      <ScreenHeading
        title="Set a new password"
        highlight="password"
        subtitle="Make it one you haven't used before."
      />

      <TextField
        label="New password"
        value={password}
        onChangeText={setPassword}
        placeholder="Choose a password"
        password
        autoComplete="new-password"
        textContentType="newPassword"
        containerStyle={{ marginTop: spacing.huge, marginBottom: spacing.xxlXxxl }}
      />

      <PasswordRules password={password} />

      <View style={styles.spacer} />

      <Button label="Save new password" onPress={onSave} disabled={!valid || busy} />
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center' },
  bar: { flex: 1 },
  spacer: { flex: 1, minHeight: 24 },
});
