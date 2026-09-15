import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function IdentityDocumentScreen() {
  return (
    <PlaceholderScreen
      title="Document scan"
      figma="1:175312"
      notes="iDenfy SDK, passport / licence."
      actions={[{ label: 'Continue', href: '/(onboarding)/identity/face-consent' }]}
    />
  );
}
