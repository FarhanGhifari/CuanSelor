-- 1. Table: profiles (Terkoneksi langsung dengan auth.users bawaan Supabase)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name VARCHAR NOT NULL,
  gender VARCHAR CHECK (gender IN ('Laki-laki', 'Perempuan')),
  date_of_birth DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Table: financial_records (Data finansial terkini user)
CREATE TABLE public.financial_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE, -- UNIQUE karena 1 user hanya punya 1 record finansial aktif (1-to-1)
  monthly_income NUMERIC NOT NULL DEFAULT 0,
  monthly_expenses NUMERIC NOT NULL DEFAULT 0,
  annual_bonus NUMERIC NOT NULL DEFAULT 0,
  saving_percentage NUMERIC NOT NULL DEFAULT 0,
  cold_cash NUMERIC NOT NULL DEFAULT 0,
  expected_annual_return NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Table: retirement_plans (Rencana dan hasil kalkulasi Aktuaria)
CREATE TABLE public.retirement_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE, -- UNIQUE (1-to-1)
  target_retirement_age INTEGER NOT NULL,
  post_retirement_lifestyle NUMERIC NOT NULL,
  life_expectancy_age INTEGER,
  projected_retirement_fund_needed NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Table: risk_profiles (History/Riwayat assessment profil risiko)
CREATE TABLE public.risk_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL, -- TIDAK UNIQUE karena bisa banyak assessment (1-to-Many)
  answers JSONB NOT NULL,
  risk_category VARCHAR NOT NULL,
  ai_suggestion TEXT,
  assessed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Optional: Aktifkan Row Level Security (RLS) untuk keamanan API langsung (Opsional jika pakai Backend Express sebagai Proxy)
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.financial_records ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.retirement_plans ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.risk_profiles ENABLE ROW LEVEL SECURITY;
