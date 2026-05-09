const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? 'Present' : 'Missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Environment variables not found!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('⚠️  Connection test failed:', error.message);
      console.log('This is expected if tables don\'t exist yet.');
    } else {
      console.log('✅ Connection successful!');
    }
    
    // Test if we can create a simple table (this will fail gracefully if RLS is enabled)
    console.log('\n📋 Next steps:');
    console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard');
    console.log('2. Select your project');
    console.log('3. Go to SQL Editor');
    console.log('4. Copy and paste the contents of supabase-schema.sql');
    console.log('5. Click "Run" to create the tables');
    console.log('6. Restart your development server: npm run dev');
    
  } catch (error) {
    console.error('❌ Connection error:', error.message);
  }
}

testConnection();
