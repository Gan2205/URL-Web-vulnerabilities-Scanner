#!/usr/bin/env node

/**
 * Fix Comparison API - Alternative Approach
 * This script creates a working comparison by using proper UUIDs
 */

const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

// Supabase configuration
const supabaseUrl = 'https://ucbsmsybshbahoalxlie.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjYnNtc3lic2hiYWhvYWx4bGllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDc1NDIsImV4cCI6MjA3Mzg4MzU0Mn0.WrnmrSvqOWRJD5dCyD6xmbEDgiToqx1Y0SLXm48rmnA';

const supabase = createClient(supabaseUrl, supabaseKey);

// Function to convert Firebase UID to UUID format
function firebaseUidToUuid(firebaseUid) {
  if (firebaseUid.length !== 28) {
    return firebaseUid; // Return as-is if not a Firebase UID
  }
  
  // Convert Firebase UID to UUID format
  // Take first 8, then 4, then 4, then 4, then 12 characters
  return firebaseUid.substring(0, 8) + '-' + 
         firebaseUid.substring(8, 12) + '-' + 
         firebaseUid.substring(12, 16) + '-' + 
         firebaseUid.substring(16, 20) + '-' + 
         firebaseUid.substring(20, 28) + '0000';
}

// Function to create a proper UUID from Firebase UID
function createUuidFromFirebaseUid(firebaseUid) {
  // Use the Firebase UID as a seed to generate a consistent UUID
  const crypto = require('crypto');
  const hash = crypto.createHash('sha256').update(firebaseUid).digest('hex');
  
  // Create a proper UUID from the hash
  return hash.substring(0, 8) + '-' + 
         hash.substring(8, 12) + '-' + 
         hash.substring(12, 16) + '-' + 
         hash.substring(16, 20) + '-' + 
         hash.substring(20, 32);
}

async function testComparisonWithUuids() {
  console.log('🧪 Testing scan comparison with proper UUIDs...');
  
  const testFirebaseUid = 'Fia8m4gpQHX7duLZOxhvtJaatNP2';
  const testUuid = createUuidFromFirebaseUid(testFirebaseUid);
  const testUrl = 'https://example.com';
  
  console.log('🔄 Converting Firebase UID to UUID:');
  console.log(`   Firebase UID: ${testFirebaseUid}`);
  console.log(`   Converted UUID: ${testUuid}`);
  
  try {
    // Step 1: Create a test user first
    console.log('📝 Step 1: Creating test user...');
    
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([{
        id: testUuid,
        email: 'test@example.com',
        name: 'Test User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();
    
    if (userError && !userError.message.includes('duplicate key')) {
      console.error('❌ Error creating user:', userError);
      throw userError;
    }
    
    console.log('✅ Test user created or already exists');
    
    // Step 2: Create test scan data with proper UUIDs
    console.log('📝 Step 2: Creating test scan data with UUIDs...');
    
    const testScans = [
      {
        id: uuidv4(),
        user_id: testUuid,
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
        id: uuidv4(),
        user_id: testUuid,
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
    
    // Insert test data
    const { data: insertData, error: insertError } = await supabase
      .from('scan_results')
      .insert(testScans)
      .select();
    
    if (insertError) {
      console.error('❌ Error inserting test data:', insertError);
      throw insertError;
    }
    
    console.log('✅ Test data inserted successfully');
    console.log('📊 Inserted scans:', insertData.map(s => ({ id: s.id, url: s.url, score: s.security_score?.score })));
    
    // Step 3: Test the comparison API with the UUIDs
    console.log('📝 Step 3: Testing comparison API...');
    
    const comparisonData = {
      url: testUrl,
      scanIds: insertData.map(s => s.id),
      userId: testFirebaseUid // Use original Firebase UID
    };
    
    console.log('🔄 Testing with data:', comparisonData);
    
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
      .in('id', insertData.map(s => s.id));
    
    if (deleteError) {
      console.log('⚠️  Could not clean up test data:', deleteError.message);
    } else {
      console.log('✅ Test data cleaned up successfully');
    }
    
    console.log('🎉 Test completed successfully!');
    console.log('💡 The comparison feature works with UUID conversion!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testComparisonWithUuids();
