import { z } from 'zod';
import { pence } from './money';
import { normaliseSortCode, normaliseUkMobile } from './uk';

/** Integer pence, non-negative. Use `.transform` output as `Pence`. */
export const penceSchema = z
  .number()
  .int()
  .nonnegative()
  .transform((n) => pence(n));

export const sortCodeSchema = z.string().transform((s, ctx) => {
  const normalised = normaliseSortCode(s);
  if (!normalised) {
    ctx.addIssue({ code: 'custom', message: 'Sort code must be 6 digits' });
    return z.NEVER;
  }
  return normalised;
});

export const accountNumberSchema = z.string().regex(/^\d{8}$/, 'Account number must be 8 digits');

export const ukMobileSchema = z.string().transform((s, ctx) => {
  const normalised = normaliseUkMobile(s);
  if (!normalised) {
    ctx.addIssue({ code: 'custom', message: 'Enter a valid UK mobile number' });
    return z.NEVER;
  }
  return normalised;
});

export const handleSchema = z
  .string()
  .min(3)
  .max(24)
  .regex(/^[a-z0-9_]+$/, 'Handles are lowercase letters, numbers and underscores');

/** POST /v1/payments — send money to another Ditto user by handle. */
export const createP2pPaymentSchema = z.object({
  toHandle: handleSchema,
  amount: penceSchema,
  reference: z.string().max(35).optional(),
});
export type CreateP2pPaymentInput = z.input<typeof createP2pPaymentSchema>;
export type CreateP2pPayment = z.output<typeof createP2pPaymentSchema>;

/** POST /v1/bank-accounts — link a UK bank account. */
export const linkBankAccountSchema = z.object({
  sortCode: sortCodeSchema,
  accountNumber: accountNumberSchema,
  accountHolderName: z.string().min(1).max(70),
});
export type LinkBankAccountInput = z.input<typeof linkBankAccountSchema>;
