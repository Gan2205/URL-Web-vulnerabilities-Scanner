import { NextResponse } from 'next/server';
import { getPreviousScans } from '@/lib/firebaseService';

export async function POST(request: Request) {
  try {
    const { url, userId } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const { data: scans, error } = await getPreviousScans(url, userId);

    if (error || !scans || scans.length < 2) {
      return NextResponse.json({ 
        success: false, 
        message: 'Not enough scan history to compare.' 
      });
    }

    const currentScan = scans[0];
    const previousScan = scans[1];

    let oldScore = previousScan.score;
    let newScore = currentScan.score;
    let change = newScore - oldScore;
    let changePercentage = oldScore === 0 ? 0 : (change / oldScore) * 100;

    const currentVulns = JSON.parse(currentScan.vulnerabilities || '[]');
    const previousVulns = JSON.parse(previousScan.vulnerabilities || '[]');

    return NextResponse.json({
      success: true,
      data: {
        url,
        totalScans: scans.length,
        scoreChanges: {
          oldScore,
          newScore,
          change,
          changePercentage: parseFloat(changePercentage.toFixed(2))
        },
        vulnerabilityChanges: {
          fixed: Math.max(0, previousVulns.length - currentVulns.length),
          introduced: Math.max(0, currentVulns.length - previousVulns.length),
          currentTotal: currentVulns.length
        },
        trends: {
          scoreTrend: change > 0 ? 'improving' : change < 0 ? 'degrading' : 'stable'
        }
      }
    });

  } catch (error: any) {
    console.error('Comparison error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
