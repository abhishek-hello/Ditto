import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function CreateAccountLegalNameScreen() {
  return (
    <PlaceholderScreen
      title="Your legal name"
      stage="Account creation — step 2 of 10"
      figma="17:1297"
      notes="First, middle (optional), last, date of birth."
      actions={[{ label: 'Continue', href: '/(onboarding)/create-account/email' }]}
    />
  );
}
