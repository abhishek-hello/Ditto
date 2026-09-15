import { formatPence, pence } from '@ditto/core';
import { ApiStatus } from '@/components/ApiStatus';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 px-6">
      <h1 className="text-4xl font-semibold tracking-tight">Ditto Pay</h1>
      <p className="text-lg text-neutral-600">
        UK mobile payments. Monorepo scaffold is live: this page renders{' '}
        <code className="rounded bg-neutral-100 px-1">@ditto/core</code> from the shared packages,
        e.g. {formatPence(pence(1250))}.
      </p>
      <ul className="list-disc space-y-1 pl-6 text-neutral-700">
        <li>Web: Next.js App Router (this app)</li>
        <li>Mobile: Expo + expo-router</li>
        <li>API: Express 5 + Supabase</li>
      </ul>
      <ApiStatus />
    </main>
  );
}
