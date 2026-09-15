import type { ApiErr, ApiOk } from '@ditto/core';
import type { Response } from 'express';

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export function ok<T>(res: Response, data: T, status = 200): void {
  const body: ApiOk<T> = { ok: true, data };
  res.status(status).json(body);
}

export function fail(res: Response, status: number, code: string, message: string): void {
  const body: ApiErr = { ok: false, error: { code, message } };
  res.status(status).json(body);
}
