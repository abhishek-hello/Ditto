import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

/**
 * Re-authentication gate (Figma 1:171645): confirm password / Face or
 * fingerprint / verify mobile (OTP). Shown before any sensitive change.
 * Callers pass `?next=<route>`; on success we replace ourselves with it.
 */
export default function ReauthScreen() {
  const router = useRouter();
  const { next } = useLocalSearchParams<{ next?: string }>();
  const destination = (next ?? '/account') as Href;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm it’s you</Text>
      <Text style={styles.notes}>
        Confirm your password, use Face ID / fingerprint, or verify your mobile. Returns to:{' '}
        {String(destination)}
      </Text>
      <Pressable style={styles.button} onPress={() => router.replace(destination)}>
        <Text style={styles.buttonText}>Confirm (placeholder)</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12 },
  title: { fontSize: 28, fontWeight: '600' },
  notes: { fontSize: 15, color: '#4b5563', lineHeight: 22 },
  button: {
    marginTop: 12,
    backgroundColor: '#111827',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
});
