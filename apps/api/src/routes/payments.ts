import { type CreateP2pPayment, createP2pPaymentSchema } from '@ditto/core';
import type { DittoSupabaseClient } from '@ditto/supabase';
import { Router } from 'express';
import { HttpError, ok } from '../lib/http';
import { validateBody } from '../middleware/validate';

export function paymentsRouter(db: DittoSupabaseClient) {
  const router = Router();

  router.get('/payments', async (req, res, next) => {
    try {
      const { data: wallets } = await db
        .from('wallets')
        .select('id')
        .eq('owner_id', req.userId ?? '');
      const ids = (wallets ?? []).map((w) => w.id);
      const { data, error } = await db
        .from('transactions')
        .select('*')
        .or(`from_wallet_id.in.(${ids.join(',')}),to_wallet_id.in.(${ids.join(',')})`)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw new HttpError(500, 'db_error', error.message);
      ok(res, data);
    } catch (err) {
      next(err);
    }
  });

  router.post('/payments', validateBody(createP2pPaymentSchema), async (req, _res, next) => {
    try {
      const input = req.body as CreateP2pPayment;
      // TODO(ledger): move into a Postgres function so debit + credit + insert
      // are one atomic transaction. See docs/architecture.md → "Ledger".
      const { data: recipient } = await db
        .from('profiles')
        .select('id')
        .eq('handle', input.toHandle)
        .single();
      if (!recipient) throw new HttpError(404, 'recipient_not_found', 'No user with that handle');
      if (recipient.id === req.userId) {
        throw new HttpError(422, 'self_payment', 'You cannot pay yourself');
      }
      throw new HttpError(501, 'not_implemented', 'P2P ledger not wired up yet');
    } catch (err) {
      next(err);
    }
  });

  return router;
}
