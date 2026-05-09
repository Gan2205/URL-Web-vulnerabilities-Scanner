#!/usr/bin/env node

/**
 * Database Migration Script for ThreatLens
 * This script updates the database schema to support Firebase UIDs
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://ucbsmsybshbahoalxlie.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjYnNtc3lic2hiYWhvYWx4bGllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDc1NDIsImV4cCI6MjA3Mzg4MzU0Mn0.WrnmrSvqOWRJD5dCyD6xmbEDgiToqx1Y0SLXm48rmnA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateDatabase() {
  console.log('🚀 Starting database migration...');
  
  try {
    // Step 1: Drop foreign key constraints
    console.log('📝 Step 1: Dropping foreign key constraints...');
    
    const dropConstraints = `
      ALTER TABLE scan_results DROP CONSTRAINT IF EXISTS scan_results_user_id_fkey;
      ALTER TABLE scheduled_scans DROP CONSTRAINT IF EXISTS scheduled_scans_user_id_fkey;
    `;
    
    const { error: constraintError } = await supabase.rpc('exec_sql', { sql: dropConstraints });
    if (constraintError) {
      console.log('⚠️  Constraint drop warnings (may not exist):', constraintError.message);
    } else {
      console.log('✅ Foreign key constraints dropped successfully');
    }
    
    // Step 2: Change user_id columns to TEXT
    console.log('📝 Step 2: Changing user_id columns to TEXT...');
    
    const alterColumns = `
      ALTER TABLE scan_results ALTER COLUMN user_id TYPE TEXT;
      ALTER TABLE scheduled_scans ALTER COLUMN user_id TYPE TEXT;
    `;
    
    const { error: alterError } = await supabase.rpc('exec_sql', { sql: alterColumns });
    if (alterError) {
      console.error('❌ Error altering columns:', alterError);
      throw alterError;
    }
    
    console.log('✅ Columns altered successfully');
    
    // Step 3: Verify the changes
    console.log('📝 Step 3: Verifying changes...');
    
    const verifyQuery = `
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name IN ('scan_results', 'scheduled_scans') 
      AND column_name = 'user_id'
      ORDER BY table_name;
    `;
    
    const { data: verifyData, error: verifyError } = await supabase.rpc('exec_sql', { sql: verifyQuery });
    if (verifyError) {
      console.error('❌ Error verifying changes:', verifyError);
      throw verifyError;
    }
    
    console.log('✅ Verification results:');
    console.table(verifyData);
    
    // Step 4: Test with a sample Firebase UID
    console.log('📝 Step 4: Testing with sample Firebase UID...');
    
    const testQuery = `
      SELECT COUNT(*) as count 
      FROM scan_results 
      WHERE user_id = 'Fia8m4gpQHX7duLZOxhvtJaatNP2';
    `;
    
    const { data: testData, error: testError } = await supabase.rpc('exec_sql', { sql: testQuery });
    if (testError) {
      console.error('❌ Error testing Firebase UID:', testError);
      throw testError;
    }
    
    console.log('✅ Firebase UID test successful:', testData);
    
    console.log('🎉 Database migration completed successfully!');
    console.log('🔗 The scan comparison feature should now work properly.');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.log('\n📋 Manual migration steps:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Run the following SQL:');
    console.log(`
      ALTER TABLE scan_results DROP CONSTRAINT IF EXISTS scan_results_user_id_fkey;
      ALTER TABLE scheduled_scans DROP CONSTRAINT IF EXISTS scheduled_scans_user_id_fkey;
      ALTER TABLE scan_results ALTER COLUMN user_id TYPE TEXT;
      ALTER TABLE scheduled_scans ALTER COLUMN user_id TYPE TEXT;
    `);
    process.exit(1);
  }
}

// Run the migration
migrateDatabase();
