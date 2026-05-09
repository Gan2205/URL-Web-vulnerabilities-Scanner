# 🚀 Your WhatsApp Setup Guide

## Your Meta WhatsApp Business Cloud API Credentials

Based on your provided credentials, here's your complete setup:

### 📋 Your Configuration

```bash
# Meta WhatsApp Business Cloud API Configuration
WHATSAPP_SERVICE=business

# Meta App Configuration
META_APP_ID=1121620270121304
META_APP_SECRET=y0f33771db9cd78829cff413802362065
META_VERIFY_TOKEN=threatlens_verify_token_2024

# WhatsApp Business API
WHATSAPP_PHONE_NUMBER_ID=895249553670691
WHATSAPP_ACCESS_TOKEN=EAAP8G5HGAVgBPqqC0EDu7HIJJTUHW7TfdWHYTBLJHoq7hdZBhMkQCWjScxt4yZCwoQCZCca3bkbq2NGwlJAZBWSZBe9sRSObhKUpqUt3E54TXhiA7ZC0T3R6mc94bgUCJmSzTpQiZA619xDFLZB74CC9mIfiWeu9ZCu6LhcbSGFZBUVsDLBJBfkInVoMnmwZCHt6Av56AeWLHLU0lnNaAEJkF5WEnI3wrsKiTz4BvAUajIgqrf6ZAzL4mVQ7RYN44uEOrgZDZD
WHATSAPP_BUSINESS_ACCOUNT_ID=819092584390222

# Webhook Configuration
WHATSAPP_WEBHOOK_URL=https://yourdomain.com/api/whatsapp-webhook
WHATSAPP_VERIFY_TOKEN=threatlens_verify_token_2024
```

## 🚀 Quick Setup Steps

### Step 1: Update Your .env.local File

Copy the configuration above to your `.env.local` file in the root of your ThreatLens project.

### Step 2: Test Your Configuration

```bash
# Test your setup
node test-your-whatsapp.js
```

This will:
- ✅ Validate your access token
- ✅ Check your phone number ID
- ✅ Verify your business account
- ✅ Send a test message
- ✅ Check message templates
- ✅ Show rate limits

### Step 3: Configure Webhook in Meta Developer Console

1. **Go to Meta Developer Console**
   - Visit [developers.facebook.com](https://developers.facebook.com)
   - Select your app (ID: 1121620270121304)

2. **Configure WhatsApp Webhook**
   - Go to WhatsApp → Configuration
   - Set Webhook URL: `https://yourdomain.com/api/whatsapp-webhook`
   - Set Verify Token: `threatlens_verify_token_2024`
   - Subscribe to "messages" events

3. **Test Webhook Verification**
   ```bash
   curl -X GET "https://yourdomain.com/api/whatsapp-webhook?hub.mode=subscribe&hub.verify_token=threatlens_verify_token_2024&hub.challenge=test_challenge"
   ```

### Step 4: Start Your Server

```bash
# Start ThreatLens
npm run dev
```

### Step 5: Test WhatsApp Integration

1. **Send a test message** to your WhatsApp business number
2. **Try these commands**:
   - `https://example.com` - Scan a URL
   - `Scan https://google.com` - Command-based scanning
   - `help` - Get help information
   - `status` - Check service status

## 🧪 Testing Commands

### Test Message Sending (PowerShell)

```powershell
curl -i -X POST `
  https://graph.facebook.com/v18.0/895249553670691/messages `
  -H 'Authorization: Bearer EAAP8G5HGAVgBPqqC0EDu7HIJJTUHW7TfdWHYTBLJHoq7hdZBhMkQCWjScxt4yZCwoQCZCca3bkbq2NGwlJAZBWSZBe9sRSObhKUpqUt3E54TXhiA7ZC0T3R6mc94bgUCJmSzTpQiZA619xDFLZB74CC9mIfiWeu9ZCu6LhcbSGFZBUVsDLBJBfkInVoMnmwZCHt6Av56AeWLHLU0lnNaAEJkF5WEnI3wrsKiTz4BvAUajIgqrf6ZAzL4mVQ7RYN44uEOrgZDZD' `
  -H 'Content-Type: application/json' `
  -d '{ "messaging_product": "whatsapp", "to": "919381276836", "type": "text", "text": { "body": "Hello from ThreatLens! Send me a URL to scan." } }'
```

### Test Webhook (Replace yourdomain.com)

```bash
curl -X GET "https://yourdomain.com/api/whatsapp-webhook?hub.mode=subscribe&hub.verify_token=threatlens_verify_token_2024&hub.challenge=test_challenge"
```

## 🔧 Troubleshooting

### Common Issues

1. **Access Token Expired**
   - Your access token might expire
   - Generate a new one from Meta Developer Console

2. **Webhook Not Receiving Messages**
   - Check webhook URL is accessible
   - Verify webhook configuration in Meta Console
   - Check server logs for errors

3. **Messages Not Sending**
   - Verify phone number format (+country code)
   - Check access token validity
   - Ensure business account is active

### Debug Mode

Enable debug logging in your `.env.local`:

```bash
DEBUG=whatsapp:*
NODE_ENV=development
```

## 📊 Your Account Details

- **App ID**: 1121620270121304
- **Phone Number ID**: 895249553670691
- **Business Account ID**: 819092584390222
- **Verify Token**: threatlens_verify_token_2024

## 🎯 What You Can Do Now

1. **Send URLs for scanning** - Users can send any URL and get security reports
2. **Interactive commands** - help, status, info commands work
3. **Multiple URL scanning** - Scan multiple URLs in one message
4. **Rich formatting** - Beautiful, emoji-rich security reports
5. **Error handling** - Clear error messages and guidance

## 🚀 Ready to Go!

Your WhatsApp integration is now configured and ready to use! 

1. Copy the config to `.env.local`
2. Run `node test-your-whatsapp.js`
3. Configure webhook in Meta Console
4. Start your server with `npm run dev`
5. Send messages to your WhatsApp business number

**Happy scanning!** 🛡️📱
