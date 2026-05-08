import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Plus, Target, Trash2, X, Check, Zap, Trophy, Calendar } from 'lucide-react'
import CardWrapper from './CardWrapper'
import { getDateISO, getYesterdayISO, readRoot, updateRoot } from './storage'

const CATEGORIES = ['Health', 'Fitness', 'Mental', 'Productivity', 'Sleep', 'Nutrition', 'Other']
const COLORS = ['#059669', '#3b82f6', '#8b5cf6', '#f97316', '#ec4899']

const categoryIcons = {
  Health: Zap,
  Fitness: Flame,
  Mental: Trophy,
  Productivity: Zap,
  Sleep: Calendar,
  Nutrition: Flame,
  Other: Target,
}

export default function HabitsDailyCard() {
  const [habits, setHabits] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', frequency: 'Daily', category: 'Health', color: COLORS[0] })
  const [confirmId, setConfirmId] = useState(null)

  useEffect(() => {
    const today = getDateISO()
    const data = readRoot('lifeosHabitsData')
    const updated = (data.habits || []).map((habit) => ({
      ...habit,
      doneToday: habit.lastChecked === today ? habit.doneToday : false,
    }))
    updateRoot('lifeosHabitsData', (current) => ({ ...current, habits: updated }))
    setHabits(updated)
  }, [])

  const saveHabits = (next) => {
    setHabits(next)
    updateRoot('lifeosHabitsData', (current) => ({ ...current, habits: next }))
  }

  const addHabit = () => {
    if (!form.name.trim()) return
    const next = [...habits, { id: Date.now(), ...form, streak: 0, lastChecked: null, doneToday: false }]
    saveHabits(next)
    setForm({ name: '', frequency: 'Daily', category: 'Health', color: COLORS[0] })
    setShowForm(false)
  }

  const toggleHabit = (id) => {
    const today = getDateISO()
    const yesterday = getYesterdayISO()
    saveHabits(
      habits.map((habit) => {
        if (habit.id !== id) return habit
        if (habit.doneToday) return { ...habit, doneToday: false }
        const streak = habit.lastChecked === yesterday ? habit.streak + 1 : habit.lastChecked === today ? habit.streak : 1
        return { ...habit, doneToday: true, lastChecked: today, streak }
      })
    )
  }

  const removeHabit = (id) => {
    if (confirmId === id) {
      saveHabits(habits.filter((habit) => habit.id !== id))
      setConfirmId(null)
      return
    }
    setConfirmId(id)
    setTimeout(() => setConfirmId((prev) => (prev === id ? null : prev)), 2000)
  }

  const doneCount = useMemo(() => habits.filter((habit) => habit.doneToday).length, [habits])
  const progress = habits.length > 0 ? (doneCount / habits.length) * 100 : 0

  return (
    <CardWrapper 
      icon={<Target className="w-4 h-4 text-[#059669]" />} 
      title="Daily Habits" 
      badge={
        <span className={doneCount === habits.length && habits.length > 0 ? 'text-[#059669]' : 'text-gray-400'}>
          {doneCount}/{habits.length}
        </span>
      }
    >
      <div className="space-y-4 p-1">
        {/* Progress Bar */}
        {habits.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Daily Progress</span>
              <span className="text-[#059669] font-medium">{progress.toFixed(0)}%</span>
            </div>
            <div className="w-full h-2 bg-[#071a0f] rounded-full overflow-hidden border border-[#1e3028]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`h-full rounded-full ${progress === 100 ? 'bg-gradient-to-r from-[#059669] to-[#34d399]' : 'bg-[#059669]'}`}
              />
            </div>
          </div>
        )}

        {/* Add Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[#071a0f] rounded-2xl p-5 border border-[#1e3028] overflow-hidden space-y-3"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium text-sm">New Habit</span>
                <button 
                  onClick={() => setShowForm(false)}
                  className="w-7 h-7 rounded-lg bg-[#1e3028] hover:bg-[#2a4035] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <input 
                className="bg-[#0a0f0a] border border-[#1e3028] rounded-xl px-4 py-3 text-white w-full text-sm focus:border-[#059669] focus:ring-1 focus:ring-[#059669] outline-none transition-colors placeholder:text-gray-600" 
                placeholder="Habit name (e.g. Morning Run)" 
                value={form.name} 
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && addHabit()}
              />

              <div className="grid grid-cols-2 gap-3">
                <select 
                  className="bg-[#0a0f0a] border border-[#1e3028] rounded-xl px-4 py-3 text-white w-full text-sm focus:border-[#059669] focus:ring-1 focus:ring-[#059669] outline-none transition-colors cursor-pointer appearance-none" 
                  value={form.frequency} 
                  onChange={(e) => setForm((prev) => ({ ...prev, frequency: e.target.value }))}
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                </select>

                <select 
                  className="bg-[#0a0f0a] border border-[#1e3028] rounded-xl px-4 py-3 text-white w-full text-sm focus:border-[#059669] focus:ring-1 focus:ring-[#059669] outline-none transition-colors cursor-pointer appearance-none" 
                  value={form.category} 
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <span className="text-gray-500 text-xs mb-2 block">Choose color</span>
                <div className="flex gap-2">
                  {COLORS.map((color) => (
                    <motion.button
                      key={color}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setForm((prev) => ({ ...prev, color }))}
                      className={`w-8 h-8 rounded-full transition-all ${form.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-[#071a0f]' : 'opacity-60 hover:opacity-100'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={addHabit}
                className="bg-[#059669] hover:bg-[#047857] text-white rounded-xl px-4 py-3 w-full text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Habit
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Button */}
        {!showForm && (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setShowForm(true)}
            className="w-full border-2 border-dashed border-[#1e3028] rounded-xl p-4 flex items-center justify-center gap-2 hover:border-[#059669] hover:bg-[#059669]/5 transition-all group"
          >
            <div className="w-8 h-8 rounded-full bg-[#059669]/10 flex items-center justify-center group-hover:bg-[#059669]/20 transition-colors">
              <Plus className="w-4 h-4 text-[#059669]" />
            </div>
            <span className="text-gray-400 text-sm group-hover:text-[#059669] transition-colors">Add new habit</span>
          </motion.button>
        )}

        {/* Habits List */}
        <div className="space-y-2.5">
          <AnimatePresence>
            {habits.map((habit, index) => {
              const isDone = habit.doneToday
              const isConfirming = confirmId === habit.id
              const CategoryIcon = categoryIcons[habit.category] || Target

              return (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className={`group relative rounded-xl px-4 py-3.5 transition-all duration-300 ${
                    isDone 
                      ? 'bg-[#059669]/10 border border-[#059669]/30' 
                      : 'bg-[#071a0f] border border-[#1e3028] hover:border-[#1e3028]/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Checkbox */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleHabit(habit.id)}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                        isDone
                          ? 'bg-[#059669] border-[#059669]'
                          : 'border-[#1e3028] hover:border-[#059669]/50'
                      }`}
                    >
                      {isDone && <Check className="w-3.5 h-3.5 text-white" />}
                    </motion.button>

                    {/* Color indicator */}
                    <div 
                      className="w-2 h-8 rounded-full flex-shrink-0"
                      style={{ backgroundColor: habit.color }}
                    />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium text-sm truncate ${isDone ? 'text-[#059669] line-through opacity-70' : 'text-white'}`}>
                          {habit.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] uppercase tracking-wider text-gray-500 bg-[#0a0f0a] px-2 py-0.5 rounded">
                          {habit.category}
                        </span>
                        <span className="text-[10px] text-gray-600">{habit.frequency}</span>
                      </div>
                    </div>

                    {/* Streak */}
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg flex-shrink-0 ${
                      habit.streak > 0 ? 'bg-orange-500/10' : 'bg-transparent'
                    }`}>
                      <Flame className={`w-3.5 h-3.5 ${habit.streak > 0 ? 'text-orange-400' : 'text-gray-600'}`} />
                      <span className={`text-xs font-bold ${habit.streak > 0 ? 'text-orange-400' : 'text-gray-600'}`}>
                        {habit.streak}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeHabit(habit.id)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          isConfirming 
                            ? 'bg-red-500/20 text-red-400' 
                            : 'hover:bg-red-500/10 text-gray-500 hover:text-red-400'
                        }`}
                      >
                        {isConfirming ? (
                          <span className="text-[10px] font-bold">Sure?</span>
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {habits.length === 0 && !showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 rounded-full bg-[#059669]/5 border border-[#1e3028] flex items-center justify-center mx-auto mb-3">
              <Target className="w-8 h-8 text-[#059669]/30" />
            </div>
            <p className="text-gray-500 text-sm">No habits tracked yet</p>
            <p className="text-gray-600 text-xs mt-1">Build your first daily habit above</p>
          </motion.div>
        )}
      </div>
    </CardWrapper>
  )
}