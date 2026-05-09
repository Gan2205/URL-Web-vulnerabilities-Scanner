-- Complete Database Schema Update for ThreatLens
-- This script updates the database to fully support the application

-- Step 1: Drop all foreign key constraints
ALTER TABLE scan_results DROP CONSTRAINT IF EXISTS scan_results_user_id_fkey;
ALTER TABLE scan_results DROP CONSTRAINT IF EXISTS scan_results_scheduled_scan_id_fkey;
ALTER TABLE scheduled_scans DROP CONSTRAINT IF EXISTS scheduled_scans_user_id_fkey;

-- Step 2: Change user_id columns to TEXT to support Firebase UIDs
ALTER TABLE scan_results ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE scheduled_scans ALTER COLUMN user_id TYPE TEXT;

-- Step 3: Change id columns to TEXT to support custom IDs
-- Note: This will require recreating the tables as we can't change UUID to TEXT directly
-- We'll create new tables with the correct schema

-- Create new scan_results table with TEXT IDs
CREATE TABLE IF NOT EXISTS scan_results_new (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  url TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  vulnerabilities JSONB NOT NULL DEFAULT '[]',
  summary JSONB NOT NULL DEFAULT '{}',
  security_score JSONB NOT NULL DEFAULT '{}',
  certificate_info JSONB,
  scheduled_scan_id TEXT, -- Reference to scheduled scan if this was a scheduled scan
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create new scheduled_scans table with TEXT IDs
CREATE TABLE IF NOT EXISTS scheduled_scans_new (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  url TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  schedule_type VARCHAR(50) NOT NULL CHECK (schedule_type IN ('random', 'weekly', 'monthly')),
  schedule_config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  last_run TIMESTAMP WITH TIME ZONE,
  next_run TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Copy data from old tables to new tables (if any data exists)
INSERT INTO scan_results_new (id, user_id, url, timestamp, vulnerabilities, summary, security_score, certificate_info, scheduled_scan_id, created_at, updated_at)
SELECT 
  id::text, 
  user_id::text, 
  url, 
  timestamp, 
  vulnerabilities, 
  summary, 
  security_score, 
  certificate_info, 
  scheduled_scan_id::text, 
  created_at, 
  updated_at
FROM scan_results
ON CONFLICT (id) DO NOTHING;

INSERT INTO scheduled_scans_new (id, user_id, url, name, schedule_type, schedule_config, is_active, last_run, next_run, created_at, updated_at)
SELECT 
  id::text, 
  user_id::text, 
  url, 
  name, 
  schedule_type, 
  schedule_config, 
  is_active, 
  last_run, 
  next_run, 
  created_at, 
  updated_at
FROM scheduled_scans
ON CONFLICT (id) DO NOTHING;

-- Step 5: Drop old tables and rename new ones
DROP TABLE IF EXISTS scan_results CASCADE;
DROP TABLE IF EXISTS scheduled_scans CASCADE;

ALTER TABLE scan_results_new RENAME TO scan_results;
ALTER TABLE scheduled_scans_new RENAME TO scheduled_scans;

-- Step 6: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_scan_results_user_id ON scan_results(user_id);
CREATE INDEX IF NOT EXISTS idx_scan_results_url ON scan_results(url);
CREATE INDEX IF NOT EXISTS idx_scan_results_created_at ON scan_results(created_at);
CREATE INDEX IF NOT EXISTS idx_scheduled_scans_user_id ON scheduled_scans(user_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_scans_is_active ON scheduled_scans(is_active);

-- Step 7: Create RLS policies for the new tables
ALTER TABLE scan_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_scans ENABLE ROW LEVEL SECURITY;

-- RLS policies for scan_results
CREATE POLICY "Users can view their own scan results" ON scan_results
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own scan results" ON scan_results
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own scan results" ON scan_results
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own scan results" ON scan_results
  FOR DELETE USING (auth.uid()::text = user_id);

-- RLS policies for scheduled_scans
CREATE POLICY "Users can view their own scheduled scans" ON scheduled_scans
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own scheduled scans" ON scheduled_scans
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own scheduled scans" ON scheduled_scans
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own scheduled scans" ON scheduled_scans
  FOR DELETE USING (auth.uid()::text = user_id);

-- Step 8: Verify the changes
SELECT 'scan_results' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'scan_results' AND column_name IN ('id', 'user_id')
UNION ALL
SELECT 'scheduled_scans' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'scheduled_scans' AND column_name IN ('id', 'user_id')
ORDER BY table_name, column_name;
