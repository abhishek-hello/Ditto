-- Custom migration (drizzle-kit generate --custom): auto-create a profile and a
-- GBP wallet whenever Supabase Auth inserts a user. Drizzle's schema cannot
-- express triggers, so this lives here and is applied in order by drizzle-kit migrate.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, handle, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'handle', 'user_' || substr(replace(NEW.id::text, '-', ''), 1, 12)),
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', 'Ditto user')
  );
  INSERT INTO public.wallets (owner_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$;
--> statement-breakpoint
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
--> statement-breakpoint
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
