import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function AccountNotificationsIndexScreen() {
  return (
    <PlaceholderScreen
      title="Notifications"
      figma="1:170876, 1:175746"
      notes={'List, "Mark all read".'}
      actions={[{ label: 'Open notice (demo)', href: '/account/notifications/demo' }]}
    />
  );
}
