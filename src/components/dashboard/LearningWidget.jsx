import { useDashboardStore } from '@/store/useDashboardStore'
import { motion } from 'framer-motion'
import { BookOpen, TrendingUp, Clock } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

export default function LearningWidget() {
  const { learning } = useDashboardStore()
  const totalProgress = Math.round(
    learning.goals.reduce((acc, g) => acc + g.progress / g.total, 0) / learning.goals.length * 100
  )

  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-brand-blue" />
        </div>
        <h3 className="font-semibold">Learning</h3>
        <div className="ml-auto flex items-center gap-1 text-xs text-brand-orange">
          <Clock className="w-3 h-3" />
          {learning.streak} day streak
        </div>
      </div>

      <div className="mb-4 p-3 rounded-xl bg-brand-blue/5 border border-brand-blue/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Overall Progress</span>
          <span className="text-sm font-bold text-brand-blue">{totalProgress}%</span>
        </div>
        <Progress value={totalProgress} className="h-2" />
      </div>

      <div className="space-y-2">
        {learning.goals.map((goal, i) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-2.5 rounded-xl border border-border bg-card"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium">{goal.title}</span>
              <span className="text-xs text-muted-foreground">{goal.progress}/{goal.total}</span>
            </div>
            <Progress value={(goal.progress / goal.total) * 100} className="h-1.5" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
