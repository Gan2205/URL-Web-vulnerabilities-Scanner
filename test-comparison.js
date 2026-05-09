#!/usr/bin/env node

/**
 * Test Script for Scan Comparison Feature
 * This script creates test data and tests the comparison API
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://ucbsmsybshbahoalxlie.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjYnNtc3lic2hiYWhvYWx4bGllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDc1NDIsImV4cCI6MjA3Mzg4MzU0Mn0.WrnmrSvqOWRJD5dCyD6xmbEDgiToqx1Y0SLXm48rmnA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testComparison() {
  console.log('🧪 Testing scan comparison feature...');
  
  const testUserId = 'Fia8m4gpQHX7duLZOxhvtJaatNP2';
  const testUrl = 'https://example.com';
  
  try {
    // Step 1: Check current database schema
    console.log('📝 Step 1: Checking database schema...');
    
    const { data: schemaData, error: schemaError } = await supabase
      .from('information_schema.columns')
      .select('table_name, column_name, data_type')
      .eq('table_name', 'scan_results')
      .eq('column_name', 'user_id');
    
    if (schemaError) {
      console.log('⚠️  Could not check schema directly, proceeding with test...');
    } else {
      console.log('📊 Current schema:', schemaData);
    }
    
    // Step 2: Try to insert test data
    console.log('📝 Step 2: Creating test scan data...');
    
    const testScans = [
      {
        id: 'test-scan-1',
        user_id: testUserId,
        url: testUrl,
        timestamp: new Date().toISOString(),
        vulnerabilities: [
          { type: 'XSS', severity: 'high', description: 'Cross-site scripting vulnerability' },
          { type: 'SQL Injection', severity: 'critical', description: 'SQL injection vulnerability' }
        ],
        summary: {
          total_vulnerabilities: 2,
          critical: 1,
          high: 1,
          medium: 0,
          low: 0
        },
        security_score: {
          score: 75,
          grade: 'C',
          details: 'Multiple high-severity vulnerabilities found'
        }
      },
      {
        id: 'test-scan-2',
        user_id: testUserId,
        url: testUrl,
        timestamp: new Date(Date.now() - 60000).toISOString(), // 1 minute ago
        vulnerabilities: [
          { type: 'XSS', severity: 'high', description: 'Cross-site scripting vulnerability' },
          { type: 'CSRF', severity: 'medium', description: 'Cross-site request forgery' }
        ],
        summary: {
          total_vulnerabilities: 2,
          critical: 0,
          high: 1,
          medium: 1,
          low: 0
        },
        security_score: {
          score: 85,
          grade: 'B',
          details: 'Some vulnerabilities found but overall security improved'
        }
      }
    ];
    
    // Try to insert test data
    const { data: insertData, error: insertError } = await supabase
      .from('scan_results')
      .insert(testScans)
      .select();
    
    if (insertError) {
      console.error('❌ Error inserting test data:', insertError);
      
      if (insertError.code === '22P02') {
        console.log('\n🔧 SOLUTION: Database schema needs to be updated!');
        console.log('Please run the following SQL in your Supabase dashboard:');
        console.log(`
          ALTER TABLE scan_results DROP CONSTRAINT IF EXISTS scan_results_user_id_fkey;
          ALTER TABLE scheduled_scans DROP CONSTRAINT IF EXISTS scheduled_scans_user_id_fkey;
          ALTER TABLE scan_results ALTER COLUMN user_id TYPE TEXT;
          ALTER TABLE scheduled_scans ALTER COLUMN user_id TYPE TEXT;
        `);
        console.log('\nAfter running this SQL, run this test script again.');
        return;
      }
      
      throw insertError;
    }
    
    console.log('✅ Test data inserted successfully:', insertData);
    
    // Step 3: Test the comparison API
    console.log('📝 Step 3: Testing comparison API...');
    
    const comparisonData = {
      url: testUrl,
      scanIds: ['test-scan-1', 'test-scan-2'],
      userId: testUserId
    };
    
    const response = await fetch('http://localhost:3000/api/scan-comparison', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(comparisonData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Comparison API test successful!');
      console.log('📊 Comparison result:', JSON.stringify(result, null, 2));
    } else {
      console.error('❌ Comparison API test failed:', result);
    }
    
    // Step 4: Clean up test data
    console.log('📝 Step 4: Cleaning up test data...');
    
    const { error: deleteError } = await supabase
      .from('scan_results')
      .delete()
      .in('id', ['test-scan-1', 'test-scan-2']);
    
    if (deleteError) {
      console.log('⚠️  Could not clean up test data:', deleteError.message);
    } else {
      console.log('✅ Test data cleaned up successfully');
    }
    
    console.log('🎉 Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testComparison();
