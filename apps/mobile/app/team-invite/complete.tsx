import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function TeamInviteCompleteScreen() {
  return (
    <PlaceholderScreen
      title={"You're All Set!"}
      figma="1:174285"
      notes="Watch 1 Min Demo Video. Team member main app (1:174703) uses the same tabs with a reduced Account menu."
      actions={[{ label: 'Go to Home', href: '/(tabs)/home' }]}
    />
  );
}
