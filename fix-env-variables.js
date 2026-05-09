// Fix Environment Variables Script
const fs = require('fs');
const path = require('path');

console.log('=== FIXING ENVIRONMENT VARIABLES ===');

// Read current .env.local if it exists
const envPath = path.join(__dirname, '.env.local');
let envContent = '';

try {
  envContent = fs.readFileSync(envPath, 'utf8');
  console.log('✅ Found existing .env.local file');
} catch (error) {
  console.log('⚠️ No existing .env.local file found');
}

// Check if Supabase variables are set
const hasSupabaseUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL=') && 
                      !envContent.includes('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
const hasSupabaseKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=') && 
                      !envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');

console.log('Supabase URL configured:', hasSupabaseUrl ? '✅' : '❌');
console.log('Supabase Key configured:', hasSupabaseKey ? '✅' : '❌');

if (!hasSupabaseUrl || !hasSupabaseKey) {
  console.log('\n❌ Supabase environment variables are missing or have placeholder values');
  console.log('\n🔧 SOLUTION:');
  console.log('1. Get your Supabase URL and Anon Key from your Supabase dashboard');
  console.log('2. Update .env.local file with real values:');
  console.log('   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key');
  console.log('3. Restart the Next.js server');
  
  // Create a template .env.local with placeholders
  const templateContent = `# Supabase Configuration (REQUIRED - Replace with your actual values)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key

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

  try {
    fs.writeFileSync(envPath, templateContent);
    console.log('\n✅ Created .env.local template with placeholders');
    console.log('📝 Please update the Supabase values with your actual credentials');
  } catch (error) {
    console.error('❌ Error creating .env.local:', error.message);
  }
} else {
  console.log('\n✅ Supabase environment variables are properly configured');
}

console.log('\n=== NEXT STEPS ===');
console.log('1. Update .env.local with your actual Supabase credentials');
console.log('2. Restart the Next.js server: npm run dev');
console.log('3. Test the application');
console.log('4. Then proceed with Gmail OAuth setup');
