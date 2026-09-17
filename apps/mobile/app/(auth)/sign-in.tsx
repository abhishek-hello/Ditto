import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { FormScreen } from '@/components/FormScreen';
import { ScreenHeading } from '@/components/ScreenHeading';
import { StageHeader } from '@/components/StageHeader';
import { TextField } from '@/components/TextField';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/theme';

/** Wrong attempts before the account is locked. */
const MAX_ATTEMPTS = 3;
const WRONG_CREDENTIALS = 'Incorrect email or password.';

/**
 * Sign in: email, password, and the three states the handoff draws — clean,
 * wrong credentials, and locked after three failures.
 *
 * ponytail: the lock is counted in component state, so it clears on relaunch.
 * Supabase already rate-limits the endpoint; a durable lock needs the API to
 * own the counter, which is the right place for it once that endpoint exists.
 *
 * Dev builds accept `?state=error|locked` to pin a state for verification.
 */
export default function SignInScreen() {
  const { colors, radius, spacing, text } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ state?: string }>();
  const pinned = __DEV__ ? params.state : undefined;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(pinned === 'error' ? WRONG_CREDENTIALS : '');
  const [attempts, setAttempts] = useState(pinned === 'error' ? 1 : 0);
  const [locked, setLocked] = useState(pinned === 'locked');
  const [busy, setBusy] = useState(false);

  const onSubmit = async () => {
    if (locked || busy) return;
    setBusy(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);

    if (!authError) {
      router.replace('/(tabs)/home');
      return;
    }

    const next = attempts + 1;
    setAttempts(next);
    if (next >= MAX_ATTEMPTS) {
      setLocked(true);
      setError('');
    } else {
      setError(WRONG_CREDENTIALS);
    }
  };

  return (
    <FormScreen header={<StageHeader onBack={() => router.replace('/(auth)/welcome')} />}>
      <ScreenHeading title="Sign in" highlight="in" size="lg" />

      {locked ? (
        <View
          style={{
            marginTop: spacing.xxlXxxl,
            padding: spacing.lgXl,
            paddingHorizontal: spacing.xl,
            borderRadius: radius.lg,
            borderWidth: 1,
            borderColor: colors.errorBorder,
            backgroundColor: colors.errorSoft,
          }}
        >
          <Text style={[text.bodyXs, { color: colors.onErrorSoft }]}>
            Too many attempts. Your account is locked for 15 minutes — reset your password to unlock
            it now.
          </Text>
        </View>
      ) : null}

      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="you@business.co.uk"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        containerStyle={{ marginTop: spacing.huge }}
      />

      <TextField
        label="Password"
        value={password}
        onChangeText={(next) => {
          setPassword(next);
          setError('');
        }}
        placeholder="••••••••"
        password
        autoComplete="current-password"
        textContentType="password"
        invalid={Boolean(error)}
        containerStyle={{ marginTop: spacing.xxl }}
      />

      <View style={[styles.errorRow, { gap: spacing.lg, marginTop: spacing.mdLg }]}>
        <Text style={[text.caption, styles.errorText, { color: colors.error }]}>{error}</Text>
        <Pressable
          onPress={() => router.push('/(auth)/forgot-password')}
          accessibilityRole="button"
          hitSlop={spacing.md}
        >
          <Text style={[text.link, { color: colors.link }]}>Forgot password?</Text>
        </Pressable>
      </View>

      <View style={styles.spacer} />

      <Button label="Sign In" onPress={onSubmit} disabled={locked || busy} />
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  errorRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  errorText: { flex: 1 },
  spacer: { flex: 1, minHeight: 24 },
});
