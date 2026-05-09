import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

function generateEmailHtml(url: string, score: number, vulnerabilities: any[]): string {
  const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F';
  const color = score >= 90 ? '#16a34a' : score >= 70 ? '#d97706' : '#dc2626';

  let vulnsHtml = '';
  if (vulnerabilities.length === 0) {
    vulnsHtml = '<p style="text-align: center; color: #6b7280; margin: 20px 0;">No vulnerabilities detected!</p>';
  } else {
    vulnerabilities.forEach((v) => {
      let badgeColor = '#6b7280';
      const severity = (v.severity || 'LOW').toUpperCase();
      if (severity === 'CRITICAL') badgeColor = '#dc2626';
      if (severity === 'HIGH') badgeColor = '#ea580c';
      if (severity === 'MEDIUM') badgeColor = '#d97706';
      if (severity === 'LOW') badgeColor = '#65a30d';

      vulnsHtml += '<div style="border-left: 4px solid ' + badgeColor + '; padding: 15px; margin: 15px 0; background: #f9fafb; border-radius: 0 8px 8px 0;">';
      vulnsHtml += '<div style="margin-bottom: 8px;">';
      vulnsHtml += '<span style="display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-right: 10px; background-color: ' + badgeColor + '; color: white;">' + severity + '</span>';
      vulnsHtml += '<span style="font-weight: 600; color: #1f2937;">' + (v.type || v.name || 'Unknown') + '</span>';
      vulnsHtml += '</div>';
      vulnsHtml += '<div style="color: #6b7280; margin: 5px 0;">' + (v.description || '') + '</div>';
      vulnsHtml += '<div style="font-family: monospace; background: #f3f4f6; padding: 8px 12px; border-radius: 6px; font-size: 14px; color: #374151;">Location: ' + (v.location || 'N/A') + '</div>';
      vulnsHtml += '</div>';
    });
  }

  const html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>'
    + 'body{font-family:-apple-system,sans-serif;line-height:1.6;color:#333;max-width:800px;margin:0 auto;padding:20px;background-color:#f8fafc;}'
    + '.header{background:linear-gradient(135deg,#2563eb 0%,#4f46e5 100%);color:white;padding:30px;border-radius:12px;text-align:center;margin-bottom:30px;}'
    + '.card{background:white;border-radius:12px;padding:25px;margin-bottom:25px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);}'
    + '</style></head><body>'
    + '<div class="header">'
    + '<h1 style="margin:0;font-size:28px;">ThreatLens Security Report</h1>'
    + '<p style="margin:10px 0 0 0;opacity:0.9;">Scan Results for ' + url + '</p>'
    + '<p style="margin:5px 0 0 0;opacity:0.8;">Date: ' + new Date().toLocaleString() + '</p>'
    + '</div>'
    + '<div class="card">'
    + '<h2 style="margin-top:0;color:#1f2937;">Security Score</h2>'
    + '<div style="display:flex;align-items:center;justify-content:center;margin:20px 0;">'
    + '<div style="width:120px;height:120px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:bold;color:white;background:' + color + ';margin-right:20px;">' + score + '</div>'
    + '<div><div style="font-size:24px;font-weight:bold;color:#1f2937;">Grade: ' + grade + '</div></div>'
    + '</div></div>'
    + '<div class="card">'
    + '<h2 style="margin-top:0;color:#1f2937;">Vulnerabilities Found (' + vulnerabilities.length + ')</h2>'
    + vulnsHtml
    + '</div>'
    + '<div style="text-align:center;color:#6b7280;font-size:14px;margin-top:30px;"><p>This is an automated security report from ThreatLens.</p></div>'
    + '</body></html>';

  return html;
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
      console.log('--- EMAIL MOCK (No SMTP credentials in .env.local) ---');
      console.log('To: ' + receiverEmail);
      console.log('Subject: ThreatLens Security Report - ' + url);
      console.log('Score: ' + score + ', Vulns: ' + vulnerabilities.length);
      console.log('------------------------------------------------------');
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
      subject: 'ThreatLens Security Report - ' + url,
      html: htmlContent,
    });

    return NextResponse.json({ success: true, message: 'Email sent successfully!' });

  } catch (error: any) {
    console.error('Email sending error:', error);
    return NextResponse.json({ error: 'Failed to send email: ' + (error.message || 'Unknown error') }, { status: 500 });
  }
}
