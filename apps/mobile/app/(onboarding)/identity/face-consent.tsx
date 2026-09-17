import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function IdentityFaceConsentScreen() {
  return (
    <PlaceholderScreen
      title="Match Your Face"
      figma="145:5155"
      notes={'Biometric consent ("BEFORE YOU CONTINUE").'}
      actions={[{ label: 'I consent', href: '/(onboarding)/identity/face-scan' }]}
    />
  );
}
