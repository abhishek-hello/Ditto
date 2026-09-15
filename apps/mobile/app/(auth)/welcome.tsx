import { PlaceholderScreen } from '@/components/PlaceholderScreen';

export default function WelcomeScreen() {
  return (
    <PlaceholderScreen
      title="Made to get paid."
      figma="1:164223"
      notes={'Welcome. Includes the "Not available in your region yet" bottom sheet.'}
      actions={[
        { label: 'Create Account', href: '/(onboarding)/create-account/merchant-type' },
        { label: 'Sign In', href: '/(auth)/sign-in' },
      ]}
    />
  );
}
