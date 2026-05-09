// Test webhook with proper Twilio format
const twilio = require('twilio');

async function testWebhookFix() {
  console.log('🧪 Testing Webhook Fix...\n');

  try {
    const client = twilio(
      'YOUR_TWILIO_ACCOUNT_SID',
      'YOUR_TWILIO_AUTH_TOKEN'
    );

    // Test 1: Send a valid URL
    console.log('📤 Test 1: Sending valid URL...');
    const message1 = await client.messages.create({
      from: 'whatsapp:+14155238886',
      to: 'whatsapp:+919381276836',
      body: '🔍 Testing webhook fix with https://google.com'
    });
    console.log('✅ Message sent:', message1.sid);

    // Test 2: Send an invalid URL
    console.log('\n📤 Test 2: Sending invalid URL...');
    const message2 = await client.messages.create({
      from: 'whatsapp:+14155238886',
      to: 'whatsapp:+919381276836',
      body: '🔍 Testing with invalid URL: not-a-valid-url'
    });
    console.log('✅ Message sent:', message2.sid);

    // Test 3: Send help command
    console.log('\n📤 Test 3: Sending help command...');
    const message3 = await client.messages.create({
      from: 'whatsapp:+14155238886',
      to: 'whatsapp:+919381276836',
      body: 'help'
    });
    console.log('✅ Message sent:', message3.sid);

    console.log('\n🎉 All test messages sent!');
    console.log('📱 Check your WhatsApp for responses...');
    console.log('\n📋 Expected responses:');
    console.log('1. Security scan report for google.com');
    console.log('2. Invalid URL error message');
    console.log('3. Help message with commands');

  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testWebhookFix();
