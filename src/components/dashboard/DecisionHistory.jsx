import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollText } from 'lucide-react'
import CardWrapper from './CardWrapper'

export default function DecisionHistory() {
  const [history, setHistory] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editingOutcome, setEditingOutcome] = useState('')

  useEffect(() => {
    loadHistory()
    
    // Listen for updates from DecisionInbox
    const handleUpdate = () => {
      loadHistory()
    }
    window.addEventListener('decisionsUpdated', handleUpdate)
    
    return () => {
      window.removeEventListener('decisionsUpdated', handleUpdate)
    }
  }, [])

  const loadHistory = () => {
    const stored = localStorage.getItem('lifeosDecisionsData')
    if (stored) {
      const data = JSON.parse(stored)
      setHistory(data.history || [])
    }
  }

  const saveHistory = (updated) => {
    const stored = localStorage.getItem('lifeosDecisionsData') || JSON.stringify({ inbox: [], history: [] })
    const data = JSON.parse(stored)
    data.history = updated
    localStorage.setItem('lifeosDecisionsData', JSON.stringify(data))
    setHistory(updated)
    
    // Trigger update event
    window.dispatchEvent(new Event('decisionsUpdated'))
  }

  const updateOutcome = (id) => {
    const updated = history.map((h) =>
      h.id === id ? { ...h, outcome: editingOutcome } : h
    )
    saveHistory(updated)
    setEditingId(null)
    setEditingOutcome('')
  }

  const totalCount = history.length

  return (
    <CardWrapper icon={<ScrollText className="w-4 h-4 text-[#059669]" />} title="Decision History" badge={`${totalCount} total`}>
      <div className="space-y-3">
        {history.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            No decisions made yet — make your first one above
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {history.map((decision) => (
              <motion.div
                key={decision.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-[#071a0f] border border-[#1e3028] rounded-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white text-sm">{decision.title}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Decided: {new Date(decision.decidedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-green-900/20 text-green-400 rounded whitespace-nowrap">
                    ✓ Decided
                  </span>
                </div>

                {editingId === decision.id ? (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 space-y-2 overflow-hidden"
                    >
                      <textarea
                        value={editingOutcome}
                        onChange={(e) => setEditingOutcome(e.target.value)}
                        placeholder="Outcome and notes..."
                        rows={2}
                        className="w-full bg-[#0a0f0a] border border-[#1e3028] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#059669] focus:border-[#059669] resize-none"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateOutcome(decision.id)}
                          className="flex-1 bg-[#059669] hover:bg-[#047857] text-white rounded px-2 py-1 text-xs font-medium transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2 py-1 text-gray-400 hover:text-white text-xs transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  decision.outcome && (
                    <button
                      onClick={() => {
                        setEditingId(decision.id)
                        setEditingOutcome(decision.outcome)
                      }}
                      className="mt-2 text-xs text-gray-400 hover:text-[#059669] transition-colors cursor-pointer"
                    >
                      Outcome: {decision.outcome.substring(0, 60)}
                      {decision.outcome.length > 60 ? '...' : ''}
                    </button>
                  )
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </CardWrapper>
  )
}
