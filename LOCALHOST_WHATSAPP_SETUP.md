# 🏠 Localhost WhatsApp Setup Guide

Since you're running ThreatLens locally, you need to expose your localhost to the internet so Meta can send webhooks to your server.

## 🚀 Quick Setup Options

### Option 1: Using ngrok (Recommended)

#### Step 1: Install ngrok
```bash
# Download from https://ngrok.com/download
# Or install via npm
npm install -g ngrok
```

#### Step 2: Start Your ThreatLens Server
```bash
# In one terminal
npm run dev
```

#### Step 3: Expose Localhost with ngrok
```bash
# In another terminal
ngrok http 3000
```

You'll get output like:
```
Session Status                online
Account                       your-email@example.com
Version                       3.x.x
Region                        United States (us)
Latency                       45ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok.io -> http://localhost:3000
```

**Copy the HTTPS URL** (e.g., `https://abc123.ngrok.io`)

#### Step 4: Update Your .env.local
```bash
# Update your .env.local file
WHATSAPP_WEBHOOK_URL=https://abc123.ngrok.io/api/whatsapp-webhook
```

#### Step 5: Configure Webhook in Meta Console
1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Select your app (ID: 1121620270121304)
3. Go to WhatsApp → Configuration
4. Set:
   - **Webhook URL**: `https://abc123.ngrok.io/api/whatsapp-webhook`
   - **Verify Token**: `threatlens_verify_token_2024`
   - **Subscribe to**: "messages" events

#### Step 6: Test Webhook Verification
```bash
curl -X GET "https://abc123.ngrok.io/api/whatsapp-webhook?hub.mode=subscribe&hub.verify_token=threatlens_verify_token_2024&hub.challenge=test_challenge"
```

### Option 2: Using localtunnel

#### Step 1: Install localtunnel
```bash
npm install -g localtunnel
```

#### Step 2: Start Your Server
```bash
npm run dev
```

#### Step 3: Expose Localhost
```bash
# In another terminal
lt --port 3000 --subdomain threatlens-whatsapp
```

You'll get a URL like: `https://threatlens-whatsapp.loca.lt`

#### Step 4: Update Configuration
```bash
# Update your .env.local file
WHATSAPP_WEBHOOK_URL=https://threatlens-whatsapp.loca.lt/api/whatsapp-webhook
```

### Option 3: Using Cloudflare Tunnel

#### Step 1: Install Cloudflare Tunnel
```bash
# Download from https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
```

#### Step 2: Authenticate
```bash
cloudflared tunnel login
```

#### Step 3: Create Tunnel
```bash
cloudflared tunnel create threatlens-whatsapp
```

#### Step 4: Configure Tunnel
Create `config.yml`:
```yaml
tunnel: threatlens-whatsapp
credentials-file: /path/to/credentials.json

ingress:
  - hostname: threatlens-whatsapp.yourdomain.com
    service: http://localhost:3000
  - service: http_status:404
```

#### Step 5: Run Tunnel
```bash
cloudflared tunnel run threatlens-whatsapp
```

## 🧪 Testing Your Local Setup

### Step 1: Test Webhook Verification
```bash
# Replace with your ngrok URL
curl -X GET "https://abc123.ngrok.io/api/whatsapp-webhook?hub.mode=subscribe&hub.verify_token=threatlens_verify_token_2024&hub.challenge=test_challenge"
```

Expected response: `test_challenge`

### Step 2: Test Message Sending
```bash
# Test sending a message
node test-your-whatsapp.js
```

### Step 3: Test Full Integration
1. Send a WhatsApp message to your business number
2. Check your server logs for incoming webhook requests
3. Verify you receive a response

## 🔧 Troubleshooting Local Setup

### Common Issues

#### 1. ngrok Not Working
```bash
# Check if ngrok is running
curl http://127.0.0.1:4040/api/tunnels

# Restart ngrok
ngrok http 3000
```

#### 2. Webhook Not Receiving Messages
- Check if your server is running on port 3000
- Verify ngrok is running and URL is accessible
- Check Meta Console webhook configuration
- Look at server logs for errors

#### 3. CORS Issues
Add CORS headers to your webhook route:
```javascript
// In your webhook route
res.header('Access-Control-Allow-Origin', '*');
res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
```

#### 4. SSL Certificate Issues
ngrok provides HTTPS by default, but if you have issues:
```bash
# Use ngrok with custom domain (paid)
ngrok http 3000 --hostname=your-custom-domain.ngrok.io
```

## 📱 Complete Local Testing Workflow

### 1. Start Everything
```bash
# Terminal 1: Start ThreatLens
npm run dev

# Terminal 2: Start ngrok
ngrok http 3000
```

### 2. Update Configuration
```bash
# Copy ngrok URL to .env.local
WHATSAPP_WEBHOOK_URL=https://abc123.ngrok.io/api/whatsapp-webhook
```

### 3. Configure Meta Webhook
- Set webhook URL in Meta Console
- Verify token: `threatlens_verify_token_2024`
- Subscribe to "messages" events

### 4. Test Integration
```bash
# Test webhook verification
curl -X GET "https://abc123.ngrok.io/api/whatsapp-webhook?hub.mode=subscribe&hub.verify_token=threatlens_verify_token_2024&hub.challenge=test_challenge"

# Test message sending
node test-your-whatsapp.js
```

### 5. Send Real WhatsApp Messages
- Send `https://example.com` to your business number
- Check server logs for webhook requests
- Verify you receive security report

## 🚨 Important Notes

### Security
- ngrok URLs are public - don't expose sensitive data
- Use verify tokens to secure your webhook
- Consider using ngrok's authentication features

### Persistence
- ngrok URLs change each time you restart (free tier)
- For production, use a static domain or hosting service
- Consider upgrading to ngrok paid plan for static URLs

### Rate Limits
- Meta has rate limits on webhook calls
- ngrok has bandwidth limits on free tier
- Monitor your usage

## 🎯 Quick Start Commands

```bash
# 1. Start ThreatLens
npm run dev

# 2. Start ngrok (in another terminal)
ngrok http 3000

# 3. Copy ngrok URL and update .env.local
# 4. Configure webhook in Meta Console
# 5. Test with:
curl -X GET "https://your-ngrok-url.ngrok.io/api/whatsapp-webhook?hub.mode=subscribe&hub.verify_token=threatlens_verify_token_2024&hub.challenge=test_challenge"

# 6. Send WhatsApp messages to your business number
```

## 🎉 You're Ready!

Once you follow these steps, your localhost ThreatLens will be accessible via WhatsApp through the internet tunnel. Users can send URLs to your WhatsApp business number and receive security scan reports!

**Happy local development!** 🏠📱🛡️
