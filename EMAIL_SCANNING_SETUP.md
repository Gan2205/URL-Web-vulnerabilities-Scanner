# Email-Based Security Scanning Setup Guide

## Overview
This feature allows users to send emails to an admin Gmail address with URLs to scan. The system automatically extracts URLs, performs security scans, and replies with detailed reports.

## Features
- ✅ Automatic URL extraction from email content
- ✅ URL validation and security scanning
- ✅ Detailed HTML and text email reports
- ✅ Support for multiple URLs per email
- ✅ Error handling for invalid URLs
- ✅ Professional email templates

## Setup Instructions

### 1. Email Service Provider Setup

Choose one of the following email service providers:

#### Option A: SendGrid
1. Create a SendGrid account
2. Set up a webhook endpoint: `https://yourdomain.com/api/email-webhook`
3. Configure incoming email parsing
4. Add webhook authentication

#### Option B: AWS SES
1. Set up AWS SES
2. Configure SNS topic for incoming emails
3. Set up Lambda function to call webhook
4. Configure email forwarding rules

#### Option C: Gmail API
1. Set up Google Cloud Project
2. Enable Gmail API
3. Create service account
4. Set up email monitoring

### 2. Environment Variables

Add to your `.env.local`:

```bash
# Email Service Configuration
EMAIL_SERVICE_PROVIDER=sendgrid # or 'aws-ses' or 'gmail'
SENDGRID_API_KEY=your_sendgrid_api_key
AWS_SES_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
GMAIL_CLIENT_ID=your_gmail_client_id
GMAIL_CLIENT_SECRET=your_gmail_client_secret

# Admin Email Configuration
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_EMAIL_PASSWORD=your_email_password
```

### 3. Webhook Configuration

The webhook endpoint is available at:
```
POST https://yourdomain.com/api/email-webhook
```

Expected payload format:
```json
{
  "from": "user@example.com",
  "subject": "Please scan this website",
  "body": "Hi, can you scan https://example.com for security issues?",
  "messageId": "unique-message-id"
}
```

### 4. Testing

Run the test script:
```bash
node test-email-scan.js
```

## Usage Examples

### User Email Examples

**Single URL:**
```
To: admin@yourdomain.com
Subject: Security scan request
Body: Hi, can you please scan https://example.com for security vulnerabilities?
```

**Multiple URLs:**
```
To: admin@yourdomain.com
Subject: Scan multiple websites
Body: Please scan these websites:
1. https://example.com
2. https://github.com
3. https://stackoverflow.com
```

**Invalid URL:**
```
To: admin@yourdomain.com
Subject: Invalid URL test
Body: Please scan https://this-site-does-not-exist.com
```

## Email Report Features

### Security Score Display
- Visual score (0-100)
- Color-coded grades (A-F)
- Risk level indicators

### Vulnerability Details
- Severity levels (Critical, High, Medium, Low)
- Vulnerability types and descriptions
- Remediation suggestions

### Professional Formatting
- HTML and plain text versions
- Responsive design
- Branded templates
- Clear error messages

## API Endpoints

### Email Scan Processing
```
POST /api/email-scan
```
Process email scan requests manually (for testing)

### Email Webhook
```
POST /api/email-webhook
```
Receive emails from email service providers

### Health Check
```
GET /api/email-scan
GET /api/email-webhook
```

## Error Handling

The system handles various error scenarios:

1. **No URLs Found**: Clear message explaining how to include URLs
2. **Invalid URLs**: Specific error messages for each invalid URL
3. **Scan Failures**: Detailed error reporting
4. **Email Delivery Issues**: Fallback error handling

## Security Considerations

1. **Email Validation**: Verify sender email addresses
2. **Rate Limiting**: Prevent spam and abuse
3. **URL Validation**: Only scan safe, accessible URLs
4. **Authentication**: Secure webhook endpoints
5. **Logging**: Monitor all email scan activities

## Monitoring and Logs

The system provides comprehensive logging:
- Email receipt logs
- URL extraction logs
- Scan progress logs
- Error logs
- Email delivery logs

## Customization

### Email Templates
Modify `EmailScanService.generateEmailReport()` to customize:
- Email styling
- Report format
- Branding elements
- Additional information

### URL Extraction
Modify `EmailScanService.extractUrls()` to:
- Support different URL formats
- Handle special characters
- Filter specific domains

### Scan Configuration
Modify scan parameters in `EmailScanService.performScan()` to:
- Adjust scan depth
- Modify vulnerability detection
- Change scoring algorithms

## Troubleshooting

### Common Issues

1. **Emails not being received**
   - Check webhook configuration
   - Verify email service provider settings
   - Check server logs

2. **URLs not being extracted**
   - Verify URL format in emails
   - Check regex pattern in `extractUrls()`
   - Test with different URL formats

3. **Scans failing**
   - Check if scan API is running
   - Verify URL accessibility
   - Check network connectivity

4. **Email reports not being sent**
   - Verify email service configuration
   - Check email service provider limits
   - Verify recipient email addresses

### Debug Mode

Enable debug logging by adding to your environment:
```bash
DEBUG_EMAIL_SCAN=true
```

## Support

For issues or questions:
1. Check server logs
2. Run test scripts
3. Verify configuration
4. Check email service provider documentation
