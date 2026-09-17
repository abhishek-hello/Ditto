import { useLocalSearchParams, useRouter } from 'expo-router';
import { StageHeader } from '@/components/StageHeader';
import { VerifyCodeScreen } from '@/components/VerifyCodeScreen';
import { supabase } from '@/lib/supabase';

/** Reset step 2 of 3: the emailed code. */
export default function ForgotPasswordCodeScreen() {
  const router = useRouter();
  const { email = '' } = useLocalSearchParams<{ email?: string }>();

  return (
    <VerifyCodeScreen
      header={<StageHeader fills={[1, 0, 0]} />}
      codeName="reset code"
      email={email}
      onVerify={async (code) => {
        const { error } = await supabase.auth.verifyOtp({ email, token: code, type: 'recovery' });
        if (error) return false;
        router.push({ pathname: '/(auth)/forgot-password/new-password', params: { email } });
        return true;
      }}
      onResend={() => {
        supabase.auth.resetPasswordForEmail(email).catch(() => undefined);
      }}
      onChangeEmail={() => router.back()}
    />
  );
}
