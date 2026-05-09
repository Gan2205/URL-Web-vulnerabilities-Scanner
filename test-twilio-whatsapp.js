// Quick Twilio WhatsApp Test
// Run with: node test-twilio-whatsapp.js

require('dotenv').config({ path: '.env.local' });

async function testTwilioWhatsApp() {
  console.log('🧪 Testing Twilio WhatsApp Integration...\n');

  // Check environment variables
  const requiredVars = [
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'TWILIO_WHATSAPP_NUMBER'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    console.log('❌ Missing required environment variables:');
    missingVars.forEach(varName => console.log(`   - ${varName}`));
    console.log('\nPlease add them to your .env.local file');
    return;
  }

  console.log('✅ All required environment variables are set\n');

  // Test sending a message
  const testPhoneNumber = process.env.TEST_PHONE_NUMBER || '+919381276836';
  
  try {
    const twilio = require('twilio');
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    console.log('📤 Sending test message...');
    
    const message = await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${testPhoneNumber}`,
      body: '🧪 Test message from ThreatLens WhatsApp Bot!\n\nThis is a test message to verify your WhatsApp integration is working correctly.\n\n🛡️ Powered by ThreatLens Security Scanner\n\nSend me a URL to scan for security vulnerabilities!'
    });

    console.log('✅ Test message sent successfully!');
    console.log(`   Message SID: ${message.sid}`);
    console.log(`   To: ${testPhoneNumber}`);
    console.log(`   Status: ${message.status}\n`);

  } catch (error) {
    console.log('❌ Error sending test message:');
    console.log(`   ${error.message}\n`);
  }

  console.log('🎉 Twilio WhatsApp test completed!');
  console.log('\n📋 Next Steps:');
  console.log('1. Make sure you joined the Twilio sandbox');
  console.log('2. Send a WhatsApp message to your sandbox number');
  console.log('3. Try: https://example.com');
  console.log('4. Check your server logs for incoming messages');
}

testTwilioWhatsApp().catch(console.error);
