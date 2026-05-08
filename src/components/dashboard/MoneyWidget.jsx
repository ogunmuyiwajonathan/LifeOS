import { useDashboardStore } from '@/store/useDashboardStore'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

export default function MoneyWidget() {
  const { money } = useDashboardStore()
  const savingsPercent = Math.min(100, Math.round((money.savings / money.savingsGoal) * 100))

  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-brand-green/10 flex items-center justify-center">
          <Wallet className="w-4 h-4 text-brand-green" />
        </div>
        <h3 className="font-semibold">Money</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-brand-green/5 border border-brand-green/10"
        >
          <div className="flex items-center gap-1 text-brand-green mb-1">
            <TrendingUp className="w-3 h-3" />
            <span className="text-xs font-medium">Income</span>
          </div>
          <p className="text-lg font-bold">${money.income.toLocaleString()}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-3 rounded-xl bg-red-500/5 border border-red-500/10"
        >
          <div className="flex items-center gap-1 text-red-500 mb-1">
            <TrendingDown className="w-3 h-3" />
            <span className="text-xs font-medium">Expenses</span>
          </div>
          <p className="text-lg font-bold">${money.expenses.toLocaleString()}</p>
        </motion.div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Savings</span>
          <span className="font-medium">${money.savings.toLocaleString()}</span>
        </div>
        <Progress value={savingsPercent} className="h-2" />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Goal: ${money.savingsGoal.toLocaleString()}</span>
          <span>{savingsPercent}%</span>
        </div>
      </div>
    </div>
  )
}
