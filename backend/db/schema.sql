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

CREATE TABLE IF NOT EXISTS study_uploads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_name       VARCHAR(255),
  s3_key          TEXT,
  file_type       VARCHAR(20) CHECK (file_type IN ('pdf', 'image', 'text')),
  processed       BOOLEAN DEFAULT FALSE,
  flashcards_json JSONB,
  summary_text    TEXT,
  mindmap_json    JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_study_uploads_user_id ON study_uploads(user_id);

CREATE TABLE IF NOT EXISTS quiz_sessions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  source_type         VARCHAR(30) CHECK (source_type IN ('pdf', 'youtube', 'text', 'topic')),
  source_ref          TEXT,
  subject             VARCHAR(100),
  total_questions     SMALLINT,
  score               SMALLINT DEFAULT 0,
  difficulty          VARCHAR(10) DEFAULT 'medium',
  time_taken_seconds  INTEGER,
  completed_at        TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_quiz_sessions_user_id ON quiz_sessions(user_id);

CREATE TABLE IF NOT EXISTS quiz_answers (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id        UUID NOT NULL REFERENCES quiz_sessions(id) ON DELETE CASCADE,
  question_text     TEXT NOT NULL,
  correct_answer    TEXT NOT NULL,
  user_answer       TEXT,
  is_correct        BOOLEAN,
  concept_tag       VARCHAR(100),
  spaced_rep_due_at TIMESTAMPTZ,
  asked_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_answers_session_id ON quiz_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_spaced_rep ON quiz_answers(spaced_rep_due_at);

CREATE TABLE IF NOT EXISTS interview_sessions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  domain            VARCHAR(50) CHECK (domain IN ('cs', 'marketing', 'finance', 'hr', 'product', 'data')),
  round_type        VARCHAR(20) CHECK (round_type IN ('hr', 'technical', 'mixed')),
  company_target    VARCHAR(100),
  total_questions   SMALLINT DEFAULT 5,
  clarity_score     SMALLINT,
  depth_score       SMALLINT,
  confidence_score  SMALLINT,
  structure_score   SMALLINT,
  filler_word_count SMALLINT,
  completed_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_interview_sessions_user_id ON interview_sessions(user_id);

CREATE TABLE IF NOT EXISTS interview_answers (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id            UUID NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
  question_text         TEXT NOT NULL,
  answer_text           TEXT,
  audio_s3_key          TEXT,
  ai_feedback           TEXT,
  filler_words_detected JSONB DEFAULT '[]',
  follow_up_triggered   BOOLEAN DEFAULT FALSE,
  question_index        SMALLINT NOT NULL,
  answered_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_interview_answers_session_id ON interview_answers(session_id);
