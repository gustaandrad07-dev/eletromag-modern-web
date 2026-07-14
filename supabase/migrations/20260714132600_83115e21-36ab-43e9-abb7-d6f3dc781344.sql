
-- Storage policies for site-images bucket
DROP POLICY IF EXISTS "site-images admin write insert" ON storage.objects;
DROP POLICY IF EXISTS "site-images admin write update" ON storage.objects;
DROP POLICY IF EXISTS "site-images admin write delete" ON storage.objects;
DROP POLICY IF EXISTS "site-images auth read" ON storage.objects;

CREATE POLICY "site-images admin write insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "site-images admin write update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "site-images admin write delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "site-images auth read" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'site-images');
