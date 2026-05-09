import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

function generateEmailHtml(url: string, score: number, vulnerabilities: any[]): string {
  const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F';
  const scoreColor = score >= 90 ? '#16a34a' : score >= 70 ? '#d97706' : '#dc2626';
  const scoreBg = score >= 90 ? '#f0fdf4' : score >= 70 ? '#fffbeb' : '#fef2f2';
  const scoreLabel = score >= 90 ? 'Excellent' : score >= 80 ? 'Good' : score >= 70 ? 'Fair' : score >= 60 ? 'Poor' : 'Critical';
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  // Build vulnerability rows
  let vulnsHtml = '';
  if (vulnerabilities.length === 0) {
    vulnsHtml = `
      <tr>
        <td style="padding: 30px; text-align: center;">
          <div style="width: 60px; height: 60px; background: #dcfce7; border-radius: 50%; margin: 0 auto 16px; line-height: 60px; font-size: 28px;">✓</div>
          <p style="margin: 0; font-size: 16px; font-weight: 600; color: #16a34a;">No Vulnerabilities Detected</p>
          <p style="margin: 8px 0 0; font-size: 14px; color: #6b7280;">This URL passed all security checks.</p>
        </td>
      </tr>`;
  } else {
    vulnerabilities.forEach((v, i) => {
      const severity = (v.severity || 'LOW').toUpperCase();
      let badgeColor = '#6b7280';
      let badgeBg = '#f3f4f6';
      let borderColor = '#e5e7eb';
      if (severity === 'CRITICAL') { badgeColor = '#dc2626'; badgeBg = '#fef2f2'; borderColor = '#fca5a5'; }
      else if (severity === 'HIGH') { badgeColor = '#ea580c'; badgeBg = '#fff7ed'; borderColor = '#fdba74'; }
      else if (severity === 'MEDIUM') { badgeColor = '#d97706'; badgeBg = '#fffbeb'; borderColor = '#fcd34d'; }
      else if (severity === 'LOW') { badgeColor = '#16a34a'; badgeBg = '#f0fdf4'; borderColor = '#86efac'; }

      vulnsHtml += `
        <tr>
          <td style="padding: ${i === 0 ? '24px 24px 12px' : '12px 24px'};">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid ${borderColor}; border-left: 4px solid ${badgeColor}; border-radius: 8px; background: ${badgeBg};">
              <tr>
                <td style="padding: 16px 20px;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="padding-bottom: 8px;">
                        <span style="display: inline-block; background: ${badgeColor}; color: white; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 3px 10px; border-radius: 20px;">${severity}</span>
                        &nbsp;&nbsp;
                        <span style="font-size: 15px; font-weight: 600; color: #111827;">${v.type || v.name || 'Unknown Issue'}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="font-size: 14px; color: #4b5563; line-height: 1.6; padding-bottom: 10px;">${v.description || ''}</td>
                    </tr>
                    ${v.recommendation ? `
                    <tr>
                      <td style="background: white; border-radius: 6px; padding: 10px 14px; font-size: 13px; color: #374151; border: 1px solid ${borderColor};">
                        <strong style="color: ${badgeColor};">💡 Fix:</strong> ${v.recommendation}
                      </td>
                    </tr>` : ''}
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>`;
    });

    // Add final padding row
    vulnsHtml += `<tr><td style="padding-bottom: 8px;"></td></tr>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ThreatLens Security Report</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f1f5f9; padding: 32px 16px;">
    <tr>
      <td align="center">

        <!-- Email container -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%;">

          <!-- ====== HEADER ====== -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e40af 0%, #4f46e5 100%); border-radius: 16px 16px 0 0; padding: 40px 32px; text-align: center;">
              <p style="margin: 0 0 6px; font-size: 13px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #bfdbfe;">Security Analysis</p>
              <h1 style="margin: 0 0 16px; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em;">ThreatLens Report</h1>
              <p style="margin: 0 0 6px; font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #93c5fd;">Scanned URL</p>
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0 0 12px;">
                <tr>
                  <td style="background: #ffffff; border-radius: 8px; padding: 12px 18px;">
                    <p style="margin: 0; font-size: 15px; font-weight: 700; color: #1e40af !important; word-break: break-all; text-decoration: none;">&#128279; <span style="color: #1e40af;">${url}</span></p>
                  </td>
                </tr>
              </table>
              <p style="margin: 0; font-size: 12px; color: #bfdbfe;">&#128197; ${date}</p>
            </td>
          </tr>

          <!-- ====== SCORE CARD ====== -->
          <tr>
            <td style="background: #ffffff; padding: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 20px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #6b7280;">Security Score</p>
                    <!-- Score circle using table -->
                    <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 20px;">
                      <tr>
                        <td width="140" height="140" style="background: ${scoreColor}; border-radius: 50%; text-align: center; vertical-align: middle; width: 140px; height: 140px; border-radius: 70px;">
                          <span style="font-size: 44px; font-weight: 800; color: white; line-height: 140px; display: block;">${score}</span>
                        </td>
                      </tr>
                    </table>
                    <!-- Grade badge -->
                    <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 12px;">
                      <tr>
                        <td style="background: ${scoreBg}; border: 2px solid ${scoreColor}; border-radius: 100px; padding: 8px 28px; text-align: center;">
                          <span style="font-size: 22px; font-weight: 800; color: ${scoreColor};">Grade: ${grade}</span>
                        </td>
                      </tr>
                    </table>
                    <p style="margin: 0; font-size: 14px; color: ${scoreColor}; font-weight: 600;">${scoreLabel} Security Posture</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ====== DIVIDER ====== -->
          <tr>
            <td style="background: #ffffff; padding: 0 32px;">
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 0;">
            </td>
          </tr>

          <!-- ====== SUMMARY STATS ====== -->
          <tr>
            <td style="background: #ffffff; padding: 24px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="50%" style="text-align: center; padding: 16px; background: #f8fafc; border-radius: 12px; margin-right: 8px;">
                    <p style="margin: 0; font-size: 32px; font-weight: 800; color: #1e293b;">${vulnerabilities.length}</p>
                    <p style="margin: 4px 0 0; font-size: 13px; color: #64748b; font-weight: 500;">Issues Found</p>
                  </td>
                  <td width="8px"></td>
                  <td width="50%" style="text-align: center; padding: 16px; background: #f8fafc; border-radius: 12px;">
                    <p style="margin: 0; font-size: 32px; font-weight: 800; color: ${scoreColor};">${score}/100</p>
                    <p style="margin: 4px 0 0; font-size: 13px; color: #64748b; font-weight: 500;">Security Score</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ====== VULNERABILITIES SECTION ====== -->
          <tr>
            <td style="background: #ffffff; border-radius: 0 0 16px 16px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <!-- Section header -->
                <tr>
                  <td style="padding: 0 24px 8px; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 20px 0 0; font-size: 16px; font-weight: 700; color: #111827;">
                      🔍 Vulnerability Details
                      <span style="font-size: 13px; font-weight: 500; color: #6b7280; margin-left: 8px;">(${vulnerabilities.length} found)</span>
                    </p>
                  </td>
                </tr>
                ${vulnsHtml}
              </table>
            </td>
          </tr>

          <!-- ====== FOOTER ====== -->
          <tr>
            <td style="padding: 28px 16px; text-align: center;">
              <p style="margin: 0 0 4px; font-size: 13px; font-weight: 600; color: #475569;">ThreatLens Security</p>
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">This is an automated security report. Do not reply to this email.</p>
              <p style="margin: 12px 0 0; font-size: 11px; color: #cbd5e1;">Generated by ThreatLens Web Vulnerability Scanner</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const receiverEmail = body.receiverEmail;
    const url = body.url;
    const score = body.score || 0;
    const vulnerabilities = body.vulnerabilities || [];

    if (!receiverEmail || !url) {
      return NextResponse.json({ error: 'Receiver email and scan URL are required.' }, { status: 400 });
    }

    const htmlContent = generateEmailHtml(url, score, vulnerabilities);

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const emailFrom = process.env.EMAIL_FROM || 'noreply@threatlens.app';

    if (!smtpUser || !smtpPass) {
      console.log('--- EMAIL MOCK (No SMTP credentials) ---');
      console.log('To: ' + receiverEmail);
      console.log('Score: ' + score + ', Vulns: ' + vulnerabilities.length);
      return NextResponse.json({
        success: true,
        message: 'Email simulated in server console (Add SMTP config to .env.local to send real emails).'
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: '"ThreatLens Security" <' + emailFrom + '>',
      to: receiverEmail,
      subject: `ThreatLens Report: ${score}/100 — ${url}`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true, message: 'Email sent successfully!' });

  } catch (error: any) {
    console.error('Email sending error:', error);
    return NextResponse.json({ error: 'Failed to send email: ' + (error.message || 'Unknown error') }, { status: 500 });
  }
}
