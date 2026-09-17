import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '@/components/Button';
import { FormScreen } from '@/components/FormScreen';
import { ScreenHeading } from '@/components/ScreenHeading';
import { SelectField, type SelectOption } from '@/components/SelectField';
import { StageHeader } from '@/components/StageHeader';
import { useTheme } from '@/theme';

/**
 * Ditto Pay is UK-only (AGENTS.md hard rule 2). The other rows are listed so the
 * user can see the roadmap, and every one of them is disabled — this screen
 * shows a plan, it is not a currency switch.
 */
const DEFAULT_COUNTRY = 'United Kingdom (GBP)';
const COUNTRIES: SelectOption[] = [
  { value: DEFAULT_COUNTRY },
  { value: 'Australia (AUD)', label: 'Australia (AUD) — coming soon', disabled: true },
  { value: 'Eurozone (EUR)', label: 'Eurozone (EUR) — coming soon', disabled: true },
  { value: 'New Zealand (NZD)', label: 'New Zealand (NZD) — coming soon', disabled: true },
  { value: 'United States (USD)', label: 'United States (USD) — coming soon', disabled: true },
];

const DEFAULT_LANGUAGE = 'English';
const LANGUAGES: SelectOption[] = [
  { value: DEFAULT_LANGUAGE },
  { value: 'French', label: 'French — coming soon', disabled: true },
  { value: 'German', label: 'German — coming soon', disabled: true },
  { value: 'Italian', label: 'Italian — coming soon', disabled: true },
  { value: 'Spanish', label: 'Spanish — coming soon', disabled: true },
];

/** Stage 1, the opening step: where the merchant trades and in what language. */
export default function CountryLanguageScreen() {
  const { spacing } = useTheme();
  const router = useRouter();
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);

  return (
    <FormScreen
      header={
        <StageHeader
          fills={[0.04, 0, 0, 0]}
          label="Stage 1 of 4 · Account creation — where you trade"
          onBack={() => router.replace('/(auth)/welcome')}
        />
      }
    >
      <ScreenHeading title="Country and language" highlight="language" />

      <SelectField
        label="Select country"
        sheetTitle="Select country"
        value={country}
        options={COUNTRIES}
        onChange={setCountry}
        helper="Your bank account must match the currency of your operating country."
        containerStyle={{ marginTop: spacing.xxlXxxl }}
      />

      <SelectField
        label="Select language"
        sheetTitle="Select language"
        value={language}
        options={LANGUAGES}
        onChange={setLanguage}
        containerStyle={{ marginTop: spacing.xxlXxxl }}
      />

      <View style={styles.spacer} />

      <Button
        label="Continue"
        onPress={() => router.push('/(onboarding)/create-account/merchant-type')}
      />
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  spacer: { flex: 1, minHeight: 24 },
});
