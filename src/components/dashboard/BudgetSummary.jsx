import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, BarChart2, TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import CardWrapper from './CardWrapper'
import { formatCurrency } from './storage'

export default function BudgetSummary() {
  const [income, setIncome] = useState(0)
  const [expenses, setExpenses] = useState(0)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const stored = localStorage.getItem('lifeosMoneyData')
    if (stored) {
      const data = JSON.parse(stored)
      const totalIncome = (data.incomeEntries || []).reduce((sum, i) => sum + i.amount, 0)
      const totalExpenses = (data.expenseEntries || []).reduce((sum, e) => sum + e.amount, 0)
      setIncome(totalIncome)
      setExpenses(totalExpenses)
    }
  }

  const savings = income - expenses
  const isPositive = savings >= 0
  const expensePercent = income > 0 ? Math.min(100, (expenses / income) * 100) : 0

  return (
    <CardWrapper 
      icon={<BarChart2 className="w-4 h-4 text-[#059669]" />} 
      title="Budget Summary" 
      badge={
        <span className={`text-xs font-medium ${isPositive ? 'text-[#059669]' : 'text-red-400'}`}>
          {isPositive ? 'Healthy' : 'Deficit'}
        </span>
      }
    >
      <div className="space-y-5">
        {/* Income Row */}
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#059669]/10 border border-[#059669]/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#059669]" />
            </div>
            <span className="text-gray-400 text-sm">Income</span>
          </div>
          <motion.span 
            key={income}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-bold text-lg text-[#059669]"
          >
            {formatCurrency(income)}
          </motion.span>
        </div>

        {/* Expenses Row */}
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-red-400" />
            </div>
            <span className="text-gray-400 text-sm">Expenses</span>
          </div>
          <motion.span 
            key={expenses}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-bold text-lg text-red-400"
          >
            {formatCurrency(expenses)}
          </motion.span>
        </div>

        {/* Divider */}
        <div className="border-t border-[#1e3028]" />

        {/* Money Available */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isPositive ? 'bg-[#059669]/10 border border-[#059669]/20' : 'bg-red-500/10 border border-red-500/20'}`}>
              <Wallet className={`w-4 h-4 ${isPositive ? 'text-[#059669]' : 'text-red-400'}`} />
            </div>
            <span className="text-gray-300 text-sm font-medium">Money Available</span>
          </div>
          <motion.span 
            key={savings}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className={`font-bold text-xl ${isPositive ? 'text-[#059669]' : 'text-red-400'}`}
          >
            {formatCurrency(savings)}
          </motion.span>
        </div>

        {/* Expense ratio bar */}
        {income > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Expense ratio</span>
              <span className="text-gray-400">{expensePercent.toFixed(0)}% of income</span>
            </div>
            <div className="h-2 bg-[#071a0f] rounded-full overflow-hidden border border-[#1e3028]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${expensePercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full rounded-full ${expensePercent > 90 ? 'bg-red-500' : expensePercent > 70 ? 'bg-yellow-500' : 'bg-[#059669]'}`}
              />
            </div>
          </div>
        )}

        {/* Warning */}
        {savings < 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 rounded-xl bg-red-500/5 border border-red-500/20"
          >
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span className="text-red-400 text-sm">Spending exceeds income</span>
          </motion.div>
        )}
      </div>
    </CardWrapper>
  )
}