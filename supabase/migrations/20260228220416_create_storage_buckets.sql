/*
  # Create Storage Buckets for PDFs

  ## Overview
  Creates storage buckets for resume and portfolio PDFs with public access.

  ## Storage Buckets
  1. `resumes` - For storing one-page resume PDFs
  2. `portfolios` - For storing multi-page portfolio PDFs

  ## Security
  - Both buckets allow public access for reading
  - Both buckets allow public uploads (password protection handled in application layer)
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('resumes', 'resumes', true, 10485760, ARRAY['application/pdf']),
  ('portfolios', 'portfolios', true, 52428800, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read access for resumes"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'resumes');

CREATE POLICY "Public upload access for resumes"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Public delete access for resumes"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'resumes');

CREATE POLICY "Public read access for portfolios"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'portfolios');

CREATE POLICY "Public upload access for portfolios"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'portfolios');

CREATE POLICY "Public delete access for portfolios"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'portfolios');