import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheet } from '@/components/BottomSheet';
import { BrandLogo } from '@/components/BrandLogo';
import { Button } from '@/components/Button';
import { useTheme } from '@/theme';

/**
 * Ditto Pay is UK-only (AGENTS.md, PRODUCT.md), so this is a constant rather
 * than a lookup. The geo check lands here when it is wired.
 */
const REGION_SUPPORTED = true;

/**
 * Welcome (Figma 1:164223): logo lockup, tagline, Create Account / Sign In, and
 * the "Not available in your region yet" sheet shown to unsupported regions.
 *
 * Dev builds accept `?state=geo` to treat the region as unsupported: the sheet
 * opens on arrival and Create Account reopens it. Long-pressing the footnote
 * also opens it, so the state is reachable without a deep link.
 */
export default function WelcomeScreen() {
  const { colors, radius, size, spacing, text } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ state?: string }>();
  const pinnedGeo = __DEV__ && params.state === 'geo';

  const [sheetOpen, setSheetOpen] = useState(pinnedGeo);
  const regionSupported = REGION_SUPPORTED && !pinnedGeo;

  const onCreateAccount = () => {
    if (!regionSupported) {
      setSheetOpen(true);
      return;
    }
    router.push('/(onboarding)/create-account/merchant-type');
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingHorizontal: spacing.gutter,
          // Figma screen padding is 0 16 12 16: nothing sits near the status
          // bar, so the hero stays centred on the full height.
          paddingBottom: insets.bottom + spacing.lg,
        },
      ]}
    >
      <View style={styles.hero}>
        <BrandLogo />
        <Text
          style={[styles.centred, text.body, { color: colors.textMuted, marginTop: spacing.xl }]}
        >
          Made to get paid.
        </Text>
      </View>

      <View style={{ gap: spacing.mdLg }}>
        <Button label="Create Account" onPress={onCreateAccount} />
        <Button
          label="Sign In"
          variant="secondary"
          onPress={() => router.push('/(auth)/sign-in')}
        />
        <Text
          onLongPress={__DEV__ ? () => setSheetOpen(true) : undefined}
          style={[
            styles.centred,
            text.captionSm,
            { color: colors.textFaint, marginTop: spacing.mdLg },
          ]}
        >
          Available in the UK
        </Text>
      </View>

      <BottomSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        accessibilityLabel="Not available in your region yet"
      >
        <View
          style={[
            styles.badge,
            {
              width: size.badge,
              height: size.badge,
              borderRadius: radius.pill,
              backgroundColor: colors.primarySoft,
            },
          ]}
        >
          <Text style={[text.h3, { color: colors.accentText }]}>i</Text>
        </View>

        <Text style={[text.h2, { color: colors.textPrimary }]}>
          Not available in your region <Text style={{ color: colors.accentText }}>yet</Text>
        </Text>

        <Text style={[text.bodySm, { color: colors.textSecondary }]}>
          DittoPay currently supports merchants in the UK. We'll let you know when that changes.
        </Text>

        <Button
          label="Got it"
          variant="secondary"
          size="md"
          onPress={() => setSheetOpen(false)}
          style={{ marginTop: spacing.xs }}
        />
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  centred: { textAlign: 'center' },
  badge: { alignItems: 'center', justifyContent: 'center' },
});
