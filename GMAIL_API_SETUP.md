# Gmail API Setup - Quick Guide

## 1. Google Cloud Console Setup
1. Go to https://console.cloud.google.com/
2. Create new project: "ThreatLens Email Scanner"
3. Enable Gmail API
4. Create OAuth 2.0 credentials
5. Download JSON file as `gmail-credentials.json`

## 2. Install Package
```bash
npm install googleapis
```

## 3. Environment Variables (.env.local)
```bash
GMAIL_CLIENT_ID=your_client_id
GMAIL_CLIENT_SECRET=your_client_secret
GMAIL_REFRESH_TOKEN=your_refresh_token
ADMIN_EMAIL=your_email@gmail.com
```

## 4. Get Refresh Token
Visit: http://localhost:3000/api/gmail-auth
Click "Authorize Gmail" → Copy refresh token

## 5. Test
Send email to your Gmail with URL → Get security report reply
