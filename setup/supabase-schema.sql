-- ─────────────────────────────────────────────────────────────
-- Fuel Log — Supabase Schema
-- Run this entire file in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ─────────────────────────────────────────────────────────────

-- ── User profiles ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  weight      NUMERIC,
  height      NUMERIC,
  body_fat    NUMERIC,
  sex         TEXT CHECK (sex IN ('male', 'female')),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

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

-- profiles: id = auth.uid()
CREATE POLICY "own profile" ON profiles FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

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
