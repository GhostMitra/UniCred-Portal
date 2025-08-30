-- PostgreSQL MVP Seed Data Script
-- This script sets up the complete database schema and injects all mock data for the MVP
-- Run this script against your PostgreSQL database to set up the complete environment

-- =============================================================================
-- SCHEMA SETUP
-- =============================================================================

-- Create enums
DO $$ BEGIN
  CREATE TYPE "AccessType" AS ENUM ('student', 'recruiter', 'university');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "CredentialType" AS ENUM ('bachelor', 'master', 'certificate', 'diploma');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "CredentialStatus" AS ENUM ('verified', 'pending', 'expired', 'revoked');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Create tables
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "fullName" TEXT,
    "passwordHash" TEXT NOT NULL,
    "accessType" "AccessType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Student" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "did" TEXT NOT NULL,
    "walletJwk" JSONB NOT NULL,
    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Credential" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "CredentialType" NOT NULL,
    "institution" TEXT NOT NULL,
    "dateIssued" TIMESTAMP(3) NOT NULL,
    "status" "CredentialStatus" NOT NULL DEFAULT 'pending',
    "studentId" TEXT,
    "vcJwt" TEXT,
    "vcHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recruiterApproved" BOOLEAN NOT NULL DEFAULT false,
    "studentAccepted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Credential_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "LedgerEvent" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "credentialId" TEXT,
    "details" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LedgerEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Block" (
    "id" TEXT NOT NULL,
    "height" INTEGER NOT NULL,
    "previousHash" TEXT NOT NULL,
    "payloadHash" TEXT NOT NULL,
    "nonce" INTEGER NOT NULL,
    "hash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Block_pkey" PRIMARY KEY ("id")
);

-- Create unique indexes
CREATE UNIQUE INDEX IF NOT EXISTS "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "Student_userId_key" ON "Student"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "Student_email_key" ON "Student"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "Student_did_key" ON "Student"("did");
CREATE UNIQUE INDEX IF NOT EXISTS "Credential_vcHash_key" ON "Credential"("vcHash");
CREATE UNIQUE INDEX IF NOT EXISTS "Block_height_key" ON "Block"("height");
CREATE UNIQUE INDEX IF NOT EXISTS "Block_hash_key" ON "Block"("hash");

-- Add foreign key constraints
DO $$ BEGIN
    ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "Credential" ADD CONSTRAINT "Credential_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "LedgerEvent" ADD CONSTRAINT "LedgerEvent_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "Credential"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =============================================================================
-- MOCK DATA INJECTION
-- =============================================================================

-- Clear existing data (optional - uncomment if you want to start fresh)
-- TRUNCATE TABLE "LedgerEvent", "Credential", "Student", "User", "Block" CASCADE;

-- Users (password for all users is 'password')
-- bcrypt hash for 'password' with cost=10: $2b$10$CwTycUXWue0Thq9StjUM0uQ7yQbQYwR8X1YV7QYw2aQh5i1Q0wz66
INSERT INTO "User" ("id", "username", "email", "fullName", "passwordHash", "accessType", "createdAt", "updatedAt")
VALUES
  -- Students
  ('USER_STU001', 'STU001', 'student1@example.edu', 'Student One', '$2b$10$CwTycUXWue0Thq9StjUM0uQ7yQbQYwR8X1YV7QYw2aQh5i1Q0wz66', 'student', NOW(), NOW()),
  ('USER_STU002', 'STU002', 'student2@example.edu', 'Student Two', '$2b$10$CwTycUXWue0Thq9StjUM0uQ7yQbQYwR8X1YV7QYw2aQh5i1Q0wz66', 'student', NOW(), NOW()),
  ('USER_STU003', 'STU003', 'student3@example.edu', 'Student Three', '$2b$10$CwTycUXWue0Thq9StjUM0uQ7yQbQYwR8X1YV7QYw2aQh5i1Q0wz66', 'student', NOW(), NOW()),
  ('USER_STU004', 'STU004', 'sarah.johnson@example.edu', 'Sarah Johnson', '$2b$10$CwTycUXWue0Thq9StjUM0uQ7yQbQYwR8X1YV7QYw2aQh5i1Q0wz66', 'student', NOW(), NOW()),
  ('USER_STU005', 'STU005', 'michael.chen@example.edu', 'Michael Chen', '$2b$10$CwTycUXWue0Thq9StjUM0uQ7yQbQYwR8X1YV7QYw2aQh5i1Q0wz66', 'student', NOW(), NOW()),
  ('USER_STU006', 'STU006', 'emily.rodriguez@example.edu', 'Emily Rodriguez', '$2b$10$CwTycUXWue0Thq9StjUM0uQ7yQbQYwR8X1YV7QYw2aQh5i1Q0wz66', 'student', NOW(), NOW()),
  ('USER_STU007', 'STU007', 'david.kim@example.edu', 'David Kim', '$2b$10$CwTycUXWue0Thq9StjUM0uQ7yQbQYwR8X1YV7QYw2aQh5i1Q0wz66', 'student', NOW(), NOW()),
  ('USER_STU008', 'STU008', 'lisa.thompson@example.edu', 'Lisa Thompson', '$2b$10$CwTycUXWue0Thq9StjUM0uQ7yQbQYwR8X1YV7QYw2aQh5i1Q0wz66', 'student', NOW(), NOW()),
  ('USER_STU009', 'STU009', 'james.wilson@example.edu', 'James Wilson', '$2b$10$CwTycUXWue0Thq9StjUM0uQ7yQbQYwR8X1YV7QYw2aQh5i1Q0wz66', 'student', NOW(), NOW()),
  ('USER_STU010', 'STU010', 'anna.garcia@example.edu', 'Anna Garcia', '$2b$10$CwTycUXWue0Thq9StjUM0uQ7yQbQYwR8X1YV7QYw2aQh5i1Q0wz66', 'student', NOW(), NOW()),
  
  -- Recruiters
  ('USER_REC001', 'REC001', 'recruiter1@techcorp.com', 'John Recruiter', '$2b$10$CwTycUXWue0Thq9StjUM0uQ7yQbQYwR8X1YV7QYw2aQh5i1Q0wz66', 'recruiter', NOW(), NOW()),
  ('USER_REC002', 'REC002', 'hr@innovatetech.com', 'Jane HR Manager', '$2b$10$CwTycUXWue0Thq9StjUM0uQ7yQbQYwR8X1YV7QYw2aQh5i1Q0wz66', 'recruiter', NOW(), NOW()),
  ('USER_REC003', 'REC003', 'talent@startup.io', 'Alex Talent Scout', '$2b$10$CwTycUXWue0Thq9StjUM0uQ7yQbQYwR8X1YV7QYw2aQh5i1Q0wz66', 'recruiter', NOW(), NOW()),
  
  -- University Admins
  ('USER_UNI001', 'UNI001', 'admin1@university.edu', 'University Admin One', '$2b$10$CwTycUXWue0Thq9StjUM0uQ7yQbQYwR8X1YV7QYw2aQh5i1Q0wz66', 'university', NOW(), NOW()),
  ('USER_UNI002', 'UNI002', 'registrar@techuniversity.edu', 'Tech University Registrar', '$2b$10$CwTycUXWue0Thq9StjUM0uQ7yQbQYwR8X1YV7QYw2aQh5i1Q0wz66', 'university', NOW(), NOW()),
  ('USER_UNI003', 'UNI003', 'credentials@businessschool.edu', 'Business School Admin', '$2b$10$CwTycUXWue0Thq9StjUM0uQ7yQbQYwR8X1YV7QYw2aQh5i1Q0wz66', 'university', NOW(), NOW())

ON CONFLICT ("id") DO NOTHING;

-- Students (linked to student users)
INSERT INTO "Student" ("id", "userId", "name", "email", "status", "did", "walletJwk")
VALUES
  ('STU001', 'USER_STU001', 'Student One', 'student1@example.edu', 'active', 'did:example:stu001', '{"kty":"OKP","crv":"Ed25519","d":"mock_private_key_001","x":"mock_public_key_001"}'),
  ('STU002', 'USER_STU002', 'Student Two', 'student2@example.edu', 'active', 'did:example:stu002', '{"kty":"OKP","crv":"Ed25519","d":"mock_private_key_002","x":"mock_public_key_002"}'),
  ('STU003', 'USER_STU003', 'Student Three', 'student3@example.edu', 'active', 'did:example:stu003', '{"kty":"OKP","crv":"Ed25519","d":"mock_private_key_003","x":"mock_public_key_003"}'),
  ('STU004', 'USER_STU004', 'Sarah Johnson', 'sarah.johnson@example.edu', 'active', 'did:example:stu004', '{"kty":"OKP","crv":"Ed25519","d":"mock_private_key_004","x":"mock_public_key_004"}'),
  ('STU005', 'USER_STU005', 'Michael Chen', 'michael.chen@example.edu', 'active', 'did:example:stu005', '{"kty":"OKP","crv":"Ed25519","d":"mock_private_key_005","x":"mock_public_key_005"}'),
  ('STU006', 'USER_STU006', 'Emily Rodriguez', 'emily.rodriguez@example.edu', 'active', 'did:example:stu006', '{"kty":"OKP","crv":"Ed25519","d":"mock_private_key_006","x":"mock_public_key_006"}'),
  ('STU007', 'USER_STU007', 'David Kim', 'david.kim@example.edu', 'active', 'did:example:stu007', '{"kty":"OKP","crv":"Ed25519","d":"mock_private_key_007","x":"mock_public_key_007"}'),
  ('STU008', 'USER_STU008', 'Lisa Thompson', 'lisa.thompson@example.edu', 'active', 'did:example:stu008', '{"kty":"OKP","crv":"Ed25519","d":"mock_private_key_008","x":"mock_public_key_008"}'),
  ('STU009', 'USER_STU009', 'James Wilson', 'james.wilson@example.edu', 'active', 'did:example:stu009', '{"kty":"OKP","crv":"Ed25519","d":"mock_private_key_009","x":"mock_public_key_009"}'),
  ('STU010', 'USER_STU010', 'Anna Garcia', 'anna.garcia@example.edu', 'active', 'did:example:stu010', '{"kty":"OKP","crv":"Ed25519","d":"mock_private_key_010","x":"mock_public_key_010"}')

ON CONFLICT ("id") DO NOTHING;

-- Comprehensive Credentials Data
INSERT INTO "Credential" ("id", "title", "type", "institution", "dateIssued", "status", "studentId", "vcJwt", "vcHash", "createdAt", "updatedAt", "recruiterApproved", "studentAccepted")
VALUES
  -- STU001 - Computer Science Student (7 credentials)
  ('CRED_BACHELOR_CS_STU001', 'Bachelor of Computer Science', 'bachelor', 'Tech University', NOW() - INTERVAL '365 days', 'verified', 'STU001', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSJ9.mock_bachelor_cs_001', 'hash_bachelor_cs_001', NOW(), NOW(), true, true),
  ('CRED_CERT_DATA_STU001', 'Data Analysis Certificate', 'certificate', 'Data Institute', NOW() - INTERVAL '120 days', 'verified', 'STU001', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSJ9.mock_data_cert_001', 'hash_data_cert_001', NOW(), NOW(), true, true),
  ('CRED_DIPLOMA_ML_STU001', 'Machine Learning Diploma', 'diploma', 'AI Academy', NOW() - INTERVAL '30 days', 'pending', 'STU001', NULL, NULL, NOW(), NOW(), false, false),
  ('CRED_CERT_WEB_STU001', 'Web Development Certificate', 'certificate', 'Code Academy', NOW() - INTERVAL '90 days', 'verified', 'STU001', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSJ9.mock_web_cert_001', 'hash_web_cert_001', NOW(), NOW(), true, true),
  ('CRED_CERT_CLOUD_STU001', 'Cloud Computing Certificate', 'certificate', 'Cloud Institute', NOW() - INTERVAL '60 days', 'verified', 'STU001', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSJ9.mock_cloud_cert_001', 'hash_cloud_cert_001', NOW(), NOW(), true, true),
  ('CRED_CERT_CYBER_STU001', 'Cybersecurity Certificate', 'certificate', 'Security Academy', NOW() - INTERVAL '45 days', 'verified', 'STU001', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSJ9.mock_cyber_cert_001', 'hash_cyber_cert_001', NOW(), NOW(), false, true),
  ('CRED_MASTER_CS_STU001', 'Master of Computer Science', 'master', 'Tech University', NOW() - INTERVAL '180 days', 'verified', 'STU001', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSJ9.mock_master_cs_001', 'hash_master_cs_001', NOW(), NOW(), true, true),
  
  -- STU002 - Data Science Student (3 credentials)
  ('CRED_MASTER_DS_STU002', 'Master of Data Science', 'master', 'Tech University', NOW() - INTERVAL '200 days', 'verified', 'STU002', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSJ9.mock_master_ds_002', 'hash_master_ds_002', NOW(), NOW(), true, true),
  ('CRED_CERT_PYTHON_STU002', 'Python Programming Certificate', 'certificate', 'Code Academy', NOW() - INTERVAL '90 days', 'verified', 'STU002', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSJ9.mock_python_cert_002', 'hash_python_cert_002', NOW(), NOW(), true, true),
  ('CRED_CERT_STATS_STU002', 'Advanced Statistics Certificate', 'certificate', 'Data Institute', NOW() - INTERVAL '50 days', 'verified', 'STU002', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSJ9.mock_stats_cert_002', 'hash_stats_cert_002', NOW(), NOW(), false, true),
  
  -- STU003 - Business Student (3 credentials)
  ('CRED_BACHELOR_BBA_STU003', 'Bachelor of Business Administration', 'bachelor', 'Business University', NOW() - INTERVAL '400 days', 'verified', 'STU003', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSJ9.mock_bachelor_bba_003', 'hash_bachelor_bba_003', NOW(), NOW(), true, true),
  ('CRED_CERT_MARKETING_STU003', 'Digital Marketing Certificate', 'certificate', 'Marketing Institute', NOW() - INTERVAL '60 days', 'verified', 'STU003', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSJ9.mock_marketing_cert_003', 'hash_marketing_cert_003', NOW(), NOW(), true, true),
  ('CRED_CERT_PROJECT_STU003', 'Project Management Certificate', 'certificate', 'PMI Institute', NOW() - INTERVAL '25 days', 'pending', 'STU003', NULL, NULL, NOW(), NOW(), false, false),
  
  -- STU004 - Engineering Student (4 credentials)
  ('CRED_BACHELOR_ME_STU004', 'Bachelor of Mechanical Engineering', 'bachelor', 'Engineering University', NOW() - INTERVAL '300 days', 'verified', 'STU004', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSJ9.mock_bachelor_me_004', 'hash_bachelor_me_004', NOW(), NOW(), true, true),
  ('CRED_MASTER_EM_STU004', 'Master of Engineering Management', 'master', 'Engineering University', NOW() - INTERVAL '100 days', 'verified', 'STU004', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSJ9.mock_master_em_004', 'hash_master_em_004', NOW(), NOW(), true, true),
  ('CRED_CERT_CAD_STU004', 'CAD Design Certificate', 'certificate', 'Design Institute', NOW() - INTERVAL '45 days', 'pending', 'STU004', NULL, NULL, NOW(), NOW(), false, false),
  ('CRED_CERT_LEAN_STU004', 'Lean Manufacturing Certificate', 'certificate', 'Manufacturing Institute', NOW() - INTERVAL '35 days', 'verified', 'STU004', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSJ9.mock_lean_cert_004', 'hash_lean_cert_004', NOW(), NOW(), true, true),
  
  -- STU005 - Medical Student (4 credentials)
  ('CRED_BACHELOR_BIO_STU005', 'Bachelor of Biology', 'bachelor', 'Medical University', NOW() - INTERVAL '500 days', 'verified', 'STU005', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSJ9.mock_bachelor_bio_005', 'hash_bachelor_bio_005', NOW(), NOW(), true, true),
  ('CRED_MASTER_MPH_STU005', 'Master of Public Health', 'master', 'Medical University', NOW() - INTERVAL '150 days', 'verified', 'STU005', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSJ9.mock_master_mph_005', 'hash_master_mph_005', NOW(), NOW(), true, true),
  ('CRED_CERT_RESEARCH_STU005', 'Clinical Research Certificate', 'certificate', 'Research Institute', NOW() - INTERVAL '75 days', 'verified', 'STU005', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSJ9.mock_research_cert_005', 'hash_research_cert_005', NOW(), NOW(), true, true),
  ('CRED_CERT_ETHICS_STU005', 'Medical Ethics Certificate', 'certificate', 'Ethics Institute', NOW() - INTERVAL '40 days', 'verified', 'STU005', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSJ9.mock_ethics_cert_005', 'hash_ethics_cert_005', NOW(), NOW(), false, true),
  
  -- STU006 - Arts Student (3 credentials)
  ('CRED_BACHELOR_FA_STU006', 'Bachelor of Fine Arts', 'bachelor', 'Arts University', NOW() - INTERVAL '250 days', 'verified', 'STU006', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSJ9.mock_bachelor_fa_006', 'hash_bachelor_fa_006', NOW(), NOW(), true, true),
  ('CRED_DIPLOMA_DA_STU006', 'Digital Art Diploma', 'diploma', 'Digital Arts Academy', NOW() - INTERVAL '80 days', 'verified', 'STU006', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSJ9.mock_diploma_da_006', 'hash_diploma_da_006', NOW(), NOW(), true, true),
  ('CRED_CERT_GD_STU006', 'Graphic Design Certificate', 'certificate', 'Design School', NOW() - INTERVAL '40 days', 'pending', 'STU006', NULL, NULL, NOW(), NOW(), false, false),
  
  -- STU007 - Finance Student (4 credentials)
  ('CRED_BACHELOR_FIN_STU007', 'Bachelor of Finance', 'bachelor', 'Finance University', NOW() - INTERVAL '350 days', 'verified', 'STU007', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSJ9.mock_bachelor_fin_007', 'hash_bachelor_fin_007', NOW(), NOW(), true, true),
  ('CRED_MASTER_FE_STU007', 'Master of Financial Engineering', 'master', 'Finance University', NOW() - INTERVAL '120 days', 'verified', 'STU007', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSJ9.mock_master_fe_007', 'hash_master_fe_007', NOW(), NOW(), true, true),
  ('CRED_CERT_CFA_STU007', 'CFA Level 1 Certificate', 'certificate', 'CFA Institute', NOW() - INTERVAL '30 days', 'verified', 'STU007', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSJ9.mock_cfa_cert_007', 'hash_cfa_cert_007', NOW(), NOW(), true, true),
  ('CRED_CERT_RISK_STU007', 'Risk Management Certificate', 'certificate', 'Risk Institute', NOW() - INTERVAL '20 days', 'pending', 'STU007', NULL, NULL, NOW(), NOW(), false, false),
  
  -- STU008 - Law Student (3 credentials)
  ('CRED_BACHELOR_PS_STU008', 'Bachelor of Political Science', 'bachelor', 'Law University', NOW() - INTERVAL '450 days', 'verified', 'STU008', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSJ9.mock_bachelor_ps_008', 'hash_bachelor_ps_008', NOW(), NOW(), true, true),
  ('CRED_MASTER_JD_STU008', 'Juris Doctor', 'master', 'Law University', NOW() - INTERVAL '180 days', 'verified', 'STU008', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSJ9.mock_jd_008', 'hash_jd_008', NOW(), NOW(), true, true),
  ('CRED_CERT_LEGAL_STU008', 'Legal Research Certificate', 'certificate', 'Legal Institute', NOW() - INTERVAL '60 days', 'pending', 'STU008', NULL, NULL, NOW(), NOW(), false, false),
  
  -- STU009 - Education Student (3 credentials)
  ('CRED_BACHELOR_ED_STU009', 'Bachelor of Education', 'bachelor', 'Education University', NOW() - INTERVAL '320 days', 'verified', 'STU009', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSJ9.mock_bachelor_ed_009', 'hash_bachelor_ed_009', NOW(), NOW(), true, true),
  ('CRED_MASTER_EDTECH_STU009', 'Master of Educational Technology', 'master', 'Education University', NOW() - INTERVAL '90 days', 'verified', 'STU009', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSJ9.mock_master_edtech_009', 'hash_master_edtech_009', NOW(), NOW(), true, true),
  ('CRED_CERT_ONLINE_STU009', 'Online Teaching Certificate', 'certificate', 'Teaching Institute', NOW() - INTERVAL '20 days', 'pending', 'STU009', NULL, NULL, NOW(), NOW(), false, false),
  
  -- STU010 - Psychology Student (4 credentials)
  ('CRED_BACHELOR_PSY_STU010', 'Bachelor of Psychology', 'bachelor', 'Psychology University', NOW() - INTERVAL '280 days', 'verified', 'STU010', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSJ9.mock_bachelor_psy_010', 'hash_bachelor_psy_010', NOW(), NOW(), true, true),
  ('CRED_MASTER_CP_STU010', 'Master of Clinical Psychology', 'master', 'Psychology University', NOW() - INTERVAL '110 days', 'verified', 'STU010', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSJ9.mock_master_cp_010', 'hash_master_cp_010', NOW(), NOW(), true, true),
  ('CRED_CERT_CBT_STU010', 'Cognitive Behavioral Therapy Certificate', 'certificate', 'Therapy Institute', NOW() - INTERVAL '50 days', 'verified', 'STU010', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSJ9.mock_cbt_cert_010', 'hash_cbt_cert_010', NOW(), NOW(), true, true),
  ('CRED_CERT_TRAUMA_STU010', 'Trauma Counseling Certificate', 'certificate', 'Counseling Institute', NOW() - INTERVAL '15 days', 'pending', 'STU010', NULL, NULL, NOW(), NOW(), false, false)

ON CONFLICT ("id") DO NOTHING;

-- Ledger Events for credential verification tracking
INSERT INTO "LedgerEvent" ("id", "eventType", "credentialId", "details", "createdAt")
VALUES
  -- Events for verified credentials
  ('LEDGER_EVT_001', 'CREDENTIAL_ISSUED', 'CRED_BACHELOR_CS_STU001', '{"issuer":"Tech University","student":"STU001","credentialType":"bachelor"}', NOW() - INTERVAL '365 days'),
  ('LEDGER_EVT_002', 'CREDENTIAL_VERIFIED', 'CRED_BACHELOR_CS_STU001', '{"verifier":"system","timestamp":"2024-01-15T10:00:00Z"}', NOW() - INTERVAL '360 days'),
  ('LEDGER_EVT_003', 'CREDENTIAL_ISSUED', 'CRED_CERT_DATA_STU001', '{"issuer":"Data Institute","student":"STU001","credentialType":"certificate"}', NOW() - INTERVAL '120 days'),
  ('LEDGER_EVT_004', 'CREDENTIAL_VERIFIED', 'CRED_CERT_DATA_STU001', '{"verifier":"system","timestamp":"2024-08-15T14:30:00Z"}', NOW() - INTERVAL '115 days'),
  ('LEDGER_EVT_005', 'CREDENTIAL_ISSUED', 'CRED_CERT_WEB_STU001', '{"issuer":"Code Academy","student":"STU001","credentialType":"certificate"}', NOW() - INTERVAL '90 days'),
  ('LEDGER_EVT_006', 'CREDENTIAL_VERIFIED', 'CRED_CERT_WEB_STU001', '{"verifier":"system","timestamp":"2024-09-01T09:15:00Z"}', NOW() - INTERVAL '85 days'),
  ('LEDGER_EVT_007', 'CREDENTIAL_ISSUED', 'CRED_CERT_CLOUD_STU001', '{"issuer":"Cloud Institute","student":"STU001","credentialType":"certificate"}', NOW() - INTERVAL '60 days'),
  ('LEDGER_EVT_008', 'CREDENTIAL_VERIFIED', 'CRED_CERT_CLOUD_STU001', '{"verifier":"system","timestamp":"2024-10-01T16:45:00Z"}', NOW() - INTERVAL '55 days'),
  ('LEDGER_EVT_009', 'CREDENTIAL_ISSUED', 'CRED_CERT_CYBER_STU001', '{"issuer":"Security Academy","student":"STU001","credentialType":"certificate"}', NOW() - INTERVAL '45 days'),
  ('LEDGER_EVT_010', 'CREDENTIAL_VERIFIED', 'CRED_CERT_CYBER_STU001', '{"verifier":"system","timestamp":"2024-10-15T11:20:00Z"}', NOW() - INTERVAL '40 days'),
  ('LEDGER_EVT_011', 'CREDENTIAL_ISSUED', 'CRED_MASTER_CS_STU001', '{"issuer":"Tech University","student":"STU001","credentialType":"master"}', NOW() - INTERVAL '180 days'),
  ('LEDGER_EVT_012', 'CREDENTIAL_VERIFIED', 'CRED_MASTER_CS_STU001', '{"verifier":"system","timestamp":"2024-07-01T13:00:00Z"}', NOW() - INTERVAL '175 days'),
  
  -- Events for STU002
  ('LEDGER_EVT_013', 'CREDENTIAL_ISSUED', 'CRED_MASTER_DS_STU002', '{"issuer":"Tech University","student":"STU002","credentialType":"master"}', NOW() - INTERVAL '200 days'),
  ('LEDGER_EVT_014', 'CREDENTIAL_VERIFIED', 'CRED_MASTER_DS_STU002', '{"verifier":"system","timestamp":"2024-06-15T10:30:00Z"}', NOW() - INTERVAL '195 days'),
  ('LEDGER_EVT_015', 'CREDENTIAL_ISSUED', 'CRED_CERT_PYTHON_STU002', '{"issuer":"Code Academy","student":"STU002","credentialType":"certificate"}', NOW() - INTERVAL '90 days'),
  ('LEDGER_EVT_016', 'CREDENTIAL_VERIFIED', 'CRED_CERT_PYTHON_STU002', '{"verifier":"system","timestamp":"2024-09-05T15:45:00Z"}', NOW() - INTERVAL '85 days'),
  
  -- Events for STU003
  ('LEDGER_EVT_017', 'CREDENTIAL_ISSUED', 'CRED_BACHELOR_BBA_STU003', '{"issuer":"Business University","student":"STU003","credentialType":"bachelor"}', NOW() - INTERVAL '400 days'),
  ('LEDGER_EVT_018', 'CREDENTIAL_VERIFIED', 'CRED_BACHELOR_BBA_STU003', '{"verifier":"system","timestamp":"2024-02-01T12:00:00Z"}', NOW() - INTERVAL '395 days'),
  ('LEDGER_EVT_019', 'CREDENTIAL_ISSUED', 'CRED_CERT_MARKETING_STU003', '{"issuer":"Marketing Institute","student":"STU003","credentialType":"certificate"}', NOW() - INTERVAL '60 days'),
  ('LEDGER_EVT_020', 'CREDENTIAL_VERIFIED', 'CRED_CERT_MARKETING_STU003', '{"verifier":"system","timestamp":"2024-10-20T14:15:00Z"}', NOW() - INTERVAL '55 days'),
  
  -- Events for other students (sample)
  ('LEDGER_EVT_021', 'CREDENTIAL_ISSUED', 'CRED_BACHELOR_ME_STU004', '{"issuer":"Engineering University","student":"STU004","credentialType":"bachelor"}', NOW() - INTERVAL '300 days'),
  ('LEDGER_EVT_022', 'CREDENTIAL_VERIFIED', 'CRED_BACHELOR_ME_STU004', '{"verifier":"system","timestamp":"2024-03-15T09:30:00Z"}', NOW() - INTERVAL '295 days'),
  ('LEDGER_EVT_023', 'CREDENTIAL_ISSUED', 'CRED_BACHELOR_BIO_STU005', '{"issuer":"Medical University","student":"STU005","credentialType":"bachelor"}', NOW() - INTERVAL '500 days'),
  ('LEDGER_EVT_024', 'CREDENTIAL_VERIFIED', 'CRED_BACHELOR_BIO_STU005', '{"verifier":"system","timestamp":"2023-08-01T08:00:00Z"}', NOW() - INTERVAL '495 days'),
  ('LEDGER_EVT_025', 'CREDENTIAL_ISSUED', 'CRED_BACHELOR_FA_STU006', '{"issuer":"Arts University","student":"STU006","credentialType":"bachelor"}', NOW() - INTERVAL '250 days'),
  ('LEDGER_EVT_026', 'CREDENTIAL_VERIFIED', 'CRED_BACHELOR_FA_STU006', '{"verifier":"system","timestamp":"2024-05-01T11:45:00Z"}', NOW() - INTERVAL '245 days')

ON CONFLICT ("id") DO NOTHING;

-- Sample blockchain blocks for demonstration
INSERT INTO "Block" ("id", "height", "previousHash", "payloadHash", "nonce", "hash", "createdAt")
VALUES
  ('BLOCK_GENESIS', 0, '0000000000000000000000000000000000000000000000000000000000000000', 'genesis_payload_hash', 12345, 'genesis_block_hash_000000', NOW() - INTERVAL '400 days'),
  ('BLOCK_001', 1, 'genesis_block_hash_000000', 'block_1_payload_hash', 23456, 'block_1_hash_111111', NOW() - INTERVAL '365 days'),
  ('BLOCK_002', 2, 'block_1_hash_111111', 'block_2_payload_hash', 34567, 'block_2_hash_222222', NOW() - INTERVAL '300 days'),
  ('BLOCK_003', 3, 'block_2_hash_222222', 'block_3_payload_hash', 45678, 'block_3_hash_333333', NOW() - INTERVAL '200 days'),
  ('BLOCK_004', 4, 'block_3_hash_333333', 'block_4_payload_hash', 56789, 'block_4_hash_444444', NOW() - INTERVAL '100 days'),
  ('BLOCK_005', 5, 'block_4_hash_444444', 'block_5_payload_hash', 67890, 'block_5_hash_555555', NOW() - INTERVAL '50 days')

ON CONFLICT ("id") DO NOTHING;

-- =============================================================================
-- VERIFICATION AND SUMMARY
-- =============================================================================

-- Display summary of inserted data
SELECT 
  'Users' as entity_type,
  COUNT(*) as count
FROM "User"

UNION ALL

SELECT 
  'Students' as entity_type,
  COUNT(*) as count
FROM "Student"

UNION ALL

SELECT 
  'Credentials' as entity_type,
  COUNT(*) as count
FROM "Credential"

UNION ALL

SELECT 
  'Ledger Events' as entity_type,
  COUNT(*) as count
FROM "LedgerEvent"

UNION ALL

SELECT 
  'Blocks' as entity_type,
  COUNT(*) as count
FROM "Block";

-- Display user breakdown by access type
SELECT 
  "accessType",
  COUNT(*) as user_count
FROM "User"
GROUP BY "accessType"
ORDER BY "accessType";

-- Display credential breakdown by status
SELECT 
  "status",
  COUNT(*) as credential_count
FROM "Credential"
GROUP BY "status"
ORDER BY "status";

-- Display credentials per student
SELECT 
  s."name" as student_name,
  COUNT(c."id") as credential_count,
  STRING_AGG(c."title", ', ' ORDER BY c."dateIssued" DESC) as credentials
FROM "Student" s
LEFT JOIN "Credential" c ON s."id" = c."studentId"
GROUP BY s."id", s."name"
ORDER BY s."name";

-- =============================================================================
-- QUICK ACCESS QUERIES
-- =============================================================================

-- To view all users and their access levels:
-- SELECT "username", "email", "fullName", "accessType" FROM "User" ORDER BY "accessType", "username";

-- To view all students with their credentials:
-- SELECT s."name", s."email", c."title", c."type", c."institution", c."status" 
-- FROM "Student" s 
-- LEFT JOIN "Credential" c ON s."id" = c."studentId" 
-- ORDER BY s."name", c."dateIssued" DESC;

-- To view credential verification status:
-- SELECT "title", "institution", "status", "recruiterApproved", "studentAccepted" 
-- FROM "Credential" 
-- ORDER BY "dateIssued" DESC;

-- =============================================================================
-- LOGIN CREDENTIALS FOR TESTING
-- =============================================================================

/*
TEST LOGIN CREDENTIALS (password for all users is 'password'):

STUDENTS:
- Username: STU001, Email: student1@example.edu, Name: Student One
- Username: STU002, Email: student2@example.edu, Name: Student Two
- Username: STU003, Email: student3@example.edu, Name: Student Three
- Username: STU004, Email: sarah.johnson@example.edu, Name: Sarah Johnson
- Username: STU005, Email: michael.chen@example.edu, Name: Michael Chen
- Username: STU006, Email: emily.rodriguez@example.edu, Name: Emily Rodriguez
- Username: STU007, Email: david.kim@example.edu, Name: David Kim
- Username: STU008, Email: lisa.thompson@example.edu, Name: Lisa Thompson
- Username: STU009, Email: james.wilson@example.edu, Name: James Wilson
- Username: STU010, Email: anna.garcia@example.edu, Name: Anna Garcia

RECRUITERS:
- Username: REC001, Email: recruiter1@techcorp.com, Name: John Recruiter
- Username: REC002, Email: hr@innovatetech.com, Name: Jane HR Manager
- Username: REC003, Email: talent@startup.io, Name: Alex Talent Scout

UNIVERSITY ADMINS:
- Username: UNI001, Email: admin1@university.edu, Name: University Admin One
- Username: UNI002, Email: registrar@techuniversity.edu, Name: Tech University Registrar
- Username: UNI003, Email: credentials@businessschool.edu, Name: Business School Admin

PASSWORD FOR ALL USERS: password
*/