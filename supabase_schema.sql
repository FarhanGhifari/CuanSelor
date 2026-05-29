-- ============================================================================
-- CuanSelor Database Schema - Minimal & Normalized
-- Updated: 2026-05-28
-- Total: 4 tabel Better Auth + 4 tabel aplikasi = 8 tabel
-- ============================================================================

-- ============================================================================
-- BETTER AUTH TABLES (4 tabel - dikelola oleh Better Auth CLI)
-- ============================================================================
-- 1. user
-- 2. session
-- 3. account
-- 4. verification
--
-- Jalankan migration Better Auth terlebih dahulu:
-- npx auth@latest migrate --config ./src/config/auth.js --yes
-- Atau copy-paste dari: frontend/better-auth_migrations/*.sql

-- ============================================================================
-- APPLICATION TABLES (4 tabel)
-- ============================================================================

-- ============================================================================
-- 1. profiles (Data profil user - extends user table)
-- ============================================================================
DROP TABLE IF EXISTS public.profiles CASCADE;

CREATE TABLE public.profiles (
  id TEXT REFERENCES public."user"(id) ON DELETE CASCADE PRIMARY KEY,
  full_name VARCHAR NOT NULL,
  gender VARCHAR CHECK (gender IN ('Laki-laki', 'Perempuan')),
  date_of_birth DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

COMMENT ON TABLE public.profiles IS 'Data profil user (nama, gender, tanggal lahir)';

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid()::text = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid()::text = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid()::text = id);

-- ============================================================================
-- 2. financial_records (Data finansial user - 1:1 dengan user)
-- ============================================================================
DROP TABLE IF EXISTS public.financial_records CASCADE;

CREATE TABLE public.financial_records (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES public."user"(id) ON DELETE CASCADE NOT NULL UNIQUE,
  monthly_income NUMERIC(15, 2) NOT NULL DEFAULT 0,
  monthly_expenses NUMERIC(15, 2) DEFAULT 0,
  annual_bonus NUMERIC(5, 2) NOT NULL DEFAULT 0,
  cold_cash NUMERIC(15, 2) NOT NULL DEFAULT 0,
  saving_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0,
  expected_annual_return NUMERIC(5, 2) DEFAULT 4.5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

COMMENT ON TABLE public.financial_records IS 'Data finansial user (gaji, tabungan, bonus)';
COMMENT ON COLUMN public.financial_records.monthly_expenses IS 'Tidak dipakai calculator, hanya untuk backward compatibility';

-- Enable RLS
ALTER TABLE public.financial_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own financial records"
  ON public.financial_records FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own financial records"
  ON public.financial_records FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own financial records"
  ON public.financial_records FOR UPDATE
  USING (auth.uid()::text = user_id);

-- ============================================================================
-- 3. retirement_plans (Rencana pensiun user - 1:1 dengan user)
-- ============================================================================
DROP TABLE IF EXISTS public.retirement_plans CASCADE;

CREATE TABLE public.retirement_plans (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES public."user"(id) ON DELETE CASCADE NOT NULL UNIQUE,
  target_retirement_age INTEGER NOT NULL,
  post_retirement_lifestyle NUMERIC(5, 2) NOT NULL DEFAULT 70,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

COMMENT ON TABLE public.retirement_plans IS 'Rencana pensiun user (target usia, lifestyle)';

-- Enable RLS
ALTER TABLE public.retirement_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own retirement plans"
  ON public.retirement_plans FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own retirement plans"
  ON public.retirement_plans FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own retirement plans"
  ON public.retirement_plans FOR UPDATE
  USING (auth.uid()::text = user_id);

-- ============================================================================
-- 4. risk_profiles (Profil risiko user - 1:N dengan user untuk history)
-- ============================================================================
DROP TABLE IF EXISTS public.risk_profiles CASCADE;

CREATE TABLE public.risk_profiles (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES public."user"(id) ON DELETE CASCADE NOT NULL,
  risk_category VARCHAR NOT NULL CHECK (risk_category IN ('conservative', 'moderate', 'aggressive', 'very_aggressive')),
  answers JSONB DEFAULT '{}'::jsonb,
  assessed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

COMMENT ON TABLE public.risk_profiles IS 'Profil risiko investasi user (bisa multiple untuk history)';
COMMENT ON COLUMN public.risk_profiles.answers IS 'Jawaban kuesioner + data tambahan (sector, age, gender, hasHealthInsurance, includePandemicRisk)';

-- Index untuk query by user_id dan assessed_at
CREATE INDEX idx_risk_profiles_user_assessed ON public.risk_profiles(user_id, assessed_at DESC);

-- Enable RLS
ALTER TABLE public.risk_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own risk profiles"
  ON public.risk_profiles FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own risk profiles"
  ON public.risk_profiles FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- ============================================================================
-- 5. chat_conversations (Sesi percakapan AI advisor - 1:N dengan user)
-- ============================================================================
DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.chat_conversations CASCADE;

CREATE TABLE public.chat_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES public."user"(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) DEFAULT 'Percakapan Baru',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

COMMENT ON TABLE public.chat_conversations IS 'Sesi percakapan AI advisor per user';

CREATE INDEX idx_chat_conversations_user ON public.chat_conversations(user_id, updated_at DESC);

-- Enable RLS
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own conversations"
  ON public.chat_conversations FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own conversations"
  ON public.chat_conversations FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own conversations"
  ON public.chat_conversations FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own conversations"
  ON public.chat_conversations FOR DELETE
  USING (auth.uid()::text = user_id);

-- ============================================================================
-- 6. chat_messages (Pesan dalam percakapan AI advisor)
-- ============================================================================
CREATE TABLE public.chat_messages (
  id SERIAL PRIMARY KEY,
  conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

COMMENT ON TABLE public.chat_messages IS 'Pesan individual dalam percakapan AI advisor';

CREATE INDEX idx_chat_messages_conv ON public.chat_messages(conversation_id, created_at ASC);

-- Enable RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies (via join ke chat_conversations)
CREATE POLICY "Users can view own messages"
  ON public.chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_conversations
      WHERE chat_conversations.id = chat_messages.conversation_id
      AND chat_conversations.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert own messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chat_conversations
      WHERE chat_conversations.id = chat_messages.conversation_id
      AND chat_conversations.user_id = auth.uid()::text
    )
  );

-- ============================================================================
-- HELPER FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function untuk auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers untuk auto-update updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_financial_records_updated_at ON public.financial_records;
CREATE TRIGGER update_financial_records_updated_at
  BEFORE UPDATE ON public.financial_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_retirement_plans_updated_at ON public.retirement_plans;
CREATE TRIGGER update_retirement_plans_updated_at
  BEFORE UPDATE ON public.retirement_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_chat_conversations_updated_at ON public.chat_conversations;
CREATE TRIGGER update_chat_conversations_updated_at
  BEFORE UPDATE ON public.chat_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SUMMARY
-- ============================================================================
-- Total: 10 tabel
-- 
-- Better Auth (4):
--   1. user
--   2. session
--   3. account
--   4. verification
--
-- Aplikasi (6):
--   5. profiles (1:1 dengan user)
--   6. financial_records (1:1 dengan user)
--   7. retirement_plans (1:1 dengan user)
--   8. risk_profiles (1:N dengan user - untuk history)
--   9. chat_conversations (1:N dengan user - sesi chat AI)
--  10. chat_messages (1:N dengan conversation - pesan chat)
--
-- Semua tabel aplikasi sudah:
-- ✅ RLS enabled
-- ✅ Policies untuk SELECT, INSERT, UPDATE (+ DELETE untuk conversations)
-- ✅ Triggers untuk auto-update updated_at
-- ✅ Indexes untuk performa
-- ✅ Comments untuk dokumentasi
-- ✅ Ternormalisasi (tidak ada redundansi)
--
-- Cache projection menggunakan in-memory cache di backend (node-cache)
-- ============================================================================
