import type { NextFunction, Request, Response } from 'express';
import { fail, HttpError } from '../lib/http';
import type { Logger } from '../lib/logger';

export function errorHandler(logger: Logger) {
  return (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
    if (err instanceof HttpError) {
      fail(res, err.status, err.code, err.message);
      return;
    }
    if (err instanceof SyntaxError && 'body' in err) {
      fail(res, 400, 'invalid_json', 'Request body is not valid JSON');
      return;
    }
    logger.error({ err }, 'Unhandled error');
    fail(res, 500, 'internal_error', 'Something went wrong');
  };
}
