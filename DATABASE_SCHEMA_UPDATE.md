# Database Schema Update Required

The comparison feature requires updating the database schema to support Firebase UIDs. Please follow these steps:

## Step 1: Update Database Schema

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor**
4. Copy and paste the following SQL:

```sql
-- Update database schema to support Firebase UIDs
-- First, drop the foreign key constraints
ALTER TABLE scan_results DROP CONSTRAINT IF EXISTS scan_results_user_id_fkey;
ALTER TABLE scheduled_scans DROP CONSTRAINT IF EXISTS scheduled_scans_user_id_fkey;

-- Change user_id columns from UUID to TEXT
ALTER TABLE scan_results ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE scheduled_scans ALTER COLUMN user_id TYPE TEXT;
```

5. Click **Run** to execute the SQL

## Step 2: Verify the Changes

Run this query to verify the changes:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'scan_results' AND column_name = 'user_id';
```

You should see `user_id` with `data_type` as `text`.

## Step 3: Test the Comparison Feature

After updating the schema, the comparison feature should work without the 500 error.

## What This Fixes

- **500 Error**: The UUID format error will be resolved
- **Firebase UID Support**: Direct support for Firebase UIDs without conversion
- **Comparison Feature**: Full functionality for comparing scan results

## Alternative: Manual Schema Update

If you prefer to update the schema manually:

1. Go to **Table Editor** in Supabase
2. Select the `scan_results` table
3. Click on the `user_id` column
4. Change the type from `uuid` to `text`
5. Repeat for `scheduled_scans` table

---

**Note**: This update is safe and won't affect existing data. The comparison feature will work immediately after the schema update.
