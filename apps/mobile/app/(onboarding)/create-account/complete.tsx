import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function CreateAccountCompleteScreen() {
  return (
    <PlaceholderScreen
      title="Fantastic!"
      stage="Account creation — complete"
      figma="1:165000"
      notes="Your account setup stage is complete. Next we will verify your identity."
      actions={[{ label: 'Verify identity', href: '/(onboarding)/identity' }]}
    />
  );
}
