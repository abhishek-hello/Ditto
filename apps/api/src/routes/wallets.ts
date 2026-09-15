import { pence, type Wallet } from '@ditto/core';
import type { DittoSupabaseClient } from '@ditto/supabase';
import { Router } from 'express';
import { HttpError, ok } from '../lib/http';

export function walletsRouter(db: DittoSupabaseClient) {
  const router = Router();

  router.get('/wallets/me', async (req, res, next) => {
    try {
      const { data, error } = await db
        .from('wallets')
        .select('id, owner_id, currency, balance_pence, created_at')
        .eq('owner_id', req.userId ?? '')
        .eq('currency', 'GBP')
        .single();
      if (error || !data) throw new HttpError(404, 'wallet_not_found', 'No GBP wallet');

      const wallet: Wallet = {
        id: data.id as Wallet['id'],
        ownerId: data.owner_id as Wallet['ownerId'],
        currency: 'GBP',
        balance: pence(Number(data.balance_pence)),
        createdAt: data.created_at,
      };
      ok(res, wallet);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
