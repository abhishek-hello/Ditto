import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function IdentityVerifiedScreen() {
  return (
    <PlaceholderScreen
      title="Identity Verified"
      figma="1:175312"
      notes="Success."
      actions={[{ label: 'Continue', href: '/(onboarding)/business/profession' }]}
    />
  );
}
