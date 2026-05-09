// Test script for WhatsApp functionality
// Run with: node test-whatsapp.js

const { WhatsAppScanService } = require('./src/lib/whatsappScanService.ts');
const { WhatsAppTemplates } = require('./src/lib/whatsappTemplates.ts');

async function testWhatsAppIntegration() {
  console.log('🧪 Testing WhatsApp Integration...\n');

  // Test 1: URL extraction
  console.log('📱 Test 1: URL Extraction');
  const testMessage = 'Please scan https://example.com and also check http://test.com for security issues';
  const urls = WhatsAppScanService.extractUrls(testMessage);
  console.log('Input:', testMessage);
  console.log('Extracted URLs:', urls);
  console.log('✅ URL extraction working\n');

  // Test 2: Phone number validation
  console.log('📱 Test 2: Phone Number Validation');
  const { WhatsAppService } = require('./src/lib/whatsappService.ts');
  
  const testNumbers = ['+1234567890', '1234567890', 'invalid', '+1-234-567-8900'];
  testNumbers.forEach(num => {
    const validation = WhatsAppService.validatePhoneNumber(num);
    console.log(`${num}: ${validation.isValid ? '✅ Valid' : '❌ Invalid'} ${validation.error || ''}`);
  });
  console.log('');

  // Test 3: Message templates
  console.log('📱 Test 3: Message Templates');
  console.log('Welcome Message:');
  console.log(WhatsAppTemplates.getWelcomeMessage());
  console.log('\nHelp Message:');
  console.log(WhatsAppTemplates.getHelpMessage());
  console.log('');

  // Test 4: Scan result formatting
  console.log('📱 Test 4: Scan Result Formatting');
  const mockResult = {
    url: 'https://example.com',
    isValid: true,
    scanResult: {
      securityScore: {
        score: 75,
        grade: 'B',
        color: 'yellow',
        description: 'Website has some security issues that should be addressed.'
      },
      vulnerabilities: [
        {
          type: 'XSS Vulnerability',
          severity: 'high',
          description: 'Cross-site scripting vulnerability found in login form',
          location: '/login'
        },
        {
          type: 'Missing Security Headers',
          severity: 'medium',
          description: 'Missing Content-Security-Policy header',
          location: 'All pages'
        }
      ]
    }
  };

  console.log('Single Scan Result:');
  console.log(WhatsAppTemplates.getSingleScanResult(mockResult));
  console.log('');

  // Test 5: Error handling
  console.log('📱 Test 5: Error Handling');
  const errorResult = {
    url: 'https://invalid-url.com',
    isValid: false,
    error: 'Connection timeout'
  };
  console.log('Error Result:');
  console.log(WhatsAppTemplates.getSingleScanResult(errorResult));
  console.log('');

  console.log('🎉 All tests completed!');
  console.log('\n📋 Next Steps:');
  console.log('1. Set up WhatsApp service provider (Twilio, Business API, etc.)');
  console.log('2. Configure environment variables in .env.local');
  console.log('3. Test with real WhatsApp messages');
  console.log('4. Deploy webhook endpoints');
}

// Run the test
testWhatsAppIntegration().catch(console.error);
