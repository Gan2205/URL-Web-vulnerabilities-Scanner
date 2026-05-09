# 📧 Email Setup Guide for ThreatLens

## Overview

ThreatLens can send beautiful email reports with scan results to users. This guide shows you how to configure different email services.

## 🚀 Quick Setup Options

### **Option 1: Console Logging (Default - No Setup Required)**
By default, ThreatLens logs email content to the console instead of sending real emails. This is perfect for development and testing.

**No configuration needed** - emails will be logged to your server console.

### **Option 2: Gmail SMTP (Easiest)**
Use your Gmail account to send emails.

#### Setup Steps:
1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Add to `.env.local`**:
```bash
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
EMAIL_FROM=your-email@gmail.com
```

### **Option 3: SendGrid (Professional)**
SendGrid is a professional email service with high deliverability.

#### Setup Steps:
1. **Create SendGrid Account** at [sendgrid.com](https://sendgrid.com)
2. **Get API Key**:
   - Go to Settings → API Keys
   - Create API Key with "Mail Send" permissions
3. **Install Package**:
```bash
npm install @sendgrid/mail
```
4. **Add to `.env.local`**:
```bash
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com
```

### **Option 4: AWS SES (Scalable)**
Amazon SES is great for high-volume email sending.

#### Setup Steps:
1. **Create AWS Account** and verify your domain
2. **Get AWS Credentials**:
   - Create IAM user with SES permissions
   - Get Access Key ID and Secret Access Key
3. **Install Package**:
```bash
npm install @aws-sdk/client-ses
```
4. **Add to `.env.local`**:
```bash
EMAIL_SERVICE=ses
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
EMAIL_FROM=noreply@yourdomain.com
```

## 📋 Environment Variables Reference

Add these to your `.env.local` file:

```bash
# Email Service Configuration
EMAIL_SERVICE=console          # Options: console, smtp, sendgrid, ses
EMAIL_FROM=noreply@yourdomain.com

# SMTP Configuration (for Gmail, Outlook, etc.)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password

# SendGrid Configuration
SENDGRID_API_KEY=your-sendgrid-api-key

# AWS SES Configuration
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
```

## 🧪 Testing Email Functionality

### Test with Console Logging (Default)
1. **No setup required**
2. **Schedule a scan** with email notifications enabled
3. **Check server console** for email content logs
4. **Verify** that email content is generated correctly

### Test with Real Email Service
1. **Configure your chosen email service** (see options above)
2. **Restart your server** after adding environment variables
3. **Schedule a test scan** with your email address
4. **Check your inbox** for the security report

## 📧 Email Report Features

### What's Included in Email Reports:
- ✅ **Professional HTML Design** with responsive layout
- ✅ **Scan Information** (URL, name, timestamp)
- ✅ **Vulnerability Summary** with counts by severity
- ✅ **Security Score** with visual grade indicator
- ✅ **Detailed Vulnerability List** with descriptions
- ✅ **Color-coded Severity Levels** (🔴 Critical, 🟠 High, 🟡 Medium, 🔵 Low)
- ✅ **Professional Branding** and contact information

### Email Content Preview:
```
Subject: ThreatLens Security Report - https://example.com

📊 Scan Information:
- Target URL: https://example.com
- Scan Name: Weekly Security Check
- Scan Date: 2024-01-15 10:30:00

📈 Vulnerability Summary:
- Total Issues: 5
- Critical: 1
- High: 2
- Medium: 1
- Low: 1

🏆 Security Score: 75/100 (Grade: C)

🔍 Detailed Vulnerabilities:
1. SQL Injection [CRITICAL]
   Description: SQL injection vulnerability detected
   Location: URL parameter: id

2. Cross-Site Scripting [HIGH]
   Description: XSS vulnerability in form input
   Location: Form field: username
```

## 🔧 Troubleshooting

### Common Issues:

#### "Email service not configured"
- **Solution**: Add `EMAIL_SERVICE` to your `.env.local` file
- **Options**: `console`, `smtp`, `sendgrid`, `ses`

#### "SMTP authentication failed"
- **Solution**: Check your SMTP credentials
- **For Gmail**: Use App Password, not regular password
- **For Outlook**: Enable "Less secure app access" or use App Password

#### "SendGrid API key invalid"
- **Solution**: Verify your SendGrid API key
- **Check**: API key has "Mail Send" permissions
- **Verify**: API key is not expired

#### "AWS SES access denied"
- **Solution**: Check your AWS credentials and permissions
- **Verify**: IAM user has SES permissions
- **Check**: Domain is verified in AWS SES

#### "Emails not being sent"
- **Check**: Server console for error messages
- **Verify**: Environment variables are loaded correctly
- **Test**: Try console mode first to verify email generation

### Debug Mode:
Add this to your `.env.local` to see detailed email logs:
```bash
DEBUG_EMAIL=true
```

## 🚀 Production Recommendations

### For Production Use:
1. **Use Professional Email Service**: SendGrid, AWS SES, or Mailgun
2. **Verify Your Domain**: Set up SPF, DKIM, and DMARC records
3. **Monitor Deliverability**: Check bounce rates and spam complaints
4. **Rate Limiting**: Implement rate limiting to prevent abuse
5. **Error Handling**: Set up monitoring for failed email sends

### Security Best Practices:
- ✅ **Never commit** email credentials to version control
- ✅ **Use environment variables** for all sensitive data
- ✅ **Rotate API keys** regularly
- ✅ **Monitor email usage** for unusual activity
- ✅ **Use dedicated email domain** for better deliverability

## 📞 Support

If you need help setting up email functionality:

1. **Check the console logs** for error messages
2. **Verify environment variables** are correctly set
3. **Test with console mode** first to verify email generation
4. **Check email service documentation** for specific setup requirements

---

**ThreatLens Email System** - Professional security reports delivered to your inbox! 📧🛡️
