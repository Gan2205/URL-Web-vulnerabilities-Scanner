// Test script for Meta WhatsApp Business Cloud API
// Run with: node test-meta-whatsapp.js

require('dotenv').config({ path: '.env.local' });

async function testMetaWhatsAppIntegration() {
  console.log('🧪 Testing Meta WhatsApp Business Cloud API Integration...\n');

  // Check environment variables
  console.log('📋 Checking configuration...');
  const requiredVars = [
    'WHATSAPP_SERVICE',
    'META_APP_ID',
    'META_APP_SECRET',
    'WHATSAPP_PHONE_NUMBER_ID',
    'WHATSAPP_ACCESS_TOKEN',
    'WHATSAPP_BUSINESS_ACCOUNT_ID',
    'WHATSAPP_VERIFY_TOKEN'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    console.log('❌ Missing required environment variables:');
    missingVars.forEach(varName => console.log(`   - ${varName}`));
    console.log('\nPlease run: node setup-meta-whatsapp.js');
    return;
  }
  console.log('✅ All required environment variables are set\n');

  // Test 1: Access Token Validation
  console.log('🔑 Test 1: Access Token Validation');
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/me?access_token=${process.env.WHATSAPP_ACCESS_TOKEN}`
    );
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Access token is valid');
      console.log(`   App ID: ${data.id}`);
      console.log(`   App Name: ${data.name || 'N/A'}\n`);
    } else {
      const error = await response.json();
      console.log('❌ Access token is invalid');
      console.log(`   Error: ${error.error?.message || 'Unknown error'}\n`);
    }
  } catch (error) {
    console.log('❌ Error testing access token:', error.message, '\n');
  }

  // Test 2: Phone Number Validation
  console.log('📱 Test 2: Phone Number Validation');
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}?access_token=${process.env.WHATSAPP_ACCESS_TOKEN}`
    );
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Phone number is valid');
      console.log(`   Phone Number ID: ${data.id}`);
      console.log(`   Display Number: ${data.display_phone_number || 'N/A'}\n`);
    } else {
      const error = await response.json();
      console.log('❌ Phone number is invalid');
      console.log(`   Error: ${error.error?.message || 'Unknown error'}\n`);
    }
  } catch (error) {
    console.log('❌ Error testing phone number:', error.message, '\n');
  }

  // Test 3: Send Test Message
  console.log('📤 Test 3: Send Test Message');
  const testPhoneNumber = await new Promise((resolve) => {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question('Enter a phone number to send test message to (with country code, e.g., +1234567890): ', (answer) => {
      rl.close();
      resolve(answer);
    });
  });

  if (testPhoneNumber) {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: testPhoneNumber,
            type: 'text',
            text: {
              body: '🧪 Test message from ThreatLens WhatsApp Bot!\n\nThis is a test message to verify your WhatsApp integration is working correctly.\n\n🛡️ Powered by ThreatLens Security Scanner'
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Test message sent successfully');
        console.log(`   Message ID: ${data.messages?.[0]?.id}`);
        console.log(`   To: ${testPhoneNumber}\n`);
      } else {
        const error = await response.json();
        console.log('❌ Failed to send test message');
        console.log(`   Error: ${error.error?.message || 'Unknown error'}`);
        console.log(`   Code: ${error.error?.code || 'N/A'}\n`);
      }
    } catch (error) {
      console.log('❌ Error sending test message:', error.message, '\n');
    }
  }

  // Test 4: Webhook Verification
  console.log('🔗 Test 4: Webhook Verification');
  const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL || 'https://yourdomain.com/api/whatsapp-webhook';
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
  
  console.log(`   Webhook URL: ${webhookUrl}`);
  console.log(`   Verify Token: ${verifyToken}`);
  console.log(`   Test URL: ${webhookUrl}?hub.mode=subscribe&hub.verify_token=${verifyToken}&hub.challenge=test_challenge`);
  console.log('   Run this curl command to test webhook verification:\n');
  console.log(`   curl -X GET "${webhookUrl}?hub.mode=subscribe&hub.verify_token=${verifyToken}&hub.challenge=test_challenge"\n`);

  // Test 5: Message Templates (if available)
  console.log('📝 Test 5: Message Templates');
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/message_templates?access_token=${process.env.WHATSAPP_ACCESS_TOKEN}`
    );
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Message templates retrieved');
      console.log(`   Total templates: ${data.data?.length || 0}`);
      if (data.data && data.data.length > 0) {
        console.log('   Available templates:');
        data.data.slice(0, 3).forEach((template, index) => {
          console.log(`     ${index + 1}. ${template.name} (${template.status})`);
        });
        if (data.data.length > 3) {
          console.log(`     ... and ${data.data.length - 3} more`);
        }
      }
      console.log('');
    } else {
      console.log('⚠️  Could not retrieve message templates (this is normal for new accounts)\n');
    }
  } catch (error) {
    console.log('⚠️  Error retrieving message templates:', error.message, '\n');
  }

  // Test 6: Rate Limits
  console.log('⚡ Test 6: Rate Limits');
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}?fields=rate_limit_info&access_token=${process.env.WHATSAPP_ACCESS_TOKEN}`
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.rate_limit_info) {
        console.log('✅ Rate limit information retrieved');
        console.log(`   Tier: ${data.rate_limit_info.tier || 'N/A'}`);
        console.log(`   Daily limit: ${data.rate_limit_info.daily_limit || 'N/A'}`);
        console.log(`   Used today: ${data.rate_limit_info.daily_used || 'N/A'}\n`);
      } else {
        console.log('⚠️  Rate limit information not available\n');
      }
    } else {
      console.log('⚠️  Could not retrieve rate limit information\n');
    }
  } catch (error) {
    console.log('⚠️  Error retrieving rate limit information:', error.message, '\n');
  }

  // Summary
  console.log('📊 Test Summary:');
  console.log('✅ Configuration check completed');
  console.log('✅ Access token validation completed');
  console.log('✅ Phone number validation completed');
  console.log('✅ Test message sending completed');
  console.log('✅ Webhook verification instructions provided');
  console.log('✅ Message templates check completed');
  console.log('✅ Rate limits check completed\n');

  console.log('🎉 Meta WhatsApp Business Cloud API integration test completed!');
  console.log('\n📋 Next Steps:');
  console.log('1. Configure webhook in Meta Developer Console');
  console.log('2. Test webhook verification with the provided curl command');
  console.log('3. Start your ThreatLens server: npm run dev');
  console.log('4. Send WhatsApp messages to your business number');
  console.log('5. Check server logs for incoming webhook requests\n');

  console.log('🔗 Useful Links:');
  console.log('- Meta Developer Console: https://developers.facebook.com');
  console.log('- WhatsApp Business API Docs: https://developers.facebook.com/docs/whatsapp/cloud-api');
  console.log('- Graph API Explorer: https://developers.facebook.com/tools/explorer');
}

// Run the test
testMetaWhatsAppIntegration().catch(console.error);
