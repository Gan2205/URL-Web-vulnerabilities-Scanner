#!/usr/bin/env node

/**
 * Send Sample Email for Scheduled Scan Report
 * This script generates and sends a sample email report
 */

const { EmailService } = require('./src/lib/emailService');

async function sendSampleEmail() {
  console.log('📧 Generating sample scheduled scan report email...');
  
  // Sample scan report data
  const sampleReport = {
    url: 'https://example.com',
    scanName: 'Weekly Security Check',
    timestamp: new Date().toISOString(),
    vulnerabilities: [
      {
        type: 'Cross-Site Scripting (XSS)',
        severity: 'high',
        description: 'Reflected XSS vulnerability found in search parameter',
        location: 'https://example.com/search?q=<script>alert(1)</script>'
      },
      {
        type: 'SQL Injection',
        severity: 'critical',
        description: 'SQL injection vulnerability in login form',
        location: 'https://example.com/login'
      },
      {
        type: 'Insecure Direct Object Reference',
        severity: 'medium',
        description: 'User can access other users\' data by modifying URL parameters',
        location: 'https://example.com/profile/123'
      },
      {
        type: 'Missing Security Headers',
        severity: 'low',
        description: 'Missing X-Frame-Options header',
        location: 'https://example.com'
      },
      {
        type: 'Information Disclosure',
        severity: 'low',
        description: 'Server version information exposed in response headers',
        location: 'https://example.com'
      }
    ],
    summary: {
      total: 5,
      critical: 1,
      high: 1,
      medium: 1,
      low: 2
    },
    securityScore: {
      score: 65,
      grade: 'D'
    },
    certificateInfo: {
      issuer: 'Let\'s Encrypt',
      validFrom: '2024-01-15T00:00:00.000Z',
      validTo: '2024-04-15T23:59:59.000Z',
      isValid: true,
      daysUntilExpiry: 45
    }
  };
  
  const testEmail = 'test@example.com';
  
  try {
    console.log('📊 Sample Report Data:');
    console.log(`   URL: ${sampleReport.url}`);
    console.log(`   Scan Name: ${sampleReport.scanName}`);
    console.log(`   Vulnerabilities: ${sampleReport.summary.total} found`);
    console.log(`   Security Score: ${sampleReport.securityScore.score}/100 (${sampleReport.securityScore.grade})`);
    console.log(`   Critical: ${sampleReport.summary.critical}, High: ${sampleReport.summary.high}, Medium: ${sampleReport.summary.medium}, Low: ${sampleReport.summary.low}`);
    
    console.log('\n📧 Sending sample email...');
    
    const emailSent = await EmailService.sendScanReport(testEmail, sampleReport);
    
    if (emailSent) {
      console.log('✅ Sample email sent successfully!');
      console.log('📄 Check the console output above for the email content.');
    } else {
      console.log('❌ Failed to send sample email');
    }
    
  } catch (error) {
    console.error('❌ Error sending sample email:', error);
  }
}

// Run the sample email
sendSampleEmail();
