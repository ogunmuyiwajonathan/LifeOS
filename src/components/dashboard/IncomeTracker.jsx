import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Wallet, X } from 'lucide-react'
import CardWrapper from './CardWrapper'
import { formatCurrency, readRoot, updateRoot } from './storage'

export default function IncomeTracker() {
  const [incomes, setIncomes] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [source, setSource] = useState('')
  const [amount, setAmount] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    loadIncomes()
  }, [])

  const loadIncomes = () => {
    const stored = localStorage.getItem('lifeosMoneyData')
    if (stored) {
      const data = JSON.parse(stored)
      setIncomes(data.incomeEntries || [])
    }
  }

  const saveIncomes = (updated) => {
    updateRoot('lifeosMoneyData', (current) => ({ ...current, incomeEntries: updated }))
    setIncomes(updated)
  }

  const addIncome = () => {
    if (!source.trim() || !amount.trim()) return
    const newIncome = {
      id: Date.now(),
      source: source.trim(),
      amount: parseFloat(amount),
    }
    saveIncomes([...incomes, newIncome])
    setSource('')
    setAmount('')
    setShowForm(false)
  }

  const handleDelete = (id) => {
    if (deleteConfirm === id) {
      saveIncomes(incomes.filter((i) => i.id !== id))
      setDeleteConfirm(null)
    } else {
      setDeleteConfirm(id)
      setTimeout(() => setDeleteConfirm(null), 2000)
    }
  }

  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0)

  return (
    <CardWrapper
      icon={<Wallet className="w-4 h-4 text-[#059669]" />}
      title="Income Tracker"
      badge={<span className="text-[#059669]">{formatCurrency(totalIncome)}</span>}
    >
      <div className="space-y-3">
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-[#071a0f] rounded-xl p-4 border border-[#1e3028] space-y-3 overflow-hidden"
            >
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Income source..."
                className="w-full bg-[#0a0f0a] border border-[#1e3028] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#059669] focus:border-[#059669]"
              />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount (₦)"
                className="w-full bg-[#0a0f0a] border border-[#1e3028] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#059669] focus:border-[#059669]"
              />
              <div className="flex gap-2">
                <button
                  onClick={addIncome}
                  className="flex-1 bg-[#059669] hover:bg-[#047857] text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                >
                  Add Income
                </button>
                <button
                  onClick={() => {
                    setShowForm(false)
                    setSource('')
                    setAmount('')
                  }}
                  className="px-3 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-white" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {incomes.length === 0 ? (
          !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="w-full border-2 border-dashed border-[#1e3028] rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-[#059669] hover:bg-[#059669]/5 transition-all"
            >
              <Plus className="w-5 h-5 text-[#059669]" />
              <span className="text-sm text-[#059669]">Add income</span>
            </button>
          )
        ) : (
          <>
            <div className="space-y-2">
              {incomes.map((income) => (
                <motion.div
                  key={income.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-2 bg-[#071a0f] border border-[#1e3028] rounded-lg flex items-center justify-between gap-2 text-sm"
                >
                  <span className="text-gray-300">{income.source}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#059669] font-medium">{formatCurrency(income.amount)}</span>
                    <button
                      onClick={() => handleDelete(income.id)}
                      className={`p-1 rounded transition-colors ${
                        deleteConfirm === income.id
                          ? 'bg-red-900/50 text-red-400 border-red-800'
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
                className="w-full mt-2 border-2 border-dashed border-[#1e3028] rounded-lg p-2 flex items-center justify-center gap-2 text-sm text-[#059669] hover:border-[#059669] hover:bg-[#059669]/5 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Income
              </button>
            )}
            <div className="mt-4 pt-3 border-t border-[#1e3028] text-sm">
              <div className="text-[#059669] font-semibold">
                Total Income: {formatCurrency(totalIncome)}
              </div>
            </div>
          </>
        )}
      </div>
    </CardWrapper>
  )
}
