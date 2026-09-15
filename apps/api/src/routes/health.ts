import { Router } from 'express';
import { ok } from '../lib/http';

export const healthRouter = Router();

healthRouter.get('/health', (_req, res) => {
  ok(res, { status: 'ok' as const, version: process.env.npm_package_version ?? '0.0.0' });
});
