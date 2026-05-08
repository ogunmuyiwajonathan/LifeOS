import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, User, Layers, Brain, Check, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useUserStore } from '@/store/useUserStore'
import { useAuthStore } from '@/store/useAuthStore'
import Navbar from '@/components/layout/Navbar'
import { analyzeDecision } from '@/lib/gemini'

const roles = [
  { id: 'student', label: 'Student', icon: User },
  { id: 'professional', label: 'Professional', icon: User },
  { id: 'entrepreneur', label: 'Entrepreneur', icon: User },
  { id: 'creator', label: 'Creator', icon: User },
]

const areas = [
  { id: 'money', label: 'Money & Finance' },
  { id: 'habits', label: 'Habits & Health' },
  { id: 'learning', label: 'Learning & Skills' },
  { id: 'opportunities', label: 'Opportunities' },
]

export default function Onboarding() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [selectedAreas, setSelectedAreas] = useState([])
  const [biggestDecision, setBiggestDecision] = useState('')
  const [decisionAnalysis, setDecisionAnalysis] = useState(null)
  const [analyzeLoading, setAnalyzeLoading] = useState(false)
  const navigate = useNavigate()
  const { setProfile, completeOnboarding } = useUserStore()
  const { setOnboarded } = useAuthStore()
  const [isCompleting, setIsCompleting] = useState(false)

  const progress = (step / 3) * 100

  const toggleArea = (id) => {
    setSelectedAreas((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    )
  }

  const canProceed = () => {
    if (step === 1) return name.trim() && role
    if (step === 2) return selectedAreas.length > 0
    return true
  }

  const handleAnalyzeDecision = async () => {
    if (!biggestDecision.trim()) return
    setAnalyzeLoading(true)
    try {
      const analysis = await analyzeDecision(biggestDecision, 'life', 'high')
      setDecisionAnalysis(analysis)
    } catch (error) {
      console.error('Error analyzing decision:', error)
    } finally {
      setAnalyzeLoading(false)
    }
  }

  const handleComplete = async () => {
    setIsCompleting(true)
    try {
      setProfile({
        name: name.trim(),
        role,
        areas: selectedAreas,
        biggestDecision: biggestDecision.trim(),
        decisionAnalysis: decisionAnalysis,
      })
      // Save selected modules to localStorage
      localStorage.setItem('lifeosModules', JSON.stringify(selectedAreas))
      completeOnboarding()
      await setOnboarded()
      navigate('/dashboard')
    } catch (error) {
      console.error('Failed to complete onboarding:', error)
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Welcome to LifeOS</h1>
              <span className="text-sm text-muted-foreground">Step {step} of 3</span>
            </div>
            <Progress value={progress} className="h-2" />
          </motion.div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-brand-violet/10 flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-brand-violet" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Who are you?</h2>
                  <p className="text-muted-foreground">Tell us a bit about yourself to personalize your experience.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-brand-violet/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">Your Role</label>
                    <div className="grid grid-cols-2 gap-3">
                      {roles.map((r) => (
                        <button
                          key={r.id}
                          onClick={() => setRole(r.id)}
                          className={`p-4 rounded-xl border text-left transition-all ${
                            role === r.id
                              ? 'border-brand-violet bg-brand-violet/10'
                              : 'border-border bg-card hover:border-brand-violet/30'
                          }`}
                        >
                          <r.icon className={`w-5 h-5 mb-2 ${role === r.id ? 'text-brand-violet' : 'text-muted-foreground'}`} />
                          <span className="text-sm font-medium">{r.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-brand-cyan/10 flex items-center justify-center mx-auto mb-4">
                    <Layers className="w-8 h-8 text-brand-cyan" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">What do you want to manage?</h2>
                  <p className="text-muted-foreground">Select the areas of your life you want to track and improve.</p>
                </div>

                <div className="space-y-3">
                  {areas.map((area) => (
                    <button
                      key={area.id}
                      onClick={() => toggleArea(area.id)}
                      className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                        selectedAreas.includes(area.id)
                          ? 'border-brand-cyan bg-brand-cyan/10'
                          : 'border-border bg-card hover:border-brand-cyan/30'
                      }`}
                    >
                      <span className="font-medium">{area.label}</span>
                      {selectedAreas.includes(area.id) && (
                        <Check className="w-5 h-5 text-brand-cyan" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-brand-purple/10 flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-brand-purple" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">What is your biggest decision?</h2>
                  <p className="text-muted-foreground">Optional — we can help you think through it right away.</p>
                </div>

                <div>
                  <textarea
                    value={biggestDecision}
                    onChange={(e) => setBiggestDecision(e.target.value)}
                    placeholder="e.g., Should I switch careers, move cities, start a business..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-brand-purple/50 resize-none"
                  />
                </div>

                {biggestDecision.trim() && (
                  <Button
                    onClick={handleAnalyzeDecision}
                    disabled={analyzeLoading}
                    className="w-full bg-brand-purple hover:bg-brand-purple/90 text-white gap-2"
                  >
                    {analyzeLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Get AI Analysis
                      </>
                    )}
                  </Button>
                )}

                {decisionAnalysis && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl border border-brand-purple/20 bg-brand-purple/5 space-y-3"
                  >
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Risk Level</p>
                      <p className="text-sm font-semibold text-brand-purple">{decisionAnalysis.riskLevel}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Suggested Path</p>
                      <p className="text-sm">{decisionAnalysis.suggestedPath}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Key Reasoning</p>
                      <p className="text-sm">{decisionAnalysis.reasoning}</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>

            {step < 3 ? (
              <Button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canProceed()}
                className="bg-brand-violet hover:bg-brand-violet/90 text-white gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={isCompleting}
                className="bg-brand-violet hover:bg-brand-violet/90 text-white gap-2"
              >
                <Check className="w-4 h-4" />
                {isCompleting ? 'Saving...' : 'Get Started'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
