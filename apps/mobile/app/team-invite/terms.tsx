import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function TeamInviteTermsScreen() {
  return (
    <PlaceholderScreen
      title="Team Member Terms"
      stage="Step 3 of 3"
      figma="1:174285"
      notes="Scroll-gated I Accept."
      actions={[{ label: 'I Accept', href: '/team-invite/complete' }]}
    />
  );
}
