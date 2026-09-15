import { pence, type Wallet } from '@ditto/core';
import { type Db, wallets } from '@ditto/db';
import { and, eq } from 'drizzle-orm';
import { Router } from 'express';
import { HttpError, ok } from '../lib/http';

export function walletsRouter(db: Db) {
  const router = Router();

  router.get('/wallets/me', async (req, res, next) => {
    try {
      const row = await db.query.wallets.findFirst({
        where: and(eq(wallets.ownerId, req.userId ?? ''), eq(wallets.currency, 'GBP')),
      });
      if (!row) throw new HttpError(404, 'wallet_not_found', 'No GBP wallet');

      const wallet: Wallet = {
        id: row.id as Wallet['id'],
        ownerId: row.ownerId as Wallet['ownerId'],
        currency: 'GBP',
        balance: pence(row.balancePence),
        createdAt: row.createdAt,
      };
      ok(res, wallet);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
