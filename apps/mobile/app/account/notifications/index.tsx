import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function AccountNotificationsIndexScreen() {
  return (
    <PlaceholderScreen
      title="Notifications"
      figma="145:28,162:28,168:522"
      notes={'List, "Mark all read".'}
      actions={[{ label: 'Open notice (demo)', href: '/account/notifications/demo' }]}
    />
  );
}
