CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"handle" text NOT NULL,
	"display_name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_handle_format" CHECK ("profiles"."handle" ~ '^[a-z0-9_]{3,24}$'),
	CONSTRAINT "profiles_display_name_length" CHECK (char_length("profiles"."display_name") between 1 and 70)
);
--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"currency" text DEFAULT 'GBP' NOT NULL,
	"amount_pence" bigint NOT NULL,
	"from_wallet_id" uuid,
	"to_wallet_id" uuid,
	"reference" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "transactions_kind_valid" CHECK ("transactions"."kind" in ('p2p', 'top_up', 'withdrawal', 'merchant')),
	CONSTRAINT "transactions_status_valid" CHECK ("transactions"."status" in ('pending', 'completed', 'failed', 'reversed')),
	CONSTRAINT "transactions_currency_gbp" CHECK ("transactions"."currency" = 'GBP'),
	CONSTRAINT "transactions_amount_positive" CHECK ("transactions"."amount_pence" > 0),
	CONSTRAINT "transactions_reference_length" CHECK (char_length("transactions"."reference") <= 35),
	CONSTRAINT "transactions_has_a_wallet" CHECK ("transactions"."from_wallet_id" is not null or "transactions"."to_wallet_id" is not null)
);
--> statement-breakpoint
ALTER TABLE "transactions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "wallets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"currency" text DEFAULT 'GBP' NOT NULL,
	"balance_pence" bigint DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "wallets_currency_gbp" CHECK ("wallets"."currency" = 'GBP'),
	CONSTRAINT "wallets_balance_non_negative" CHECK ("wallets"."balance_pence" >= 0)
);
--> statement-breakpoint
ALTER TABLE "wallets" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_from_wallet_id_wallets_id_fk" FOREIGN KEY ("from_wallet_id") REFERENCES "public"."wallets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_to_wallet_id_wallets_id_fk" FOREIGN KEY ("to_wallet_id") REFERENCES "public"."wallets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_owner_id_profiles_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "profiles_handle_key" ON "profiles" USING btree ("handle");--> statement-breakpoint
CREATE INDEX "transactions_from_wallet_idx" ON "transactions" USING btree ("from_wallet_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "transactions_to_wallet_idx" ON "transactions" USING btree ("to_wallet_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE UNIQUE INDEX "wallets_owner_currency_key" ON "wallets" USING btree ("owner_id","currency");--> statement-breakpoint
CREATE POLICY "profiles are readable by any signed-in user" ON "profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "users update their own profile" ON "profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ("profiles"."id" = (select auth.uid())) WITH CHECK ("profiles"."id" = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "users read transactions touching their wallets" ON "transactions" AS PERMISSIVE FOR SELECT TO "authenticated" USING (exists (
        select 1 from public.wallets w
        where w.owner_id = (select auth.uid())
          and (w.id = "transactions"."from_wallet_id" or w.id = "transactions"."to_wallet_id")
      ));--> statement-breakpoint
CREATE POLICY "users read their own wallets" ON "wallets" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("wallets"."owner_id" = (select auth.uid()));