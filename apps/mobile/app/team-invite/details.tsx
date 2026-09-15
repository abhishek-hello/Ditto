import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function TeamInviteDetailsScreen() {
  return (
    <PlaceholderScreen
      title="Your Details"
      stage="Step 1 of 3"
      figma="1:174285"
      notes="Full name, email, mobile. No DOB, address or ID for team members."
      actions={[{ label: 'Continue', href: '/team-invite/password' }]}
    />
  );
}
