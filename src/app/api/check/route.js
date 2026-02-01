import { NextResponse } from 'next/server';
import { analyzeClaimWithAI } from '@/lib/services/openai';
import { analyzeMisinformationIndicators, checkSourceCredibility } from '@/lib/services/detector';
import { saveCheck, searchChecks } from '@/lib/services/storage';

export async function POST(request) {
  try {
    const { claim, url, context } = await request.json();

    if (!claim || claim.length < 10) {
      return NextResponse.json(
        { error: 'Please provide a claim to check (at least 10 characters)' },
        { status: 400 }
      );
    }

    // Check if we've analyzed this before
    const existing = await searchChecks(claim);
    if (existing.length > 0) {
      const match = existing.find(e => 
        e.claim.toLowerCase() === claim.toLowerCase()
      );
      if (match) {
        return NextResponse.json({
          result: match,
          cached: true,
        });
      }
    }

    // Run heuristic analysis
    const indicators = analyzeMisinformationIndicators(claim);
    
    // Check source if URL provided
    let sourceCredibility = null;
    if (url) {
      sourceCredibility = checkSourceCredibility(url);
    }

    let analysis;

    if (process.env.OPENAI_API_KEY) {
      analysis = await analyzeClaimWithAI(claim, context);
    } else {
      // Heuristic-only analysis
      analysis = {
        claim,
        verdict: indicators.riskLevel === 'high' ? 'Likely Misleading' : 
                 indicators.riskLevel === 'medium' ? 'Needs Verification' : 'Possibly Accurate',
        confidence: 0.5,
        explanation: `This claim contains ${indicators.indicators.length} potential misinformation indicators.`,
        redFlags: indicators.indicators.map(i => `${i.type}: ${i.matches.join(', ')}`),
        manipulationTechniques: [],
        factualErrors: [],
        missingContext: 'Full context not available without AI analysis',
        verificationSources: ['Independent news sources', 'Official statements', 'Academic research'],
        recommendation: indicators.riskLevel === 'high' 
          ? 'Exercise caution and verify with trusted sources'
          : 'Consider checking multiple sources',
        note: 'Heuristic analysis - Add OPENAI_API_KEY for AI-powered fact-checking',
      };
    }

    // Combine results
    const result = {
      ...analysis,
      indicators,
      sourceCredibility,
      url,
    };

    // Save the check
    const saved = await saveCheck(result);

    return NextResponse.json({
      success: true,
      result: saved,
    });
  } catch (error) {
    console.error('Check error:', error);
    return NextResponse.json(
      { error: 'Failed to check claim', details: error.message },
      { status: 500 }
    );
  }
}
