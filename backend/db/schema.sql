-- Postgres schema and mock data for authentication and certificate issuance (no blockchain)

-- Enums
DO $$ BEGIN
  CREATE TYPE access_type AS ENUM ('student','recruiter','university');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE credential_type AS ENUM ('bachelor','master','certificate','diploma');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE credential_status AS ENUM ('verified','pending','expired','revoked');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Tables
CREATE TABLE IF NOT EXISTS users (
  id              TEXT PRIMARY KEY,
  username        TEXT UNIQUE NOT NULL,
  email           TEXT UNIQUE,
  full_name       TEXT,
  password_hash   TEXT NOT NULL,
  access_type     access_type NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS students (
  id           TEXT PRIMARY KEY,
  user_id      TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  email        TEXT UNIQUE NOT NULL,
  status       TEXT NOT NULL,
  did          TEXT UNIQUE NOT NULL,
  wallet_jwk   JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS credentials (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  type          credential_type NOT NULL,
  institution   TEXT NOT NULL,
  date_issued   TIMESTAMPTZ NOT NULL,
  status        credential_status NOT NULL DEFAULT 'pending',
  student_id    TEXT REFERENCES students(id) ON DELETE SET NULL,
  vc_jwt        TEXT,
  vc_hash       TEXT UNIQUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ledger_events (
  id             TEXT PRIMARY KEY,
  event_type     TEXT NOT NULL,
  credential_id  TEXT REFERENCES credentials(id) ON DELETE SET NULL,
  details        JSONB NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Mock data for authentication
-- bcrypt hash for password 'password' with cost=10
-- (If login fails, use the /api/auth/seed-demo route to seed via backend.)
INSERT INTO users (id, username, email, full_name, password_hash, access_type)
VALUES
  ('USER_STU001', 'STU001', 'student1@example.edu', 'Student One', '$2b$10$CwTycUXWue0Thq9StjUM0uQ7yQbQYwR8X1YV7QYw2aQh5i1Q0wz66', 'student'),
  ('USER_REC001', 'REC001', 'recruiter1@example.edu', 'Recruiter One', '$2b$10$CwTycUXWue0Thq9StjUM0uQ7yQbQYwR8X1YV7QYw2aQh5i1Q0wz66', 'recruiter'),
  ('USER_UNI001', 'UNI001', 'admin1@university.edu', 'Admin One', '$2b$10$CwTycUXWue0Thq9StjUM0uQ7yQbQYwR8X1YV7QYw2aQh5i1Q0wz66', 'university')
ON CONFLICT (id) DO NOTHING;

-- Minimal student tied to STU001 for issuance demo
INSERT INTO students (id, user_id, name, email, status, did, wallet_jwk)
VALUES (
  'STU001',
  'USER_STU001',
  'Student One',
  'student1@example.edu',
  'active',
  'did:example:stu001',
  '{"kty":"OKP","crv":"Ed25519","d":"mock","x":"mock"}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Mock certificate credential issuance for STU001
INSERT INTO credentials (id, title, type, institution, date_issued, status, student_id, vc_jwt, vc_hash)
VALUES (
  'CRED_CERT_001',
  'Data Analysis Certificate',
  'certificate',
  'Tech University',
  now() - interval '10 days',
  'verified',
  'STU001',
  'mock-jwt',
  'mockhash-cert-001'
)
ON CONFLICT (id) DO NOTHING;

-- Matching ledger event (mock)
INSERT INTO ledger_events (id, event_type, credential_id, details)
VALUES (
  'LEDGER_EVT_001',
  'CREDENTIAL_VERIFIED_MOCK',
  'CRED_CERT_001',
  '{"reason":"mock-seed"}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


