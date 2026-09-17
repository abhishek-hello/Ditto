import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { StatusScreen } from '@/components/StatusScreen';

/**
 * The end of onboarding. From here the merchant lands in the app proper, so
 * this replaces rather than pushes — the whole onboarding stack goes away.
 */
export default function BankCompleteScreen() {
  const router = useRouter();

  return (
    <StatusScreen
      title="Bank account linked"
      body="Setup is complete — you're ready to take your first payment."
    >
      <Button
        label="Take me to DittoPay"
        onPress={() => router.replace('/(tabs)/home')}
        style={{ alignSelf: 'stretch' }}
      />
    </StatusScreen>
  );
}
