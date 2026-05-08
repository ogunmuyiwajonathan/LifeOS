import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Plus, Target, Trash2, X, Trophy } from 'lucide-react'
import CardWrapper from './CardWrapper'
import { formatCurrency, updateRoot } from './storage'

export default function SavingsGoals() {
  const [goals, setGoals] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
  const [current, setCurrent] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [addSavingsFor, setAddSavingsFor] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    loadGoals()
  }, [])

  const loadGoals = () => {
    const stored = localStorage.getItem('lifeosMoneyData')
    if (stored) {
      const data = JSON.parse(stored)
      setGoals(data.savingsGoals || [])
    }
  }

  const saveGoals = (updated) => {
    updateRoot('lifeosMoneyData', (current) => ({ ...current, savingsGoals: updated }))
    setGoals(updated)
  }

  const addGoal = () => {
    if (!name.trim() || !target.trim()) return
    const newGoal = {
      id: Date.now(),
      name: name.trim(),
      target: parseFloat(target),
      current: parseFloat(current) || 0,
    }
    saveGoals([...goals, newGoal])
    setName('')
    setTarget('')
    setCurrent('')
    setShowForm(false)
  }

  const incrementSavings = (id, amount) => {
    if (!amount || amount <= 0) return
    const updated = goals.map((g) =>
      g.id === id ? { ...g, current: Math.min(g.target, g.current + amount) } : g
    )
    saveGoals(updated)
  }

  const handleDelete = (id) => {
    if (deleteConfirm === id) {
      saveGoals(goals.filter((g) => g.id !== id))
      setDeleteConfirm(null)
    } else {
      setDeleteConfirm(id)
      setTimeout(() => setDeleteConfirm(null), 2000)
    }
  }

  // Block non-numeric input
  const handleNumberInput = (e, setter) => {
    const value = e.target.value
    // Allow only numbers and one decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setter(value)
    }
  }

  return (
    <CardWrapper icon={<Target className="w-4 h-4 text-[#059669]" />} title="Savings Goals" badge={`${goals.length} active`}>
      <div className="space-y-3 p-1">
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-[#071a0f]  rounded-xl p-4 border border-[#1e3028] space-y-3 overflow-hidden"
            >
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Goal name..."
                className="w-full bg-[#0a0f0a] border border-[#1e3028] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#059669] focus:border-[#059669]"
              />
              <input
                type="text"
                inputMode="decimal"
                value={target}
                onChange={(e) => handleNumberInput(e, setTarget)}
                placeholder="Target amount"
                className="w-full bg-[#0a0f0a] border border-[#1e3028] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#059669] focus:border-[#059669] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <input
                type="text"
                inputMode="decimal"
                value={current}
                onChange={(e) => handleNumberInput(e, setCurrent)}
                placeholder="Current savings (optional)"
                className="w-full bg-[#0a0f0a] border border-[#1e3028] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#059669] focus:border-[#059669] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <div className="flex gap-2 pt-1">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addGoal}
                  className="flex-1 bg-[#059669] hover:bg-[#047857] text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
                >
                  Add Goal
                </motion.button>
                <button
                  onClick={() => {
                    setShowForm(false)
                    setName('')
                    setTarget('')
                    setCurrent('')
                  }}
                  className="px-3 py-2.5 text-gray-400 hover:text-white hover:bg-[#1e3028] rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {goals.length === 0 ? (
          !showForm && (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setShowForm(true)}
              className="w-full border-2 border-dashed border-[#1e3028] rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-[#059669] hover:bg-[#059669]/5 transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-[#059669]/10 flex items-center justify-center">
                <Plus className="w-5 h-5 text-[#059669]" />
              </div>
              <span className="text-sm text-[#059669] font-medium">Add your first goal</span>
            </motion.button>
          )
        ) : (
          <>
            <div className="space-y-3">
              {goals.map((goal) => {
                const percentage = Math.min(100, (goal.current / goal.target) * 100)
                const isComplete = percentage >= 100
                const remaining = goal.target - goal.current

                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 bg-[#071a0f] border rounded-xl transition-all ${
                      isComplete 
                        ? 'border-[#059669]/30 bg-[#059669]/5' 
                        : 'border-[#1e3028] hover:border-[#1e3028]/80'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {isComplete ? (
                          <Trophy className="w-4 h-4 text-[#059669]" />
                        ) : (
                          <Target className="w-4 h-4 text-gray-500" />
                        )}
                        <span className={`font-semibold text-sm ${isComplete ? 'text-[#059669]' : 'text-white'}`}>
                          {goal.name}
                        </span>
                      </div>
                      {isComplete && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center gap-1 text-xs text-[#059669] font-medium bg-[#059669]/10 px-2 py-1 rounded-full"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Complete
                        </motion.div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-[#051a0f] rounded-full overflow-hidden mb-3 border border-[#1e3028]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`h-full rounded-full ${isComplete ? 'bg-gradient-to-r from-[#059669] to-[#34d399]' : 'bg-[#059669]'}`}
                      />
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="text-gray-400">
                        {formatCurrency(goal.current)} of {formatCurrency(goal.target)}
                      </span>
                      <span className={`font-bold ${isComplete ? 'text-[#059669]' : 'text-white'}`}>
                        {percentage.toFixed(0)}%
                      </span>
                    </div>

                    {/* Remaining / Status */}
                    <div className="text-xs mb-3">
                      {isComplete ? (
                        <span className="text-[#059669]">Goal reached! You saved {formatCurrency(goal.target)}</span>
                      ) : (
                        <span className="text-gray-500">
                          <span className="text-[#059669] font-medium">{formatCurrency(remaining)}</span> remaining to reach your goal
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {!isComplete ? (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setAddSavingsFor(addSavingsFor === goal.id ? null : goal.id)}
                            className="flex-1 text-xs bg-[#059669]/10 hover:bg-[#059669]/20 text-[#059669] rounded-lg py-2 transition-colors inline-flex items-center justify-center gap-1 font-medium"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add savings
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(goal.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              deleteConfirm === goal.id
                                ? 'bg-red-500/20 text-red-400'
                                : 'text-gray-500 hover:bg-red-500/10 hover:text-red-400'
                            }`}
                          >
                            {deleteConfirm === goal.id ? (
                              <span className="text-xs font-medium">Confirm?</span>
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </motion.button>
                        </>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleDelete(goal.id)}
                          className="w-full flex items-center justify-center gap-2 text-xs bg-[#059669]/10 hover:bg-red-500/10 text-[#059669] hover:text-red-400 rounded-lg py-2 transition-colors font-medium"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Clear completed goal
                        </motion.button>
                      )}
                    </div>

                    {/* Add savings input */}
                    <AnimatePresence>
                      {addSavingsFor === goal.id && !isComplete && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 overflow-hidden"
                        >
                          <div className="flex gap-2">
                            <input
                              ref={inputRef}
                              type="text"
                              inputMode="decimal"
                              placeholder="Enter amount..."
                              className="flex-1 bg-[#0a0f0a] border border-[#1e3028] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#059669] focus:border-[#059669] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              onChange={(e) => handleNumberInput(e, () => {})}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  incrementSavings(goal.id, Number(e.target.value || 0))
                                  setAddSavingsFor(null)
                                }
                              }}
                            />
                            <button
                              onClick={() => {
                                const val = Number(inputRef.current?.value || 0)
                                incrementSavings(goal.id, val)
                                setAddSavingsFor(null)
                              }}
                              className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white rounded-lg text-sm font-medium transition-colors"
                            >
                              Add
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>

            {!showForm && (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setShowForm(true)}
                className="w-full mt-3 border-2 border-dashed border-[#1e3028] rounded-xl p-3 flex items-center justify-center gap-2 text-sm text-[#059669] hover:border-[#059669] hover:bg-[#059669]/5 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add goal
              </motion.button>
            )}
          </>
        )}
      </div>
    </CardWrapper>
  )
}