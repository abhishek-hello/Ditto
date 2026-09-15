import { useLocalSearchParams } from 'expo-router';
import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function AccountNotificationsIdScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <PlaceholderScreen
      title="Notice"
      figma="1:175746, 1:176201"
      notes="Email / Mobile / Bank / Address / Business Name / Password changed, Direct debit failed, Billing Notice."
      subtitle={`id: ${id}`}
    />
  );
}
