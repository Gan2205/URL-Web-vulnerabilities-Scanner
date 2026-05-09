// Load environment variables
require('dotenv').config({ path: './twilio-config.env' });

const twilio = require('twilio');

console.log('🔧 Twilio Configuration Test');
console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID);
console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN ? '***SET***' : 'NOT SET');
console.log('TWILIO_WHATSAPP_NUMBER:', process.env.TWILIO_WHATSAPP_NUMBER);

try {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  
  console.log('✅ Twilio client created successfully');
  
  // Test sending a message
  client.messages.create({
    from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
    to: 'whatsapp:+919381276836',
    body: '🧪 Test message from ThreatLens WhatsApp Security Scanner!'
  }).then(message => {
    console.log('✅ Message sent successfully:', message.sid);
  }).catch(error => {
    console.error('❌ Error sending message:', error.message);
  });
  
} catch (error) {
  console.error('❌ Error creating Twilio client:', error.message);
}
