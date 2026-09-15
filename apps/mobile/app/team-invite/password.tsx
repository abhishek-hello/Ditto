import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function TeamInvitePasswordScreen() {
  return (
    <PlaceholderScreen
      title="Create Password"
      stage="Step 2 of 3"
      figma="1:174285"
      notes="Shared password-create component."
      actions={[{ label: 'Continue', href: '/team-invite/terms' }]}
    />
  );
}
