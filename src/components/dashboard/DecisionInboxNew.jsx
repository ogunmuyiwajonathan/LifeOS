import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Check, Scale, X } from 'lucide-react'
import CardWrapper from './CardWrapper'
import { updateModuleStreak } from '@/utils/streak'

export default function DecisionInbox() {
  const [decisions, setDecisions] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [options, setOptions] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    loadDecisions()

    const handleStorageChange = () => loadDecisions()

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('decisionsUpdated', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('decisionsUpdated', handleStorageChange)
    }
  }, [])

  const loadDecisions = () => {
    const stored = localStorage.getItem('lifeosDecisionsData')
    if (stored) {
      const data = JSON.parse(stored)
      setDecisions(data.inbox || [])
    }
  }

  const saveDecisions = (updated) => {
    const stored =
      localStorage.getItem('lifeosDecisionsData') ||
      JSON.stringify({ inbox: [], history: [] })

    const data = JSON.parse(stored)
    data.inbox = updated
    localStorage.setItem('lifeosDecisionsData', JSON.stringify(data))
    setDecisions(updated)

    window.dispatchEvent(new Event('decisionsUpdated'))
  }

  const addDecision = () => {
    if (!title.trim()) return

    const newDecision = {
      id: Date.now(),
      title: title.trim(),
      options: options.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    updateModuleStreak('decisions')
    saveDecisions([...decisions, newDecision])

    setTitle('')
    setOptions('')
    setShowForm(false)
  }

  const markAsDecided = (id) => {
    const decision = decisions.find((d) => d.id === id)
    if (!decision) return

    const stored =
      localStorage.getItem('lifeosDecisionsData') ||
      JSON.stringify({ inbox: [], history: [] })

    const data = JSON.parse(stored)
    data.history = data.history || []

    data.history.push({
      ...decision,
      status: 'decided',
      decidedAt: new Date().toISOString(),
      outcome: '',
    })

    data.inbox = decisions.filter((d) => d.id !== id)

    localStorage.setItem('lifeosDecisionsData', JSON.stringify(data))
    setDecisions(data.inbox)

    window.dispatchEvent(new Event('decisionsUpdated'))
  }

  const handleDelete = (id) => {
    if (deleteConfirm === id) {
      saveDecisions(decisions.filter((d) => d.id !== id))
      setDeleteConfirm(null)
    } else {
      setDeleteConfirm(id)
      setTimeout(() => setDeleteConfirm(null), 2000)
    }
  }

  const pendingCount = decisions.length

  return (
    <CardWrapper
      icon={<Scale className="w-4 h-4 text-[#059669]" />}
      title="Decision Inbox"
      badge={`${pendingCount} pending`}
    >
      <div className="space-y-3">
        {/* FORM */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-[#071a0f] rounded-xl p-4 border border-[#1e3028] space-y-3 overflow-hidden"
            >
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Decision title..."
                className="w-full bg-[#0a0f0a] border border-[#1e3028] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#059669]"
              />

              <textarea
                value={options}
                onChange={(e) => setOptions(e.target.value)}
                placeholder="Options / notes..."
                rows={2}
                className="w-full bg-[#0a0f0a] border border-[#1e3028] rounded-lg px-3 py-2 text-white text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#059669]"
              />

              <div className="flex gap-2">
                <button
                  onClick={addDecision}
                  className="flex-1 bg-[#059669] hover:bg-[#047857] text-white rounded-lg px-4 py-2 text-sm"
                >
                  Add to Inbox
                </button>

                <button
                  onClick={() => {
                    setShowForm(false)
                    setTitle('')
                    setOptions('')
                  }}
                  className="px-3 py-2 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LIST */}
        {decisions.length === 0 ? (
          !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="w-full border-2 border-dashed border-[#1e3028] rounded-xl p-8 flex flex-col items-center justify-center gap-2 hover:border-[#059669] hover:bg-[#059669]/5"
            >
              <Plus className="w-5 h-5 text-[#059669]" />
              <span className="text-sm text-[#059669]">Add a decision</span>
            </button>
          )
        ) : (
          <>
            <div className="space-y-2">
              {decisions.map((decision) => (
                <motion.div
                  key={decision.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-3 bg-[#071a0f] border border-[#1e3028] rounded-lg flex items-center justify-between gap-3 text-sm"
                >
                  {/* ONLY TITLE (red box simplified) */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white truncate">
                      {decision.title}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-yellow-900/20 text-yellow-400 rounded">
                      Pending
                    </span>

                    <button
                      onClick={() => markAsDecided(decision.id)}
                      className="p-1 text-[#059669] hover:bg-[#059669]/10 rounded"
                    >
                      <Check className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(decision.id)}
                      className={`p-1 rounded transition-colors ${
                        deleteConfirm === decision.id
                          ? 'text-red-400 bg-red-900/20'
                          : 'text-gray-400 hover:bg-red-900/10 hover:text-red-400'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="w-full mt-2 border-2 border-dashed border-[#1e3028] rounded-lg p-2 flex items-center justify-center gap-2 text-sm text-[#059669] hover:border-[#059669] hover:bg-[#059669]/5"
              >
                <Plus className="w-4 h-4" />
                Add another decision
              </button>
            )}
          </>
        )}
      </div>
    </CardWrapper>
  )
}