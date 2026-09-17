import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function TeamInvitePasswordScreen() {
  return (
    <PlaceholderScreen
      title="Create Password"
      stage="Step 2 of 3"
      figma="17:1297,145:3519"
      notes="Shared password-create component."
      actions={[{ label: 'Continue', href: '/team-invite/terms' }]}
    />
  );
}
