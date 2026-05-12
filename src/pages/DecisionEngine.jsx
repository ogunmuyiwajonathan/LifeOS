import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BrainCircuit, Send, Sparkles, Clock, Tag, ChevronRight, Save, AlertTriangle, CheckCircle2, XCircle, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { analyzeDecision } from '@/lib/gemini'
import { useDecisionStore } from '@/store/useDecisionStore'
import Navbar from '@/components/layout/Navbar'
import DecisionTree from '@/components/three/DecisionTree'

const categories = ['career', 'life', 'finance', 'relationship', 'health', 'other']
const urgencyLevels = [
  { id: 'low', label: 'Low', color: 'bg-brand-green/10 text-brand-green' },
  { id: 'medium', label: 'Medium', color: 'bg-brand-orange/10 text-brand-orange' },
  { id: 'high', label: 'High', color: 'bg-red-500/10 text-red-500' },
]

const riskIcons = {
  Low: CheckCircle2,
  Medium: AlertTriangle,
  High: XCircle,
}

export default function DecisionEngine() {
  const [situation, setSituation] = useState('')
  const [category, setCategory] = useState('career')
  const [urgency, setUrgency] = useState('medium')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const { addDecision } = useDecisionStore()

  const handleSubmit = async () => {
    if (!situation.trim()) return
    setLoading(true)
    
    try {
      const response = await analyzeDecision(situation, category, urgency)
      setResult(response)
      
      addDecision({
        id: `d-${Date.now()}`,
        situation: situation.trim(),
        category,
        urgency,
        date: new Date().toISOString().split('T')[0],
        result: response,
      })
    } catch (error) {
      console.error('Error analyzing decision:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="w-16 h-16 rounded-2xl bg-brand-purple/10 flex items-center justify-center mx-auto mb-4">
              <BrainCircuit className="w-8 h-8 text-brand-purple" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Decision Engine</h1>
            <p className="text-muted-foreground">Analyze your situation and explore possible outcomes</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl border border-border bg-card mb-8"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">What situation are you facing?</label>
                <textarea
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  placeholder="Describe your decision situation in detail..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand-purple/50 resize-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4" /> Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Urgency
                  </label>
                  <div className="flex gap-2">
                    {urgencyLevels.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setUrgency(level.id)}
                        className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                          urgency === level.id ? level.color + ' ring-1 ring-current' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="relative">
                  <button
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    AI Analysis
                  </button>
                  <AnimatePresence>
                    {showTooltip && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute bottom-full left-0 mb-2 px-3 py-2 rounded-lg bg-popover border border-border text-xs whitespace-nowrap shadow-lg"
                      >
                        Powered by Gemini AI
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={!situation.trim() || loading}
                  className="bg-brand-purple hover:bg-brand-purple/90 text-white gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
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
                      {result.pros.map((pro, i) => (
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
                      <XCircle className="w-5 h-5" /> Cons
                    </h3>
                    <ul className="space-y-2">
                      {result.cons.map((con, i) => (
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

                <div className="grid sm:grid-cols-3 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-5 rounded-2xl border border-border bg-card text-center"
                  >
                    <p className="text-sm text-muted-foreground mb-2">Risk Level</p>
                    <div className="flex items-center justify-center gap-2">
                      {(() => {
                        const Icon = riskIcons[result.riskLevel] || HelpCircle
                        return <Icon className={`w-5 h-5 ${result.riskLevel === 'Low' ? 'text-brand-green' : result.riskLevel === 'Medium' ? 'text-brand-orange' : 'text-red-500'}`} />
                      })()}
                      <span className="text-lg font-bold">{result.riskLevel}</span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-5 rounded-2xl border border-brand-violet/20 bg-brand-violet/5 sm:col-span-2"
                  >
                    <p className="text-sm text-muted-foreground mb-2">Suggested Path</p>
                    <p className="font-medium">{result.suggestedPath}</p>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="p-5 rounded-2xl border border-border bg-card"
                >
                  <p className="text-sm text-muted-foreground mb-2">Reasoning</p>
                  <p className="text-sm">{result.reasoning}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <h3 className="font-semibold mb-4 text-center">Possible Outcomes</h3>
                  <DecisionTree />
                </motion.div>

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
                      <p className="text-xs font-medium mb-1 opacity-70">{outcome.label}</p>
                      <p className="text-sm">{result.outcomes[outcome.key]}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
