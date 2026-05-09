#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 Supabase Environment Setup');
console.log('=============================\n');

console.log('Please provide your Supabase credentials:');
console.log('(You can find these in your Supabase project dashboard → Settings → API)\n');

rl.question('Enter your Supabase Project URL (e.g., https://your-project-id.supabase.co): ', (supabaseUrl) => {
  rl.question('Enter your Supabase Anon Key (starts with eyJ...): ', (supabaseKey) => {
    
    const envContent = `# Supabase Configuration (Required for compare and scheduling features)
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseKey}

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
    
    try {
      fs.writeFileSync(envPath, envContent);
      console.log('\n✅ Successfully updated .env.local file!');
      console.log('📝 Your Supabase credentials have been added.');
      console.log('\n🚀 Next steps:');
      console.log('1. Set up the database schema (I\'ll help you with this)');
      console.log('2. Restart the development server');
      console.log('3. Test the compare and scheduling features');
    } catch (error) {
      console.error('\n❌ Error updating .env.local:', error.message);
      console.log('\n📝 Please manually create/update .env.local with:');
      console.log(envContent);
    }
    
    rl.close();
  });
});
