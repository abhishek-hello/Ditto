'use client';

import { useEffect, useState } from 'react';
import { getApi } from '@/lib/api';

type State =
  | { kind: 'loading' }
  | { kind: 'ok'; version: string }
  | { kind: 'error'; message: string };

export function ApiStatus() {
  const [state, setState] = useState<State>({ kind: 'loading' });

  useEffect(() => {
    let cancelled = false;
    getApi()
      .health()
      .then((h) => !cancelled && setState({ kind: 'ok', version: h.version }))
      .catch((e: unknown) => {
        if (!cancelled)
          setState({ kind: 'error', message: e instanceof Error ? e.message : 'failed' });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.kind === 'loading') return <p className="text-sm text-neutral-500">Checking API…</p>;
  if (state.kind === 'error') {
    return <p className="text-sm text-red-600">API unreachable: {state.message}</p>;
  }
  return <p className="text-sm text-green-700">API online (v{state.version})</p>;
}
