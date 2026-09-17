import { useLocalSearchParams } from 'expo-router';
import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function AccountTeamMemberIdScreen() {
  const { memberId } = useLocalSearchParams<{ memberId: string }>();
  return (
    <PlaceholderScreen
      title="Team Member"
      figma="145:2272,145:3519"
      notes="Member detail / Team Member Activity, Remove."
      subtitle={`memberId: ${memberId}`}
    />
  );
}
