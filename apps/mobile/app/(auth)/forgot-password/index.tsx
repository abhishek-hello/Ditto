import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function ForgotPasswordIndexScreen() {
  return (
    <PlaceholderScreen
      title="Reset your password"
      stage="Step 1 of 3"
      figma="16:654"
      notes={'Enter email, "Send code".'}
      actions={[{ label: 'Send code', href: '/(auth)/forgot-password/code' }]}
    />
  );
}
