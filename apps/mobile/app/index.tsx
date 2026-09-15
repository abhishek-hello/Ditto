import { formatPence, pence } from '@ditto/core';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { api } from '@/lib/api';

export default function HomeScreen() {
  const [apiStatus, setApiStatus] = useState('Checking API…');

  useEffect(() => {
    api
      .health()
      .then((h) => setApiStatus(`API online (v${h.version})`))
      .catch((e: unknown) =>
        setApiStatus(`API unreachable: ${e instanceof Error ? e.message : 'failed'}`),
      );
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ditto Pay</Text>
      <Text style={styles.body}>
        Monorepo scaffold is live. This screen renders @ditto/core from the shared packages, e.g.{' '}
        {formatPence(pence(1250))}.
      </Text>
      <Text style={styles.status}>{apiStatus}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 12 },
  title: { fontSize: 32, fontWeight: '600' },
  body: { fontSize: 16, color: '#4b5563' },
  status: { fontSize: 14, color: '#6b7280' },
});
