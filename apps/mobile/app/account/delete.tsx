import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function AccountDeleteScreen() {
  return (
    <PlaceholderScreen
      title="Delete Account"
      figma="145:841"
      notes={'Re-auth, "Type DELETE to confirm", 14-day grace.'}
      actions={[{ label: 'Re-authenticate first', href: '/account/reauth?next=/account/delete' }]}
    />
  );
}
