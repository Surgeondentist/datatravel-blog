-- (Opcional) Políticas solo de newsletter si ya creaste tablas a mano.
-- Para instalaciones nuevas, usa el script completo:
--   supabase/sql/datatravel_full_setup.sql
-- (incluye subscribers + RLS + el resto del esquema).

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Quitar políticas antiguas si las renombraste igual (opcional, ajusta nombres si chocan)
DROP POLICY IF EXISTS "Newsletter: insert público" ON public.subscribers;
DROP POLICY IF EXISTS "Newsletter: lectura solo admins" ON public.subscribers;

-- Cualquiera puede apuntarse al newsletter (formulario en la web)
CREATE POLICY "Newsletter: insert público"
  ON public.subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Solo cuentas con role = admin en profiles ven la lista
CREATE POLICY "Newsletter: lectura solo admins"
  ON public.subscribers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
  );
