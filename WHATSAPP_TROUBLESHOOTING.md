# 🔧 WhatsApp Integration Troubleshooting Guide

## Common Errors and Solutions

### 1. Environment Variables Not Found

**Error**: `WHATSAPP_ACCESS_TOKEN is not defined` or similar

**Solution**:
```bash
# Check if .env.local exists and has correct values
cat .env.local

# Make sure you're in the right directory
pwd
ls -la .env.local

# Restart your server after updating .env.local
npm run dev
```

### 2. Access Token Invalid

**Error**: `WhatsApp Business API error: 401 - Invalid access token`

**Solution**:
```bash
# Test your access token
curl -X GET "https://graph.facebook.com/v18.0/me?access_token=YOUR_ACCESS_TOKEN"

# Generate a new token from Meta Developer Console
# Go to WhatsApp → API Setup → Generate Token
```

### 3. Phone Number ID Invalid

**Error**: `WhatsApp Business API error: 400 - Invalid phone number ID`

**Solution**:
```bash
# Test your phone number ID
curl -X GET "https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID?access_token=YOUR_ACCESS_TOKEN"

# Verify the phone number ID in Meta Developer Console
# Go to WhatsApp → API Setup
```

### 4. Webhook Verification Failed

**Error**: `Invalid signature` or webhook not receiving messages

**Solution**:
```bash
# Test webhook verification
curl -X GET "https://your-ngrok-url.ngrok.io/api/whatsapp-webhook?hub.mode=subscribe&hub.verify_token=threatlens_verify_token_2024&hub.challenge=test_challenge"

# Check if your server is running
curl -X GET "http://localhost:3000/api/whatsapp-scan"

# Verify webhook URL in Meta Console matches your ngrok URL
```

### 5. ngrok Not Working

**Error**: `ngrok: command not found` or tunnel not accessible

**Solution**:
```bash
# Install ngrok
npm install -g ngrok

# Or download from https://ngrok.com/download

# Test ngrok
ngrok version

# Start ngrok
ngrok http 3000
```

### 6. Server Not Running

**Error**: `ECONNREFUSED` or server not responding

**Solution**:
```bash
# Start ThreatLens server
npm run dev

# Check if port 3000 is in use
netstat -an | findstr :3000

# Kill process using port 3000 if needed
npx kill-port 3000
```

### 7. Module Not Found

**Error**: `Cannot find module` or import errors

**Solution**:
```bash
# Install dependencies
npm install

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check if all required packages are installed
npm list
```

### 8. CORS Errors

**Error**: CORS policy errors in browser

**Solution**:
```javascript
// Add CORS headers to your webhook route
res.header('Access-Control-Allow-Origin', '*');
res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
```

### 9. Message Sending Failed

**Error**: `WhatsApp Business API error: 400 - Bad Request`

**Solution**:
```bash
# Check message format
# Ensure phone number has country code (+1234567890)
# Verify message content is valid

# Test with a simple message
curl -X POST "https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID/messages" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"messaging_product":"whatsapp","to":"+1234567890","type":"text","text":{"body":"Test"}}'
```

### 10. Rate Limit Exceeded

**Error**: `Rate limit exceeded` or `429 Too Many Requests`

**Solution**:
```bash
# Check your rate limits
curl -X GET "https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID?fields=rate_limit_info&access_token=YOUR_ACCESS_TOKEN"

# Wait before sending more messages
# Consider implementing rate limiting in your code
```

## 🔍 Debug Steps

### Step 1: Check Environment Variables
```bash
# Print all environment variables
node -e "console.log(process.env)"

# Check specific variables
node -e "console.log('WHATSAPP_SERVICE:', process.env.WHATSAPP_SERVICE)"
node -e "console.log('WHATSAPP_ACCESS_TOKEN:', process.env.WHATSAPP_ACCESS_TOKEN ? 'Set' : 'Not set')"
```

### Step 2: Test API Endpoints
```bash
# Test access token
curl -X GET "https://graph.facebook.com/v18.0/me?access_token=YOUR_ACCESS_TOKEN"

# Test phone number
curl -X GET "https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID?access_token=YOUR_ACCESS_TOKEN"

# Test webhook
curl -X GET "http://localhost:3000/api/whatsapp-scan"
```

### Step 3: Check Server Logs
```bash
# Start server with debug logging
DEBUG=* npm run dev

# Or add debug logging to your code
console.log('Debug info:', { token, phoneNumberId, webhookUrl });
```

### Step 4: Test Webhook Manually
```bash
# Test webhook with sample data
curl -X POST "http://localhost:3000/api/whatsapp-webhook" \
  -H "Content-Type: application/json" \
  -d '{"from":"+1234567890","message":"https://example.com","messageId":"test123"}'
```

## 🚨 Emergency Fixes

### Quick Reset
```bash
# Stop everything
pkill -f "ngrok"
pkill -f "node"

# Clear and reinstall
rm -rf node_modules package-lock.json
npm install

# Start fresh
npm run dev
# In another terminal: ngrok http 3000
```

### Reconfigure Everything
```bash
# Run setup script
node setup-localhost-whatsapp.js

# Or manually update .env.local
# Then restart server
npm run dev
```

## 📞 Getting Help

If you're still having issues, please share:

1. **Exact error message**
2. **What you were doing when it happened**
3. **Your .env.local file** (remove sensitive tokens)
4. **Server logs**
5. **ngrok status**

## 🔧 Quick Diagnostic Script

Run this to check your setup:

```bash
node -e "
console.log('🔍 WhatsApp Integration Diagnostic');
console.log('================================');
console.log('WHATSAPP_SERVICE:', process.env.WHATSAPP_SERVICE || 'Not set');
console.log('META_APP_ID:', process.env.META_APP_ID || 'Not set');
console.log('WHATSAPP_PHONE_NUMBER_ID:', process.env.WHATSAPP_PHONE_NUMBER_ID || 'Not set');
console.log('WHATSAPP_ACCESS_TOKEN:', process.env.WHATSAPP_ACCESS_TOKEN ? 'Set' : 'Not set');
console.log('WHATSAPP_WEBHOOK_URL:', process.env.WHATSAPP_WEBHOOK_URL || 'Not set');
console.log('WHATSAPP_VERIFY_TOKEN:', process.env.WHATSAPP_VERIFY_TOKEN || 'Not set');
"
```

**Please share the specific error you're seeing, and I'll help you solve it!** 🚀
