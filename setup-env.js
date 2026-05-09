#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 ThreatLens Environment Setup');
console.log('================================\n');

const envContent = `# Supabase Configuration (Required for compare and scheduling features)
# Get these values from your Supabase project dashboard: https://supabase.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Firebase Configuration (Required for authentication)
# Get these values from your Firebase project console: https://console.firebase.google.com
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

if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists. Skipping creation.');
  console.log('   If you need to update it, please edit the file manually.\n');
} else {
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env.local file successfully!');
    console.log('📝 Please edit .env.local and add your actual credentials:\n');
    console.log('   1. Supabase: https://supabase.com (for compare & scheduling)');
    console.log('   2. Firebase: https://console.firebase.google.com (for auth)');
    console.log('   3. Gmail API: Optional (for email scanning)\n');
  } catch (error) {
    console.error('❌ Error creating .env.local:', error.message);
    console.log('\n📝 Please create .env.local manually with the following content:\n');
    console.log(envContent);
  }
}

console.log('🚀 After setting up your credentials, restart the development server:');
console.log('   npm run dev\n');

console.log('📚 For detailed setup instructions, see:');
console.log('   - DATABASE_SETUP.md (for Supabase)');
console.log('   - GMAIL_API_SETUP.md (for Gmail)');
console.log('   - EMAIL_SETUP.md (for email services)');
