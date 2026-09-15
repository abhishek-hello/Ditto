import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function ForgotPasswordCodeScreen() {
  return (
    <PlaceholderScreen
      title="Enter the reset code"
      stage="Step 2 of 3"
      figma="1:164476"
      notes="6-digit OTP, wrong-code state. Shared OTP component."
      actions={[{ label: 'Continue', href: '/(auth)/forgot-password/new-password' }]}
    />
  );
}
