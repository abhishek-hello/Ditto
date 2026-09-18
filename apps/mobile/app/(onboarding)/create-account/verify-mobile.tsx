import { useLocalSearchParams, useRouter } from 'expo-router';
import { StageHeader } from '@/components/StageHeader';
import { devCodeAccepted, VerifyCodeScreen } from '@/components/VerifyCodeScreen';
import { supabase } from '@/lib/supabase';

/**
 * Stage 1, step 5.
 *
 * The route is named for the mobile step it follows, but the handoff verifies
 * the *email* here — the title reads "Enter the email code" and the code is sent
 * to the address from step 3. Copy follows the handoff; the file keeps its name
 * so the route map in docs/figma-screens.md still lines up.
 */
export default function VerifyMobileScreen() {
  const router = useRouter();
  const { email = '' } = useLocalSearchParams<{ email?: string }>();

  return (
    <VerifyCodeScreen
      header={
        <StageHeader
          fills={[0.5, 0, 0, 0]}
          label="Stage 1 of 4 · Account creation — step 5 of 10"
        />
      }
      codeName="email code"
      email={email}
      onVerify={async (code) => {
        if (!devCodeAccepted(code)) {
          const { error } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' });
          if (error) return false;
        }
        router.push('/(onboarding)/create-account/password');
        return true;
      }}
      onResend={() => {
        supabase.auth.signInWithOtp({ email }).catch(() => undefined);
      }}
      onChangeEmail={() => router.back()}
    />
  );
}
