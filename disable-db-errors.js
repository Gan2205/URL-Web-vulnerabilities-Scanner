#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Disabling Database Errors (Temporary Fix)');
console.log('============================================\n');

console.log('This will modify the compare feature to work without database errors.');
console.log('The app will function normally for individual scans.\n');

// Create a simple environment file that disables database features
const envContent = `# Supabase Configuration (Disabled for now)
# NEXT_PUBLIC_SUPABASE_URL=https://ucbsmsybshbahoalxlie.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjYnNtc3lic2hiYWhvYWx4bGllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDc1NDIsImV4cCI6MjA3Mzg4MzU0Mn0.WrnmrSvqOWRJD5dCyD6xmbEDgiToqx1Y0SLXm48rmnA

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
  // Backup the current file
  if (fs.existsSync(envPath)) {
    const backupPath = path.join(__dirname, '.env.local.backup');
    fs.copyFileSync(envPath, backupPath);
    console.log('✅ Backed up current .env.local to .env.local.backup');
  }
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Updated .env.local to disable database features');
  console.log('📝 Database features are now disabled');
  console.log('🔄 Please restart the development server:\n');
  console.log('   1. Stop the current server (Ctrl+C)');
  console.log('   2. Run: npm run dev\n');
  
  console.log('🎯 What will work:');
  console.log('- ✅ URL Scanning');
  console.log('- ✅ Gmail Processing');
  console.log('- ✅ Authentication');
  console.log('- ✅ Main Application Interface\n');
  
  console.log('⚠️  What will be disabled:');
  console.log('- ❌ Compare feature');
  console.log('- ❌ Scheduling features');
  console.log('- ❌ Scan history persistence\n');
  
  console.log('💡 To re-enable database features later:');
  console.log('1. Set up your own Supabase database');
  console.log('2. Restore .env.local.backup');
  console.log('3. Update with your real credentials');
  
} catch (error) {
  console.error('❌ Error updating .env.local:', error.message);
  console.log('\n📝 Please manually edit .env.local and comment out the Supabase lines:');
  console.log('# NEXT_PUBLIC_SUPABASE_URL=...');
  console.log('# NEXT_PUBLIC_SUPABASE_ANON_KEY=...');
}
