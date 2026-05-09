# 📱 WhatsApp Setup Guide for ThreatLens

## Overview

ThreatLens can send security scan reports via WhatsApp messages. Users can send URLs to a WhatsApp number and receive detailed security analysis reports. This guide shows you how to configure different WhatsApp services.

## 🚀 Quick Setup Options

### **Option 1: Console Logging (Default - No Setup Required)**
By default, ThreatLens logs WhatsApp messages to the console instead of sending real messages. This is perfect for development and testing.

**No configuration needed** - messages will be logged to your server console.

### **Option 2: Twilio WhatsApp (Easiest)**
Use Twilio's WhatsApp API for reliable message delivery.

#### Setup Steps:
1. **Create Twilio Account** at [twilio.com](https://twilio.com)
2. **Get WhatsApp Sandbox**:
   - Go to Console → Messaging → Try it out → Send a WhatsApp message
   - Follow the sandbox setup instructions
3. **Get Credentials**:
   - Account SID and Auth Token from Console Dashboard
   - WhatsApp Sandbox Number (starts with +14155238886)
4. **Install Package**:
```bash
npm install twilio
```
5. **Add to `.env.local`**:
```bash
WHATSAPP_SERVICE=twilio
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=+14155238886
```

### **Option 3: WhatsApp Business API (Professional)**
Use Meta's official WhatsApp Business API for production use.

#### Setup Steps:
1. **Create Meta Developer Account** at [developers.facebook.com](https://developers.facebook.com)
2. **Create WhatsApp Business App**:
   - Go to My Apps → Create App → Business
   - Add WhatsApp product
3. **Get Credentials**:
   - Phone Number ID from WhatsApp → API Setup
   - Access Token (temporary or permanent)
   - Webhook Verify Token (create your own)
4. **Add to `.env.local`**:
```bash
WHATSAPP_SERVICE=business
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_VERIFY_TOKEN=your_verify_token
```

### **Option 4: WhatsApp Web API (Advanced)**
Use WhatsApp Web automation for development/testing.

#### Setup Steps:
1. **Install Dependencies**:
```bash
npm install puppeteer whatsapp-web.js
```
2. **Add to `.env.local`**:
```bash
WHATSAPP_SERVICE=web
WHATSAPP_SESSION_PATH=./whatsapp-session
```

## 🔧 Environment Variables

Add these to your `.env.local` file:

```bash
# WhatsApp Service Configuration
WHATSAPP_SERVICE=console # or 'twilio', 'business', 'web'

# Twilio Configuration (if using Twilio)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=+14155238886

# WhatsApp Business API Configuration (if using Business API)
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_VERIFY_TOKEN=your_verify_token

# WhatsApp Web Configuration (if using Web API)
WHATSAPP_SESSION_PATH=./whatsapp-session
```

## 📡 Webhook Configuration

### For Twilio:
1. Go to Twilio Console → Phone Numbers → Manage → Active Numbers
2. Click on your WhatsApp number
3. Set Webhook URL: `https://yourdomain.com/api/whatsapp-webhook`
4. Set HTTP method to POST

### For WhatsApp Business API:
1. Go to your WhatsApp Business App → Configuration
2. Set Webhook URL: `https://yourdomain.com/api/whatsapp-webhook`
3. Set Verify Token: (same as WHATSAPP_VERIFY_TOKEN in .env)
4. Subscribe to `messages` events

## 🧪 Testing

### Test with Console Logging:
```bash
curl -X POST http://localhost:3000/api/whatsapp-scan \
  -H "Content-Type: application/json" \
  -d '{
    "from": "+1234567890",
    "message": "Please scan https://example.com",
    "messageId": "test123"
  }'
```

### Test with Twilio Sandbox:
1. Send "join <sandbox-code>" to your Twilio WhatsApp number
2. Send any URL to the number
3. Check your server logs for the scan results

## 📱 Message Format

Users can send messages in these formats:
- `Scan https://example.com`
- `Please check https://example.com for security issues`
- `https://example.com` (just the URL)
- `Check these sites: https://site1.com https://site2.com`

## 🔍 Features

- ✅ Automatic URL extraction from messages
- ✅ URL validation and security scanning
- ✅ Detailed WhatsApp message reports
- ✅ Support for multiple URLs per message
- ✅ Error handling for invalid URLs
- ✅ Professional message formatting with emojis
- ✅ Support for different WhatsApp providers

## 🛠️ API Endpoints

### POST `/api/whatsapp-scan`
Process a WhatsApp scan request manually.

**Request Body:**
```json
{
  "from": "+1234567890",
  "message": "Scan https://example.com",
  "messageId": "optional_message_id",
  "timestamp": "optional_timestamp"
}
```

### POST `/api/whatsapp-webhook`
Webhook endpoint for WhatsApp service providers.

**Supported Providers:**
- Twilio WhatsApp
- WhatsApp Business API
- Generic webhook format

### GET `/api/whatsapp-scan`
Health check endpoint.

## 🔒 Security Considerations

1. **Webhook Verification**: Always verify webhook signatures
2. **Rate Limiting**: Implement rate limiting for webhook endpoints
3. **Phone Number Validation**: Validate phone numbers before processing
4. **Message Sanitization**: Sanitize incoming messages
5. **Error Handling**: Don't expose sensitive information in error messages

## 🚨 Troubleshooting

### Common Issues:

1. **Messages not being received**:
   - Check webhook URL is accessible
   - Verify webhook configuration
   - Check server logs for errors

2. **Invalid phone number errors**:
   - Ensure phone numbers include country code
   - Remove any formatting characters
   - Use international format (+1234567890)

3. **Twilio sandbox not working**:
   - Make sure user sent "join <sandbox-code>" first
   - Check Twilio console for message logs
   - Verify webhook URL is set correctly

4. **WhatsApp Business API issues**:
   - Verify access token is valid
   - Check phone number ID is correct
   - Ensure webhook verification is working

## 📊 Monitoring

Monitor your WhatsApp integration:
- Check webhook delivery status
- Monitor message processing times
- Track scan success/failure rates
- Monitor API rate limits

## 🔄 Updates

To update WhatsApp configuration:
1. Update environment variables
2. Restart your application
3. Test with a sample message
4. Verify webhook is still working

## 📞 Support

For issues with:
- **Twilio**: Check [Twilio Support](https://support.twilio.com)
- **WhatsApp Business API**: Check [Meta Developer Support](https://developers.facebook.com/support)
- **ThreatLens Integration**: Check server logs and this documentation
