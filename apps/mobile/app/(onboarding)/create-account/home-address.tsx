import { normalisePostcode } from '@ditto/core';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button } from '@/components/Button';
import { FooterBar } from '@/components/FooterBar';
import { FormScreen } from '@/components/FormScreen';
import { ScreenHeading } from '@/components/ScreenHeading';
import { SelectField, type SelectOption } from '@/components/SelectField';
import { StageHeader } from '@/components/StageHeader';
import { TextField } from '@/components/TextField';
import { useTheme } from '@/theme';

const POSTCODE_ERROR = 'Enter a full UK postcode, e.g. SL7 1AB';

const DEFAULT_COUNTRY = 'United Kingdom';
const DEFAULT_COUNTY = 'Buckinghamshire';
const COUNTRIES: SelectOption[] = [{ value: DEFAULT_COUNTRY }, { value: 'Ireland' }];
const COUNTIES: SelectOption[] = [
  { value: DEFAULT_COUNTY },
  { value: 'Greater London' },
  { value: 'Oxfordshire' },
];

/**
 * The merchant's home address.
 *
 * The handoff labels this "Sector 3 of 4 · Business details" while filing it
 * under account creation, and fills the third segment — that inconsistency is
 * reproduced rather than tidied, because which stage this belongs to is a
 * product decision (see docs/figma-screens.md §3, step 7).
 */
export default function HomeAddressScreen() {
  const { spacing } = useTheme();
  const router = useRouter();

  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [county, setCounty] = useState(DEFAULT_COUNTY);
  const [postcode, setPostcode] = useState('');
  const [town, setTown] = useState('');
  const [street, setStreet] = useState('');
  const [house, setHouse] = useState('');
  const [flat, setFlat] = useState('');
  // Only set by pressing Continue: complaining mid-postcode is noise.
  const [postcodeError, setPostcodeError] = useState('');

  const onContinue = () => {
    if (!normalisePostcode(postcode)) {
      setPostcodeError(POSTCODE_ERROR);
      return;
    }
    router.push('/(onboarding)/business/profession');
  };

  return (
    <FormScreen
      header={<StageHeader fills={[1, 1, 0.12, 0]} label="Sector 3 of 4 · Business details" />}
      gap={spacing.xlXxl}
      footer={
        <FooterBar>
          <Button label="Continue" onPress={onContinue} />
        </FooterBar>
      }
    >
      <ScreenHeading title="Your home address" highlight="home address" />

      <SelectField
        label="Country"
        value={country}
        options={COUNTRIES}
        onChange={setCountry}
        sheetTitle="Country"
      />
      <SelectField
        label="County / region"
        value={county}
        options={COUNTIES}
        onChange={setCounty}
        sheetTitle="County / region"
      />
      <TextField
        label="Postcode"
        value={postcode}
        onChangeText={(next) => {
          setPostcode(next.toUpperCase());
          setPostcodeError('');
        }}
        placeholder="SL7 1AB"
        autoCapitalize="characters"
        autoComplete="postal-code"
        textContentType="postalCode"
        error={postcodeError || undefined}
      />
      <TextField
        label="Town / city"
        value={town}
        onChangeText={setTown}
        autoComplete="postal-address-locality"
      />
      <TextField
        label="Street name"
        value={street}
        onChangeText={setStreet}
        autoComplete="street-address"
      />
      <TextField
        label="House name or number"
        value={house}
        onChangeText={setHouse}
        helper="House name OR number — not both"
      />
      <TextField
        label="Flat / unit (optional)"
        value={flat}
        onChangeText={setFlat}
        placeholder="Flat 2"
      />
    </FormScreen>
  );
}
