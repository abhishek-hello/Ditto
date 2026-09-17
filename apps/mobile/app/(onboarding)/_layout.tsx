import { Stack } from 'expo-router';

/**
 * Onboarding stages 1–4. Each screen draws its own `StageHeader`: the handoff
 * varies the progress fill, the caption and whether there is a bar at all from
 * step to step, and several screens scroll the header away with the body.
 */
export default function OnboardingLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
