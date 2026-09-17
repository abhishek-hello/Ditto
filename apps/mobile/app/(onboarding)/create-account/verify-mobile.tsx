import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function CreateAccountVerifyMobileScreen() {
  return (
    <PlaceholderScreen
      title="Verify your mobile"
      stage="Account creation — step 5 of 10"
      figma="6:9904,17:1297,145:841,145:1869"
      notes="6-digit OTP: empty, partial, complete, wrong code, timed out, verifying. Shared OTP component."
      actions={[{ label: 'Continue', href: '/(onboarding)/create-account/password' }]}
    />
  );
}
