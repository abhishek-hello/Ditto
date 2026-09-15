import { createApp } from './app';
import { loadEnv } from './env';
import { createLogger } from './lib/logger';

const env = loadEnv();
const logger = createLogger(env.LOG_LEVEL, env.NODE_ENV === 'development');
const app = createApp(env, logger);

const server = app.listen(env.PORT, () => {
  logger.info({ port: env.PORT, env: env.NODE_ENV }, 'Ditto Pay API listening');
});

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => {
    logger.info({ signal }, 'Shutting down');
    server.close(async () => {
      await app.close();
      process.exit(0);
    });
  });
}
