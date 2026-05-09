#!/usr/bin/env node

// Localhost WhatsApp Setup Script
// Run with: node setup-localhost-whatsapp.js

const { spawn, exec } = require('child_process');
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

async function setupLocalhostWhatsApp() {
  console.log('🏠 Localhost WhatsApp Setup Script\n');
  console.log('This script will help you set up WhatsApp integration on localhost using ngrok.\n');

  // Check if ngrok is installed
  console.log('🔍 Checking if ngrok is installed...');
  try {
    await new Promise((resolve, reject) => {
      exec('ngrok version', (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          console.log('✅ ngrok is installed');
          console.log(`   Version: ${stdout.trim()}\n`);
          resolve();
        }
      });
    });
  } catch (error) {
    console.log('❌ ngrok is not installed');
    console.log('📥 Please install ngrok:');
    console.log('   1. Download from https://ngrok.com/download');
    console.log('   2. Or install via npm: npm install -g ngrok');
    console.log('   3. Run this script again\n');
    return;
  }

  // Check if ThreatLens is running
  console.log('🔍 Checking if ThreatLens is running on port 3000...');
  try {
    const response = await fetch('http://localhost:3000/api/whatsapp-scan');
    if (response.ok) {
      console.log('✅ ThreatLens is running on port 3000\n');
    } else {
      console.log('⚠️  ThreatLens might not be running or not responding\n');
    }
  } catch (error) {
    console.log('❌ ThreatLens is not running on port 3000');
    console.log('📝 Please start ThreatLens first:');
    console.log('   npm run dev\n');
    return;
  }

  // Start ngrok
  console.log('🚀 Starting ngrok tunnel...');
  console.log('   This will expose your localhost:3000 to the internet\n');

  const ngrok = spawn('ngrok', ['http', '3000'], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  let ngrokUrl = '';
  let ngrokReady = false;

  ngrok.stdout.on('data', (data) => {
    const output = data.toString();
    console.log('ngrok:', output);
    
    // Extract HTTPS URL from ngrok output
    const urlMatch = output.match(/https:\/\/[a-zA-Z0-9-]+\.ngrok\.io/);
    if (urlMatch && !ngrokReady) {
      ngrokUrl = urlMatch[0];
      ngrokReady = true;
      console.log(`\n✅ ngrok tunnel established: ${ngrokUrl}\n`);
    }
  });

  ngrok.stderr.on('data', (data) => {
    console.error('ngrok error:', data.toString());
  });

  // Wait for ngrok to start
  await new Promise(resolve => setTimeout(resolve, 3000));

  if (!ngrokReady) {
    console.log('❌ Failed to start ngrok tunnel');
    console.log('   Please check if ngrok is properly installed and try again\n');
    ngrok.kill();
    return;
  }

  // Update .env.local
  console.log('📝 Updating .env.local file...');
  const envPath = path.join(process.cwd(), '.env.local');
  let envContent = '';

  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Update webhook URL
  const webhookUrl = `${ngrokUrl}/api/whatsapp-webhook`;
  const updatedEnvContent = updateEnvFile(envContent, {
    WHATSAPP_WEBHOOK_URL: webhookUrl
  });

  fs.writeFileSync(envPath, updatedEnvContent);
  console.log('✅ Updated .env.local with ngrok URL\n');

  // Test webhook verification
  console.log('🧪 Testing webhook verification...');
  try {
    const testUrl = `${webhookUrl}?hub.mode=subscribe&hub.verify_token=threatlens_verify_token_2024&hub.challenge=test_challenge`;
    const response = await fetch(testUrl);
    
    if (response.ok) {
      const challenge = await response.text();
      if (challenge === 'test_challenge') {
        console.log('✅ Webhook verification test passed\n');
      } else {
        console.log('⚠️  Webhook verification test failed\n');
      }
    } else {
      console.log('❌ Webhook verification test failed\n');
    }
  } catch (error) {
    console.log('❌ Error testing webhook verification:', error.message, '\n');
  }

  // Display next steps
  console.log('📋 Next Steps:\n');
  console.log('1. Configure webhook in Meta Developer Console:');
  console.log(`   - Webhook URL: ${webhookUrl}`);
  console.log('   - Verify Token: threatlens_verify_token_2024');
  console.log('   - Subscribe to "messages" events\n');
  
  console.log('2. Test webhook verification:');
  console.log(`   curl -X GET "${webhookUrl}?hub.mode=subscribe&hub.verify_token=threatlens_verify_token_2024&hub.challenge=test_challenge"\n`);
  
  console.log('3. Test sending a message:');
  console.log('   node test-your-whatsapp.js\n');
  
  console.log('4. Send WhatsApp messages to your business number');
  console.log('   - Send: https://example.com');
  console.log('   - Send: help');
  console.log('   - Send: status\n');

  console.log('5. Check server logs for incoming webhook requests\n');

  console.log('🎉 Your localhost WhatsApp integration is ready!');
  console.log(`   ngrok URL: ${ngrokUrl}`);
  console.log(`   Webhook URL: ${webhookUrl}\n`);

  console.log('⚠️  Important Notes:');
  console.log('   - Keep this terminal open to maintain the ngrok tunnel');
  console.log('   - ngrok URL will change when you restart (free tier)');
  console.log('   - For production, use a static domain or hosting service\n');

  // Keep the script running
  console.log('🔄 ngrok tunnel is running... Press Ctrl+C to stop');
  
  process.on('SIGINT', () => {
    console.log('\n🛑 Stopping ngrok tunnel...');
    ngrok.kill();
    console.log('✅ ngrok tunnel stopped');
    rl.close();
    process.exit(0);
  });
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
setupLocalhostWhatsApp().catch(console.error);
