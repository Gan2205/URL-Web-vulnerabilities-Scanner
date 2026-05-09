#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up ThreatLens Database');
console.log('=================================\n');

// Create the .env.local content
const envContent = `NEXT_PUBLIC_SUPABASE_URL=https://ucbsmsybshbahoalxlie.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjYnNtc3lic2hiYWhvYWx4bGllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDc1NDIsImV4cCI6MjA3Mzg4MzU0Mn0.WrnmrSvqOWRJD5dCyD6xmbEDgiToqx1Y0SLXm48rmnA

# Firebase Configuration (Required for authentication)
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Gmail API Configuration (Optional - for email scanning)
GMAIL_CLIENT_ID=your-gmail-client-id
GMAIL_CLIENT_SECRET=your-gmail-client-secret
GMAIL_REFRESH_TOKEN=your-gmail-refresh-token
ADMIN_EMAIL=your-email@gmail.com

# Email Service Configuration (Optional - for sending reports)
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com`;

const envPath = path.join(__dirname, '.env.local');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Successfully created .env.local with your Supabase credentials!');
  console.log('📝 Database URL: https://ucbsmsybshbahoalxlie.supabase.co');
  console.log('🔑 Anon Key: Configured\n');
  
  console.log('🚀 Next Steps:');
  console.log('1. Set up the database schema in Supabase');
  console.log('2. Restart the development server');
  console.log('3. Test the database connection\n');
  
  console.log('📋 To set up the database schema:');
  console.log('1. Go to https://supabase.com/dashboard/project/ucbsmsybshbahoalxlie');
  console.log('2. Click on "SQL Editor" in the left sidebar');
  console.log('3. Copy the contents of supabase-schema.sql');
  console.log('4. Paste and run the SQL commands\n');
  
  console.log('🔄 To restart the server:');
  console.log('1. Stop the current server (Ctrl+C)');
  console.log('2. Run: npm run dev\n');
  
} catch (error) {
  console.error('❌ Error creating .env.local:', error.message);
  console.log('\n📝 Please manually create .env.local with:');
  console.log(envContent);
}

console.log('🎯 Your Supabase project is ready!');
console.log('   Project ID: ucbsmsybshbahoalxlie');
console.log('   Dashboard: https://supabase.com/dashboard/project/ucbsmsybshbahoalxlie');
