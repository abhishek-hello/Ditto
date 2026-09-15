import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function AccountBankResultScreen() {
  return (
    <PlaceholderScreen
      title="Bank account change"
      figma="1:172654"
      notes={
        'Bank change scheduled (48h hold) / Bank account changed / Name doesn\'t match (2 attempts left, 1 attempt left, "Let\'s get a person to check this").'
      }
      actions={[{ label: 'Done', href: '/(tabs)/account' }]}
    />
  );
}
