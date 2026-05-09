-- Update database schema to support Firebase UIDs
-- Run this in your Supabase SQL Editor

-- First, drop the foreign key constraints
ALTER TABLE scan_results DROP CONSTRAINT IF EXISTS scan_results_user_id_fkey;
ALTER TABLE scheduled_scans DROP CONSTRAINT IF EXISTS scheduled_scans_user_id_fkey;

-- Change user_id columns from UUID to TEXT
ALTER TABLE scan_results ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE scheduled_scans ALTER COLUMN user_id TYPE TEXT;

-- Update the users table to also use TEXT for id (optional, but recommended)
-- Note: This will require recreating the users table
-- You can skip this if you want to keep UUID for users table

-- If you want to keep users table as UUID, you can create a mapping table instead:
-- CREATE TABLE IF NOT EXISTS user_mappings (
--   firebase_uid TEXT PRIMARY KEY,
--   supabase_uuid UUID REFERENCES users(id) ON DELETE CASCADE,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- For now, let's just update the scan tables to use TEXT for user_id
-- This allows Firebase UIDs to be stored directly

-- Verify the changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'scan_results' AND column_name = 'user_id';

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'scheduled_scans' AND column_name = 'user_id';
