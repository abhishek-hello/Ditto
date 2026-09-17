import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function CreateAccountEmailScreen() {
  return (
    <PlaceholderScreen
      title="Your email"
      stage="Account creation — step 3 of 10"
      figma="17:1297"
      notes="Email + confirm email, mismatch error."
      actions={[{ label: 'Continue', href: '/(onboarding)/create-account/mobile' }]}
    />
  );
}
