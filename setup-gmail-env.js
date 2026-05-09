const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up Gmail environment variables...');

const envContent = `# Gmail API Configuration
GMAIL_CLIENT_ID=YOUR_GMAIL_CLIENT_ID
GMAIL_CLIENT_SECRET=YOUR_GMAIL_CLIENT_SECRET
GMAIL_REFRESH_TOKEN=your_refresh_token_here
ADMIN_EMAIL=your_email@gmail.com

# Email Service Configuration
EMAIL_SERVICE=console
EMAIL_FROM=noreply@threatlens.app

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ucbsmsybshbahoalxlie.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjYnNtc3lic2hiYWhvYWx4bGllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDc1NDIsImV4cCI6MjA3Mzg4MzU0Mn0.WrnmrSvqOWRJD5dCyD6xmbEDgiToqx1Y0SLXm48rmnA
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
`;

const envPath = path.join(__dirname, '.env.local');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file');
  console.log('📝 Next steps:');
  console.log('1. Go to http://localhost:3002/gmail-setup');
  console.log('2. Complete Gmail OAuth authorization');
  console.log('3. Copy the refresh token to .env.local');
  console.log('4. Restart the development server');
  console.log('5. Automated email monitoring will be enabled');
} catch (error) {
  console.error('❌ Error creating .env.local:', error.message);
}
