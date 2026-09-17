import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function IdentityVerifiedScreen() {
  return (
    <PlaceholderScreen
      title="Identity Verified"
      figma="145:5155"
      notes="Success."
      actions={[{ label: 'Continue', href: '/(onboarding)/business/profession' }]}
    />
  );
}
