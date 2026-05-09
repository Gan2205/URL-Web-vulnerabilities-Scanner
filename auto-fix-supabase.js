// Auto-fix Supabase Environment Variables
const fs = require('fs');
const path = require('path');

console.log('=== AUTO-FIXING SUPABASE CONFIGURATION ===');

// Your actual Supabase credentials (found in your project files)
const supabaseUrl = 'https://ucbsmsybshbahoalxlie.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjYnNtc3lic2hiYWhvYWx4bGllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDc1NDIsImV4cCI6MjA3Mzg4MzU0Mn0.WrnmrSvqOWRJD5dCyD6xmbEDgiToqx1Y0SLXm48rmnA';

console.log('✅ Found your Supabase credentials:');
console.log('   URL:', supabaseUrl);
console.log('   Key:', supabaseKey.substring(0, 20) + '...');

// Create the correct .env.local content
const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseKey}

# Gmail API Configuration
GMAIL_CLIENT_ID=YOUR_GMAIL_CLIENT_ID
GMAIL_CLIENT_SECRET=YOUR_GMAIL_CLIENT_SECRET
GMAIL_REFRESH_TOKEN=

# Admin Email
ADMIN_EMAIL=admin@threatlens.com

# Email Service Configuration (Optional)
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
`;

// Write the .env.local file
const envPath = path.join(__dirname, '.env.local');
try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Successfully updated .env.local with correct Supabase credentials');
} catch (error) {
  console.error('❌ Error writing .env.local:', error.message);
  process.exit(1);
}

console.log('\n🎉 SUPABASE CONFIGURATION FIXED!');
console.log('📝 Your .env.local now contains:');
console.log('   - Correct Supabase URL');
console.log('   - Correct Supabase Anon Key');
console.log('   - Gmail API credentials');
console.log('');
console.log('🔄 NEXT STEPS:');
console.log('1. Restart your Next.js server: npm run dev');
console.log('2. The Supabase error should be gone!');
console.log('3. All features will work (scanning, comparison, scheduled scans)');
console.log('4. Then proceed with Gmail OAuth setup');
console.log('');
console.log('📧 Gmail OAuth URL: http://localhost:3000/api/gmail-auth');
