# 🔑 Meta WhatsApp Business Cloud API - Required Keys and APIs

## Overview

This guide covers all the required keys, APIs, and endpoints needed to implement WhatsApp integration using Meta's WhatsApp Business Cloud API.

## 🎯 Required Keys and Credentials

### 1. Meta App Credentials

You'll need these from your Meta Developer Account:

```bash
# Meta App Configuration
META_APP_ID=your_app_id
META_APP_SECRET=your_app_secret
META_VERIFY_TOKEN=your_custom_verify_token

# WhatsApp Business API
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id
```

### 2. Webhook Configuration

```bash
# Webhook Settings
WHATSAPP_WEBHOOK_URL=https://yourdomain.com/api/whatsapp-webhook
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_verify_token
```

## 📋 Step-by-Step Key Acquisition

### Step 1: Create Meta Developer Account

1. **Go to Meta for Developers**
   - Visit [developers.facebook.com](https://developers.facebook.com)
   - Click "Get Started" or "Log In"
   - Use your Facebook account or create one

2. **Create a New App**
   - Click "Create App"
   - Select "Business" as app type
   - Fill in app details:
     - **App Name**: ThreatLens WhatsApp Bot
     - **App Contact Email**: your-email@example.com
     - **Business Account**: Select or create one

### Step 2: Add WhatsApp Product

1. **In Your App Dashboard**
   - Go to "Add Products"
   - Find "WhatsApp" and click "Set up"

2. **Configure WhatsApp**
   - You'll see the WhatsApp configuration page
   - Note down the **Phone Number ID** (you'll need this)

### Step 3: Get Access Token

1. **Temporary Access Token (for testing)**
   - In WhatsApp configuration, find "Temporary access token"
   - Click "Generate Token"
   - Copy the token (expires in 24 hours)

2. **Permanent Access Token (for production)**
   - Go to "WhatsApp" → "API Setup"
   - Click "Add or manage phone numbers"
   - Select your phone number
   - Generate a permanent token

### Step 4: Get Phone Number ID

1. **From WhatsApp Configuration**
   - In your app dashboard, go to WhatsApp
   - Look for "Phone number ID" (starts with numbers)
   - Copy this ID

2. **From API Response**
   ```bash
   curl -X GET "https://graph.facebook.com/v18.0/me/phone_numbers?access_token=YOUR_ACCESS_TOKEN"
   ```

### Step 5: Get Business Account ID

1. **From App Dashboard**
   - Go to "App Settings" → "Basic"
   - Look for "Business Account ID"

2. **From API Response**
   ```bash
   curl -X GET "https://graph.facebook.com/v18.0/me?access_token=YOUR_ACCESS_TOKEN"
   ```

## 🔧 Environment Variables Setup

Create or update your `.env.local` file:

```bash
# Meta WhatsApp Business Cloud API Configuration
WHATSAPP_SERVICE=business

# Meta App Credentials
META_APP_ID=1234567890123456
META_APP_SECRET=your_app_secret_here
META_VERIFY_TOKEN=your_custom_verify_token

# WhatsApp Business API
WHATSAPP_PHONE_NUMBER_ID=1234567890123456
WHATSAPP_ACCESS_TOKEN=your_access_token_here
WHATSAPP_BUSINESS_ACCOUNT_ID=1234567890123456

# Webhook Configuration
WHATSAPP_WEBHOOK_URL=https://yourdomain.com/api/whatsapp-webhook
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_verify_token

# Optional: Message Template ID (for approved templates)
WHATSAPP_TEMPLATE_ID=your_template_id
```

## 📡 Required API Endpoints

### 1. Send Message API

**Endpoint**: `https://graph.facebook.com/v18.0/{phone-number-id}/messages`

**Method**: POST

**Headers**:
```json
{
  "Authorization": "Bearer YOUR_ACCESS_TOKEN",
  "Content-Type": "application/json"
}
```

**Body**:
```json
{
  "messaging_product": "whatsapp",
  "to": "1234567890",
  "type": "text",
  "text": {
    "body": "Your message here"
  }
}
```

### 2. Webhook Verification API

**Endpoint**: `https://yourdomain.com/api/whatsapp-webhook`

**Method**: GET

**Query Parameters**:
- `hub.mode`: subscribe
- `hub.verify_token`: your_verify_token
- `hub.challenge`: challenge_string

### 3. Webhook Receive Messages API

**Endpoint**: `https://yourdomain.com/api/whatsapp-webhook`

**Method**: POST

**Headers**:
```json
{
  "Content-Type": "application/json",
  "X-Hub-Signature-256": "sha256=signature"
}
```

## 🔐 Security and Authentication

### 1. Webhook Signature Verification

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(req, res, next) {
  const signature = req.headers['x-hub-signature-256'];
  const body = JSON.stringify(req.body);
  const expectedSignature = 'sha256=' + crypto
    .createHmac('sha256', process.env.META_APP_SECRET)
    .update(body)
    .digest('hex');
  
  if (signature !== expectedSignature) {
    return res.status(403).send('Forbidden');
  }
  
  next();
}
```

### 2. Access Token Validation

```javascript
async function validateAccessToken(token) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/me?access_token=${token}`
    );
    return response.ok;
  } catch (error) {
    return false;
  }
}
```

## 📱 Message Types Supported

### 1. Text Messages
```json
{
  "messaging_product": "whatsapp",
  "to": "1234567890",
  "type": "text",
  "text": {
    "body": "Hello! This is a text message."
  }
}
```

### 2. Template Messages (for approved templates)
```json
{
  "messaging_product": "whatsapp",
  "to": "1234567890",
  "type": "template",
  "template": {
    "name": "hello_world",
    "language": {
      "code": "en_US"
    }
  }
}
```

### 3. Interactive Messages
```json
{
  "messaging_product": "whatsapp",
  "to": "1234567890",
  "type": "interactive",
  "interactive": {
    "type": "button",
    "body": {
      "text": "Choose an option:"
    },
    "action": {
      "buttons": [
        {
          "type": "reply",
          "reply": {
            "id": "scan_url",
            "title": "Scan URL"
          }
        }
      ]
    }
  }
}
```

## 🧪 Testing Your Setup

### 1. Test Access Token

```bash
curl -X GET "https://graph.facebook.com/v18.0/me?access_token=YOUR_ACCESS_TOKEN"
```

### 2. Test Send Message

```bash
curl -X POST "https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID/messages" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "1234567890",
    "type": "text",
    "text": {
      "body": "Test message from ThreatLens!"
    }
  }'
```

### 3. Test Webhook

```bash
curl -X GET "https://yourdomain.com/api/whatsapp-webhook?hub.mode=subscribe&hub.verify_token=YOUR_VERIFY_TOKEN&hub.challenge=test_challenge"
```

## 🔄 Webhook Event Types

### 1. Message Events
```json
{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "WHATSAPP_BUSINESS_ACCOUNT_ID",
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "1234567890",
              "phone_number_id": "PHONE_NUMBER_ID"
            },
            "messages": [
              {
                "from": "1234567890",
                "id": "wamid.xxx",
                "timestamp": "1234567890",
                "text": {
                  "body": "Hello!"
                },
                "type": "text"
              }
            ]
          },
          "field": "messages"
        }
      ]
    }
  ]
}
```

### 2. Status Events
```json
{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "WHATSAPP_BUSINESS_ACCOUNT_ID",
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "1234567890",
              "phone_number_id": "PHONE_NUMBER_ID"
            },
            "statuses": [
              {
                "id": "wamid.xxx",
                "status": "delivered",
                "timestamp": "1234567890",
                "recipient_id": "1234567890"
              }
            ]
          },
          "field": "messages"
        }
      ]
    }
  ]
}
```

## 🚨 Rate Limits and Quotas

### 1. Message Limits
- **Free Tier**: 1,000 messages per month
- **Paid Tier**: Based on your plan
- **Rate Limit**: 80 messages per second per phone number

### 2. API Limits
- **Graph API**: 200 calls per hour per user
- **Webhook**: No specific limits
- **Media Upload**: 100MB per file

## 🔧 Required Permissions

### 1. App Permissions
- `whatsapp_business_messaging`
- `whatsapp_business_management`

### 2. Business Account Permissions
- `whatsapp_business_messaging`
- `whatsapp_business_management`

## 📊 Monitoring and Analytics

### 1. Message Status Tracking
```javascript
// Track message delivery status
app.post('/api/whatsapp-webhook', (req, res) => {
  const body = req.body;
  
  if (body.entry?.[0]?.changes?.[0]?.value?.statuses) {
    const statuses = body.entry[0].changes[0].value.statuses;
    statuses.forEach(status => {
      console.log(`Message ${status.id} status: ${status.status}`);
    });
  }
  
  res.status(200).send('OK');
});
```

### 2. Error Handling
```javascript
// Handle API errors
async function sendWhatsAppMessage(phoneNumber, message) {
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
          to: phoneNumber,
          type: 'text',
          text: { body: message }
        })
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`WhatsApp API Error: ${error.error?.message}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('WhatsApp send error:', error);
    throw error;
  }
}
```

## 🎯 Quick Start Checklist

- [ ] Create Meta Developer Account
- [ ] Create Business App
- [ ] Add WhatsApp product
- [ ] Get Phone Number ID
- [ ] Generate Access Token
- [ ] Set up webhook URL
- [ ] Configure environment variables
- [ ] Test webhook verification
- [ ] Test sending messages
- [ ] Implement message handling

## 📞 Support Resources

- **Meta Developer Docs**: [developers.facebook.com/docs/whatsapp](https://developers.facebook.com/docs/whatsapp)
- **WhatsApp Business API Docs**: [developers.facebook.com/docs/whatsapp/cloud-api](https://developers.facebook.com/docs/whatsapp/cloud-api)
- **Graph API Explorer**: [developers.facebook.com/tools/explorer](https://developers.facebook.com/tools/explorer)
- **Meta Business Support**: [business.facebook.com/support](https://business.facebook.com/support)

---

**Ready to implement?** 🚀 Use these keys and APIs to set up your WhatsApp Business Cloud API integration with ThreatLens!
