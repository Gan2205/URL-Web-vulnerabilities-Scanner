#!/usr/bin/env node

/**
 * Test Script for Scheduling Feature
 * This script tests the scheduling functionality with UUID conversion
 */

const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

// Supabase configuration
const supabaseUrl = 'https://ucbsmsybshbahoalxlie.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjYnNtc3lic2hiYWhvYWx4bGllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDc1NDIsImV4cCI6MjA3Mzg4MzU0Mn0.WrnmrSvqOWRJD5dCyD6xmbEDgiToqx1Y0SLXm48rmnA';

const supabase = createClient(supabaseUrl, supabaseKey);

// Function to create a proper UUID from Firebase UID
function createUuidFromFirebaseUid(firebaseUid) {
  const crypto = require('crypto');
  const hash = crypto.createHash('sha256').update(firebaseUid).digest('hex');
  return hash.substring(0, 8) + '-' + 
         hash.substring(8, 12) + '-' + 
         hash.substring(12, 16) + '-' + 
         hash.substring(16, 20) + '-' + 
         hash.substring(20, 32);
}

async function testScheduling() {
  console.log('🧪 Testing scheduling feature...');
  
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
    
    // Step 2: Test creating a scheduled scan
    console.log('📝 Step 2: Creating scheduled scan...');
    
    const scheduledScanData = {
      url: testUrl,
      name: 'Test Weekly Scan',
      schedule_type: 'weekly',
      schedule_config: {
        dayOfWeek: 1, // Monday
        hour: 9,
        minute: 0
      },
      email_notifications: true
    };
    
    const response = await fetch('http://localhost:3000/api/scheduled-scans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...scheduledScanData,
        userId: testFirebaseUid
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Scheduled scan created successfully!');
      console.log('📊 Created scan:', JSON.stringify(result, null, 2));
      
      const scanId = result.data.id;
      
      // Step 3: Test fetching scheduled scans
      console.log('📝 Step 3: Fetching scheduled scans...');
      
      const fetchResponse = await fetch(`http://localhost:3000/api/scheduled-scans?userId=${testFirebaseUid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const fetchResult = await fetchResponse.json();
      
      if (fetchResponse.ok) {
        console.log('✅ Scheduled scans fetched successfully!');
        console.log('📊 Found scans:', fetchResult.data?.length || 0);
        console.log('📊 Scans data:', JSON.stringify(fetchResult, null, 2));
      } else {
        console.error('❌ Error fetching scheduled scans:', fetchResult);
      }
      
      // Step 4: Test updating the scheduled scan
      console.log('📝 Step 4: Updating scheduled scan...');
      
      const updateResponse = await fetch(`http://localhost:3000/api/scheduled-scans/${scanId}?userId=${testFirebaseUid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'Updated Test Scan',
          schedule_config: {
            dayOfWeek: 2, // Tuesday
            hour: 10,
            minute: 30
          }
        })
      });
      
      const updateResult = await updateResponse.json();
      
      if (updateResponse.ok) {
        console.log('✅ Scheduled scan updated successfully!');
        console.log('📊 Updated scan:', JSON.stringify(updateResult, null, 2));
      } else {
        console.error('❌ Error updating scheduled scan:', updateResult);
      }
      
      // Step 5: Test toggling the scheduled scan
      console.log('📝 Step 5: Toggling scheduled scan...');
      
      const toggleResponse = await fetch(`http://localhost:3000/api/scheduled-scans/${scanId}/toggle?userId=${testFirebaseUid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const toggleResult = await toggleResponse.json();
      
      if (toggleResponse.ok) {
        console.log('✅ Scheduled scan toggled successfully!');
        console.log('📊 Toggled scan:', JSON.stringify(toggleResult, null, 2));
      } else {
        console.error('❌ Error toggling scheduled scan:', toggleResult);
      }
      
      // Step 6: Clean up - delete the scheduled scan
      console.log('📝 Step 6: Cleaning up scheduled scan...');
      
      const deleteResponse = await fetch(`http://localhost:3000/api/scheduled-scans/${scanId}?userId=${testFirebaseUid}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (deleteResponse.ok) {
        console.log('✅ Scheduled scan deleted successfully!');
      } else {
        const deleteResult = await deleteResponse.json();
        console.error('❌ Error deleting scheduled scan:', deleteResult);
      }
      
    } else {
      console.error('❌ Error creating scheduled scan:', result);
    }
    
    console.log('🎉 Scheduling test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testScheduling();
