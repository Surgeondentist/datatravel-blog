-- (Opcional) Políticas solo de newsletter si ya creaste tablas a mano.
-- Para instalaciones nuevas, usa el script completo:
--   supabase/sql/redshell_full_setup.sql
-- (incluye subscribers + RLS + el resto del esquema).
-- Si usas solo este archivo, ejecuta antes public.is_profile_admin() (ver profiles_rls_fix_recursion.sql).

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Quitar políticas antiguas si las renombraste igual (opcional, ajusta nombres si chocan)
DROP POLICY IF EXISTS "Newsletter: insert público" ON public.subscribers;
DROP POLICY IF EXISTS "Newsletter: lectura solo admins" ON public.subscribers;

-- Cualquiera puede apuntarse al newsletter (formulario en la web)
CREATE POLICY "Newsletter: insert público"
  ON public.subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL
    AND length(trim(email)) > 3
    AND email LIKE '%@%'
  );

-- Solo admins (usa is_profile_admin() del maestro; evita recursión RLS en profiles).
CREATE POLICY "Newsletter: lectura solo admins"
  ON public.subscribers
  FOR SELECT
  TO authenticated
  USING (public.is_profile_admin());
