import { useDashboardStore } from '@/store/useDashboardStore'
import { motion } from 'framer-motion'
import { Check, Flame, Target } from 'lucide-react'

export default function HabitsWidget() {
  const { habits, toggleHabit } = useDashboardStore()
  const completedToday = habits.filter((h) => h.completed).length

  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-brand-orange/10 flex items-center justify-center">
          <Target className="w-4 h-4 text-brand-orange" />
        </div>
        <h3 className="font-semibold">Habits</h3>
        <span className="ml-auto text-xs text-muted-foreground">
          {completedToday}/{habits.length} done
        </span>
      </div>

      <div className="space-y-2">
        {habits.map((habit, i) => (
          <motion.button
            key={habit.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => toggleHabit(habit.id)}
            className={`w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left ${
              habit.completed
                ? 'border-brand-green/30 bg-brand-green/5'
                : 'border-border bg-card hover:border-brand-orange/30'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                habit.completed ? 'bg-brand-green' : 'border-2 border-muted-foreground/30'
              }`}
            >
              {habit.completed && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className={`text-sm flex-1 ${habit.completed ? 'line-through text-muted-foreground' : ''}`}>
              {habit.name}
            </span>
            <div className="flex items-center gap-1 text-xs text-brand-orange">
              <Flame className="w-3 h-3" />
              {habit.streak}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
