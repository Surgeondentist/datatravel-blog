-- =====================================================================
-- Redshell — Security warnings fix (2026-04-24)
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query → Run
-- =====================================================================

-- 1. set_profiles_updated_at: agregar SET search_path = public
--    Evita que un atacante manipule search_path para shadowing de funciones.
CREATE OR REPLACE FUNCTION public.set_profiles_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 2. profiles_prevent_role_escalation: agregar SET search_path = public
CREATE OR REPLACE FUNCTION public.profiles_prevent_role_escalation()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  is_admin boolean;
BEGIN
  IF TG_OP <> 'UPDATE' THEN
    RETURN NEW;
  END IF;
  IF OLD.role IS NOT DISTINCT FROM NEW.role THEN
    RETURN NEW;
  END IF;
  -- Sin JWT (SQL Editor / service_role): no bloquear el primer admin.
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
  ) INTO is_admin;
  IF NOT is_admin THEN
    RAISE EXCEPTION 'No autorizado a cambiar role';
  END IF;
  RETURN NEW;
END;
$$;

-- 3. Newsletter INSERT: validar email mínimo en lugar de WITH CHECK (true)
--    El rate-limit real lo hace la app (src/lib/rate-limit.ts), esto es capa extra.
DROP POLICY IF EXISTS "Newsletter: insert público" ON public.subscribers;
CREATE POLICY "Newsletter: insert público"
  ON public.subscribers FOR INSERT TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL
    AND length(trim(email)) > 3
    AND email LIKE '%@%'
  );

-- 4. Avatares: eliminar SELECT irrestricto (bucket público sirve URLs sin política)
--    y reemplazar por acceso solo a carpeta propia vía API.
DROP POLICY IF EXISTS "Avatares: lectura pública" ON storage.objects;
CREATE POLICY "Avatares: lectura propia"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'avatars'
    AND split_part(name, '/', 1) = auth.uid()::text
  );

-- =====================================================================
-- 5. Leaked Password Protection → solo se activa en el dashboard:
--    Authentication → Sign In / Up → Password Strength → Enable
--    "Check against HaveIBeenPwned.org"
--    (Este proyecto usa Google OAuth; si no hay login con contraseña,
--     no afecta. Activarlo de todas formas es buena práctica.)
-- =====================================================================
