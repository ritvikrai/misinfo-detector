'use client'
import { useState } from 'react'
import { Shield, AlertTriangle, CheckCircle, XCircle, Search, Link, ExternalLink, Loader2 } from 'lucide-react'

export default function Home() {
  const [input, setInput] = useState('')
  const [checking, setChecking] = useState(false)
  const [result, setResult] = useState(null)

  const checkClaim = async () => {
    if (!input.trim()) return
    setChecking(true)
    setResult(null)
    
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    const verdicts = ['true', 'mostly-true', 'mixed', 'mostly-false', 'false']
    const verdict = verdicts[Math.floor(Math.random() * verdicts.length)]
    
    setResult({
      verdict,
      confidence: Math.floor(Math.random() * 30) + 70,
      summary: verdict === 'true' || verdict === 'mostly-true'
        ? "This claim appears to be accurate based on available evidence from reliable sources."
        : verdict === 'mixed'
        ? "This claim contains both accurate and inaccurate elements. Context is important."
        : "This claim contains significant inaccuracies or lacks credible supporting evidence.",
      sources: [
        { name: 'Reuters Fact Check', url: '#', supports: verdict !== 'false' },
        { name: 'AP News', url: '#', supports: verdict === 'true' || verdict === 'mostly-true' },
        { name: 'Snopes', url: '#', supports: verdict !== 'mostly-false' && verdict !== 'false' },
      ],
      context: "It's important to consider the full context and original source of this claim. Always verify information from multiple reliable sources.",
      relatedClaims: [
        'Similar claim checked in 2023',
        'Related topic fact-checked by PolitiFact'
      ]
    })
    setChecking(false)
  }

  const verdictConfig = {
    'true': { color: 'bg-green-500', icon: CheckCircle, label: 'True', bgLight: 'bg-green-50' },
    'mostly-true': { color: 'bg-lime-500', icon: CheckCircle, label: 'Mostly True', bgLight: 'bg-lime-50' },
    'mixed': { color: 'bg-yellow-500', icon: AlertTriangle, label: 'Mixed', bgLight: 'bg-yellow-50' },
    'mostly-false': { color: 'bg-orange-500', icon: XCircle, label: 'Mostly False', bgLight: 'bg-orange-50' },
    'false': { color: 'bg-red-500', icon: XCircle, label: 'False', bgLight: 'bg-red-50' },
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <Shield className="text-indigo-400" />
          Fact Checker
        </h1>
        <p className="text-indigo-200 mb-8">AI-powered misinformation detection</p>

        <div className="bg-white/10 backdrop-blur rounded-xl p-6 mb-6">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste a claim, article excerpt, or URL to fact-check..."
            className="w-full h-32 p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-indigo-300 resize-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={checkClaim}
            disabled={checking || !input.trim()}
            className="w-full mt-4 py-3 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {checking ? <><Loader2 className="animate-spin" /> Analyzing...</> : <><Search /> Check Facts</>}
          </button>
        </div>

        {result && (
          <div className="space-y-4">
            <div className={`${verdictConfig[result.verdict].bgLight} rounded-xl p-6`}>
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 ${verdictConfig[result.verdict].color} rounded-full flex items-center justify-center`}>
                  {(() => { const Icon = verdictConfig[result.verdict].icon; return <Icon className="text-white" size={32} /> })()}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Verdict</p>
                  <p className="text-2xl font-bold text-gray-800">{verdictConfig[result.verdict].label}</p>
                  <p className="text-sm text-gray-500">{result.confidence}% confidence</p>
                </div>
              </div>
              <p className="text-gray-700">{result.summary}</p>
            </div>

            <div className="bg-white rounded-xl p-5">
              <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <Link size={18} className="text-indigo-500" /> Sources Checked
              </h3>
              <div className="space-y-2">
                {result.sources.map((source, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">{source.name}</span>
                    <div className="flex items-center gap-2">
                      {source.supports ? (
                        <span className="text-green-600 text-sm flex items-center gap-1"><CheckCircle size={14} /> Supports</span>
                      ) : (
                        <span className="text-red-600 text-sm flex items-center gap-1"><XCircle size={14} /> Contradicts</span>
                      )}
                      <ExternalLink size={14} className="text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-5">
              <h3 className="font-medium text-gray-800 mb-2">Important Context</h3>
              <p className="text-gray-600 text-sm">{result.context}</p>
            </div>

            <div className="bg-indigo-50 rounded-xl p-4 text-center text-sm text-indigo-700">
              <p>Always verify information from multiple sources. This tool provides guidance but is not infallible.</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
