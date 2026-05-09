import { NextResponse } from 'next/server';

function analyzeUrlHeuristics(url: string) {
  let score = 0;
  let riskFactors = [];
  
  try {
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname.toLowerCase();
    const path = parsedUrl.pathname.toLowerCase();

    // 1. IP Address instead of domain name
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(domain)) {
      score += 40;
      riskFactors.push('Uses IP address instead of domain');
    }

    // 2. Length of URL
    if (url.length > 75) {
      score += 15;
      riskFactors.push('Suspiciously long URL');
    }

    // 3. Number of dots in domain
    const dots = (domain.match(/\./g) || []).length;
    if (dots > 3) {
      score += 20;
      riskFactors.push('Multiple subdomains detected');
    }

    // 4. Suspicious keywords
    const suspiciousWords = ['login', 'secure', 'account', 'update', 'verify', 'bank', 'paypal', 'support', 'service'];
    const foundWords = suspiciousWords.filter(word => url.toLowerCase().includes(word));
    if (foundWords.length > 0) {
      score += (foundWords.length * 15);
      riskFactors.push(`Contains suspicious keywords: ${foundWords.join(', ')}`);
    }

    // 5. Use of special characters in domain (like dash)
    if (domain.includes('-')) {
      score += 10;
      riskFactors.push('Contains dashes in domain name');
    }

    // 6. Check for HTTPS
    if (parsedUrl.protocol !== 'https:') {
      score += 25;
      riskFactors.push('Does not use HTTPS');
    }

  } catch (e) {
    // If URL is invalid, mark as highly suspicious
    score += 80;
    riskFactors.push('Malformed URL structure');
  }

  // Cap score at 99
  const finalProbability = Math.min(score, 99) / 100;
  
  return {
    probability: finalProbability,
    is_phishing: finalProbability > 0.5,
    confidence: finalProbability > 0.5 ? finalProbability : (1 - finalProbability),
    risk_level: finalProbability > 0.7 ? 'High' : finalProbability > 0.3 ? 'Medium' : 'Low',
    factors: riskFactors
  };
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
      // First try to hit the Python ML backend if it's running
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
        signal: AbortSignal.timeout(2000), // Short timeout so it falls back quickly
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch (err: any) {
      // Python backend is not running, fallback to built-in heuristics silently
    }

    // --- Node.js Heuristic Fallback ---
    const analysis = analyzeUrlHeuristics(url);

    return NextResponse.json({
      url,
      is_phishing: analysis.is_phishing,
      confidence: analysis.confidence,
      probability: analysis.probability,
      risk_level: analysis.risk_level,
      _note: 'Generated using internal heuristic engine (ML backend offline)'
    });

  } catch (error: any) {
    console.error('Phishing API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
