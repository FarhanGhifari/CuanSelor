-- Migration: Add projection_results table
-- Date: 2026-05-31
-- Description: Persist projection results per user and input hash

CREATE TABLE IF NOT EXISTS public.projection_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES public."user"(id) ON DELETE CASCADE NOT NULL,
  input_hash VARCHAR NOT NULL,
  calculator_input JSONB NOT NULL,
  result_json JSONB NOT NULL,
  computed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT projection_results_user_input_hash_key UNIQUE (user_id, input_hash)
);

CREATE INDEX IF NOT EXISTS idx_projection_results_user_id
  ON public.projection_results (user_id);

CREATE INDEX IF NOT EXISTS idx_projection_results_computed_at
  ON public.projection_results (computed_at DESC);

COMMENT ON TABLE public.projection_results IS
  'Snapshot hasil kalkulasi proyeksi pensiun per user dan kombinasi input.';

COMMENT ON COLUMN public.projection_results.input_hash IS
  'Hash dari calculator input untuk menentukan apakah hasil proyeksi masih valid.';

COMMENT ON COLUMN public.projection_results.calculator_input IS
  'Snapshot input yang dikirim ke FastAPI calculator.';

COMMENT ON COLUMN public.projection_results.result_json IS
  'Hasil kalkulasi penuh yang dikembalikan ke frontend.';
