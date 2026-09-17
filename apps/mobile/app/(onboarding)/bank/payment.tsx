import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Button } from '@/components/Button';
import { StatusScreen } from '@/components/StatusScreen';
import { useTheme } from '@/theme';

type PaymentState = 'handoff' | 'paid' | 'failed' | 'pending';

/** How long the Stripe hand-off is shown before the result lands. */
const HANDOFF_MS = 1700;

/**
 * Stage 4: the four states of taking the set-up fee.
 *
 * TODO: `handoff` currently resolves to `paid` on a timer. It becomes the real
 * wait on Stripe's SDK once the payment sheet is wired; the other three states
 * are already what the result maps onto.
 *
 * Dev builds accept `?state=paid|failed|pending` to pin a state.
 */
export default function PaymentScreen() {
  const { colors, spacing, text } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ state?: string }>();
  const pinned =
    __DEV__ && ['paid', 'failed', 'pending'].includes(params.state ?? '')
      ? (params.state as PaymentState)
      : null;

  const [state, setState] = useState<PaymentState>(pinned ?? 'handoff');

  useEffect(() => {
    if (pinned || state !== 'handoff') return;
    const timer = setTimeout(() => setState('paid'), HANDOFF_MS);
    return () => clearTimeout(timer);
  }, [pinned, state]);

  if (state === 'handoff') {
    return (
      <View
        style={[
          styles.centred,
          {
            backgroundColor: colors.background,
            paddingHorizontal: spacing.giant,
            gap: spacing.xxl,
          },
        ]}
      >
        <Spinner />
        <Text
          accessibilityRole="header"
          style={[styles.copy, text.h3, { color: colors.textPrimary }]}
        >
          Taking you to secure checkout
        </Text>
        <Text style={[styles.copy, text.bodySm, { color: colors.textMuted }]}>
          You're leaving DittoPay for a moment to add your card details securely with Stripe.
        </Text>
      </View>
    );
  }

  if (state === 'pending') {
    return (
      <View
        style={[
          styles.centred,
          {
            backgroundColor: colors.background,
            paddingHorizontal: spacing.giant,
            gap: spacing.xlXxl,
          },
        ]}
      >
        <PulsingDot />
        <Text
          accessibilityRole="header"
          style={[styles.copy, text.h3, { color: colors.textPrimary }]}
        >
          Confirming your payment
        </Text>
        <Text style={[styles.copy, text.bodySm, { color: colors.textMuted }]}>
          This usually takes a few seconds. You haven't been charged twice, and nothing else needs
          doing right now.
        </Text>
        <Text style={[styles.copy, text.caption, { color: colors.textMuted }]}>
          Taking longer than usual? You can close this screen — we'll activate your account the
          moment it's confirmed and let you know.
        </Text>
        <Button
          label="Check again"
          variant="plain"
          size="sm"
          onPress={() => setState('paid')}
          style={{ marginTop: spacing.xs }}
        />
      </View>
    );
  }

  if (state === 'failed') {
    return (
      <StatusScreen
        tone="error"
        compact
        title="Payment didn't go through"
        body="You have not been charged. Nothing has been taken from your card — you can try again now."
      >
        <View style={{ alignSelf: 'stretch', gap: spacing.xlXxl }}>
          <Button
            label="Try again"
            variant="secondary"
            size="md"
            onPress={() => router.replace('/(onboarding)/bank/setup-fee')}
          />
          <Button label="Contact support" variant="plain" size="sm" />
        </View>
      </StatusScreen>
    );
  }

  return (
    <StatusScreen compact title="Payment successful" body="Your DittoPay account is now active.">
      <Button
        label="Continue"
        onPress={() => router.replace('/(onboarding)/bank/tour')}
        style={styles.stretch}
      />
    </StatusScreen>
  );
}

/** 46pt ring with one brand quarter, spinning. */
const SPINNER_SIZE = 46;
const SPIN_MS = 900;

function Spinner() {
  const { border, colors, radius } = useTheme();
  const turn = useSharedValue(0);

  useEffect(() => {
    turn.value = withRepeat(withTiming(1, { duration: SPIN_MS, easing: Easing.linear }), -1, false);
  }, [turn]);

  const style = useAnimatedStyle(() => ({ transform: [{ rotate: `${turn.value * 360}deg` }] }));

  return (
    <Animated.View
      accessibilityRole="progressbar"
      style={[
        {
          width: SPINNER_SIZE,
          height: SPINNER_SIZE,
          borderRadius: radius.pill,
          borderWidth: border.strong * 2,
          borderColor: colors.border,
          borderTopColor: colors.primary,
        },
        style,
      ]}
    />
  );
}

/** 12pt brand dot, breathing — the "still confirming" signal. */
const DOT_SIZE = 12;
const PULSE_MS = 550;

function PulsingDot() {
  const { colors, radius } = useTheme();
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: PULSE_MS, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: PULSE_MS, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, [pulse]);

  const style = useAnimatedStyle(() => ({
    opacity: 1 - pulse.value * 0.55,
    transform: [{ scale: 1 + pulse.value * 0.9 }],
  }));

  return (
    <Animated.View
      accessibilityRole="progressbar"
      style={[
        {
          width: DOT_SIZE,
          height: DOT_SIZE,
          borderRadius: radius.pill,
          backgroundColor: colors.primary,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  centred: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  copy: { textAlign: 'center' },
  stretch: { alignSelf: 'stretch' },
});
