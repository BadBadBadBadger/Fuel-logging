-- ─────────────────────────────────────────────────────────────
-- Fuel Log — Supabase Schema
-- FIRST-TIME SETUP: run this entire file in Supabase SQL Editor
-- (Dashboard → SQL Editor → New Query).
--
-- ⚠️ EXISTING DATABASE: do NOT re-run the whole file. Nothing here deletes data —
-- there is no DROP/TRUNCATE/DELETE, and the CREATE TABLE / ADD COLUMN / CREATE INDEX
-- statements are all idempotent — BUT `CREATE POLICY` has no IF NOT EXISTS in Postgres,
-- so the RLS block below fails with 42710 "policy already exists". The SQL Editor runs
-- the file in one transaction, so that abort ROLLS BACK any ALTER TABLE above it: the
-- columns you were adding silently never land. To add columns to a live database, run
-- just the ALTER TABLE lines you need, then confirm with:
--   SELECT column_name FROM information_schema.columns WHERE table_name = 'profiles';
-- ─────────────────────────────────────────────────────────────

-- ── User profiles ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  weight      NUMERIC,
  height      NUMERIC,
  body_fat    NUMERIC,
  sex         TEXT CHECK (sex IN ('male', 'female')),
  -- Compliance (LEGAL_ROADMAP Phase B): 18+ affirmation (R6) + Art. 9 explicit consent (R2).
  age_confirmed_at            TIMESTAMPTZ,   -- when the user affirmed they are 18+
  health_consent_at           TIMESTAMPTZ,   -- when explicit health-data consent was given
  consent_policy_version      TEXT,          -- privacy-policy version consented to (e.g. '1.0')
  health_consent_withdrawn_at TIMESTAMPTZ,   -- set if consent is later withdrawn
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- For existing installs: add the consent columns if the table predates them (safe to re-run).
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS age_confirmed_at            TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS health_consent_at           TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS consent_policy_version      TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS health_consent_withdrawn_at TIMESTAMPTZ;

-- Energy-model Step 1 (activity / NEAT seed). Currently LOCAL-ONLY in the app: run this
-- column FIRST, then wire it into syncProfile()/pullFromSupabase() in app.jsx — do NOT add
-- it to the upsert before the column exists or the whole profile upsert 400s silently.
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS activity TEXT
  CHECK (activity IN ('sedentary', 'light', 'active', 'very'));

-- Energy-model Step 5 (cut cycling — features/energy-safety/02-cut-cycle-blocks.feature).
-- These may NOT be local-only: block state is the one thing that has to remember a long cut,
-- so a new device must not silently restart the clock at 0. Same ordering rule as above —
-- run these columns FIRST, then wire syncProfile()/pullFromSupabase().
-- NOTE the loads are NUMERIC, not INTEGER: a day is weighted by how deep the deficit is
-- (a 10% cut adds 0.5, a 25% cut adds 1.25), so these accumulate fractionally.
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cut_block_start DATE;    -- start of the open cut block; NULL = not cutting
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cut_block_load  NUMERIC DEFAULT 0;  -- load-days accumulated in that block
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cut_load_year   NUMERIC DEFAULT 0;  -- RETIRED (see below) — left in place, no longer written
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_break_end  DATE;    -- end of the most recent completed diet break

-- Energy-model Step 5, file 03 (the break drain). A break is time not cutting, and each
-- rest day pays down 1/DIET_BREAK_DAYS of the load the block held when the break began.
-- That starting load IS the drain rate, so it has to survive a device change: without it
-- a second phone would resume the break at the wrong speed and skip the early-return
-- guard. The rest-day count needs no column — it is re-derived on pull from
--   offRun = DIET_BREAK_DAYS × (1 − cut_block_load ÷ cut_break_load).
-- ⚠️ RUN THIS BEFORE deploying the build that writes it: an upsert naming a column that
-- doesn't exist 400s and takes the whole profile sync down with it.
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cut_break_load  NUMERIC DEFAULT 0;  -- block load when the current break began

-- RETIRED 2026-08-09 (file 03): cut_load_year held a rolling-year cut total that escalated
-- the break message after ~a year of dieting. Removed as the wrong measure of harm — that
-- tracks energy availability and how much bodyweight has come off (both already covered),
-- not calendar time under a mild deficit. The app no longer reads or writes this column.
-- Deliberately NOT dropped: dropping a live column can only go wrong, and an unused one
-- costs nothing. Safe to drop by hand later if you ever want the tidy-up.

-- ── Daily food log entries ─────────────────────────────────────
-- entry_id is the client-side timestamp used as the log entry id
CREATE TABLE IF NOT EXISTS food_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  entry_id    BIGINT NOT NULL,
  name        TEXT NOT NULL,
  kcal        NUMERIC NOT NULL,
  protein     NUMERIC,
  carbs       NUMERIC,
  fat         NUMERIC,
  time        TEXT,
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, entry_id)
);

-- ── Daily water logs ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS water_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  glasses     INTEGER NOT NULL DEFAULT 0,
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- ── Workout entries ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workouts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  entry_id    BIGINT NOT NULL,
  type        TEXT NOT NULL,
  duration    INTEGER NOT NULL,
  intensity   TEXT NOT NULL,
  kcal        INTEGER NOT NULL,
  time        TEXT,
  notes       TEXT,
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, entry_id)
);

-- ── Body weight log ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS weigh_ins (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  weight      NUMERIC NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- ── User settings ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS settings (
  id                    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  mode                  TEXT DEFAULT 'cut',
  tdee_adj              INTEGER DEFAULT 0,
  custom_kcal           INTEGER,
  aggressive_cut_acked  BOOLEAN DEFAULT FALSE,
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ── Custom meal library ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS meal_library (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  kcal        NUMERIC NOT NULL,
  protein     NUMERIC,
  carbs       NUMERIC,
  fat         NUMERIC,
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- ── Earned badges ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS badges (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_key   TEXT NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_key)
);

-- ── Daily history snapshots ───────────────────────────────────
CREATE TABLE IF NOT EXISTS history_snapshots (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  mode        TEXT,
  kcal        INTEGER,
  protein     NUMERIC,
  carbs       NUMERIC,
  fat         NUMERIC,
  water       INTEGER,
  training    BOOLEAN,
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- ── AI coach tip cache ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS coach_tips (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  tip         TEXT,
  refreshes   INTEGER DEFAULT 0,
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- ── Entitlements (Premium status) ──────────────────────────
-- Source of truth for premium entitlement. Users cannot write this table;
-- only the service role (webhooks, server-side voucher redeems) may.
-- The worker checks this table before proxying AI.
CREATE TABLE IF NOT EXISTS entitlements (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier        TEXT DEFAULT 'free' CHECK (tier IN ('free', 'premium')),
  status      TEXT DEFAULT 'inactive' CHECK (status IN ('inactive', 'trial', 'active', 'expired')),
  expires_at  TIMESTAMPTZ,
  source      TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ─────────────────────────────────────────────────────────────
-- Row Level Security (RLS)
-- Users can only read/write their own rows.
-- ─────────────────────────────────────────────────────────────

ALTER TABLE profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_logs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_logs       ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts         ENABLE ROW LEVEL SECURITY;
ALTER TABLE weigh_ins        ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings         ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_library     ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges           ENABLE ROW LEVEL SECURITY;
ALTER TABLE history_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_tips       ENABLE ROW LEVEL SECURITY;
ALTER TABLE entitlements     ENABLE ROW LEVEL SECURITY;

-- profiles: id = auth.uid()
CREATE POLICY "own profile" ON profiles FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- entitlements: users READ their own row only (service role writes via voucher / webhooks)
CREATE POLICY "read own entitlement" ON entitlements FOR SELECT USING (auth.uid() = user_id);

-- All other tables: user_id = auth.uid()
CREATE POLICY "own food_logs"         ON food_logs         FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own water_logs"        ON water_logs        FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own workouts"          ON workouts          FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own weigh_ins"         ON weigh_ins         FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own settings"          ON settings          FOR ALL USING (auth.uid() = id)      WITH CHECK (auth.uid() = id);
CREATE POLICY "own meal_library"      ON meal_library      FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own badges"            ON badges            FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own history_snapshots" ON history_snapshots FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own coach_tips"        ON coach_tips        FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- Indexes for common query patterns
-- ─────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS food_logs_user_date     ON food_logs(user_id, date);
CREATE INDEX IF NOT EXISTS water_logs_user_date    ON water_logs(user_id, date);
CREATE INDEX IF NOT EXISTS workouts_user_date      ON workouts(user_id, date);
CREATE INDEX IF NOT EXISTS weigh_ins_user_date     ON weigh_ins(user_id, date);
CREATE INDEX IF NOT EXISTS history_user_date       ON history_snapshots(user_id, date);
CREATE INDEX IF NOT EXISTS coach_tips_user_date    ON coach_tips(user_id, date);
CREATE INDEX IF NOT EXISTS meal_library_user       ON meal_library(user_id);
CREATE INDEX IF NOT EXISTS badges_user             ON badges(user_id);
CREATE INDEX IF NOT EXISTS entitlements_user       ON entitlements(user_id);
