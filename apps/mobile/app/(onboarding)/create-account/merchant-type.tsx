import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '@/components/Button';
import { FormScreen } from '@/components/FormScreen';
import { OptionCard } from '@/components/OptionCard';
import { ScreenHeading } from '@/components/ScreenHeading';
import { StageHeader } from '@/components/StageHeader';
import { useTheme } from '@/theme';

type MerchantType = 'sole-merchant' | 'business';

/**
 * Stage 1, step 1: what kind of merchant. Both options are selectable — the
 * handoff makes Business a live choice, where the earlier Figma frame had it
 * greyed as "coming soon". The choice is local state until the onboarding API
 * can store it.
 */
export default function MerchantTypeScreen() {
  const { spacing } = useTheme();
  const router = useRouter();
  const [merchantType, setMerchantType] = useState<MerchantType | null>('sole-merchant');

  return (
    <FormScreen
      header={
        <StageHeader
          fills={[0.1, 0, 0, 0]}
          label="Stage 1 of 4 · Account creation — step 1 of 10"
        />
      }
    >
      <ScreenHeading
        title="What kind of merchant are you?"
        highlight="merchant"
        subtitle="This decides which documents we'll ask for next."
      />

      <View accessibilityRole="radiogroup" style={{ marginTop: spacing.xxlXxxl, gap: spacing.lg }}>
        <OptionCard
          title="Sole Merchant"
          description="Self-employed, working under your own name or a trading name."
          selected={merchantType === 'sole-merchant'}
          onPress={() => setMerchantType('sole-merchant')}
        />
        <OptionCard
          title="Business"
          description="Limited companies and partnerships."
          selected={merchantType === 'business'}
          onPress={() => setMerchantType('business')}
        />
      </View>

      <View style={styles.spacer} />

      <Button
        label="Continue"
        disabled={merchantType === null}
        onPress={() => router.push('/(onboarding)/create-account/legal-name')}
      />
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  spacer: { flex: 1, minHeight: 24 },
});
