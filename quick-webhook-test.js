// Quick webhook test
const http = require('http');

const testData = {
  From: "whatsapp:+919381276836",
  Body: "https://google.com",
  MessageSid: "test123"
};

const postData = JSON.stringify(testData);

console.log('🧪 Testing webhook with Twilio credentials...');
console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID);
console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN ? 'SET' : 'NOT SET');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/whatsapp-webhook',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log(`📡 Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('📡 Response:', data);
    if (res.statusCode === 200) {
      console.log('✅ Webhook test successful!');
    } else {
      console.log('❌ Webhook test failed!');
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Error:', e.message);
  console.log('💡 Make sure the server is running on port 3000');
});

req.write(postData);
req.end();
