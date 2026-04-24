-- =============================================================================
-- Redshell — Supabase: tablas, RLS, Storage (ejecutar una vez)
-- Dashboard → SQL Editor → New query → Pegar → Run
-- =============================================================================

-- ── Perfiles (una fila por usuario de auth; email para panel admin) ─────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email text,
  display_name text,
  avatar_url text,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'banned')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles (role);

CREATE OR REPLACE FUNCTION public.set_profiles_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_profiles_updated_at();

-- Fila al registrarse (Google OAuth, etc.)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Solo admins pueden cambiar roles; el resto no puede auto-promocionarse
CREATE OR REPLACE FUNCTION public.profiles_prevent_role_escalation()
RETURNS trigger
LANGUAGE plpgsql
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
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
  ) INTO is_admin;
  IF NOT is_admin THEN
    RAISE EXCEPTION 'No autorizado a cambiar role';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_role_guard ON public.profiles;
CREATE TRIGGER trg_profiles_role_guard
  BEFORE UPDATE OF role ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.profiles_prevent_role_escalation();

-- ── Newsletter ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  confirmed boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT subscribers_email_key UNIQUE (email)
);

CREATE INDEX IF NOT EXISTS idx_subscribers_created ON public.subscribers (created_at DESC);

-- ── Comentarios ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  post_slug text NOT NULL,
  body text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comments_post_status ON public.comments (post_slug, status);
CREATE INDEX IF NOT EXISTS idx_comments_created ON public.comments (created_at DESC);

-- ── Reportes de comentarios ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid NOT NULL REFERENCES public.comments (id) ON DELETE CASCADE,
  reported_by uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT reports_one_per_user UNIQUE (comment_id, reported_by)
);

-- =============================================================================
-- Row Level Security
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- profiles: lectura
DROP POLICY IF EXISTS "profiles_select_anon_authors" ON public.profiles;
CREATE POLICY "profiles_select_anon_authors"
  ON public.profiles FOR SELECT TO anon
  USING (
    EXISTS (
      SELECT 1 FROM public.comments c
      WHERE c.user_id = profiles.id AND c.status = 'published'
    )
  );

DROP POLICY IF EXISTS "profiles_select_authenticated" ON public.profiles;
CREATE POLICY "profiles_select_authenticated"
  ON public.profiles FOR SELECT TO authenticated
  USING (
    auth.uid() = id
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
    OR EXISTS (
      SELECT 1 FROM public.comments c
      WHERE c.user_id = profiles.id AND c.status = 'published'
    )
  );

DROP POLICY IF EXISTS "profiles_update_self" ON public.profiles;
CREATE POLICY "profiles_update_self"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- subscribers (newsletter + admin)
DROP POLICY IF EXISTS "Newsletter: insert público" ON public.subscribers;
DROP POLICY IF EXISTS "Newsletter: lectura solo admins" ON public.subscribers;

CREATE POLICY "Newsletter: insert público"
  ON public.subscribers FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Newsletter: lectura solo admins"
  ON public.subscribers FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- comments
DROP POLICY IF EXISTS "comments_select_public" ON public.comments;
CREATE POLICY "comments_select_public"
  ON public.comments FOR SELECT TO anon, authenticated
  USING (status = 'published');

DROP POLICY IF EXISTS "comments_select_admin" ON public.comments;
CREATE POLICY "comments_select_admin"
  ON public.comments FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "comments_insert_own" ON public.comments;
CREATE POLICY "comments_insert_own"
  ON public.comments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "comments_update_admin" ON public.comments;
CREATE POLICY "comments_update_admin"
  ON public.comments FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS "comments_delete_admin" ON public.comments;
CREATE POLICY "comments_delete_admin"
  ON public.comments FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- reports
DROP POLICY IF EXISTS "reports_insert_own" ON public.reports;
CREATE POLICY "reports_insert_own"
  ON public.reports FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = reported_by);

-- =============================================================================
-- Storage: bucket público "avatars" (ruta sugerida: {user_id}/avatar.webp)
-- =============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Avatares: lectura pública" ON storage.objects;
CREATE POLICY "Avatares: lectura pública"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Avatares: subir en carpeta propia" ON storage.objects;
CREATE POLICY "Avatares: subir en carpeta propia"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND split_part(name, '/', 1) = auth.uid()::text
  );

DROP POLICY IF EXISTS "Avatares: actualizar propios" ON storage.objects;
CREATE POLICY "Avatares: actualizar propios"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND split_part(name, '/', 1) = auth.uid()::text
  );

DROP POLICY IF EXISTS "Avatares: borrar propios" ON storage.objects;
CREATE POLICY "Avatares: borrar propios"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND split_part(name, '/', 1) = auth.uid()::text
  );

-- =============================================================================
-- Post-instalación (ajusta a tu caso)
-- =============================================================================
-- 1) Authentication → Providers → Google: Client ID + Secret (Google Cloud Console).
-- 2) Authentication → URL configuration:
--      Site URL: https://TU-DOMINIO.com  (en dev puedes usar http://localhost:3000)
--      Redirect URLs: incluye
--        https://TU-DOMINIO.com/auth/callback
--        http://localhost:3000/auth/callback
-- 3) Primer administrador (tras iniciar sesión una vez para que exista la fila en profiles):
--      UPDATE public.profiles SET role = 'admin' WHERE email = 'tu-correo@gmail.com';
-- 4) URL pública de un avatar en Storage (ejemplo):
--      https://TU-REF.supabase.co/storage/v1/object/public/avatars/TU-USER-UUID/foto.webp
--    Si guardas esa URL en profiles.avatar_url, el front la acepta (safe-avatar-url).
