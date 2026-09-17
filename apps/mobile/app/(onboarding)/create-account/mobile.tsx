import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function CreateAccountMobileScreen() {
  return (
    <PlaceholderScreen
      title="Your mobile number"
      stage="Account creation — step 4 of 10"
      figma="17:1297"
      notes="UK mobile validation (ukMobile from @ditto/core)."
      actions={[{ label: 'Continue', href: '/(onboarding)/create-account/verify-mobile' }]}
    />
  );
}
