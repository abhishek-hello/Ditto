import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { OptionCard } from '@/components/OptionCard';
import { ScreenHeading } from '@/components/ScreenHeading';
import { useTheme } from '@/theme';

type MerchantType = 'sole-merchant' | 'business';

/**
 * Onboarding stage 1, step 1 (Figma 1:165000): what kind of merchant.
 * Sole Merchant is the only live option; Business is shown but not selectable.
 * The choice is local state until the onboarding API can store it.
 */
export default function CreateAccountMerchantTypeScreen() {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [merchantType, setMerchantType] = useState<MerchantType>('sole-merchant');

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingBottom: insets.bottom + spacing.lg },
      ]}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{
          paddingHorizontal: spacing.gutter,
          paddingBottom: spacing.xl,
          gap: spacing.xxxl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeading
          title="What kind of merchant are you?"
          highlight="merchant"
          subtitle="This decides which documents we'll ask for next."
        />

        <View accessibilityRole="radiogroup" style={{ gap: spacing.mdLg }}>
          <OptionCard
            title="Sole Merchant"
            description="Self-employed, working under your own name or a trading name."
            selected={merchantType === 'sole-merchant'}
            onPress={() => setMerchantType('sole-merchant')}
          />
          <OptionCard
            title="Business"
            description={'Limited companies and partnerships.\nComing soon.'}
            selected={merchantType === 'business'}
            disabled
          />
        </View>
      </ScrollView>

      <Button
        label="Continue"
        onPress={() => router.push('/(onboarding)/create-account/legal-name')}
        style={{ marginHorizontal: spacing.gutter }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
});
