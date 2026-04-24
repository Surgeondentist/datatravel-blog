-- Corrige 42P17 «infinite recursion detected in policy for relation profiles».
-- Ejecutar en Supabase SQL Editor (una vez). Luego prueba de nuevo el login / SELECT profiles.

CREATE OR REPLACE FUNCTION public.is_profile_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.is_profile_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_profile_admin() TO authenticated;

DROP POLICY IF EXISTS "profiles_select_authenticated" ON public.profiles;
CREATE POLICY "profiles_select_authenticated"
  ON public.profiles FOR SELECT TO authenticated
  USING (
    auth.uid() = id
    OR public.is_profile_admin()
    OR EXISTS (
      SELECT 1 FROM public.comments c
      WHERE c.user_id = profiles.id AND c.status = 'published'
    )
  );

DROP POLICY IF EXISTS "Newsletter: lectura solo admins" ON public.subscribers;
CREATE POLICY "Newsletter: lectura solo admins"
  ON public.subscribers FOR SELECT TO authenticated
  USING (public.is_profile_admin());

DROP POLICY IF EXISTS "comments_select_admin" ON public.comments;
CREATE POLICY "comments_select_admin"
  ON public.comments FOR SELECT TO authenticated
  USING (public.is_profile_admin());

DROP POLICY IF EXISTS "comments_update_admin" ON public.comments;
CREATE POLICY "comments_update_admin"
  ON public.comments FOR UPDATE TO authenticated
  USING (public.is_profile_admin());

DROP POLICY IF EXISTS "comments_delete_admin" ON public.comments;
CREATE POLICY "comments_delete_admin"
  ON public.comments FOR DELETE TO authenticated
  USING (public.is_profile_admin());
