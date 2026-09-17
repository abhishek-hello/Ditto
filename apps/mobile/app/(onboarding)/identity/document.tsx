import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function IdentityDocumentScreen() {
  return (
    <PlaceholderScreen
      title="Document scan"
      figma="145:5155"
      notes="iDenfy SDK, passport / licence."
      actions={[{ label: 'Continue', href: '/(onboarding)/identity/face-consent' }]}
    />
  );
}
