import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function IdentityIndexScreen() {
  return (
    <PlaceholderScreen
      title="Verify Your Identity"
      figma="145:5155"
      notes="Intro, choose Passport / Driving Licence."
      actions={[
        { label: 'Passport', href: '/(onboarding)/identity/document' },
        { label: 'Driving Licence', href: '/(onboarding)/identity/document' },
      ]}
    />
  );
}
