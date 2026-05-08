import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BrainCircuit, Send, Sparkles, ChevronRight, Check, X, AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { analyzeDecision } from '@/lib/gemini'
import Navbar from '@/components/layout/Navbar'
import DecisionTree from '@/components/three/DecisionTree'

const riskIcons = {
  Low: CheckCircle2,
  Medium: AlertTriangle,
  High: X,
}

export default function DecisionAnalyser() {
  const [decisions, setDecisions] = useState([])
  const [selectedDecision, setSelectedDecision] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState('list') // 'list' or 'analyze'

  useEffect(() => {
    loadDecisions()
    
    const handleUpdate = () => {
      loadDecisions()
    }
    window.addEventListener('decisionsUpdated', handleUpdate)
    
    return () => {
      window.removeEventListener('decisionsUpdated', handleUpdate)
    }
  }, [])

  const loadDecisions = () => {
    const stored = localStorage.getItem('lifeosDecisionsData')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        // Get decisions from both inbox and history for analysis
        const allDecisions = [
          ...(data.inbox || []).map(d => ({ ...d, source: 'inbox' })),
          ...(data.history || []).map(d => ({ ...d, source: 'history' }))
        ]
        setDecisions(allDecisions)
      } catch (error) {
        console.error('Error loading decisions:', error)
      }
    }
  }

  const handleAnalyzeDecision = async (decision) => {
    setSelectedDecision(decision)
    setAnalysis(null)
    setLoading(true)
    setViewMode('analyze')
    
    try {
      const decisionText = decision.title || decision.situation || ''
      const options = decision.options || ''
      const fullText = `${decisionText}${options ? `. ${options}` : ''}`
      
      const result = await analyzeDecision(fullText, decision.category || 'general', decision.urgency || 'medium')
      setAnalysis(result)
    } catch (error) {
      console.error('Error analyzing decision:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBackToList = () => {
    setViewMode('list')
    setSelectedDecision(null)
    setAnalysis(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="w-16 h-16 rounded-2xl bg-brand-purple/10 flex items-center justify-center mx-auto mb-4">
              <BrainCircuit className="w-8 h-8 text-brand-purple" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Decision Analyser</h1>
            <p className="text-muted-foreground">Review and analyze your past decisions with AI insights</p>
          </motion.div>

          <AnimatePresence mode="wait">
            {viewMode === 'list' ? (
              // List View
              <motion.div
                key="list"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="space-y-4"
              >
                {decisions.length === 0 ? (
                  <div className="text-center py-12">
                    <BrainCircuit className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">No decisions yet. Add some decisions to analyze!</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {decisions.map((decision) => (
                      <motion.button
                        key={decision.id}
                        onClick={() => handleAnalyzeDecision(decision)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        className="text-left p-4 rounded-xl border border-border bg-card hover:border-brand-purple/50 hover:bg-brand-purple/5 transition-all"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{decision.title || decision.situation}</h3>
                            {(decision.options || decision.category) && (
                              <p className="text-sm text-muted-foreground">
                                {decision.category && <span className="inline-block mr-3">📁 {decision.category}</span>}
                                {decision.options && <span className="truncate">{decision.options}</span>}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded ${
                              decision.source === 'history'
                                ? 'bg-green-900/20 text-green-400'
                                : 'bg-yellow-900/20 text-yellow-400'
                            }`}>
                              {decision.source === 'history' ? 'Decided' : 'Pending'}
                            </span>
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              // Analysis View
              <motion.div
                key="analyze"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                {/* Back Button */}
                <Button
                  variant="outline"
                  onClick={handleBackToList}
                  className="gap-2 mb-4"
                >
                  ← Back to Decisions
                </Button>

                {/* Decision Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-2xl border border-border bg-card"
                >
                  <h2 className="text-2xl font-bold mb-2">{selectedDecision.title || selectedDecision.situation}</h2>
                  {selectedDecision.options && (
                    <p className="text-muted-foreground mb-4">{selectedDecision.options}</p>
                  )}
                  {selectedDecision.category && (
                    <span className="text-xs px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple">
                      {selectedDecision.category}
                    </span>
                  )}
                </motion.div>

                {loading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-12 text-center"
                  >
                    <div className="w-12 h-12 border-4 border-brand-purple/20 border-t-brand-purple rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Analyzing your decision with AI...</p>
                  </motion.div>
                ) : analysis ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    {/* Pros & Cons */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="p-5 rounded-2xl border border-brand-green/20 bg-brand-green/5"
                      >
                        <h3 className="font-semibold text-brand-green mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5" /> Pros
                        </h3>
                        <ul className="space-y-2">
                          {analysis.pros?.map((pro, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 + i * 0.1 }}
                              className="flex items-start gap-2 text-sm"
                            >
                              <ChevronRight className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                              {pro}
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="p-5 rounded-2xl border border-red-500/20 bg-red-500/5"
                      >
                        <h3 className="font-semibold text-red-500 mb-3 flex items-center gap-2">
                          <X className="w-5 h-5" /> Cons
                        </h3>
                        <ul className="space-y-2">
                          {analysis.cons?.map((con, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 + i * 0.1 }}
                              className="flex items-start gap-2 text-sm"
                            >
                              <ChevronRight className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                              {con}
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid sm:grid-cols-3 gap-4">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-5 rounded-2xl border border-border bg-card text-center"
                      >
                        <p className="text-sm text-muted-foreground mb-2">Risk Level</p>
                        <div className="flex items-center justify-center gap-2 mb-2">
                          {(() => {
                            const Icon = riskIcons[analysis.riskLevel] || HelpCircle
                            return <Icon className={`w-5 h-5 ${analysis.riskLevel === 'Low' ? 'text-brand-green' : analysis.riskLevel === 'Medium' ? 'text-brand-orange' : 'text-red-500'}`} />
                          })()}
                          <span className="text-lg font-bold">{analysis.riskLevel}</span>
                        </div>
                        {analysis.riskScore !== undefined && (
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                analysis.riskScore < 40 ? 'bg-brand-green' : analysis.riskScore < 70 ? 'bg-brand-orange' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(100, analysis.riskScore)}%` }}
                            />
                          </div>
                        )}
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="p-5 rounded-2xl border border-border bg-card text-center"
                      >
                        <p className="text-sm text-muted-foreground mb-2">Timeframe</p>
                        <p className="text-lg font-bold">{analysis.timeframe || 'N/A'}</p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="p-5 rounded-2xl border border-brand-violet/20 bg-brand-violet/5 text-center"
                      >
                        <p className="text-sm text-muted-foreground mb-2">Status</p>
                        <p className="text-lg font-bold text-brand-violet">{selectedDecision.source === 'history' ? '✓ Decided' : '⏳ Pending'}</p>
                      </motion.div>
                    </div>

                    {/* Reasoning */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="p-5 rounded-2xl border border-border bg-card"
                    >
                      <p className="text-sm text-muted-foreground mb-2">Analysis</p>
                      <p className="text-sm leading-relaxed">{analysis.reasoning}</p>
                    </motion.div>

                    {/* Suggested Path */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="p-5 rounded-2xl border border-brand-purple/20 bg-brand-purple/5"
                    >
                      <p className="text-sm text-muted-foreground mb-2">Recommended Path</p>
                      <p className="text-sm font-medium mb-3">{analysis.suggestedPath}</p>
                      {analysis.actionSteps && analysis.actionSteps.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-brand-purple/20">
                          <p className="text-xs font-semibold text-brand-purple mb-2">Action Steps:</p>
                          <ol className="space-y-1">
                            {analysis.actionSteps.map((step, i) => (
                              <li key={i} className="text-xs text-slate-300 flex gap-2">
                                <span className="font-semibold text-brand-purple">{i + 1}.</span>
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </motion.div>

                    {/* Decision Tree Visualization */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <h3 className="font-semibold mb-4 text-center">Decision Tree Visualization</h3>
                      <div className="rounded-2xl border border-border bg-card p-6 min-h-[400px] flex items-center justify-center">
                        <DecisionTree />
                      </div>
                    </motion.div>

                    {/* Outcomes */}
                    <div className="grid sm:grid-cols-3 gap-4">
                      {[
                        { key: 'bestCase', label: 'Best Case', color: 'border-brand-green/30 bg-brand-green/5' },
                        { key: 'worstCase', label: 'Worst Case', color: 'border-red-500/30 bg-red-500/5' },
                        { key: 'mostLikely', label: 'Most Likely', color: 'border-brand-blue/30 bg-brand-blue/5' },
                      ].map((outcome, i) => (
                        <motion.div
                          key={outcome.key}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 + i * 0.1 }}
                          className={`p-4 rounded-xl border ${outcome.color}`}
                        >
                          <p className="text-xs font-medium mb-2 opacity-70">{outcome.label}</p>
                          <p className="text-sm">{analysis.outcomes?.[outcome.key]}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
