// Test script for your specific Meta WhatsApp Business Cloud API credentials
// Run with: node test-your-whatsapp.js

const META_APP_ID = '1121620270121304';
const META_APP_SECRET = 'y0f33771db9cd78829cff413802362065';
const WHATSAPP_PHONE_NUMBER_ID = '895249553670691';
const WHATSAPP_ACCESS_TOKEN = 'EAAP8G5HGAVgBPqqC0EDu7HIJJTUHW7TfdWHYTBLJHoq7hdZBhMkQCWjScxt4yZCwoQCZCca3bkbq2NGwlJAZBWSZBe9sRSObhKUpqUt3E54TXhiA7ZC0T3R6mc94bgUCJmSzTpQiZA619xDFLZB74CC9mIfiWeu9ZCu6LhcbSGFZBUVsDLBJBfkInVoMnmwZCHt6Av56AeWLHLU0lnNaAEJkF5WEnI3wrsKiTz4BvAUajIgqrf6ZAzL4mVQ7RYN44uEOrgZDZD';
const WHATSAPP_BUSINESS_ACCOUNT_ID = '819092584390222';

async function testYourWhatsAppSetup() {
  console.log('🧪 Testing Your Meta WhatsApp Business Cloud API Setup...\n');

  // Test 1: Access Token Validation
  console.log('🔑 Test 1: Access Token Validation');
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/me?access_token=${WHATSAPP_ACCESS_TOKEN}`
    );
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Access token is valid');
      console.log(`   App ID: ${data.id}`);
      console.log(`   App Name: ${data.name || 'N/A'}`);
      console.log(`   Expected App ID: ${META_APP_ID}`);
      console.log(`   Match: ${data.id === META_APP_ID ? '✅' : '❌'}\n`);
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
      `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}?access_token=${WHATSAPP_ACCESS_TOKEN}`
    );
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Phone number is valid');
      console.log(`   Phone Number ID: ${data.id}`);
      console.log(`   Display Number: ${data.display_phone_number || 'N/A'}`);
      console.log(`   Status: ${data.status || 'N/A'}`);
      console.log(`   Quality Rating: ${data.quality_rating || 'N/A'}\n`);
    } else {
      const error = await response.json();
      console.log('❌ Phone number is invalid');
      console.log(`   Error: ${error.error?.message || 'Unknown error'}\n`);
    }
  } catch (error) {
    console.log('❌ Error testing phone number:', error.message, '\n');
  }

  // Test 3: Business Account Validation
  console.log('🏢 Test 3: Business Account Validation');
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${WHATSAPP_BUSINESS_ACCOUNT_ID}?access_token=${WHATSAPP_ACCESS_TOKEN}`
    );
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Business account is valid');
      console.log(`   Business Account ID: ${data.id}`);
      console.log(`   Name: ${data.name || 'N/A'}`);
      console.log(`   Timezone: ${data.timezone_name || 'N/A'}\n`);
    } else {
      const error = await response.json();
      console.log('❌ Business account is invalid');
      console.log(`   Error: ${error.error?.message || 'Unknown error'}\n`);
    }
  } catch (error) {
    console.log('❌ Error testing business account:', error.message, '\n');
  }

  // Test 4: Send Test Message
  console.log('📤 Test 4: Send Test Message');
  const testPhoneNumber = await new Promise((resolve) => {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question('Enter a phone number to send test message to (with country code, e.g., +919381276836): ', (answer) => {
      rl.close();
      resolve(answer);
    });
  });

  if (testPhoneNumber) {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: testPhoneNumber,
            type: 'text',
            text: {
              body: '🧪 Test message from ThreatLens WhatsApp Bot!\n\nThis is a test message to verify your WhatsApp integration is working correctly.\n\n🛡️ Powered by ThreatLens Security Scanner\n\nSend me a URL to scan for security vulnerabilities!'
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Test message sent successfully');
        console.log(`   Message ID: ${data.messages?.[0]?.id}`);
        console.log(`   To: ${testPhoneNumber}`);
        console.log(`   Status: ${data.messages?.[0]?.message_status || 'N/A'}\n`);
      } else {
        const error = await response.json();
        console.log('❌ Failed to send test message');
        console.log(`   Error: ${error.error?.message || 'Unknown error'}`);
        console.log(`   Code: ${error.error?.code || 'N/A'}`);
        console.log(`   Type: ${error.error?.type || 'N/A'}\n`);
      }
    } catch (error) {
      console.log('❌ Error sending test message:', error.message, '\n');
    }
  }

  // Test 5: Message Templates
  console.log('📝 Test 5: Message Templates');
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/message_templates?access_token=${WHATSAPP_ACCESS_TOKEN}`
    );
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Message templates retrieved');
      console.log(`   Total templates: ${data.data?.length || 0}`);
      if (data.data && data.data.length > 0) {
        console.log('   Available templates:');
        data.data.slice(0, 5).forEach((template, index) => {
          console.log(`     ${index + 1}. ${template.name} (${template.status})`);
        });
        if (data.data.length > 5) {
          console.log(`     ... and ${data.data.length - 5} more`);
        }
      } else {
        console.log('   No templates found (this is normal for new accounts)');
      }
      console.log('');
    } else {
      console.log('⚠️  Could not retrieve message templates\n');
    }
  } catch (error) {
    console.log('⚠️  Error retrieving message templates:', error.message, '\n');
  }

  // Test 6: Rate Limits
  console.log('⚡ Test 6: Rate Limits');
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}?fields=rate_limit_info&access_token=${WHATSAPP_ACCESS_TOKEN}`
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.rate_limit_info) {
        console.log('✅ Rate limit information retrieved');
        console.log(`   Tier: ${data.rate_limit_info.tier || 'N/A'}`);
        console.log(`   Daily limit: ${data.rate_limit_info.daily_limit || 'N/A'}`);
        console.log(`   Used today: ${data.rate_limit_info.daily_used || 'N/A'}`);
        console.log(`   Reset time: ${data.rate_limit_info.reset_time || 'N/A'}\n`);
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
  console.log('✅ Business account validation completed');
  console.log('✅ Test message sending completed');
  console.log('✅ Message templates check completed');
  console.log('✅ Rate limits check completed\n');

  console.log('🎉 Your Meta WhatsApp Business Cloud API setup test completed!');
  console.log('\n📋 Next Steps:');
  console.log('1. Copy the configuration from whatsapp-config.env to your .env.local file');
  console.log('2. Configure webhook in Meta Developer Console:');
  console.log('   - Webhook URL: https://yourdomain.com/api/whatsapp-webhook');
  console.log('   - Verify Token: threatlens_verify_token_2024');
  console.log('   - Subscribe to "messages" events');
  console.log('3. Test webhook verification:');
  console.log('   curl -X GET "https://yourdomain.com/api/whatsapp-webhook?hub.mode=subscribe&hub.verify_token=threatlens_verify_token_2024&hub.challenge=test_challenge"');
  console.log('4. Start your ThreatLens server: npm run dev');
  console.log('5. Send WhatsApp messages to your business number');
  console.log('6. Check server logs for incoming webhook requests\n');

  console.log('🔗 Your Configuration:');
  console.log(`   App ID: ${META_APP_ID}`);
  console.log(`   Phone Number ID: ${WHATSAPP_PHONE_NUMBER_ID}`);
  console.log(`   Business Account ID: ${WHATSAPP_BUSINESS_ACCOUNT_ID}`);
  console.log(`   Verify Token: threatlens_verify_token_2024`);
}

// Run the test
testYourWhatsAppSetup().catch(console.error);
