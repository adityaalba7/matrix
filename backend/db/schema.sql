CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             VARCHAR(100)  NOT NULL,
  email            VARCHAR(255)  UNIQUE NOT NULL,
  password_hash    VARCHAR(255),
  college          VARCHAR(200),
  monthly_budget   INTEGER       DEFAULT 800000,
  language_pref    VARCHAR(20)   DEFAULT 'english',
  trimind_score    SMALLINT      DEFAULT 0,
  streak_days      SMALLINT      DEFAULT 0,
  exam_date        DATE,
  onboarding_goal  VARCHAR(50),
  created_at       TIMESTAMPTZ   DEFAULT NOW(),
  last_active_at   TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS expenses (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount_paise   INTEGER NOT NULL,
  category       VARCHAR(50) CHECK (category IN ('food', 'transport', 'study', 'fun', 'bills', 'other')),
  merchant       VARCHAR(200),
  note           TEXT,
  source         VARCHAR(30) CHECK (source IN ('manual', 'voice', 'receipt_scan', 'upi_sms')),
  upi_ref        VARCHAR(100),
  logged_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  deleted_at     TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_logged_at ON expenses(logged_at);

CREATE TABLE IF NOT EXISTS savings_goals (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title                VARCHAR(200) NOT NULL,
  target_amount_paise  INTEGER NOT NULL,
  saved_amount_paise   INTEGER DEFAULT 0,
  target_date          DATE,
  is_active            BOOLEAN DEFAULT TRUE,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_savings_goals_user_id ON savings_goals(user_id);
