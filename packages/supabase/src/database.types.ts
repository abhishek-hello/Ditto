/**
 * GENERATED FILE — do not edit by hand.
 * Regenerate with:  npm run types:generate -w @ditto/supabase
 *
 * This placeholder mirrors the initial migration so the repo typechecks before
 * Supabase has been started locally.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          handle: string;
          display_name: string;
          created_at: string;
        };
        Insert: {
          id: string;
          handle: string;
          display_name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          handle?: string;
          display_name?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      wallets: {
        Row: {
          id: string;
          owner_id: string;
          currency: string;
          balance_pence: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          currency?: string;
          balance_pence?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          currency?: string;
          balance_pence?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      transactions: {
        Row: {
          id: string;
          kind: string;
          status: string;
          currency: string;
          amount_pence: number;
          from_wallet_id: string | null;
          to_wallet_id: string | null;
          reference: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          kind: string;
          status?: string;
          currency?: string;
          amount_pence: number;
          from_wallet_id?: string | null;
          to_wallet_id?: string | null;
          reference?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          kind?: string;
          status?: string;
          currency?: string;
          amount_pence?: number;
          from_wallet_id?: string | null;
          to_wallet_id?: string | null;
          reference?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
