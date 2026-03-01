/*
  # Create Resume and Portfolio Management System

  ## Overview
  This migration creates the database structure for managing resumes and portfolios with soft delete support.

  ## New Tables
  
  ### `resumes` (Database A)
  - `id` (uuid, primary key) - Unique identifier for each resume
  - `filename` (text) - Original filename of the PDF (supports Chinese characters)
  - `file_path` (text) - Storage path in Supabase Storage
  - `file_url` (text) - Public URL for accessing the PDF
  - `uploaded_at` (timestamptz) - When the resume was uploaded
  - `is_deleted` (boolean, default false) - Soft delete flag
  - `deleted_at` (timestamptz, nullable) - When the resume was soft deleted

  ### `portfolios` (Database B)
  - `id` (uuid, primary key) - Unique identifier for each portfolio
  - `filename` (text) - Original filename of the PDF (supports Chinese characters)
  - `file_path` (text) - Storage path in Supabase Storage
  - `file_url` (text) - Public URL for accessing the PDF
  - `uploaded_at` (timestamptz) - When the portfolio was uploaded
  - `is_deleted` (boolean, default false) - Soft delete flag
  - `deleted_at` (timestamptz, nullable) - When the portfolio was soft deleted

  ## Security
  - Enable RLS on both tables
  - Allow public read access to non-deleted items
  - No authentication required for this portfolio website
*/

CREATE TABLE IF NOT EXISTS resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  file_path text NOT NULL,
  file_url text NOT NULL,
  uploaded_at timestamptz DEFAULT now(),
  is_deleted boolean DEFAULT false,
  deleted_at timestamptz
);

CREATE TABLE IF NOT EXISTS portfolios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  file_path text NOT NULL,
  file_url text NOT NULL,
  uploaded_at timestamptz DEFAULT now(),
  is_deleted boolean DEFAULT false,
  deleted_at timestamptz
);

ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to active resumes"
  ON resumes
  FOR SELECT
  USING (is_deleted = false);

CREATE POLICY "Allow public read access to active portfolios"
  ON portfolios
  FOR SELECT
  USING (is_deleted = false);

CREATE POLICY "Allow public insert into resumes"
  ON resumes
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public insert into portfolios"
  ON portfolios
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update of resumes"
  ON resumes
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public update of portfolios"
  ON portfolios
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_resumes_not_deleted ON resumes(is_deleted, uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_portfolios_not_deleted ON portfolios(is_deleted, uploaded_at DESC);