import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function IdentityIndexScreen() {
  return (
    <PlaceholderScreen
      title="Verify Your Identity"
      figma="1:175312"
      notes="Intro, choose Passport / Driving Licence."
      actions={[
        { label: 'Passport', href: '/(onboarding)/identity/document' },
        { label: 'Driving Licence', href: '/(onboarding)/identity/document' },
      ]}
    />
  );
}
