import { createClient } from "@supabase/supabase-js";

/**
 * Cliente con service role: solo usar en Server Components / Route Handlers
 * después de comprobar que el usuario es admin. Nunca importar en código de cliente.
 */
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
