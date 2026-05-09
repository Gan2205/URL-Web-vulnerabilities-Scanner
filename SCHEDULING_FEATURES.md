# 🕐 ThreatLens Scheduling Features

## Overview

ThreatLens now includes comprehensive scheduling capabilities that allow users to automate security scans at custom intervals. Users can schedule scans to run at random times, weekly, or monthly, with email reports sent to their registered email address.

## 🚀 Features Implemented

### 1. **Database Schema**
- ✅ `scheduled_scans` table with full RLS policies
- ✅ Support for different schedule types (random, weekly, monthly)
- ✅ Email notification preferences
- ✅ Scan execution tracking and history

### 2. **API Endpoints**
- ✅ `GET /api/scheduled-scans` - List all scheduled scans
- ✅ `POST /api/scheduled-scans` - Create new scheduled scan
- ✅ `GET /api/scheduled-scans/[id]` - Get specific scheduled scan
- ✅ `PUT /api/scheduled-scans/[id]` - Update scheduled scan
- ✅ `DELETE /api/scheduled-scans/[id]` - Delete scheduled scan
- ✅ `POST /api/scheduled-scans/[id]/toggle` - Toggle active/inactive
- ✅ `GET /api/scheduler` - Get scheduler status
- ✅ `POST /api/scheduler` - Manage scheduler (start/stop/check)

### 3. **Background Scheduler Service**
- ✅ Automatic execution of due scans
- ✅ Configurable check intervals (default: 5 minutes)
- ✅ Error handling and retry logic
- ✅ Scan result storage and email notifications

### 4. **Email Service**
- ✅ Beautiful HTML email templates
- ✅ Plain text fallback
- ✅ Comprehensive vulnerability reports
- ✅ Security score visualization
- ✅ Professional branding

### 5. **User Interface**
- ✅ Tab-based navigation (Scan, History, Scheduled)
- ✅ Intuitive scheduling form with validation
- ✅ Real-time status updates
- ✅ Easy management of scheduled scans
- ✅ Visual indicators for active/inactive scans

## 📅 Schedule Types

### 🎲 Random Intervals
- **Purpose**: Unpredictable scanning to avoid detection patterns
- **Configuration**: 
  - `minIntervalHours`: Minimum hours between scans (1-168)
  - `maxIntervalHours`: Maximum hours between scans (1-168)
- **Use Case**: Security testing, penetration testing, compliance monitoring

### 📅 Weekly Schedule
- **Purpose**: Regular weekly security assessments
- **Configuration**:
  - `dayOfWeek`: Day of week (0=Sunday, 1=Monday, etc.)
  - `hour`: Hour of day (0-23)
  - `minute`: Minute of hour (0-59)
- **Use Case**: Regular security audits, weekly compliance checks

### 📆 Monthly Schedule
- **Purpose**: Monthly comprehensive security reviews
- **Configuration**:
  - `dayOfMonth`: Day of month (1-31)
  - `hour`: Hour of day (0-23)
  - `minute`: Minute of hour (0-59)
- **Use Case**: Monthly security reports, compliance reviews

## 🔧 Technical Implementation

### Database Schema
```sql
CREATE TABLE scheduled_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  schedule_type VARCHAR(50) NOT NULL CHECK (schedule_type IN ('random', 'weekly', 'monthly')),
  schedule_config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  last_run TIMESTAMP WITH TIME ZONE,
  next_run TIMESTAMP WITH TIME ZONE,
  total_runs INTEGER DEFAULT 0,
  email_notifications BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### API Usage Examples

#### Create Random Schedule
```javascript
const response = await fetch('/api/scheduled-scans', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://example.com',
    name: 'Weekly Security Check',
    schedule_type: 'random',
    schedule_config: {
      minIntervalHours: 24,
      maxIntervalHours: 72
    },
    email_notifications: true
  })
});
```

#### Create Weekly Schedule
```javascript
const response = await fetch('/api/scheduled-scans', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://example.com',
    name: 'Monday Morning Security Scan',
    schedule_type: 'weekly',
    schedule_config: {
      dayOfWeek: 1, // Monday
      hour: 9,      // 9 AM
      minute: 0     // On the hour
    },
    email_notifications: true
  })
});
```

#### Create Monthly Schedule
```javascript
const response = await fetch('/api/scheduled-scans', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://example.com',
    name: 'Monthly Security Audit',
    schedule_type: 'monthly',
    schedule_config: {
      dayOfMonth: 1, // 1st of month
      hour: 10,      // 10 AM
      minute: 30     // 10:30 AM
    },
    email_notifications: true
  })
});
```

## 📧 Email Reports

### Features
- **Professional Design**: Clean, modern HTML template
- **Comprehensive Data**: All vulnerability details and security scores
- **Visual Indicators**: Color-coded severity levels and security grades
- **Responsive**: Works on desktop and mobile devices
- **Accessible**: Proper contrast and semantic HTML

### Email Content
- Scan information (URL, name, timestamp)
- Vulnerability summary with counts by severity
- Security score with visual grade indicator
- Detailed vulnerability list with descriptions
- Professional branding and contact information

## 🚀 Getting Started

### 1. Database Setup
Run the updated schema in your Supabase database:
```bash
# Execute the SQL in supabase-schema.sql
```

### 2. Start the Scheduler
The scheduler service can be started via API:
```javascript
// Start scheduler with 5-minute intervals
await fetch('/api/scheduler', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'start', intervalMinutes: 5 })
});
```

### 3. Create Your First Scheduled Scan
1. Navigate to the "Scheduled" tab in the UI
2. Click "Schedule New Scan"
3. Fill in the URL and scan name
4. Choose your schedule type and configuration
5. Enable email notifications
6. Click "Schedule Scan"

## 🔒 Security Considerations

### Authentication
- All API endpoints require user authentication
- Row Level Security (RLS) ensures users only see their own scans
- Scheduled scans are tied to user accounts

### Rate Limiting
- Built-in delays between scans to prevent abuse
- Configurable intervals to respect target server resources
- Error handling for failed scans

### Email Security
- Email templates are sanitized to prevent XSS
- No sensitive data in email content
- Professional formatting to avoid spam filters

## 📊 Monitoring and Management

### Scheduler Status
Check scheduler status:
```javascript
const response = await fetch('/api/scheduler');
const status = await response.json();
console.log('Scheduler running:', status.data.isRunning);
```

### Manual Trigger
Manually trigger a check for due scans:
```javascript
await fetch('/api/scheduler', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'check' })
});
```

### Scan Management
- View all scheduled scans in the UI
- Toggle active/inactive status
- Update schedule configurations
- Delete unwanted schedules
- Monitor execution history

## 🎯 Use Cases

### 1. **Security Teams**
- Regular vulnerability assessments
- Compliance monitoring
- Security posture tracking

### 2. **DevOps Teams**
- CI/CD pipeline integration
- Infrastructure security monitoring
- Automated security testing

### 3. **Compliance Officers**
- Regular audit preparation
- Regulatory compliance monitoring
- Documentation and reporting

### 4. **Penetration Testers**
- Unpredictable testing schedules
- Long-term security monitoring
- Client reporting automation

## 🔮 Future Enhancements

### Planned Features
- **Custom Time Zones**: Support for different time zones
- **Advanced Scheduling**: Cron-like expressions for complex schedules
- **Team Management**: Shared schedules across team members
- **Integration APIs**: Webhook notifications and third-party integrations
- **Advanced Reporting**: Trend analysis and historical comparisons
- **Mobile App**: Native mobile app for schedule management

### Email Service Integration
- **SendGrid**: Professional email delivery
- **AWS SES**: Scalable email service
- **Mailgun**: Developer-friendly email API
- **SMTP**: Direct SMTP server integration

## 📝 Configuration

### Environment Variables
```bash
# Email service configuration
EMAIL_SERVICE_PROVIDER=sendgrid
EMAIL_API_KEY=your_api_key
EMAIL_FROM=noreply@threatlens.app

# Scheduler configuration
SCHEDULER_INTERVAL_MINUTES=5
SCHEDULER_MAX_CONCURRENT_SCANS=10

# Application configuration
NEXT_PUBLIC_APP_URL=https://threatlens.app
```

## 🆘 Troubleshooting

### Common Issues

#### Scheduler Not Running
- Check if scheduler service is started
- Verify database connection
- Check for error logs

#### Scans Not Executing
- Verify scan is active
- Check next_run timestamp
- Ensure URL is accessible

#### Email Not Sending
- Verify email service configuration
- Check user email preferences
- Review email service logs

#### Database Errors
- Ensure RLS policies are properly configured
- Check user authentication
- Verify table permissions

## 📞 Support

For technical support or feature requests:
- **Documentation**: Check this file and inline code comments
- **Issues**: Report bugs via GitHub issues
- **Features**: Request new features via GitHub discussions

---

**ThreatLens Scheduling System** - Automate your security scanning with professional-grade scheduling and reporting capabilities.
