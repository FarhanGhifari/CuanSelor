-- ============================================================================
-- CuanSelor - Complete Database Schema (Excluding Better Auth)
-- ============================================================================
-- 
-- Note: Better Auth tables (public."user", public."session", public."account", public."verification")
-- are generated automatically by Better Auth.
-- You can run the following command to generate them:
-- npx auth migrate --config ./src/config/auth.js --yes
--
-- Run this consolidated schema script on your Supabase database after the Better Auth
-- tables have been created to set up all application tables, indexes, policies, and triggers.
-- ============================================================================

-- ── 1. COMMON UTILITIES & HELPERS ──────────────────────────────────────────

-- Helper function to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ── 2. TABLE: PROFILES ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT REFERENCES public."user"(id) ON DELETE CASCADE PRIMARY KEY,
  full_name VARCHAR NOT NULL,
  gender VARCHAR CHECK (gender IN ('Laki-laki', 'Perempuan')),
  date_of_birth DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger for profiles.updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


-- ── 3. TABLE: FINANCIAL_RECORDS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.financial_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES public."user"(id) ON DELETE CASCADE NOT NULL UNIQUE,
  monthly_income NUMERIC NOT NULL DEFAULT 0,
  monthly_expenses NUMERIC NOT NULL DEFAULT 0,
  annual_bonus NUMERIC NOT NULL DEFAULT 0,
  saving_percentage NUMERIC NOT NULL DEFAULT 0,
  cold_cash NUMERIC NOT NULL DEFAULT 0,
  expected_annual_return NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger for financial_records.updated_at
DROP TRIGGER IF EXISTS update_financial_records_updated_at ON public.financial_records;
CREATE TRIGGER update_financial_records_updated_at
  BEFORE UPDATE ON public.financial_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


-- ── 4. TABLE: RETIREMENT_PLANS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.retirement_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES public."user"(id) ON DELETE CASCADE NOT NULL UNIQUE,
  target_retirement_age INTEGER NOT NULL,
  post_retirement_lifestyle NUMERIC NOT NULL,
  life_expectancy_age INTEGER,
  projected_retirement_fund_needed NUMERIC,
  planning_age INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

COMMENT ON COLUMN public.retirement_plans.planning_age IS 
  'Target age until which retirement funds should last (based on mortality table, max P90)';

-- Trigger for retirement_plans.updated_at
DROP TRIGGER IF EXISTS update_retirement_plans_updated_at ON public.retirement_plans;
CREATE TRIGGER update_retirement_plans_updated_at
  BEFORE UPDATE ON public.retirement_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


-- ── 5. TABLE: RISK_PROFILES ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.risk_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES public."user"(id) ON DELETE CASCADE NOT NULL,
  answers JSONB NOT NULL,
  risk_category VARCHAR NOT NULL,
  ai_suggestion TEXT,
  assessed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- ── 6. TABLE: PROJECTION_RESULTS ────────────────────────────────────────────
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

-- Trigger for projection_results.updated_at
DROP TRIGGER IF EXISTS update_projection_results_updated_at ON public.projection_results;
CREATE TRIGGER update_projection_results_updated_at
  BEFORE UPDATE ON public.projection_results
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


-- ── 7. TABLE: CHAT_CONVERSATIONS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.chat_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES public."user"(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) DEFAULT 'Percakapan Baru',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

COMMENT ON TABLE public.chat_conversations IS 'Sesi percakapan AI advisor per user';

CREATE INDEX IF NOT EXISTS idx_chat_conversations_user 
  ON public.chat_conversations(user_id, updated_at DESC);

ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view own conversations" ON public.chat_conversations;
CREATE POLICY "Users can view own conversations"
  ON public.chat_conversations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own conversations" ON public.chat_conversations;
CREATE POLICY "Users can insert own conversations"
  ON public.chat_conversations FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own conversations" ON public.chat_conversations;
CREATE POLICY "Users can update own conversations"
  ON public.chat_conversations FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Users can delete own conversations" ON public.chat_conversations;
CREATE POLICY "Users can delete own conversations"
  ON public.chat_conversations FOR DELETE USING (true);

-- Trigger for chat_conversations.updated_at
DROP TRIGGER IF EXISTS update_chat_conversations_updated_at ON public.chat_conversations;
CREATE TRIGGER update_chat_conversations_updated_at
  BEFORE UPDATE ON public.chat_conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


-- ── 8. TABLE: CHAT_MESSAGES ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id SERIAL PRIMARY KEY,
  conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

COMMENT ON TABLE public.chat_messages IS 'Pesan individual dalam percakapan AI advisor';

CREATE INDEX IF NOT EXISTS idx_chat_messages_conv 
  ON public.chat_messages(conversation_id, created_at ASC);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view own messages" ON public.chat_messages;
CREATE POLICY "Users can view own messages"
  ON public.chat_messages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own messages" ON public.chat_messages;
CREATE POLICY "Users can insert own messages"
  ON public.chat_messages FOR INSERT WITH CHECK (true);


-- ── 9. OPTIONAL: ENABLE ROW LEVEL SECURITY FOR ALL OTHER TABLES ──────────────
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.financial_records ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.retirement_plans ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.risk_profiles ENABLE ROW LEVEL SECURITY;
