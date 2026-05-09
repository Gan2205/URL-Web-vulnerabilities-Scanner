# 📱 WhatsApp Integration for ThreatLens

## Overview

ThreatLens now supports WhatsApp integration, allowing users to send URLs via WhatsApp messages and receive detailed security scan reports. This feature provides a convenient way to scan websites on-the-go using the most popular messaging platform.

## ✨ Features

- 🔍 **Automatic URL Extraction**: Intelligently extracts URLs from WhatsApp messages
- 📊 **Real-time Security Scanning**: Performs comprehensive security analysis
- 📱 **Rich Message Formatting**: Beautiful, emoji-rich reports optimized for mobile
- 🤖 **Interactive Commands**: Support for help, status, and info commands
- 🔄 **Multiple Provider Support**: Works with Twilio, WhatsApp Business API, and more
- ⚡ **Fast Processing**: Quick response times for better user experience
- 🛡️ **Error Handling**: Graceful error handling and user feedback

## 🚀 Quick Start

### 1. Basic Setup (Console Logging)

For development and testing, no additional setup is required:

```bash
# No configuration needed - messages will be logged to console
npm run dev
```

### 2. Production Setup (Twilio)

For production use with Twilio WhatsApp:

```bash
# Install Twilio SDK
npm install twilio

# Add to .env.local
WHATSAPP_SERVICE=twilio
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=+14155238886
```

## 📁 File Structure

```
src/
├── lib/
│   ├── whatsappService.ts          # Core WhatsApp messaging service
│   ├── whatsappScanService.ts      # URL scanning and processing
│   └── whatsappTemplates.ts        # Message templates and formatting
├── app/api/
│   ├── whatsapp-webhook/route.ts   # Webhook endpoint for incoming messages
│   └── whatsapp-scan/route.ts      # Manual scan endpoint
└── test-whatsapp.js                # Test script
```

## 🔧 Configuration

### Environment Variables

```bash
# WhatsApp Service Configuration
WHATSAPP_SERVICE=console              # or 'twilio', 'business', 'web'

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=+14155238886

# WhatsApp Business API Configuration
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_VERIFY_TOKEN=your_verify_token
```

### Supported Services

1. **Console Logging** (Default)
   - Logs messages to server console
   - Perfect for development and testing
   - No external dependencies

2. **Twilio WhatsApp**
   - Reliable message delivery
   - Easy setup with sandbox
   - Production-ready

3. **WhatsApp Business API**
   - Official Meta API
   - High message limits
   - Professional features

4. **WhatsApp Web** (Advanced)
   - Uses automation libraries
   - Good for development
   - Requires more setup

## 📱 Usage Examples

### User Interactions

Users can interact with the WhatsApp bot in several ways:

```
# Scan a single URL
https://example.com

# Scan with command
Scan https://example.com

# Check multiple URLs
Check https://site1.com and https://site2.com

# Get help
help

# Check status
status

# Get info
info
```

### Message Formats

The bot recognizes various message formats:

- **Direct URLs**: `https://example.com`
- **Commands**: `Scan https://example.com`
- **Multiple URLs**: `https://site1.com https://site2.com`
- **Mixed content**: `Please scan https://example.com for security issues`

## 🔍 API Endpoints

### POST `/api/whatsapp-scan`

Process a WhatsApp scan request manually.

**Request:**
```json
{
  "from": "+1234567890",
  "message": "Scan https://example.com",
  "messageId": "optional_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "WhatsApp scan completed and report sent",
  "results": {
    "totalUrls": 1,
    "validUrls": 1,
    "invalidUrls": 0
  }
}
```

### POST `/api/whatsapp-webhook`

Webhook endpoint for WhatsApp service providers.

**Supported Providers:**
- Twilio WhatsApp
- WhatsApp Business API
- Generic webhook format

## 🎨 Message Templates

The system includes rich message templates for different scenarios:

### Scan Results
- **Single URL**: Detailed security analysis with score and vulnerabilities
- **Multiple URLs**: Summary of all scanned URLs
- **No URLs**: Helpful guidance on how to send URLs
- **Errors**: Clear error messages with troubleshooting tips

### Commands
- **Help**: List of available commands and usage examples
- **Status**: Service status and health information
- **Info**: About ThreatLens and features

### Notifications
- **Welcome**: Introduction for new users
- **Rate Limit**: When user exceeds scan limits
- **Maintenance**: Service maintenance notifications

## 🧪 Testing

### Run Test Script

```bash
node test-whatsapp.js
```

### Manual Testing

```bash
# Test scan endpoint
curl -X POST http://localhost:3000/api/whatsapp-scan \
  -H "Content-Type: application/json" \
  -d '{
    "from": "+1234567890",
    "message": "Scan https://example.com"
  }'

# Test webhook
curl -X POST http://localhost:3000/api/whatsapp-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "from": "+1234567890",
    "message": "https://example.com",
    "messageId": "test123"
  }'
```

## 🔒 Security Considerations

1. **Webhook Verification**: Always verify webhook signatures
2. **Rate Limiting**: Implement rate limiting for webhook endpoints
3. **Phone Number Validation**: Validate phone numbers before processing
4. **Message Sanitization**: Sanitize incoming messages
5. **Error Handling**: Don't expose sensitive information in error messages

## 📊 Monitoring

Monitor your WhatsApp integration:

- **Webhook Delivery**: Check webhook delivery status
- **Message Processing**: Monitor processing times
- **Scan Success Rate**: Track successful vs failed scans
- **API Rate Limits**: Monitor usage against limits
- **Error Rates**: Track and analyze errors

## 🚨 Troubleshooting

### Common Issues

1. **Messages not received**
   - Check webhook URL accessibility
   - Verify webhook configuration
   - Check server logs for errors

2. **Invalid phone number errors**
   - Ensure country code is included
   - Remove formatting characters
   - Use international format

3. **Twilio sandbox issues**
   - User must send "join <sandbox-code>" first
   - Check Twilio console for message logs
   - Verify webhook URL configuration

4. **WhatsApp Business API issues**
   - Verify access token validity
   - Check phone number ID
   - Ensure webhook verification works

### Debug Mode

Enable debug logging:

```bash
# Add to .env.local
DEBUG=whatsapp:*
```

## 🔄 Updates and Maintenance

### Updating Configuration

1. Update environment variables
2. Restart application
3. Test with sample message
4. Verify webhook functionality

### Monitoring Health

- Check `/api/whatsapp-scan` health endpoint
- Monitor webhook delivery logs
- Track scan success rates
- Monitor API usage

## 📈 Performance

### Optimization Tips

1. **URL Limiting**: Limit to 3 URLs per message for faster processing
2. **Caching**: Cache scan results for repeated URLs
3. **Rate Limiting**: Implement user rate limiting
4. **Async Processing**: Use background processing for heavy scans

### Scaling

- Use message queues for high volume
- Implement horizontal scaling
- Monitor resource usage
- Set up load balancing

## 🤝 Contributing

To contribute to WhatsApp integration:

1. Fork the repository
2. Create feature branch
3. Add tests for new features
4. Update documentation
5. Submit pull request

## 📞 Support

For issues with:

- **Twilio**: [Twilio Support](https://support.twilio.com)
- **WhatsApp Business API**: [Meta Developer Support](https://developers.facebook.com/support)
- **ThreatLens Integration**: Check logs and documentation

## 📄 License

This WhatsApp integration is part of ThreatLens and follows the same license terms.

---

**Ready to scan websites via WhatsApp?** 🚀

Set up your WhatsApp service provider and start receiving security scan reports on your phone!
