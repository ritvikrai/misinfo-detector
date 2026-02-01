import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeClaimWithAI(claim, context = '') {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a fact-checking expert. Analyze claims for accuracy, potential misinformation, and logical fallacies.

Important:
- Be balanced and objective
- Distinguish between facts, opinions, and unverifiable claims
- Note when you're uncertain
- Cite types of sources that could verify the claim

Return JSON:
{
  "claim": "The claim being analyzed",
  "verdict": "True/False/Partially True/Misleading/Unverifiable",
  "confidence": 0.85,
  "explanation": "Detailed explanation",
  "redFlags": ["Misinformation indicator 1"],
  "manipulationTechniques": ["Technique used if any"],
  "factualErrors": ["Specific error if any"],
  "missingContext": "Important context that's omitted",
  "verificationSources": ["Type of source that could verify"],
  "relatedFactChecks": ["Similar claims that have been checked"],
  "recommendation": "What readers should know"
}`,
      },
      {
        role: 'user',
        content: `Analyze this claim for misinformation:\n\nClaim: ${claim}\n\nContext: ${context || 'No additional context provided'}`,
      },
    ],
    max_tokens: 1500,
    temperature: 0.3,
  });

  const content = response.choices[0].message.content;
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {}
  
  return { explanation: content, verdict: 'Unable to analyze' };
}

export async function detectManipulationTechniques(text) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Identify manipulation and propaganda techniques in text. Return JSON:
{
  "techniques": [
    {"name": "Technique name", "example": "Quote from text", "explanation": "How it manipulates"}
  ],
  "emotionalAppeals": ["Type of emotional appeal"],
  "logicalFallacies": ["Fallacy name"],
  "overallManipulationScore": 0.7
}`,
      },
      {
        role: 'user',
        content: text,
      },
    ],
    max_tokens: 800,
  });

  const content = response.choices[0].message.content;
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {}
  
  return { techniques: [], overallManipulationScore: 0 };
}
