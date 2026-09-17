import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme';

/**
 * The password policy, straight from the handoff. The 8–12 upper bound is the
 * design's, not a typo — it is stated on both the create and reset screens.
 * Lives here rather than in `@ditto/core` because nothing server-side enforces
 * it yet; move it when the API gains a password endpoint.
 */
const PASSWORD_RULES = [
  { label: '8–12 characters', test: (p: string) => p.length >= 8 && p.length <= 12 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'One number', test: (p: string) => /\d/.test(p) },
  { label: 'One symbol', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
] as const;

export function passwordMeetsPolicy(password: string): boolean {
  return PASSWORD_RULES.every((rule) => rule.test(password));
}

/** The handoff draws 13 between rules and 11 inside one — neither is on the 2px scale. */
const ROW_GAP = 13;
const TICK_GAP = 11;

export interface PasswordRulesProps {
  password: string;
}

/** The live checklist under a new-password field: a rule ticks as it is met. */
export function PasswordRules({ password }: PasswordRulesProps) {
  const { border, colors, radius, size, text } = useTheme();

  return (
    <View style={{ gap: ROW_GAP }}>
      {PASSWORD_RULES.map((rule) => {
        const met = rule.test(password);
        return (
          <View
            key={rule.label}
            accessibilityRole="text"
            accessibilityLabel={`${rule.label}: ${met ? 'met' : 'not met'}`}
            style={[styles.row, { gap: TICK_GAP }]}
          >
            <View
              style={[
                styles.dot,
                {
                  width: size.ruleDot,
                  height: size.ruleDot,
                  borderRadius: radius.pill,
                  borderWidth: met ? 0 : border.strong,
                  borderColor: colors.handle,
                  backgroundColor: met ? colors.primary : colors.surface,
                },
              ]}
            >
              {met ? <Text style={[text.label, { color: colors.onPrimary }]}>✓</Text> : null}
            </View>
            <Text style={[text.bodyTight, { color: met ? colors.textPrimary : colors.textMuted }]}>
              {rule.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  dot: { alignItems: 'center', justifyContent: 'center' },
});
