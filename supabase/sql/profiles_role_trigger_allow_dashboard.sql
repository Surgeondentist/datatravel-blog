-- Ejecutar UNA VEZ si ya tienes el trigger antiguo y no puedes hacer UPDATE de role desde SQL Editor.
-- Luego: UPDATE public.profiles SET role = 'admin' WHERE email = 'tu-correo@gmail.com';

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
