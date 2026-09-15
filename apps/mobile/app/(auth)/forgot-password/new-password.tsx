import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function ForgotPasswordNewPasswordScreen() {
  return (
    <PlaceholderScreen
      title="Set a new password"
      stage="Step 3 of 3"
      figma="1:164476"
      notes="Live tickable rules. Shared password-create component."
      actions={[{ label: 'Back to Sign In', href: '/(auth)/sign-in' }]}
    />
  );
}
