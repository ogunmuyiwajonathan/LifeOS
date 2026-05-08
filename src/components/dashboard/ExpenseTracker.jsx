import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, TrendingDown, X } from 'lucide-react'
import CardWrapper from './CardWrapper'
import { formatCurrency, updateRoot } from './storage'

const CATEGORIES = [
  'Housing',
  'Food',
  'Transport',
  'Entertainment',
  'Health',
  'Subscriptions',
  'Shopping',
  'Other',
]

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [category, setCategory] = useState('Food')
  const [amount, setAmount] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [description, setDescription] = useState('')

  useEffect(() => {
    loadExpenses()
  }, [])

  const loadExpenses = () => {
    const stored = localStorage.getItem('lifeosMoneyData')
    if (stored) {
      const data = JSON.parse(stored)
      setExpenses(data.expenseEntries || [])
    }
  }

  const saveExpenses = (updated) => {
    updateRoot('lifeosMoneyData', (current) => ({ ...current, expenseEntries: updated }))
    setExpenses(updated)
  }

  const addExpense = () => {
    if (!amount.trim()) return
    const newExpense = {
      description: description.trim(),
      id: Date.now(),
      category,
      amount: parseFloat(amount),
      date: new Date().toISOString(),
    }
    saveExpenses([...expenses, newExpense])
    setAmount('')
    setDescription('')
    setShowForm(false)
  }

  const handleDelete = (id) => {
    if (deleteConfirm === id) {
      saveExpenses(expenses.filter((e) => e.id !== id))
      setDeleteConfirm(null)
    } else {
      setDeleteConfirm(id)
      setTimeout(() => setDeleteConfirm(null), 2000)
    }
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)

  const getCategoryColor = (cat) => {
    const colors = {
      Housing: 'bg-blue-900/20 text-blue-400',
      Food: 'bg-orange-900/20 text-orange-400',
      Transport: 'bg-purple-900/20 text-purple-400',
      Entertainment: 'bg-yellow-900/20 text-yellow-400',
      Health: 'bg-red-900/20 text-red-400',
      Subscriptions: 'bg-green-900/20 text-green-400',
      Other: 'bg-gray-700/20 text-gray-400',
    }
    return colors[cat] || colors.Other
  }

  return (
    <CardWrapper icon={<TrendingDown className="w-4 h-4 text-[#059669]" />} title="Expense Tracker" badge={formatCurrency(totalExpenses)}>
      <div className="space-y-3">
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-[#071a0f] rounded-xl p-4 border border-[#1e3028] space-y-3 overflow-hidden"
            >
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#0a0f0a] border border-[#1e3028] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#059669] focus:border-[#059669]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
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
                  onClick={addExpense}
                  className="flex-1 bg-[#059669] hover:bg-[#047857] text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                >
                  Add Expense
                </button>
                <button
                  onClick={() => {
                    setShowForm(false)
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

        {expenses.length === 0 ? (
          !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="w-full border-2 border-dashed border-[#1e3028] rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-[#059669] hover:bg-[#059669]/5 transition-all"
            >
              <Plus className="w-5 h-5 text-[#059669]" />
              <span className="text-sm text-[#059669]">Add expense</span>
            </button>
          )
        ) : (
          <>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {expenses
                .slice()
                .reverse()
                .map((expense) => (
                  <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-2 bg-[#071a0f] border border-[#1e3028] rounded-lg flex items-center justify-between gap-2 text-sm"
                  >
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(expense.category)}`}>
                      {expense.category}
                    </span>
                    <div className="flex items-center gap-2">
                      {expense.description && <span className="text-gray-500 text-xs">{expense.description}</span>}
                      <span className="text-red-400 font-medium">{formatCurrency(expense.amount)}</span>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className={`p-1 rounded transition-colors ${
                          deleteConfirm === expense.id
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
                Add expense
              </button>
            )}
            <div className="mt-4 pt-3 border-t border-[#1e3028] text-sm">
              <div className="text-red-400 font-semibold">
                Total Expenses: {formatCurrency(totalExpenses)}
              </div>
            </div>
          </>
        )}
      </div>
    </CardWrapper>
  )
}
