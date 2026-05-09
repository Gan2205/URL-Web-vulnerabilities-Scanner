# 📱 Complete Twilio WhatsApp Setup Guide for ThreatLens

## Overview

This guide will walk you through setting up WhatsApp integration using Twilio's WhatsApp API. Twilio provides a reliable and easy-to-use WhatsApp sandbox for testing and production use.

## 🎯 What You'll Achieve

By the end of this guide, you'll have:
- ✅ A working WhatsApp bot that receives messages
- ✅ Automatic URL extraction and security scanning
- ✅ Beautiful formatted security reports sent via WhatsApp
- ✅ Interactive commands (help, status, info)
- ✅ Production-ready setup

## 📋 Prerequisites

- Node.js and npm installed
- ThreatLens project running
- Twilio account (free tier available)
- Basic understanding of webhooks

## 🚀 Step-by-Step Implementation

### Step 1: Create Twilio Account

1. **Go to Twilio Console**
   - Visit [console.twilio.com](https://console.twilio.com)
   - Click "Sign up" if you don't have an account
   - Verify your phone number and email

2. **Get Your Account Credentials**
   - After login, you'll see your Account SID and Auth Token
   - Copy these values (you'll need them later)
   - Keep these secure - never commit them to version control

### Step 2: Set Up WhatsApp Sandbox

1. **Navigate to WhatsApp**
   - In Twilio Console, go to "Messaging" → "Try it out" → "Send a WhatsApp message"
   - Or go directly to [console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn](https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn)

2. **Join the Sandbox**
   - You'll see a sandbox number (starts with +14155238886)
   - Send the join code to this number from your WhatsApp
   - Example: Send "join <your-sandbox-code>" to +14155238886

3. **Test Basic Messaging**
   - Send a test message to the sandbox number
   - You should receive a response confirming you're connected

### Step 3: Install Twilio SDK

```bash
# Navigate to your ThreatLens project directory
cd threatlens

# Install Twilio SDK
npm install twilio

# Install types for TypeScript (if using TypeScript)
npm install --save-dev @types/twilio
```

### Step 4: Configure Environment Variables

1. **Create/Update .env.local file**
   ```bash
   # WhatsApp Service Configuration
   WHATSAPP_SERVICE=twilio
   
   # Twilio Configuration
   TWILIO_ACCOUNT_SID=your_account_sid_here
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_WHATSAPP_NUMBER=+14155238886
   
   # Optional: Custom from number (if you have a verified WhatsApp number)
   # TWILIO_WHATSAPP_NUMBER=+1234567890
   ```

2. **Get Your Credentials from Twilio Console**
   - Account SID: Found in Console Dashboard
   - Auth Token: Found in Console Dashboard (click to reveal)
   - WhatsApp Number: Your sandbox number (e.g., +14155238886)

### Step 5: Set Up Webhook (Local Development)

For local development, you'll need to expose your local server to the internet. Here are two options:

#### Option A: Using ngrok (Recommended)

1. **Install ngrok**
   ```bash
   # Download from https://ngrok.com/download
   # Or install via npm
   npm install -g ngrok
   ```

2. **Start your ThreatLens server**
   ```bash
   npm run dev
   ```

3. **In another terminal, expose your local server**
   ```bash
   ngrok http 3000
   ```

4. **Copy the HTTPS URL**
   - You'll get something like: `https://abc123.ngrok.io`
   - Copy this URL

#### Option B: Using localtunnel

```bash
# Install localtunnel
npm install -g localtunnel

# Start your server
npm run dev

# In another terminal, expose your local server
lt --port 3000 --subdomain threatlens-whatsapp
```

### Step 6: Configure Twilio Webhook

1. **Go to Twilio Console → Phone Numbers**
   - Navigate to "Phone Numbers" → "Manage" → "Active Numbers"
   - Click on your WhatsApp sandbox number

2. **Set Webhook URL**
   - In the "Messaging" section, set:
     - **Webhook URL**: `https://your-ngrok-url.ngrok.io/api/whatsapp-webhook`
     - **HTTP Method**: POST
   - Example: `https://abc123.ngrok.io/api/whatsapp-webhook`

3. **Save Configuration**
   - Click "Save" to apply the webhook settings

### Step 7: Test the Integration

1. **Start Your Server**
   ```bash
   npm run dev
   ```

2. **Send a Test Message**
   - Send a WhatsApp message to your sandbox number
   - Try: `https://example.com`
   - Or: `Scan https://google.com`

3. **Check Server Logs**
   - You should see incoming webhook requests in your console
   - Look for messages like:
     ```
     📱 Received WhatsApp webhook from: +1234567890
     🔍 Processing WhatsApp message from: +1234567890
     📱 WhatsApp message sent via Twilio to: +1234567890
     ```

4. **Verify Response**
   - You should receive a formatted security report via WhatsApp

### Step 8: Test Different Commands

Try these commands to test all functionality:

```
# URL Scanning
https://example.com
Scan https://google.com
Check https://github.com

# Interactive Commands
help
status
info

# Multiple URLs
https://site1.com https://site2.com
```

### Step 9: Production Setup (Optional)

When ready for production:

1. **Get a Verified WhatsApp Number**
   - Apply for WhatsApp Business API access
   - Get a verified phone number
   - Update your webhook URL to your production domain

2. **Update Environment Variables**
   ```bash
   # Production .env.local
   WHATSAPP_SERVICE=twilio
   TWILIO_ACCOUNT_SID=your_production_account_sid
   TWILIO_AUTH_TOKEN=your_production_auth_token
   TWILIO_WHATSAPP_NUMBER=+1234567890  # Your verified number
   ```

3. **Update Webhook URL**
   - Set webhook to: `https://yourdomain.com/api/whatsapp-webhook`

## 🧪 Testing Script

Create a test script to verify everything works:

```javascript
// test-twilio-whatsapp.js
const { WhatsAppScanService } = require('./src/lib/whatsappScanService');

async function testTwilioIntegration() {
  console.log('🧪 Testing Twilio WhatsApp Integration...\n');

  // Test 1: Process a scan request
  const testRequest = {
    from: '+1234567890',
    message: 'Scan https://example.com',
    messageId: 'test123'
  };

  try {
    console.log('📱 Processing test request...');
    const success = await WhatsAppScanService.handleIncomingMessage(testRequest);
    console.log('✅ Test completed:', success ? 'Success' : 'Failed');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testTwilioIntegration();
```

Run the test:
```bash
node test-twilio-whatsapp.js
```

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. Webhook Not Receiving Messages

**Problem**: Messages sent to WhatsApp don't trigger webhook

**Solutions**:
- Verify webhook URL is accessible from internet
- Check ngrok is running and URL is correct
- Ensure webhook URL is set correctly in Twilio Console
- Check server logs for incoming requests

#### 2. "Invalid Phone Number" Errors

**Problem**: Phone number validation fails

**Solutions**:
- Ensure phone numbers include country code (+1 for US)
- Remove any formatting characters
- Use international format: +1234567890

#### 3. Messages Not Sending

**Problem**: Webhook receives message but no response sent

**Solutions**:
- Check Twilio credentials are correct
- Verify WHATSAPP_SERVICE=twilio in .env.local
- Check server logs for error messages
- Ensure Twilio account has sufficient balance

#### 4. Sandbox Not Working

**Problem**: Can't send messages to sandbox

**Solutions**:
- Make sure you sent "join <sandbox-code>" first
- Check sandbox code is correct
- Try sending to sandbox number from WhatsApp
- Verify sandbox is active in Twilio Console

#### 5. TypeScript Errors

**Problem**: TypeScript compilation errors

**Solutions**:
```bash
# Install Twilio types
npm install --save-dev @types/twilio

# Or add to tsconfig.json
{
  "compilerOptions": {
    "skipLibCheck": true
  }
}
```

### Debug Mode

Enable detailed logging:

```bash
# Add to .env.local
DEBUG=whatsapp:*
NODE_ENV=development
```

## 📊 Monitoring and Logs

### Check Integration Status

1. **Twilio Console Logs**
   - Go to Console → Monitor → Logs
   - Filter by "WhatsApp" to see message logs

2. **Server Logs**
   - Check your server console for webhook requests
   - Look for error messages and processing logs

3. **Test Endpoints**
   ```bash
   # Health check
   curl http://localhost:3000/api/whatsapp-scan
   
   # Test webhook
   curl -X POST http://localhost:3000/api/whatsapp-webhook \
     -H "Content-Type: application/json" \
     -d '{"from":"+1234567890","message":"test","messageId":"test123"}'
   ```

## 🚀 Advanced Configuration

### Rate Limiting

Add rate limiting to prevent abuse:

```javascript
// Add to your webhook route
const rateLimit = require('express-rate-limit');

const whatsappLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Apply to webhook route
app.use('/api/whatsapp-webhook', whatsappLimiter);
```

### Message Validation

Add webhook signature verification:

```javascript
// Add to webhook route
const twilio = require('twilio');

function validateTwilioSignature(req, res, next) {
  const twilioSignature = req.headers['x-twilio-signature'];
  const url = req.originalUrl;
  const params = req.body;
  
  const isValid = twilio.validateRequest(
    process.env.TWILIO_AUTH_TOKEN,
    twilioSignature,
    url,
    params
  );
  
  if (!isValid) {
    return res.status(403).send('Forbidden');
  }
  
  next();
}
```

## 📈 Scaling for Production

### Database Integration

Store scan results and user data:

```javascript
// Add to whatsappScanService.ts
import { SupabaseService } from './supabaseService';

// After successful scan
await SupabaseService.saveScanResult({
  user_id: phoneNumber,
  url: result.url,
  scan_type: 'whatsapp',
  vulnerabilities: result.scanResult?.vulnerabilities || [],
  security_score: result.scanResult?.securityScore?.score || 0,
  // ... other fields
});
```

### Error Handling

Implement comprehensive error handling:

```javascript
// Add to whatsappService.ts
static async sendErrorNotification(phoneNumber: string, error: string) {
  const message = `❌ *Error Occurred*\n\nSorry, something went wrong: ${error}\n\nPlease try again later.`;
  
  return await this.sendScanReport(phoneNumber, {
    url: 'Error',
    scanName: 'Error Report',
    timestamp: new Date().toISOString(),
    vulnerabilities: [],
    summary: { total: 0, critical: 0, high: 0, medium: 0, low: 0 },
    securityScore: { score: 0, grade: 'F' }
  }, message);
}
```

## 🎉 Success!

If you've followed all steps, you should now have:

- ✅ A working WhatsApp bot that receives messages
- ✅ Automatic security scanning of URLs
- ✅ Beautiful formatted reports sent via WhatsApp
- ✅ Interactive commands and error handling
- ✅ Production-ready setup

## 📞 Support

If you encounter issues:

1. **Check Twilio Documentation**: [Twilio WhatsApp API Docs](https://www.twilio.com/docs/whatsapp)
2. **Review Server Logs**: Look for error messages in console
3. **Test Webhook**: Use curl to test webhook endpoint
4. **Verify Configuration**: Double-check all environment variables

## 🔄 Next Steps

1. **Customize Messages**: Modify templates in `whatsappTemplates.ts`
2. **Add Features**: Implement user preferences, scan history
3. **Monitor Usage**: Set up logging and analytics
4. **Scale Up**: Move to production WhatsApp Business API

---

**Congratulations!** 🎉 Your ThreatLens WhatsApp integration is now ready to scan websites via WhatsApp messages!
