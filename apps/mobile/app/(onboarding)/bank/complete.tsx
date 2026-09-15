import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function BankCompleteScreen() {
  return (
    <PlaceholderScreen
      title={"You're all set"}
      stage="Bank verification — step 11 of 11"
      figma="1:167327"
      notes="A quick 60-second tour before you take your first payment."
      actions={[{ label: 'Go to Home', href: '/(tabs)/home' }]}
    />
  );
}
