-- Ensure the storage bucket for portfolio exists (public for read by default)
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for storage.objects on the 'portfolio' bucket
-- Public can READ objects from this bucket (adjust if you want private reads)
DROP POLICY IF EXISTS "Public read for portfolio bucket" ON storage.objects;
CREATE POLICY "Public read for portfolio bucket" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'portfolio');

-- Only authenticated users can INSERT (upload) to this bucket
DROP POLICY IF EXISTS "Authenticated insert to portfolio bucket" ON storage.objects;
CREATE POLICY "Authenticated insert to portfolio bucket" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'portfolio' AND auth.role() = 'authenticated');

-- Only authenticated users can UPDATE objects in this bucket
DROP POLICY IF EXISTS "Authenticated update portfolio bucket" ON storage.objects;
CREATE POLICY "Authenticated update portfolio bucket" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'portfolio' AND auth.role() = 'authenticated');

-- Only authenticated users can DELETE objects in this bucket
DROP POLICY IF EXISTS "Authenticated delete portfolio bucket" ON storage.objects;
CREATE POLICY "Authenticated delete portfolio bucket" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'portfolio' AND auth.role() = 'authenticated');


