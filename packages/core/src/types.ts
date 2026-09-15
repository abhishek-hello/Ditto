/**
 * Canonical domain types for Ditto Pay.
 *
 * Money is ALWAYS an integer number of pence (`Pence`). Never store or transmit
 * floating-point pounds. See DESIGN.md → "Money".
 */

/** Integer number of pence. 1250 === £12.50 */
export type Pence = number & { readonly __brand: 'Pence' };

export type Currency = 'GBP';

export type UserId = string & { readonly __brand: 'UserId' };
export type WalletId = string & { readonly __brand: 'WalletId' };
export type TransactionId = string & { readonly __brand: 'TransactionId' };

export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'reversed';
export type TransactionKind = 'p2p' | 'top_up' | 'withdrawal' | 'merchant';

export interface Profile {
  id: UserId;
  handle: string;
  displayName: string;
  createdAt: string;
}

export interface Wallet {
  id: WalletId;
  ownerId: UserId;
  currency: Currency;
  balance: Pence;
  createdAt: string;
}

export interface Transaction {
  id: TransactionId;
  kind: TransactionKind;
  status: TransactionStatus;
  currency: Currency;
  amount: Pence;
  fromWalletId: WalletId | null;
  toWalletId: WalletId | null;
  reference: string | null;
  createdAt: string;
}

/** Standard API envelope. Every apps/api response uses one of these shapes. */
export type ApiOk<T> = { ok: true; data: T };
export type ApiErr = { ok: false; error: { code: string; message: string } };
export type ApiResponse<T> = ApiOk<T> | ApiErr;
