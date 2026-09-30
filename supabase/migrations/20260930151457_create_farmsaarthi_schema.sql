/*
# FarmSaarthi - Core Schema

1. New Tables
- `user_profiles` — extends auth.users with display name, field location, and preferences.
  - id (uuid, PK, references auth.users)
  - email (text)
  - display_name (text)
  - field_latitude (double precision, nullable)
  - field_longitude (double precision, nullable)
  - field_location_name (text, nullable)
  - created_at (timestamptz)
  - updated_at (timestamptz)

- `observations` — crop health observations/diagnoses uploaded by users.
  - id (uuid, PK)
  - user_id (uuid, references auth.users, DEFAULT auth.uid())
  - crop_name (text)
  - image_url (text, nullable)
  - diagnosis (text, nullable)
  - confidence (double precision, nullable)
  - evidence (jsonb, nullable — array of evidence items)
  - status (text — 'diagnosed' | 'insufficient_evidence' | 'pending')
  - data_source (text, nullable)
  - created_at (timestamptz)

- `advisories` — advisory items linked to observations or standalone.
  - id (uuid, PK)
  - user_id (uuid, references auth.users, DEFAULT auth.uid())
  - observation_id (uuid, nullable, references observations)
  - title (text)
  - body (text)
  - severity (text — 'info' | 'warning' | 'critical')
  - created_at (timestamptz)

- `field_memory` — timeline of field events: observation, advisory, action, outcome.
  - id (uuid, PK)
  - user_id (uuid, references auth.users, DEFAULT auth.uid())
  - event_type (text — 'observation' | 'advisory' | 'action' | 'outcome')
  - title (text)
  - description (text)
  - crop_name (text, nullable)
  - created_at (timestamptz)

2. Security
- RLS enabled on all tables.
- All tables are owner-scoped: authenticated users can only access their own rows.
- user_profiles: user can read/update only their own profile row (id = auth.uid()).
- observations, advisories, field_memory: owner-scoped via user_id = auth.uid().
- user_id columns default to auth.uid() so inserts without explicit user_id succeed.
- INSERT policies use WITH CHECK (auth.uid() = user_id) to enforce ownership.
- UPDATE and DELETE policies use USING (auth.uid() = user_id).
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  display_name text DEFAULT '',
  field_latitude double precision,
  field_longitude double precision,
  field_location_name text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON user_profiles;
CREATE POLICY "select_own_profile" ON user_profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON user_profiles;
CREATE POLICY "insert_own_profile" ON user_profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON user_profiles;
CREATE POLICY "update_own_profile" ON user_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON user_profiles;
CREATE POLICY "delete_own_profile" ON user_profiles
  FOR DELETE TO authenticated USING (auth.uid() = id);

CREATE TABLE IF NOT EXISTS observations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  crop_name text NOT NULL DEFAULT '',
  image_url text,
  diagnosis text,
  confidence double precision,
  evidence jsonb,
  status text NOT NULL DEFAULT 'pending',
  data_source text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE observations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_observations" ON observations;
CREATE POLICY "select_own_observations" ON observations
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_observations" ON observations;
CREATE POLICY "insert_own_observations" ON observations
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_observations" ON observations;
CREATE POLICY "update_own_observations" ON observations
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_observations" ON observations;
CREATE POLICY "delete_own_observations" ON observations
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS advisories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  observation_id uuid REFERENCES observations(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  severity text NOT NULL DEFAULT 'info',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE advisories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_advisories" ON advisories;
CREATE POLICY "select_own_advisories" ON advisories
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_advisories" ON advisories;
CREATE POLICY "insert_own_advisories" ON advisories
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_advisories" ON advisories;
CREATE POLICY "update_own_advisories" ON advisories
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_advisories" ON advisories;
CREATE POLICY "delete_own_advisories" ON advisories
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS field_memory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL DEFAULT 'observation',
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  crop_name text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE field_memory ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_field_memory" ON field_memory;
CREATE POLICY "select_own_field_memory" ON field_memory
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_field_memory" ON field_memory;
CREATE POLICY "insert_own_field_memory" ON field_memory
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_field_memory" ON field_memory;
CREATE POLICY "update_own_field_memory" ON field_memory
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_field_memory" ON field_memory;
CREATE POLICY "delete_own_field_memory" ON field_memory
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_observations_user_id ON observations(user_id);
CREATE INDEX IF NOT EXISTS idx_advisories_user_id ON advisories(user_id);
CREATE INDEX IF NOT EXISTS idx_field_memory_user_id ON field_memory(user_id);
CREATE INDEX IF NOT EXISTS idx_field_memory_created_at ON field_memory(created_at DESC);
