import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function IdentityFaceScanScreen() {
  return (
    <PlaceholderScreen
      title="Face Detection"
      figma="145:5155"
      notes={'"Scanning your face", iDenfy SDK.'}
      actions={[{ label: 'Continue', href: '/(onboarding)/identity/verified' }]}
    />
  );
}
