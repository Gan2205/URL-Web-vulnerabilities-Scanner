# 🔧 Twilio Webhook Setup Guide

## Current ngrok URL:
```
https://0451598db31b.ngrok-free.app
```

## 📱 **Step 1: Configure Twilio Webhook**

1. **Go to**: https://console.twilio.com/
2. **Navigate to**: Messaging → Try it out → Send a WhatsApp message
3. **Find your WhatsApp number**: +1 415 523 8886
4. **Set Webhook URL to**: `https://0451598db31b.ngrok-free.app/api/whatsapp-webhook`
5. **HTTP Method**: POST
6. **Save the configuration**

## 🧪 **Step 2: Test the Webhook**

After setting the webhook URL, send a message to **+1 415 523 8886**:
- `https://google.com`
- `help`
- `status`

## 🔍 **Step 3: Check Webhook Logs**

The webhook should receive messages and process them. Check your server logs for:
- `📱 Received WhatsApp webhook from:`
- `📱 Message:`
- `✅ WhatsApp message processed successfully`

## 🚨 **If Still Not Working:**

1. **Verify ngrok is running**: `netstat -ano | findstr :4040`
2. **Check server is running**: `netstat -ano | findstr :3000`
3. **Test webhook directly**: Use the test script
4. **Check Twilio logs**: Go to Twilio Console → Monitor → Logs

## 📞 **Your WhatsApp Number**: +1 415 523 8886
## 🌐 **Webhook URL**: https://0451598db31b.ngrok-free.app/api/whatsapp-webhook
