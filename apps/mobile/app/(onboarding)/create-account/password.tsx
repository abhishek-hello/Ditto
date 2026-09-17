import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function CreateAccountPasswordScreen() {
  return (
    <PlaceholderScreen
      title="Create a password"
      stage="Account creation — step 6 of 10"
      figma="17:1297,145:3519"
      notes="Rules checklist, Show toggle. Shared password-create component."
      actions={[{ label: 'Continue', href: '/(onboarding)/create-account/home-address' }]}
    />
  );
}
