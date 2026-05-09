// Load environment variables first
require('dotenv').config({ path: './twilio-config.env' });

console.log('🔧 Starting server with Twilio environment variables...');
console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID);
console.log('TWILIO_WHATSAPP_NUMBER:', process.env.TWILIO_WHATSAPP_NUMBER);

// Start the Next.js server
const { spawn } = require('child_process');

const server = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env }
});

server.on('error', (error) => {
  console.error('❌ Server error:', error);
});

server.on('close', (code) => {
  console.log(`📡 Server exited with code ${code}`);
});

console.log('✅ Server starting with environment variables loaded...');
