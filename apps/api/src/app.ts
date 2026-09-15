import { createDb, type Db } from '@ditto/db';
import { createPublicClient } from '@ditto/supabase';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import type { Env } from './env';
import { fail } from './lib/http';
import type { Logger } from './lib/logger';
import { requireAuth } from './middleware/auth';
import { errorHandler } from './middleware/error';
import { healthRouter } from './routes/health';
import { paymentsRouter } from './routes/payments';
import { walletsRouter } from './routes/wallets';

export interface AppDeps {
  /** Injectable for tests; defaults to a real Drizzle connection. */
  db?: Db;
}

export function createApp(env: Env, logger: Logger, deps: AppDeps = {}) {
  const app = express();

  // Drizzle over Supabase Postgres. Bypasses RLS — server-only.
  const db = deps.db ?? createDb({ url: env.SUPABASE_DB_URL });
  // Anon client is used solely to verify user access tokens with Supabase Auth.
  const auth = createPublicClient({ url: env.SUPABASE_URL, key: env.SUPABASE_ANON_KEY });

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: env.API_CORS_ORIGINS, credentials: true }));
  app.use(express.json({ limit: '100kb' }));
  app.use(pinoHttp({ logger, autoLogging: { ignore: (req) => req.url === '/health' } }));

  app.use(healthRouter);

  const v1 = express.Router();
  v1.use(requireAuth(auth));
  v1.use(walletsRouter(db));
  v1.use(paymentsRouter(db));
  app.use('/v1', v1);

  app.use((_req, res) => fail(res, 404, 'not_found', 'Route not found'));
  app.use(errorHandler(logger));

  return Object.assign(app, { close: () => db.close() });
}
