#!/usr/bin/env node

// Meta WhatsApp Business Cloud API Setup Script
// Run with: node setup-meta-whatsapp.js

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupMetaWhatsApp() {
  console.log('🚀 Meta WhatsApp Business Cloud API Setup\n');
  console.log('This script will help you configure WhatsApp integration with Meta\'s Cloud API.\n');

  // Check if .env.local exists
  const envPath = path.join(process.cwd(), '.env.local');
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    console.log('✅ Found existing .env.local file\n');
  } else {
    console.log('📝 Creating new .env.local file\n');
  }

  // Collect configuration
  console.log('📋 Please provide the following information from your Meta Developer Account:\n');
  console.log('1. Go to https://developers.facebook.com');
  console.log('2. Create a Business App and add WhatsApp product');
  console.log('3. Get your credentials from the WhatsApp configuration page\n');

  const appId = await question('Meta App ID: ');
  const appSecret = await question('Meta App Secret: ');
  const phoneNumberId = await question('WhatsApp Phone Number ID: ');
  const accessToken = await question('WhatsApp Access Token: ');
  const businessAccountId = await question('WhatsApp Business Account ID: ');
  const verifyToken = await question('Webhook Verify Token (create your own): ');
  const webhookUrl = await question('Webhook URL (e.g., https://yourdomain.com/api/whatsapp-webhook): ');

  // Update or create .env.local
  const newEnvContent = updateEnvFile(envContent, {
    WHATSAPP_SERVICE: 'business',
    META_APP_ID: appId,
    META_APP_SECRET: appSecret,
    WHATSAPP_PHONE_NUMBER_ID: phoneNumberId,
    WHATSAPP_ACCESS_TOKEN: accessToken,
    WHATSAPP_BUSINESS_ACCOUNT_ID: businessAccountId,
    WHATSAPP_VERIFY_TOKEN: verifyToken,
    WHATSAPP_WEBHOOK_URL: webhookUrl
  });

  fs.writeFileSync(envPath, newEnvContent);
  console.log('\n✅ Configuration saved to .env.local\n');

  // Test configuration
  console.log('🧪 Testing configuration...\n');
  
  try {
    // Test access token
    const response = await fetch(`https://graph.facebook.com/v18.0/me?access_token=${accessToken}`);
    if (response.ok) {
      console.log('✅ Access token is valid');
    } else {
      console.log('❌ Access token is invalid');
    }
  } catch (error) {
    console.log('❌ Error testing access token:', error.message);
  }

  // Display next steps
  console.log('\n📋 Next Steps:\n');
  console.log('1. Configure webhook in Meta Developer Console:');
  console.log(`   - Webhook URL: ${webhookUrl}`);
  console.log(`   - Verify Token: ${verifyToken}`);
  console.log('   - Subscribe to "messages" events\n');
  
  console.log('2. Test webhook verification:');
  console.log(`   curl -X GET "${webhookUrl}?hub.mode=subscribe&hub.verify_token=${verifyToken}&hub.challenge=test_challenge"\n`);
  
  console.log('3. Test sending a message:');
  console.log('   Send a WhatsApp message to your business number\n');
  
  console.log('4. Start your server:');
  console.log('   npm run dev\n');
  
  console.log('5. Check server logs for incoming webhook requests\n');

  console.log('🎉 Setup complete! Your WhatsApp integration is ready to use.');
  
  rl.close();
}

function updateEnvFile(content, newVars) {
  let lines = content.split('\n');
  const existingKeys = new Set();
  
  // Update existing variables
  lines = lines.map(line => {
    const match = line.match(/^([^=]+)=/);
    if (match) {
      const key = match[1].trim();
      if (newVars[key]) {
        existingKeys.add(key);
        return `${key}=${newVars[key]}`;
      }
    }
    return line;
  });
  
  // Add new variables
  Object.entries(newVars).forEach(([key, value]) => {
    if (!existingKeys.has(key)) {
      lines.push(`${key}=${value}`);
    }
  });
  
  return lines.join('\n');
}

// Run setup
setupMetaWhatsApp().catch(console.error);
