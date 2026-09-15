import pino from 'pino';

export function createLogger(level: string, pretty: boolean) {
  return pino({
    level,
    ...(pretty ? { transport: { target: 'pino-pretty', options: { colorize: true } } } : {}),
    redact: ['req.headers.authorization', 'req.headers.cookie'],
  });
}

export type Logger = ReturnType<typeof createLogger>;
