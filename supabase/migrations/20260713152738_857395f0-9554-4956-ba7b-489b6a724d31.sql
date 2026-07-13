
-- ROLES
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admins can view all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins can insert roles" ON public.user_roles
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins can delete roles" ON public.user_roles
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Auto-grant admin to the founder email on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF lower(NEW.email) = 'gustaandrad07@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_grant_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_admin();

-- Also fire when the email becomes confirmed later (auto_confirm is on, but safe)
CREATE TRIGGER on_auth_user_confirmed_grant_admin
AFTER UPDATE OF email_confirmed_at ON auth.users
FOR EACH ROW WHEN (old.email_confirmed_at IS NULL AND new.email_confirmed_at IS NOT NULL)
EXECUTE FUNCTION public.handle_new_user_admin();

-- SITE CONTENT (key/value editable text)
CREATE TABLE public.site_content (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);
GRANT SELECT ON public.site_content TO anon, authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site_content public read" ON public.site_content
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "site_content admin write insert" ON public.site_content
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "site_content admin write update" ON public.site_content
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "site_content admin write delete" ON public.site_content
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Seed default content (contato info + horários)
INSERT INTO public.site_content (key, value) VALUES
  ('contact_info', '{"phone":"(92) 99999-9999","email":"contato@eletromag.com.br","address":"Manaus / AM","hours_weekdays":"Segunda a Sexta: 8h às 17h","hours_saturday":"Sábado: 8h às 12h"}'::jsonb),
  ('home_hero', '{"eyebrow":"Engenharia Elétrica · Manaus / AM","title":"Energia com precisão","subtitle":"Instalações elétricas industriais e prediais em Manaus"}'::jsonb),
  ('about_page', '{"title":"Sobre a ELETROMAG","intro":"Somos especialistas em engenharia elétrica com mais de 70 profissionais no time."}'::jsonb);

-- PORTFOLIO
CREATE TABLE public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  caption TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.portfolio_items TO anon, authenticated;
GRANT ALL ON public.portfolio_items TO service_role;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "portfolio public read" ON public.portfolio_items
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "portfolio admin insert" ON public.portfolio_items
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "portfolio admin update" ON public.portfolio_items
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "portfolio admin delete" ON public.portfolio_items
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- EQUIPMENT
CREATE TABLE public.equipment_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.equipment_items TO anon, authenticated;
GRANT ALL ON public.equipment_items TO service_role;
ALTER TABLE public.equipment_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "equipment public read" ON public.equipment_items
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "equipment admin insert" ON public.equipment_items
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "equipment admin update" ON public.equipment_items
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "equipment admin delete" ON public.equipment_items
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Storage policies for site-images bucket
CREATE POLICY "site-images public read" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'site-images');
CREATE POLICY "site-images admin upload" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "site-images admin update" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "site-images admin delete" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));

-- Helper: list all users (admin only) for the "add admin" flow
CREATE OR REPLACE FUNCTION public.list_admin_users()
RETURNS TABLE (user_id UUID, email TEXT, created_at TIMESTAMPTZ)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;
  RETURN QUERY
    SELECT u.id, u.email::text, ur.created_at
    FROM public.user_roles ur
    JOIN auth.users u ON u.id = ur.user_id
    WHERE ur.role = 'admin'
    ORDER BY ur.created_at ASC;
END;
$$;
GRANT EXECUTE ON FUNCTION public.list_admin_users() TO authenticated;

-- Grant admin by email (admin only)
CREATE OR REPLACE FUNCTION public.grant_admin_by_email(_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid UUID;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;
  SELECT id INTO _uid FROM auth.users WHERE lower(email) = lower(_email) LIMIT 1;
  IF _uid IS NULL THEN
    RETURN 'not_found';
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (_uid, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN 'ok';
END;
$$;
GRANT EXECUTE ON FUNCTION public.grant_admin_by_email(TEXT) TO authenticated;

-- Revoke admin
CREATE OR REPLACE FUNCTION public.revoke_admin(_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;
  DELETE FROM public.user_roles WHERE user_id = _user_id AND role = 'admin';
END;
$$;
GRANT EXECUTE ON FUNCTION public.revoke_admin(UUID) TO authenticated;
