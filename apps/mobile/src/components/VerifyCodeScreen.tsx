import { formatCountdown, maskEmail } from '@ditto/core';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { CodeInput } from '@/components/CodeInput';
import { FormScreen } from '@/components/FormScreen';
import { ScreenHeading } from '@/components/ScreenHeading';
import { useTheme } from '@/theme';

const CODE_LENGTH = 6;
/** The handoff starts the clock at 2:41 and a resend restocks it to 3:00. */
const INITIAL_SECONDS = 161;
const RESEND_SECONDS = 180;
/** Long enough for the sixth digit to paint before the screen moves on. */
const AUTOSUBMIT_DELAY_MS = 220;

export interface VerifyCodeScreenProps {
  /** `StageHeader` for this flow — the reset and sign-up variants differ. */
  header: ReactNode;
  /** Highlighted phrase in "Enter the …": "reset code" or "email code". */
  codeName: string;
  email: string;
  /** Resolves true when the code is accepted. */
  onVerify: (code: string) => Promise<boolean>;
  onResend: () => void;
  /** "Wrong email? Change it" — back to whichever screen collected it. */
  onChangeEmail: () => void;
}

/**
 * The 6-digit code screen, shared by password reset and sign-up. Both draw the
 * same body; only the header, the word in the title and what "verify" means
 * differ, so those are props rather than a second copy of this screen.
 */
export function VerifyCodeScreen({
  header,
  codeName,
  email,
  onVerify,
  onResend,
  onChangeEmail,
}: VerifyCodeScreenProps) {
  const { colors, spacing, text } = useTheme();
  const [code, setCode] = useState('');
  const [rejected, setRejected] = useState(false);
  const [seconds, setSeconds] = useState(INITIAL_SECONDS);
  const [busy, setBusy] = useState(false);
  const autoSubmit = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const tick = setInterval(() => setSeconds((left) => Math.max(0, left - 1)), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => () => clearTimeout(autoSubmit.current), []);

  const submit = async (value: string) => {
    if (busy || value.length < CODE_LENGTH) return;
    setBusy(true);
    const accepted = await onVerify(value);
    setBusy(false);
    if (!accepted) {
      // The handoff clears the cells on a wrong code rather than leaving the
      // user to delete six digits by hand.
      setCode('');
      setRejected(true);
    }
  };

  const onChangeCode = (next: string) => {
    setCode(next);
    setRejected(false);
    clearTimeout(autoSubmit.current);
    if (next.length === CODE_LENGTH) {
      autoSubmit.current = setTimeout(() => submit(next), AUTOSUBMIT_DELAY_MS);
    }
  };

  const resend = () => {
    setSeconds(RESEND_SECONDS);
    setCode('');
    setRejected(false);
    onResend();
  };

  return (
    <FormScreen header={header}>
      <ScreenHeading title={`Enter the ${codeName}`} highlight={codeName} />

      <Text style={[text.lead, { color: colors.textMuted, marginTop: spacing.mdLg }]}>
        We emailed a 6-digit code to {maskEmail(email)}.
      </Text>

      <CodeInput
        value={code}
        onChangeText={onChangeCode}
        error={rejected}
        accessibilityLabel="6-digit code"
        style={{ marginTop: spacing.xxxl, marginBottom: spacing.xlXxl }}
      />

      <Text style={[text.bodySm, { color: colors.textMuted }]}>
        Code expires in{' '}
        <Text style={[text.value, { color: colors.textPrimary }]}>{formatCountdown(seconds)}</Text>
      </Text>

      <Text
        style={[
          text.bodyXs,
          { color: rejected ? colors.error : colors.textMuted, marginTop: spacing.md },
        ]}
      >
        {rejected
          ? "That code was incorrect. We've cleared it — try again."
          : 'It can take a few seconds to arrive.'}
      </Text>

      <View style={styles.spacer} />

      <Button
        label="Verify"
        onPress={() => submit(code)}
        disabled={code.length < CODE_LENGTH || busy}
        style={{ marginBottom: spacing.xs }}
      />

      <Button label="Resend code" variant="plain" size="sm" onPress={resend} />

      <Text style={[styles.centred, text.caption, { color: colors.textMuted }]}>
        Wrong email?{' '}
        <Text onPress={onChangeEmail} style={[text.link, { color: colors.link }]}>
          Change it
        </Text>
      </Text>
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  spacer: { flex: 1, minHeight: 24 },
  centred: { textAlign: 'center' },
});
