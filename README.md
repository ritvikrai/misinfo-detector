# Misinformation Detector

AI-powered fact-checking and misinformation detection.

## Features

- 🔍 Analyze claims for accuracy
- 🚩 Detect manipulation techniques
- 📊 Credibility scoring
- 📚 Source verification
- 🧠 Logical fallacy detection

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **AI**: OpenAI GPT-4o
- **Styling**: Tailwind CSS
- **Storage**: File-based JSON

## Getting Started

```bash
npm install
cp .env.example .env  # Add your OPENAI_API_KEY
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/check` | Check a claim |
| GET | `/api/history` | Get check history |

## Demo Mode

Works without API key using pattern-based heuristics.

## Disclaimer

This tool assists with fact-checking but should not be the sole source of truth. Always verify with multiple authoritative sources.

## License

MIT
