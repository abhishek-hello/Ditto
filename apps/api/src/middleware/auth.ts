import type { DittoSupabaseClient } from '@ditto/supabase';
import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../lib/http';

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
  }
}

/**
 * Verifies the Supabase access token sent as `Authorization: Bearer <jwt>`
 * and attaches `req.userId`. Uses the anon-key client so verification goes
 * through Supabase Auth rather than trusting a locally-decoded JWT.
 */
export function requireAuth(authClient: DittoSupabaseClient) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const header = req.header('authorization') ?? '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      next(new HttpError(401, 'unauthenticated', 'Missing bearer token'));
      return;
    }

    const { data, error } = await authClient.auth.getUser(token);
    if (error || !data.user) {
      next(new HttpError(401, 'unauthenticated', 'Invalid or expired token'));
      return;
    }
    req.userId = data.user.id;
    next();
  };
}
