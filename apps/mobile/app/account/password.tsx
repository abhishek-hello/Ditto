import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function AccountPasswordScreen() {
  return (
    <PlaceholderScreen
      title="Change Password"
      figma="1:171645"
      notes="Old, new, confirm; mismatch errors. Shared password-create component."
      actions={[{ label: 'Re-authenticate first', href: '/account/reauth?next=/account/password' }]}
    />
  );
}
