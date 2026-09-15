import { Stack } from 'expo-router';

/** Team member (invited user) onboarding. Entered via the SMS invite deep link. */
export default function TeamInviteLayout() {
  return <Stack screenOptions={{ headerShown: true, title: 'Join team' }} />;
}
