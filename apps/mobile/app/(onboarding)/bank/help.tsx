import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { FormScreen } from '@/components/FormScreen';
import { useTheme } from '@/theme';

/** Support reference quoted on this screen so the team can find the attempt log. */
const SUPPORT_REFERENCE = 'BL-48213';

const ROUTES_FORWARD = [
  {
    title: 'Try a different bank account',
    body: 'If you have another account in your own name, link that one instead.',
    actionable: true,
  },
  {
    title: 'Talk to support',
    body: `Reference ${SUPPORT_REFERENCE}. We can verify a near-match manually, usually within one business day.`,
    actionable: false,
  },
  {
    title: 'Finish this later',
    body: 'Your progress is saved. You can take payments once a bank account is linked — come back any time from Account.',
    actionable: false,
  },
];

/**
 * Stage 4: automatic linking is paused after three failed name checks. The
 * screen's job is to make clear nothing else is lost and to offer three ways on.
 */
export default function BankHelpScreen() {
  const { border, colors, radius, spacing, text } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const toLink = () => router.replace('/(onboarding)/bank/link');

  return (
    <FormScreen gap={spacing.lg}>
      <View
        style={[
          styles.badge,
          {
            marginTop: insets.top,
            borderRadius: radius.pill,
            paddingVertical: spacing.mdLg,
            paddingHorizontal: spacing.huge,
            backgroundColor: colors.errorSoft,
          },
        ]}
      >
        <Text style={[text.h3Sm, { color: colors.error }]}>!</Text>
      </View>

      <Text
        accessibilityRole="header"
        style={[styles.centred, text.h1Sm, { color: colors.textPrimary, marginTop: spacing.xlXxl }]}
      >
        Let's sort this <Text style={{ color: colors.accentText }}>another way</Text>
      </Text>

      <Text style={[styles.centred, text.body, { color: colors.textMuted }]}>
        We couldn't match the account holder name after three attempts, so we've paused automatic
        linking. Your identity is already verified — nothing else is lost.
      </Text>

      <View style={{ marginTop: spacing.mdLg, gap: spacing.lg }}>
        {ROUTES_FORWARD.map((route) => (
          <Pressable
            key={route.title}
            // Only the first route goes anywhere; the other two are guidance.
            disabled={!route.actionable}
            onPress={toLink}
            accessibilityRole={route.actionable ? 'button' : 'text'}
            style={({ pressed }) => ({
              paddingVertical: spacing.xl,
              paddingHorizontal: spacing.xlXxl,
              borderRadius: radius.xl,
              borderWidth: border.hairline,
              borderColor: colors.border,
              backgroundColor: colors.surface,
              gap: spacing.xs,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Text style={[text.h5, { color: colors.textPrimary }]}>{route.title}</Text>
            <Text style={[text.bodyXs, { color: colors.textMuted }]}>{route.body}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.spacer} />

      <Button label="Try a different account" onPress={toLink} />
      <Button
        label="Contact support"
        variant="plain"
        size="sm"
        onPress={toLink}
        style={{ marginTop: spacing.mdLg }}
      />
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'center', alignItems: 'center', justifyContent: 'center' },
  centred: { textAlign: 'center' },
  spacer: { flex: 1, minHeight: 20 },
});
