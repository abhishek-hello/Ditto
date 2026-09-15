import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';
import { HttpError } from '../lib/http';

/** Validates `req.body` against a zod schema and replaces it with the parsed output. */
export function validateBody<T extends ZodType>(schema: T) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const first = result.error.issues[0];
      const where = first?.path.join('.') || 'body';
      next(new HttpError(422, 'validation_failed', `${where}: ${first?.message}`));
      return;
    }
    req.body = result.data;
    next();
  };
}
