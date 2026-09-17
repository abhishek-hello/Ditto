import { useLocalSearchParams } from 'expo-router';
import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function AccountNotificationsIdScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <PlaceholderScreen
      title="Notice"
      figma="162:28"
      notes="Email / Mobile / Bank / Address / Business Name / Password changed, Direct debit failed, Billing Notice."
      subtitle={`id: ${id}`}
    />
  );
}
