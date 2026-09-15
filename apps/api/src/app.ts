import { createPublicClient, createServiceClient } from '@ditto/supabase';
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

export function createApp(env: Env, logger: Logger) {
  const app = express();

  const db = createServiceClient({ url: env.SUPABASE_URL, key: env.SUPABASE_SERVICE_ROLE_KEY });
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

  return app;
}
