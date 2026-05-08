import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { BarChart3, Sparkles, TrendingUp, Target, BookOpen, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
} from 'recharts'
import { useDashboardStore } from '@/store/useDashboardStore'
import Navbar from '@/components/layout/Navbar'

function CountUp({ end, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    let startTime = null
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [isInView, end, duration])

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  )
}

function TypewriterText({ text, delay = 0 }) {
  const [displayed, setDisplayed] = useState('')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    const timeout = setTimeout(() => {
      let i = 0
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i))
        i++
        if (i > text.length) clearInterval(interval)
      }, 30)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timeout)
  }, [isInView, text, delay])

  return <span ref={ref}>{displayed}<span className="animate-pulse">|</span></span>
}

export default function Insights() {
  const [period, setPeriod] = useState('weekly')
  const [showAiMessage, setShowAiMessage] = useState(false)
  const { money, habits, learning } = useDashboardStore()

  const weeklyData = [
    { name: 'Mon', money: 120, habits: 3, learning: 4 },
    { name: 'Tue', money: 95, habits: 4, learning: 6 },
    { name: 'Wed', money: 140, habits: 2, learning: 3 },
    { name: 'Thu', money: 110, habits: 5, learning: 5 },
    { name: 'Fri', money: 160, habits: 3, learning: 7 },
    { name: 'Sat', money: 80, habits: 4, learning: 2 },
    { name: 'Sun', money: 200, habits: 5, learning: 5 },
  ]

  const monthlyData = [
    { name: 'Week 1', money: 650, habits: 22, learning: 24 },
    { name: 'Week 2', money: 720, habits: 25, learning: 28 },
    { name: 'Week 3', money: 580, habits: 20, learning: 22 },
    { name: 'Week 4', money: 810, habits: 28, learning: 30 },
  ]

  const data = period === 'weekly' ? weeklyData : monthlyData

  const habitData = [
    { name: 'Done', value: habits.filter(h => h.completed).length, color: '#10B981' },
    { name: 'Pending', value: habits.filter(h => !h.completed).length, color: '#F59E0B' },
  ]

  const savingsData = money.history.map(h => ({
    month: h.month,
    savings: h.income - h.expenses,
  }))

  const stats = [
    { label: 'Money Saved', value: 1800, suffix: '', icon: Wallet, color: 'text-brand-green' },
    { label: 'Habit Streak', value: 15, suffix: ' days', icon: Target, color: 'text-brand-orange' },
    { label: 'Learning Hours', value: 32, suffix: 'h', icon: BookOpen, color: 'text-brand-blue' },
    { label: 'Completion Rate', value: 68, suffix: '%', icon: TrendingUp, color: 'text-brand-violet' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-violet/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-brand-violet" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Insights</h1>
                <p className="text-sm text-muted-foreground">Track your progress across all areas</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAiMessage(!showAiMessage)}
                className="gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Get AI Summary
              </Button>
              <Tabs value={period} onValueChange={setPeriod}>
                <TabsList className="h-9">
                  <TabsTrigger value="weekly" className="text-xs">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly" className="text-xs">Monthly</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </motion.div>

          <AnimatePresence>
            {showAiMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 p-4 rounded-xl border border-brand-violet/20 bg-brand-violet/5"
              >
                <p className="text-sm text-muted-foreground mb-2">AI coming soon — add your API key to unlock personalized insights</p>
                <div className="text-sm font-medium">
                  <TypewriterText
                    text="Based on your current data, you're showing strong consistency in learning habits. Your money management could benefit from reducing discretionary spending. Consider focusing on completing your pending habits to boost your overall streak."
                    delay={500}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-5 rounded-2xl border border-border bg-card"
              >
                <div className={`w-8 h-8 rounded-lg bg-muted flex items-center justify-center mb-3`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold mb-1">
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-5 rounded-2xl border border-border bg-card"
            >
              <h3 className="font-semibold mb-4">Activity Overview</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                    }}
                  />
                  <Bar dataKey="money" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="habits" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="learning" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-5 rounded-2xl border border-border bg-card"
            >
              <h3 className="font-semibold mb-4">Savings Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={savingsData}>
                  <defs>
                    <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                    }}
                  />
                  <Area type="monotone" dataKey="savings" stroke="#7C3AED" fill="url(#savingsGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-5 rounded-2xl border border-border bg-card"
            >
              <h3 className="font-semibold mb-4">Learning Streak</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                    }}
                  />
                  <Line type="monotone" dataKey="learning" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-5 rounded-2xl border border-border bg-card"
            >
              <h3 className="font-semibold mb-4">Habits Today</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={habitData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {habitData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                {habitData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    {entry.name}: {entry.value}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
