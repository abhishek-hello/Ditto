import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function CreateAccountEmailScreen() {
  return (
    <PlaceholderScreen
      title="Your email"
      stage="Account creation — step 3 of 10"
      figma="1:165000"
      notes="Email + confirm email, mismatch error."
      actions={[{ label: 'Continue', href: '/(onboarding)/create-account/mobile' }]}
    />
  );
}
