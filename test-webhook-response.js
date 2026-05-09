// Test webhook response
const twilio = require('twilio');

async function sendWhatsAppResponse() {
  console.log('📱 Sending WhatsApp response...\n');

  try {
    const client = twilio(
      'YOUR_TWILIO_ACCOUNT_SID',
      'YOUR_TWILIO_AUTH_TOKEN'
    );

    const message = await client.messages.create({
      from: 'whatsapp:+14155238886',
      to: 'whatsapp:+919381276836',
      body: '🔍 Security Scan Report for amazon.com\n\n✅ URL: https://amazon.com\n🏆 Security Score: 85/100 (B)\n🔍 Vulnerabilities: 2 found\n\n📊 Summary:\n• SSL Certificate: Valid\n• Security Headers: Good\n• Content Security Policy: Present\n\n🛡️ Powered by ThreatLens Security Scanner'
    });

    console.log('✅ Security report sent!');
    console.log(`   Message SID: ${message.sid}`);
    console.log(`   Status: ${message.status}`);

  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

sendWhatsAppResponse();
