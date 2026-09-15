import {
  type CreateP2pPayment,
  createP2pPaymentSchema,
  pence,
  type Transaction,
} from '@ditto/core';
import { type Db, profiles, type TransactionRow, transactions, wallets } from '@ditto/db';
import { desc, eq, inArray, or } from 'drizzle-orm';
import { Router } from 'express';
import { HttpError, ok } from '../lib/http';
import { validateBody } from '../middleware/validate';

function toTransaction(row: TransactionRow): Transaction {
  return {
    id: row.id as Transaction['id'],
    kind: row.kind,
    status: row.status,
    currency: 'GBP',
    amount: pence(row.amountPence),
    fromWalletId: row.fromWalletId as Transaction['fromWalletId'],
    toWalletId: row.toWalletId as Transaction['toWalletId'],
    reference: row.reference,
    createdAt: row.createdAt,
  };
}

export function paymentsRouter(db: Db) {
  const router = Router();

  router.get('/payments', async (req, res, next) => {
    try {
      const mine = await db
        .select({ id: wallets.id })
        .from(wallets)
        .where(eq(wallets.ownerId, req.userId ?? ''));
      const ids = mine.map((w) => w.id);
      if (ids.length === 0) {
        ok(res, [] as Transaction[]);
        return;
      }
      const rows = await db
        .select()
        .from(transactions)
        .where(or(inArray(transactions.fromWalletId, ids), inArray(transactions.toWalletId, ids)))
        .orderBy(desc(transactions.createdAt))
        .limit(50);
      ok(res, rows.map(toTransaction));
    } catch (err) {
      next(err);
    }
  });

  router.post('/payments', validateBody(createP2pPaymentSchema), async (req, _res, next) => {
    try {
      const input = req.body as CreateP2pPayment;
      const recipient = await db.query.profiles.findFirst({
        columns: { id: true },
        where: eq(profiles.handle, input.toHandle),
      });
      if (!recipient) throw new HttpError(404, 'recipient_not_found', 'No user with that handle');
      if (recipient.id === req.userId) {
        throw new HttpError(422, 'self_payment', 'You cannot pay yourself');
      }
      // TODO(ledger): db.transaction(async (tx) => { lock both wallets FOR UPDATE,
      // check balance, debit, credit, insert transactions row }). See docs/architecture.md.
      throw new HttpError(501, 'not_implemented', 'P2P ledger not wired up yet');
    } catch (err) {
      next(err);
    }
  });

  return router;
}
