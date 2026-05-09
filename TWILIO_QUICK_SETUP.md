# 🚀 Twilio WhatsApp Quick Setup

## Required Details (I need these from you):

### 1. Twilio Account SID
- Go to [console.twilio.com](https://console.twilio.com)
- Copy your **Account SID** from the dashboard

### 2. Twilio Auth Token
- In the same dashboard, copy your **Auth Token** (click to reveal)

### 3. WhatsApp Sandbox Number
- Go to **Messaging** → **Try it out** → **Send a WhatsApp message**
- Copy the sandbox number (starts with +14155238886)

### 4. Your Phone Number
- Your WhatsApp number with country code (e.g., +919381276836)

## Quick Setup Steps:

### Step 1: Install Twilio
```bash
npm install twilio
```

### Step 2: Add to .env.local
```bash
WHATSAPP_SERVICE=twilio
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=+14155238886
```

### Step 3: Join Sandbox
- Send "join <sandbox-code>" to the sandbox number from your WhatsApp

### Step 4: Test
```bash
node test-twilio-whatsapp.js
```

## That's it! 🎉

**Please provide me with:**
1. Your Twilio Account SID
2. Your Twilio Auth Token  
3. Your WhatsApp number

And I'll set everything up for you!
