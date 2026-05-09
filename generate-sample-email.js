#!/usr/bin/env node

/**
 * Generate Sample Email for Scheduled Scan Report
 * This script generates a sample email report and displays it
 */

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

// Generate HTML email content
function generateEmailHTML(report) {
  const severityColors = {
    critical: '#dc2626',
    high: '#ea580c',
    medium: '#d97706',
    low: '#65a30d'
  };

  const severityIcons = {
    critical: '🔴',
    high: '🟠',
    medium: '🟡',
    low: '🟢'
  };

  const getSeverityColor = (severity) => severityColors[severity] || '#6b7280';
  const getSeverityIcon = (severity) => severityIcons[severity] || '⚪';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ThreatLens Security Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 16px;
        }
        .summary-card {
            background: white;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 25px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .score-display {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 20px 0;
        }
        .score-circle {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            font-weight: bold;
            color: white;
            margin-right: 20px;
        }
        .score-grade {
            font-size: 48px;
            font-weight: 900;
        }
        .vulnerability-counts {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        .count-item {
            text-align: center;
            padding: 15px;
            border-radius: 8px;
            font-weight: 600;
        }
        .critical { background-color: #fef2f2; color: #dc2626; }
        .high { background-color: #fff7ed; color: #ea580c; }
        .medium { background-color: #fffbeb; color: #d97706; }
        .low { background-color: #f0fdf4; color: #65a30d; }
        .vulnerabilities {
            background: white;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 25px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .vulnerability-item {
            border-left: 4px solid #e5e7eb;
            padding: 15px;
            margin: 15px 0;
            background: #f9fafb;
            border-radius: 0 8px 8px 0;
        }
        .vulnerability-header {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
        }
        .severity-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            margin-right: 10px;
        }
        .vulnerability-type {
            font-weight: 600;
            color: #1f2937;
        }
        .vulnerability-description {
            color: #6b7280;
            margin: 5px 0;
        }
        .vulnerability-location {
            font-family: 'Courier New', monospace;
            background: #f3f4f6;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 14px;
            color: #374151;
            word-break: break-all;
        }
        .certificate-info {
            background: white;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 25px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .footer {
            text-align: center;
            color: #6b7280;
            font-size: 14px;
            margin-top: 30px;
            padding: 20px;
            border-top: 1px solid #e5e7eb;
        }
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 10px 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🛡️ ThreatLens Security Report</h1>
        <p>Scheduled Scan Results for ${report.url}</p>
        <p>Scan: ${report.scanName} • ${new Date(report.timestamp).toLocaleString()}</p>
    </div>

    <div class="summary-card">
        <h2 style="margin-top: 0; color: #1f2937;">Security Overview</h2>
        <div class="score-display">
            <div class="score-circle" style="background: ${getSeverityColor(report.securityScore.grade === 'A' ? 'low' : report.securityScore.grade === 'B' ? 'medium' : report.securityScore.grade === 'C' ? 'high' : 'critical')}">
                <div class="score-grade">${report.securityScore.score}</div>
            </div>
            <div>
                <div style="font-size: 24px; font-weight: bold; color: #1f2937;">Grade: ${report.securityScore.grade}</div>
                <div style="color: #6b7280; margin-top: 5px;">Security Score</div>
            </div>
        </div>
        
        <div class="vulnerability-counts">
            <div class="count-item critical">
                <div style="font-size: 24px; font-weight: bold;">${report.summary.critical}</div>
                <div>Critical</div>
            </div>
            <div class="count-item high">
                <div style="font-size: 24px; font-weight: bold;">${report.summary.high}</div>
                <div>High</div>
            </div>
            <div class="count-item medium">
                <div style="font-size: 24px; font-weight: bold;">${report.summary.medium}</div>
                <div>Medium</div>
            </div>
            <div class="count-item low">
                <div style="font-size: 24px; font-weight: bold;">${report.summary.low}</div>
                <div>Low</div>
            </div>
        </div>
    </div>

    <div class="vulnerabilities">
        <h2 style="margin-top: 0; color: #1f2937;">Vulnerabilities Found (${report.summary.total})</h2>
        ${report.vulnerabilities.map(vuln => `
            <div class="vulnerability-item" style="border-left-color: ${getSeverityColor(vuln.severity)};">
                <div class="vulnerability-header">
                    <span class="severity-badge" style="background-color: ${getSeverityColor(vuln.severity)}; color: white;">
                        ${getSeverityIcon(vuln.severity)} ${vuln.severity.toUpperCase()}
                    </span>
                    <span class="vulnerability-type">${vuln.type}</span>
                </div>
                <div class="vulnerability-description">${vuln.description}</div>
                <div class="vulnerability-location">${vuln.location}</div>
            </div>
        `).join('')}
    </div>

    ${report.certificateInfo ? `
    <div class="certificate-info">
        <h2 style="margin-top: 0; color: #1f2937;">SSL Certificate Status</h2>
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
            <span style="font-size: 24px; margin-right: 10px;">${report.certificateInfo.isValid ? '🔒' : '🔓'}</span>
            <div>
                <div style="font-weight: 600; color: #1f2937;">${report.certificateInfo.isValid ? 'Valid Certificate' : 'Invalid Certificate'}</div>
                <div style="color: #6b7280;">Issued by: ${report.certificateInfo.issuer}</div>
            </div>
        </div>
        <div style="color: #6b7280; font-size: 14px;">
            <div>Valid from: ${new Date(report.certificateInfo.validFrom).toLocaleDateString()}</div>
            <div>Valid until: ${new Date(report.certificateInfo.validTo).toLocaleDateString()}</div>
            <div>Days until expiry: ${report.certificateInfo.daysUntilExpiry}</div>
        </div>
    </div>
    ` : ''}

    <div style="text-align: center; margin: 30px 0;">
        <a href="https://threatlens.app" class="btn">View Full Report</a>
        <a href="https://threatlens.app/scheduled-scans" class="btn">Manage Schedules</a>
    </div>

    <div class="footer">
        <p>This is an automated security report from ThreatLens.</p>
        <p>For questions or support, contact us at support@threatlens.app</p>
        <p>© 2024 ThreatLens. All rights reserved.</p>
    </div>
</body>
</html>
  `.trim();
}

// Generate plain text email content
function generateEmailText(report) {
  const severityIcons = {
    critical: '🔴',
    high: '🟠',
    medium: '🟡',
    low: '🟢'
  };

  const getSeverityIcon = (severity) => severityIcons[severity] || '⚪';

  let text = `
🛡️ THREATLENS SECURITY REPORT
================================

URL: ${report.url}
Scan: ${report.scanName}
Date: ${new Date(report.timestamp).toLocaleString()}

SECURITY OVERVIEW
=================
Security Score: ${report.securityScore.score}/100 (Grade: ${report.securityScore.grade})

Vulnerabilities Found: ${report.summary.total}
- Critical: ${report.summary.critical}
- High: ${report.summary.high}
- Medium: ${report.summary.medium}
- Low: ${report.summary.low}

VULNERABILITIES
===============
`;

  report.vulnerabilities.forEach((vuln, index) => {
    text += `
${index + 1}. ${getSeverityIcon(vuln.severity)} ${vuln.type.toUpperCase()} (${vuln.severity.toUpperCase()})
   Description: ${vuln.description}
   Location: ${vuln.location}
`;
  });

  if (report.certificateInfo) {
    text += `
SSL CERTIFICATE
===============
Status: ${report.certificateInfo.isValid ? 'Valid' : 'Invalid'}
Issuer: ${report.certificateInfo.issuer}
Valid from: ${new Date(report.certificateInfo.validFrom).toLocaleDateString()}
Valid until: ${new Date(report.certificateInfo.validTo).toLocaleDateString()}
Days until expiry: ${report.certificateInfo.daysUntilExpiry}
`;
  }

  text += `
ACTIONS REQUIRED
================
1. Review critical and high severity vulnerabilities immediately
2. Implement security patches and fixes
3. Consider scheduling more frequent scans
4. Review security headers and configurations

For detailed analysis and remediation steps, visit: https://threatlens.app

---
This is an automated security report from ThreatLens.
For support: support@threatlens.app
© 2024 ThreatLens. All rights reserved.
`;

  return text;
}

// Generate and display the sample email
console.log('📧 SAMPLE SCHEDULED SCAN REPORT EMAIL');
console.log('=====================================\n');

console.log('📊 Report Summary:');
console.log(`   URL: ${sampleReport.url}`);
console.log(`   Scan Name: ${sampleReport.scanName}`);
console.log(`   Vulnerabilities: ${sampleReport.summary.total} found`);
console.log(`   Security Score: ${sampleReport.securityScore.score}/100 (${sampleReport.securityScore.grade})`);
console.log(`   Critical: ${sampleReport.summary.critical}, High: ${sampleReport.summary.high}, Medium: ${sampleReport.summary.medium}, Low: ${sampleReport.summary.low}\n`);

console.log('📄 PLAIN TEXT EMAIL:');
console.log('====================');
console.log(generateEmailText(sampleReport));

console.log('\n\n📄 HTML EMAIL:');
console.log('==============');
console.log('(HTML content generated - ' + generateEmailHTML(sampleReport).length + ' characters)');

// Save HTML to file for viewing
const fs = require('fs');
fs.writeFileSync('sample-email.html', generateEmailHTML(sampleReport));
console.log('\n💾 HTML email saved to: sample-email.html');
console.log('   Open this file in a web browser to view the formatted email.');

console.log('\n✅ Sample email generation complete!');
