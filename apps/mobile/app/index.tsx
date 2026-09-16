import { Redirect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandLogo } from '@/components/BrandLogo';
import { Button } from '@/components/Button';
import { useSession } from '@/components/SessionProvider';
import { api } from '@/lib/api';
import { useTheme } from '@/theme';

type Bootstrap = 'loading' | 'ready' | 'failed';

/** A start faster than this is "seen as a flash" (Figma annotation): no bar. */
const SLOW_AFTER_MS = 300;
/** Wrap width of the failure copy in the frame (251px text in a 375 screen). */
const COPY_MAX_WIDTH = 260;

/**
 * Splash (Figma 1:164157): fast / slow (indeterminate bar) / failed (Retry).
 * Bootstraps the API + session, then redirects.
 * Dev builds accept `?state=slow|failed` to pin a state for verification.
 * TODO: route signed-in users with an unfinished onboarding stage back into (onboarding).
 */
export default function SplashScreen() {
  const { status } = useSession();
  const { colors, spacing, text } = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ state?: string }>();
  const pinned =
    __DEV__ && (params.state === 'slow' || params.state === 'failed') ? params.state : null;

  const [bootstrap, setBootstrap] = useState<Bootstrap>('loading');
  const [slow, setSlow] = useState(false);

  const bootstrapApp = useCallback(() => {
    setBootstrap('loading');
    setSlow(false);
    api
      .health()
      .then(() => setBootstrap('ready'))
      .catch(() => setBootstrap('failed'));
  }, []);

  useEffect(() => {
    if (pinned) return;
    bootstrapApp();
  }, [bootstrapApp, pinned]);

  useEffect(() => {
    if (bootstrap !== 'loading') return;
    const timer = setTimeout(() => setSlow(true), SLOW_AFTER_MS);
    return () => clearTimeout(timer);
  }, [bootstrap]);

  if (!pinned) {
    if (bootstrap === 'ready' && status === 'signed-in') return <Redirect href="/(tabs)/home" />;
    if (bootstrap === 'ready' && status === 'signed-out')
      return <Redirect href="/(auth)/welcome" />;
  }

  const state = pinned ?? bootstrap;
  const showBar = state === 'slow' || (state === 'loading' && slow);
  const showRetry = state === 'failed';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingHorizontal: spacing.gutter,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <BrandLogo />

      {showBar ? <IndeterminateBar style={{ marginTop: spacing.xxl }} /> : null}

      {showRetry ? (
        <>
          <Text
            style={[
              text.bodySm,
              styles.copy,
              { color: colors.textMuted, marginTop: spacing.xxl, maxWidth: COPY_MAX_WIDTH },
            ]}
          >
            Can't reach DittoPay right now. Check your connection and try again.
          </Text>
          <Button
            label="Retry"
            variant="outline"
            size="sm"
            onPress={bootstrapApp}
            style={{ alignSelf: 'center', marginTop: spacing.xl }}
          />
        </>
      ) : null}
    </View>
  );
}

/** Figma: 120×3 track, 48×3 cyan segment. */
const TRACK_WIDTH = 120;
const TRACK_HEIGHT = 3;
const SEGMENT_WIDTH = 48;
const SWEEP_MS = 1100;

function IndeterminateBar({ style }: { style?: { marginTop: number } }) {
  const { colors, radius } = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: SWEEP_MS, easing: Easing.inOut(Easing.ease) }),
      -1,
      false,
    );
  }, [progress]);

  const segmentStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -SEGMENT_WIDTH + progress.value * (TRACK_WIDTH + SEGMENT_WIDTH) }],
  }));

  return (
    <View
      accessibilityRole="progressbar"
      style={[styles.track, { backgroundColor: colors.surface, borderRadius: radius.pill }, style]}
    >
      <Animated.View
        style={[
          styles.segment,
          { backgroundColor: colors.primary, borderRadius: radius.pill },
          segmentStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  copy: { textAlign: 'center' },
  track: { width: TRACK_WIDTH, height: TRACK_HEIGHT, overflow: 'hidden' },
  segment: { width: SEGMENT_WIDTH, height: TRACK_HEIGHT },
});
