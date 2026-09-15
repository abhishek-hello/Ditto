/**
 * Ditto Pay database schema — the source of truth.
 *
 * Rules (DESIGN.md):
 *  - Money is integer pence in `bigint` columns named `*_pence`.
 *  - GBP only. The currency column exists for auditability, not for FX.
 *  - Clients (anon key) may only READ their own rows via the RLS policies below.
 *    All writes that move money go through apps/api, which connects as the
 *    `postgres` role via SUPABASE_DB_URL and therefore bypasses RLS.
 *
 * After editing:  npm run db:generate -w @ditto/db   (writes SQL to ./drizzle)
 *                 npm run db:migrate  -w @ditto/db   (applies it)
 */
import { relations, sql } from 'drizzle-orm';
import {
  bigint,
  check,
  index,
  pgPolicy,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { authenticatedRole, authUid, authUsers } from 'drizzle-orm/supabase';

export const TRANSACTION_KINDS = ['p2p', 'top_up', 'withdrawal', 'merchant'] as const;
export const TRANSACTION_STATUSES = ['pending', 'completed', 'failed', 'reversed'] as const;

const sqlList = (values: readonly string[]) => sql.raw(values.map((v) => `'${v}'`).join(', '));

// ── profiles ────────────────────────────────────────────────────────────────
export const profiles = pgTable(
  'profiles',
  {
    id: uuid('id')
      .primaryKey()
      .references(() => authUsers.id, { onDelete: 'cascade' }),
    handle: text('handle').notNull(),
    displayName: text('display_name').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex('profiles_handle_key').on(t.handle),
    check('profiles_handle_format', sql`${t.handle} ~ '^[a-z0-9_]{3,24}$'`),
    check('profiles_display_name_length', sql`char_length(${t.displayName}) between 1 and 70`),
    pgPolicy('profiles are readable by any signed-in user', {
      for: 'select',
      to: authenticatedRole,
      using: sql`true`,
    }),
    pgPolicy('users update their own profile', {
      for: 'update',
      to: authenticatedRole,
      using: sql`${t.id} = ${authUid}`,
      withCheck: sql`${t.id} = ${authUid}`,
    }),
  ],
).enableRLS();

// ── wallets ─────────────────────────────────────────────────────────────────
export const wallets = pgTable(
  'wallets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    ownerId: uuid('owner_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    currency: text('currency').notNull().default('GBP'),
    balancePence: bigint('balance_pence', { mode: 'number' }).notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex('wallets_owner_currency_key').on(t.ownerId, t.currency),
    check('wallets_currency_gbp', sql`${t.currency} = 'GBP'`),
    check('wallets_balance_non_negative', sql`${t.balancePence} >= 0`),
    pgPolicy('users read their own wallets', {
      for: 'select',
      to: authenticatedRole,
      using: sql`${t.ownerId} = ${authUid}`,
    }),
  ],
).enableRLS();

// ── transactions ────────────────────────────────────────────────────────────
export const transactions = pgTable(
  'transactions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    kind: text('kind', { enum: TRANSACTION_KINDS }).notNull(),
    status: text('status', { enum: TRANSACTION_STATUSES }).notNull().default('pending'),
    currency: text('currency').notNull().default('GBP'),
    amountPence: bigint('amount_pence', { mode: 'number' }).notNull(),
    fromWalletId: uuid('from_wallet_id').references(() => wallets.id),
    toWalletId: uuid('to_wallet_id').references(() => wallets.id),
    reference: text('reference'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index('transactions_from_wallet_idx').on(t.fromWalletId, t.createdAt.desc()),
    index('transactions_to_wallet_idx').on(t.toWalletId, t.createdAt.desc()),
    check('transactions_kind_valid', sql`${t.kind} in (${sqlList(TRANSACTION_KINDS)})`),
    check('transactions_status_valid', sql`${t.status} in (${sqlList(TRANSACTION_STATUSES)})`),
    check('transactions_currency_gbp', sql`${t.currency} = 'GBP'`),
    check('transactions_amount_positive', sql`${t.amountPence} > 0`),
    check('transactions_reference_length', sql`char_length(${t.reference}) <= 35`),
    check(
      'transactions_has_a_wallet',
      sql`${t.fromWalletId} is not null or ${t.toWalletId} is not null`,
    ),
    pgPolicy('users read transactions touching their wallets', {
      for: 'select',
      to: authenticatedRole,
      using: sql`exists (
        select 1 from public.wallets w
        where w.owner_id = ${authUid}
          and (w.id = ${t.fromWalletId} or w.id = ${t.toWalletId})
      )`,
    }),
  ],
).enableRLS();

// ── relations (for db.query.* relational API) ───────────────────────────────
export const profilesRelations = relations(profiles, ({ many }) => ({
  wallets: many(wallets),
}));

export const walletsRelations = relations(wallets, ({ one, many }) => ({
  owner: one(profiles, { fields: [wallets.ownerId], references: [profiles.id] }),
  outgoing: many(transactions, { relationName: 'from' }),
  incoming: many(transactions, { relationName: 'to' }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  fromWallet: one(wallets, {
    fields: [transactions.fromWalletId],
    references: [wallets.id],
    relationName: 'from',
  }),
  toWallet: one(wallets, {
    fields: [transactions.toWalletId],
    references: [wallets.id],
    relationName: 'to',
  }),
}));

// ── row types ───────────────────────────────────────────────────────────────
export type ProfileRow = typeof profiles.$inferSelect;
export type NewProfileRow = typeof profiles.$inferInsert;
export type WalletRow = typeof wallets.$inferSelect;
export type NewWalletRow = typeof wallets.$inferInsert;
export type TransactionRow = typeof transactions.$inferSelect;
export type NewTransactionRow = typeof transactions.$inferInsert;
