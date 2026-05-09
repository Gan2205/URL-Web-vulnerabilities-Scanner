// Test WhatsApp integration in console mode
// Run with: node test-console-whatsapp.js

const { WhatsAppScanService } = require('./src/lib/whatsappScanService');

async function testConsoleWhatsApp() {
  console.log('🧪 Testing WhatsApp Integration in Console Mode...\n');

  // Test 1: Process a scan request
  const testRequest = {
    from: '+919381276836',
    message: 'Scan https://example.com',
    messageId: 'test123'
  };

  try {
    console.log('📱 Processing test request...');
    console.log('From:', testRequest.from);
    console.log('Message:', testRequest.message);
    console.log('\n🔍 Processing scan...\n');
    
    const success = await WhatsAppScanService.handleIncomingMessage(testRequest);
    console.log('✅ Test completed:', success ? 'Success' : 'Failed');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }

  console.log('\n🎉 Console mode test completed!');
  console.log('\n📋 Next Steps:');
  console.log('1. Go to Twilio Console → Messaging → Try it out → Send a WhatsApp message');
  console.log('2. Set webhook URL: https://0451598db31b.ngrok-free.app/api/whatsapp-webhook');
  console.log('3. Send "join unusual-captured" to +1 415 523 8886');
  console.log('4. Test with real WhatsApp messages');
}

testConsoleWhatsApp().catch(console.error);
