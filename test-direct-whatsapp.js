// Direct WhatsApp test without webhook
const twilio = require('twilio');

async function testDirectWhatsApp() {
  console.log('🧪 Testing Direct WhatsApp Message...\n');

  try {
    const client = twilio(
      'YOUR_TWILIO_ACCOUNT_SID',
      'YOUR_TWILIO_AUTH_TOKEN'
    );

    console.log('📤 Sending direct message...');
    
    const message = await client.messages.create({
      from: 'whatsapp:+14155238886',
      to: 'whatsapp:+919381276836',
      body: '🧪 Direct test from ThreatLens!\n\nIf you receive this, your WhatsApp integration is working!\n\n🛡️ Powered by ThreatLens'
    });

    console.log('✅ Message sent successfully!');
    console.log(`   Message SID: ${message.sid}`);
    console.log(`   Status: ${message.status}`);
    console.log('\n📱 Check your WhatsApp for the message!');

  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('\n🔧 Try joining the sandbox first:');
    console.log('   Send "join unusual-captured" to +1 415 523 8886');
  }
}

testDirectWhatsApp();
