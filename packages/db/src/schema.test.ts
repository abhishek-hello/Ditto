import { getTableConfig } from 'drizzle-orm/pg-core';
import { describe, expect, it } from 'vitest';
import { profiles, transactions, wallets } from './schema';

const tables = { profiles, wallets, transactions };

describe('schema conventions (DESIGN.md → Money)', () => {
  it('stores money as bigint columns named *_pence', () => {
    for (const table of Object.values(tables)) {
      for (const col of getTableConfig(table).columns) {
        const looksLikeMoney = /amount|balance|fee|total/i.test(col.name);
        if (!looksLikeMoney) continue;
        expect(col.name, `${getTableConfig(table).name}.${col.name}`).toMatch(/_pence$/);
        expect(col.getSQLType()).toBe('bigint');
      }
    }
  });

  it('enables RLS on every public table', () => {
    for (const table of Object.values(tables)) {
      const cfg = getTableConfig(table);
      expect(cfg.enableRLS, cfg.name).toBe(true);
      expect(cfg.policies.length, `${cfg.name} has policies`).toBeGreaterThan(0);
    }
  });

  it('pins currency to GBP', () => {
    for (const table of [wallets, transactions]) {
      const currency = getTableConfig(table).columns.find((c) => c.name === 'currency');
      expect(currency?.default).toBe('GBP');
    }
  });
});
