import type { ApiResponse, CreateP2pPaymentInput, Transaction, Wallet } from '@ditto/core';

export interface ApiClientOptions {
  baseUrl: string;
  /** Returns the current Supabase access token, or null when signed out. */
  getAccessToken: () => Promise<string | null>;
  fetch?: typeof fetch;
}

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function createApiClient(options: ApiClientOptions) {
  const doFetch = options.fetch ?? fetch;
  const baseUrl = options.baseUrl.replace(/\/$/, '');

  async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const token = await options.getAccessToken();
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (token) headers.Authorization = `Bearer ${token}`;

    const init: RequestInit = { method, headers };
    if (body !== undefined) init.body = JSON.stringify(body);
    const res = await doFetch(`${baseUrl}${path}`, init);

    const json = (await res.json().catch(() => null)) as ApiResponse<T> | null;
    if (!json) throw new ApiError('bad_response', `Non-JSON response (${res.status})`, res.status);
    if (!json.ok) throw new ApiError(json.error.code, json.error.message, res.status);
    return json.data;
  }

  return {
    health: () => request<{ status: 'ok'; version: string }>('GET', '/health'),
    wallets: {
      mine: () => request<Wallet>('GET', '/v1/wallets/me'),
    },
    payments: {
      create: (input: CreateP2pPaymentInput) => request<Transaction>('POST', '/v1/payments', input),
      list: () => request<Transaction[]>('GET', '/v1/payments'),
    },
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
