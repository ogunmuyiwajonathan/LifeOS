import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BrainCircuit, ChevronRight } from 'lucide-react'
import CardWrapper from './CardWrapper'

export default function DecisionAnalyserWidget() {
  const [decisionCount, setDecisionCount] = useState(0)

  useEffect(() => {
    loadDecisionCount()
    
    const handleUpdate = () => {
      loadDecisionCount()
    }
    window.addEventListener('decisionsUpdated', handleUpdate)
    
    return () => {
      window.removeEventListener('decisionsUpdated', handleUpdate)
    }
  }, [])

  const loadDecisionCount = () => {
    const stored = localStorage.getItem('lifeosDecisionsData')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        const total = (data.inbox || []).length + (data.history || []).length
        setDecisionCount(total)
      } catch (error) {
        console.error('Error loading decision count:', error)
      }
    }
  }

  return (
    <CardWrapper icon={<BrainCircuit className="w-4 h-4 text-brand-purple" />} title="Decision Analyser" badge={`${decisionCount} decisions`}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Review and analyze all your decisions with AI-powered insights. Get recommendations, risk assessments, and next steps.
        </p>
        
        <Link
          to="/analyser"
          className="flex items-center justify-between p-3 rounded-lg border border-brand-purple/20 bg-brand-purple/5 hover:bg-brand-purple/10 transition-colors group"
        >
          <span className="text-sm font-medium text-brand-purple group-hover:text-brand-purple/90">
            Review Decisions
          </span>
          <ChevronRight className="w-4 h-4 text-brand-purple/50 group-hover:text-brand-purple transition-colors" />
        </Link>

        {decisionCount === 0 && (
          <p className="text-xs text-muted-foreground italic">
            Add decisions in the Decision Inbox to analyze them here.
          </p>
        )}
      </div>
    </CardWrapper>
  )
}
