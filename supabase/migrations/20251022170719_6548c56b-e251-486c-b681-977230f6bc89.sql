-- =====================================================
-- CRITICAL: This migration replaces Supabase Auth
-- All existing auth flows will break
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables that will be replaced
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS registrations CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS app_role CASCADE;
DROP TYPE IF EXISTS chapter_type CASCADE;
DROP TYPE IF EXISTS registration_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;

-- =====================================================
-- 1) Roles table
-- =====================================================
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =====================================================
-- 2) Chapters table
-- =====================================================
CREATE TABLE chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =====================================================
-- 3) Users table (replaces profiles + auth.users)
-- =====================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  chapter_id UUID NULL REFERENCES chapters(id) ON DELETE SET NULL,
  assigned_event_ids UUID[] DEFAULT ARRAY[]::UUID[],
  created_by UUID NULL REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_login_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 4) Events table
-- =====================================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  day INTEGER NOT NULL,
  start_time TIME,
  end_time TIME,
  venue TEXT,
  assigned_admin_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
  capacity INTEGER DEFAULT 0,
  image TEXT,
  short_desc TEXT,
  long_desc TEXT,
  organizer TEXT,
  guest TEXT,
  criteria TEXT[],
  rules TEXT[],
  topics TEXT[],
  program_outcomes TEXT[],
  schedule JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =====================================================
-- 5) Registrations table
-- =====================================================
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
  participant_name TEXT NOT NULL,
  participant_email TEXT NOT NULL,
  participant_phone TEXT,
  participant_branch TEXT,
  participant_year TEXT,
  college_id TEXT,
  status TEXT NOT NULL DEFAULT 'submitted',
  rejection_note TEXT,
  verified_by UUID NULL REFERENCES users(id) ON DELETE SET NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =====================================================
-- 6) Payments table (separate from registrations)
-- =====================================================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  method TEXT,
  transaction_id TEXT,
  proof_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  verified_by UUID NULL REFERENCES users(id) ON DELETE SET NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =====================================================
-- 7) Audit logs
-- =====================================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  actor_role TEXT,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  old_value JSONB,
  new_value JSONB,
  note TEXT,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB,
  resource_type TEXT,
  resource_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =====================================================
-- Indexes
-- =====================================================
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_users_chapter ON users(chapter_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_events_chapter ON events(chapter_id);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_reg_event ON registrations(event_id);
CREATE INDEX idx_reg_user ON registrations(user_id);
CREATE INDEX idx_payments_reg ON payments(registration_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_audit_actor ON audit_logs(actor_id);

-- =====================================================
-- Seed: Roles
-- =====================================================
INSERT INTO roles (id, name, description) VALUES
  ('10000000-0000-0000-0000-000000000001', 'elite_master', 'Top-level owner with full privileges'),
  ('10000000-0000-0000-0000-000000000002', 'super_admin', 'Global admin with broad privileges'),
  ('10000000-0000-0000-0000-000000000003', 'event_admin', 'Chapter/Chair admin who manages events for a chapter'),
  ('10000000-0000-0000-0000-000000000004', 'viewer', 'Read-only viewer'),
  ('10000000-0000-0000-0000-000000000005', 'user', 'Regular participant');

-- =====================================================
-- Seed: Chapters
-- =====================================================
INSERT INTO chapters (id, code, name, description) VALUES
  ('20000000-0000-0000-0000-000000000001', 'APS', 'Antenna & Propagation Society', 'AP-S chapter'),
  ('20000000-0000-0000-0000-000000000002', 'CS', 'Computer Society', 'CS chapter'),
  ('20000000-0000-0000-0000-000000000003', 'SPS', 'Signal Processing Society', 'SP-S chapter'),
  ('20000000-0000-0000-0000-000000000004', 'PROCOM', 'Professional Communication', 'PROCOM chapter'),
  ('20000000-0000-0000-0000-000000000005', 'PES', 'Power & Energy Society', 'PES chapter');

-- =====================================================
-- Seed: Admin Users
-- =====================================================
-- Elite Master
INSERT INTO users (id, name, email, password_hash, role_id, chapter_id, created_by) VALUES
('11111111-1111-1111-1111-111111111111', 'Elite Master', 'elite@ieee.example', 'password123', '10000000-0000-0000-0000-000000000001', NULL, NULL);

-- Super Admins
INSERT INTO users (id, name, email, password_hash, role_id, chapter_id, created_by) VALUES
('22222222-2222-2222-2222-222222222222', 'Super Admin 1', 'sup1@ieee.example', 'password123', '10000000-0000-0000-0000-000000000002', NULL, '11111111-1111-1111-1111-111111111111'),
('22222222-2222-2222-2222-222222222223', 'Super Admin 2', 'sup2@ieee.example', 'password123', '10000000-0000-0000-0000-000000000002', NULL, '11111111-1111-1111-1111-111111111111'),
('22222222-2222-2222-2222-222222222224', 'Super Admin 3', 'sup3@ieee.example', 'password123', '10000000-0000-0000-0000-000000000002', NULL, '11111111-1111-1111-1111-111111111111');

-- Chapter Admins
INSERT INTO users (id, name, email, password_hash, role_id, chapter_id, created_by) VALUES
('33333333-3333-3333-3333-333333333331', 'AP-S Chair', 'apschair@ieee.example', 'password123', '10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222'),
('33333333-3333-3333-3333-333333333332', 'CS Chair', 'cschair@ieee.example', 'password123', '10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222'),
('33333333-3333-3333-3333-333333333333', 'SP-S Chair', 'spschair@ieee.example', 'password123', '10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222'),
('33333333-3333-3333-3333-333333333334', 'PROCOM Chair', 'procomchair@ieee.example', 'password123', '10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222222'),
('33333333-3333-3333-3333-333333333335', 'PES Chair', 'peschair@ieee.example', 'password123', '10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222222');

-- =====================================================
-- Seed: Sample Events
-- =====================================================
INSERT INTO events (id, title, description, chapter_id, date, day, start_time, end_time, venue, assigned_admin_id, capacity) VALUES
('a1111111-1111-1111-1111-aaaaaaaaaaaa', 'ML in Antenna Optimisation', 'Workshop on ML + Antennas', '20000000-0000-0000-0000-000000000001', '2025-10-31', 1, '09:00', '16:00', 'ECE Lab', '33333333-3333-3333-3333-333333333331', 100),
('a1111111-1111-1111-1111-bbbbbbbbbbbb', 'PCB Design Workshop', 'Hands-on PCB design', '20000000-0000-0000-0000-000000000001', '2025-10-31', 1, '09:00', '13:00', 'Workshop Lab', '33333333-3333-3333-3333-333333333331', 60),
('a2222222-2222-2222-2222-cccccccccccc', 'Tech Quiz', 'Inter-college technical quiz', '20000000-0000-0000-0000-000000000002', '2025-10-31', 1, '11:00', '13:00', 'Seminar Hall', '33333333-3333-3333-3333-333333333332', 80),
('a3333333-3333-3333-3333-dddddddddddd', 'Robo Race', 'Autonomous robot race', '20000000-0000-0000-0000-000000000003', '2025-11-01', 2, '14:00', '17:00', 'Ground Floor Hall', '33333333-3333-3333-3333-333333333333', 40),
('a4444444-4444-4444-4444-eeeeeeeeeeee', 'Circuit Mania', 'Hands-on circuit design contest', '20000000-0000-0000-0000-000000000004', '2025-11-01', 2, '10:10', '12:00', 'Lab 3', '33333333-3333-3333-3333-333333333334', 50),
('a5555555-5555-5555-5555-ffffffffffff', 'Project Expo', 'Project exhibition', '20000000-0000-0000-0000-000000000005', '2025-11-01', 2, '09:00', '16:00', 'Exhibition Area', '33333333-3333-3333-3333-333333333335', 120);

-- =====================================================
-- Enable RLS
-- =====================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS Policies - Basic (You'll need to refine these)
-- =====================================================

-- Users: Everyone can read, only admins can write
CREATE POLICY "Anyone can view users" ON users FOR SELECT USING (true);
CREATE POLICY "Only admins can modify users" ON users FOR ALL USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = current_setting('app.current_user_id')::uuid AND u.role_id IN (
    SELECT id FROM roles WHERE name IN ('elite_master', 'super_admin')
  ))
);

-- Events: Public read, admins write
CREATE POLICY "Anyone can view events" ON events FOR SELECT USING (true);
CREATE POLICY "Admins can manage events" ON events FOR ALL USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = current_setting('app.current_user_id')::uuid AND u.role_id IN (
    SELECT id FROM roles WHERE name IN ('elite_master', 'super_admin', 'event_admin')
  ))
);

-- Registrations: Users see own, admins see all
CREATE POLICY "Users can view own registrations" ON registrations FOR SELECT USING (
  user_id = current_setting('app.current_user_id')::uuid
);
CREATE POLICY "Admins can view all registrations" ON registrations FOR SELECT USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = current_setting('app.current_user_id')::uuid AND u.role_id IN (
    SELECT id FROM roles WHERE name IN ('elite_master', 'super_admin', 'event_admin')
  ))
);

-- Payments: Similar to registrations
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM registrations r WHERE r.id = registration_id AND r.user_id = current_setting('app.current_user_id')::uuid)
);

-- Audit logs: Admin only
CREATE POLICY "Admins can view audit logs" ON audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = current_setting('app.current_user_id')::uuid AND u.role_id IN (
    SELECT id FROM roles WHERE name IN ('elite_master', 'super_admin')
  ))
);