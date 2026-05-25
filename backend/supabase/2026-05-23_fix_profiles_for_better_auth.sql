-- Better Auth stores user ids as text, not UUID.
-- Run this in Supabase SQL Editor if profiles.id was created with UUID.

DROP TABLE IF EXISTS public.profiles CASCADE;

CREATE TABLE public.profiles (
  id TEXT REFERENCES public."user"(id) ON DELETE CASCADE PRIMARY KEY,
  full_name VARCHAR NOT NULL,
  gender VARCHAR CHECK (gender IN ('Laki-laki', 'Perempuan')),
  date_of_birth DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
