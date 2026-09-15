import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from './app';
import { loadEnv } from './env';
import { createLogger } from './lib/logger';

const env = loadEnv({
  NODE_ENV: 'test',
  SUPABASE_URL: 'http://localhost:54321',
  SUPABASE_ANON_KEY: 'anon',
  SUPABASE_SERVICE_ROLE_KEY: 'service',
});
const app = createApp(env, createLogger('silent', false));

describe('api', () => {
  it('serves /health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.data.status).toBe('ok');
  });

  it('rejects unauthenticated /v1 calls', async () => {
    const res = await request(app).get('/v1/wallets/me');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('unauthenticated');
  });

  it('returns 404 envelope for unknown routes', async () => {
    const res = await request(app).get('/nope');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      ok: false,
      error: { code: 'not_found', message: 'Route not found' },
    });
  });
});
