import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export type SessionStatus = 'loading' | 'signed-out' | 'signed-in';

const SessionContext = createContext<SessionStatus>('loading');

/** Tracks the Supabase auth session and exposes a coarse status to the router. */
export function SessionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SessionStatus>('loading');

  useEffect(() => {
    let active = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (active) setStatus(data.session ? 'signed-in' : 'signed-out');
      })
      .catch(() => {
        if (active) setStatus('signed-out');
      });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setStatus(session ? 'signed-in' : 'signed-out');
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return <SessionContext.Provider value={status}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const status = useContext(SessionContext);
  return { status, isSignedIn: status === 'signed-in' };
}
