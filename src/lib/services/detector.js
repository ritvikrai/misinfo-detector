// Misinformation detection patterns and indicators

export const MISINFORMATION_INDICATORS = {
  urgency: {
    patterns: ['breaking', 'urgent', 'share before deleted', 'they don\'t want you to know', 'banned'],
    weight: 0.3,
  },
  absoluteLanguage: {
    patterns: ['always', 'never', 'everyone knows', 'no one', 'completely', '100%', 'proven'],
    weight: 0.2,
  },
  emotionalManipulation: {
    patterns: ['shocking', 'unbelievable', 'you won\'t believe', 'outrageous', 'disgusting'],
    weight: 0.25,
  },
  conspiracyMarkers: {
    patterns: ['cover up', 'mainstream media won\'t', 'deep state', 'they are hiding', 'wake up'],
    weight: 0.4,
  },
  pseudoscience: {
    patterns: ['miracle cure', 'doctors hate', 'big pharma', 'natural remedy they don\'t want'],
    weight: 0.35,
  },
  anonymousSources: {
    patterns: ['someone said', 'i heard', 'people are saying', 'sources say', 'insider reveals'],
    weight: 0.25,
  },
};

export const LOGICAL_FALLACIES = [
  { name: 'Ad Hominem', pattern: /attack.*person|character.*not.*argument/i },
  { name: 'Straw Man', pattern: /misrepresent|distort.*position/i },
  { name: 'False Dilemma', pattern: /only two options|either.*or/i },
  { name: 'Appeal to Authority', pattern: /expert says|doctor recommends/i },
  { name: 'Slippery Slope', pattern: /will lead to|if we allow/i },
  { name: 'Cherry Picking', pattern: /only.*example|ignores/i },
];

export function analyzeMisinformationIndicators(text) {
  const normalizedText = text.toLowerCase();
  const indicators = [];
  let totalScore = 0;

  for (const [name, config] of Object.entries(MISINFORMATION_INDICATORS)) {
    const matches = config.patterns.filter(p => normalizedText.includes(p.toLowerCase()));
    if (matches.length > 0) {
      indicators.push({
        type: name,
        matches,
        weight: config.weight,
      });
      totalScore += config.weight * (matches.length / config.patterns.length);
    }
  }

  const fallacies = LOGICAL_FALLACIES
    .filter(f => f.pattern.test(text))
    .map(f => f.name);

  return {
    indicators,
    fallacies,
    riskScore: Math.min(totalScore, 1),
    riskLevel: totalScore > 0.5 ? 'high' : totalScore > 0.25 ? 'medium' : 'low',
  };
}

export function checkSourceCredibility(url) {
  // In production, this would check against a database of known
  // misinformation sources and credibility ratings
  const knownReliable = ['reuters.com', 'apnews.com', 'bbc.com', 'npr.org'];
  const knownUnreliable = ['example-fake-news.com']; // Placeholder

  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    
    if (knownReliable.some(r => hostname.includes(r))) {
      return { credibility: 'high', note: 'Known reliable source' };
    }
    if (knownUnreliable.some(u => hostname.includes(u))) {
      return { credibility: 'low', note: 'Known unreliable source' };
    }
    
    return { credibility: 'unknown', note: 'Source credibility not verified' };
  } catch (e) {
    return { credibility: 'unknown', note: 'Could not parse URL' };
  }
}
