import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { saveScanResult } from '@/lib/firebaseService';

export async function POST(request: Request) {
  try {
    const { url, userId } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    let targetUrl = url;
    if (!targetUrl.startsWith('http')) {
      targetUrl = `https://${targetUrl}`;
    }

    const vulnerabilities = [];
    let score = 100;

    // 1. Basic Request & Security Headers
    try {
      const response = await axios.get(targetUrl, { timeout: 10000, validateStatus: () => true });
      const headers = response.headers;

      const missingHeaders = [];
      if (!headers['x-frame-options']) missingHeaders.push('X-Frame-Options');
      if (!headers['x-content-type-options']) missingHeaders.push('X-Content-Type-Options');
      if (!headers['strict-transport-security'] && targetUrl.startsWith('https')) {
        missingHeaders.push('Strict-Transport-Security');
      }

      if (missingHeaders.length > 0) {
        vulnerabilities.push({
          type: 'Missing Security Headers',
          severity: 'Low',
          description: `The following security headers are missing: ${missingHeaders.join(', ')}.`,
          recommendation: 'Configure your web server to include these security headers.'
        });
        score -= (missingHeaders.length * 2);
      }

      // Check for exposed server info
      if (headers['server'] || headers['x-powered-by']) {
        vulnerabilities.push({
          type: 'Information Disclosure',
          severity: 'Low',
          description: `Server or technology stack information is exposed in headers.`,
          recommendation: 'Remove or obfuscate Server and X-Powered-By headers.'
        });
        score -= 5;
      }

      // 2. Simple XSS Form Check
      const $ = cheerio.load(response.data);
      const forms = $('form');
      if (forms.length > 0) {
        vulnerabilities.push({
          type: 'Potential XSS Vector (Forms)',
          severity: 'Medium',
          description: `Found ${forms.length} forms on the page. Forms can be vectors for Cross-Site Scripting if input is not sanitized.`,
          recommendation: 'Ensure all user input is sanitized before rendering on the page and validate input on the server.'
        });
        score -= 10;
      }

      // 3. Simple SQLi parameter check
      const urlObj = new URL(targetUrl);
      if (urlObj.searchParams.toString().length > 0) {
        vulnerabilities.push({
          type: 'Potential SQLi Vector (URL Parameters)',
          severity: 'Medium',
          description: 'URL contains query parameters which could be tested for SQL injection.',
          recommendation: 'Use prepared statements or parameterized queries for all database interactions.'
        });
        score -= 10;
      }

    } catch (err: any) {
      return NextResponse.json({ error: `Failed to connect to the target URL: ${err.message}` }, { status: 400 });
    }

    // Ensure score is within 0-100 bounds
    score = Math.max(0, Math.min(100, score));

    // Save result to Supabase if possible (gracefully ignore errors as per COMPLETION_STATUS)
    await saveScanResult(targetUrl, score, vulnerabilities, userId);

    return NextResponse.json({
      url: targetUrl,
      score,
      vulnerabilities
    });

  } catch (error: any) {
    console.error('Scan error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
