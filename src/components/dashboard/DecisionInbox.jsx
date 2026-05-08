import { useDecisionStore } from '@/store/useDecisionStore'
import { motion } from 'framer-motion'
import { GitBranch, ArrowRight, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const riskColors = {
  Low: 'bg-brand-green/10 text-brand-green',
  Medium: 'bg-brand-orange/10 text-brand-orange',
  High: 'bg-red-500/10 text-red-500',
}

export default function DecisionInbox() {
  const { decisions, removeDecision } = useDecisionStore()

  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-brand-purple/10 flex items-center justify-center">
          <GitBranch className="w-4 h-4 text-brand-purple" />
        </div>
        <h3 className="font-semibold">Decision Inbox</h3>
        <Link to="/decisions" className="ml-auto text-xs text-brand-violet hover:underline flex items-center gap-1">
          View All <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
        {decisions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No decisions yet. Create your first one!
          </div>
        ) : (
          decisions.slice(0, 4).map((decision, i) => (
            <motion.div
              key={decision.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-3 rounded-xl border border-border bg-card group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{decision.situation}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${riskColors[decision.result?.riskLevel] || 'bg-muted'}`}>
                      {decision.result?.riskLevel || 'Unknown'}
                    </span>
                    <span className="text-xs text-muted-foreground">{decision.category}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeDecision(decision.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/10 text-red-500 transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
