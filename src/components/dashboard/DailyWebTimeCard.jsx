import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Pause, Play, Settings } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import CardWrapper from './CardWrapper'

export default function DailyWebTimeCard() {
  const [seconds, setSeconds] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [dailyGoal, setDailyGoal] = useState(60) // Default 60 minutes
  const [showGoalInput, setShowGoalInput] = useState(false)
  const [goalInput, setGoalInput] = useState('')
  const [sessions, setSessions] = useState(0)
  const [weekData, setWeekData] = useState([])
  const [goalReached, setGoalReached] = useState(false)

  // Format seconds to "1h 24m" format
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  // Load initial data from localStorage
  useEffect(() => {
    const loadData = () => {
      const stored = localStorage.getItem('lifeosWebTimer')
      if (stored) {
        const data = JSON.parse(stored)
        const today = new Date().toDateString()

        if (data.date === today) {
          // Same day - load saved time
          setSeconds(data.seconds || 0)
          setSessions(data.sessions || 0)
        } else {
          // New day - reset and save the previous day's data
          if (data.seconds > 0) {
            saveWeeklyData(data.seconds)
          }
          setSeconds(0)
          setSessions(0)
        }

        setDailyGoal(data.dailyGoal || 60)
      }

      // Load week data
      const weekStored = localStorage.getItem('lifeosWebTimerWeek')
      if (weekStored) {
        setWeekData(JSON.parse(weekStored))
      }
    }

    loadData()
  }, [])

  // Timer effect
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isPaused])

  // Check if goal reached
  useEffect(() => {
    const minutes = Math.floor(seconds / 60)
    if (minutes >= dailyGoal && !goalReached) {
      setGoalReached(true)
    } else if (minutes < dailyGoal && goalReached) {
      setGoalReached(false)
    }
  }, [seconds, dailyGoal, goalReached])

  // Save to localStorage every 30 seconds
  useEffect(() => {
    const saveInterval = setInterval(() => {
      const today = new Date().toDateString()
      const data = {
        date: today,
        seconds,
        sessions,
        dailyGoal,
      }
      localStorage.setItem('lifeosWebTimer', JSON.stringify(data))
    }, 30000)

    return () => clearInterval(saveInterval)
  }, [seconds, sessions, dailyGoal])

  // Save on visibility change (page close/hide)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const today = new Date().toDateString()
        const data = {
          date: today,
          seconds,
          sessions,
          dailyGoal,
        }
        localStorage.setItem('lifeosWebTimer', JSON.stringify(data))
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [seconds, sessions, dailyGoal])

  // Save weekly data
  const saveWeeklyData = (timeSpent) => {
    const today = new Date()
    const dayName = today.toLocaleDateString('en-US', { weekday: 'short' })
    const dateKey = today.toDateString()

    let week = JSON.parse(localStorage.getItem('lifeosWebTimerWeek') || '[]')

    // Remove old entries (keep only 7 days)
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    week = week.filter((entry) => new Date(entry.date) >= weekAgo)

    // Check if today is already in the week
    const todayIndex = week.findIndex((entry) => entry.date === dateKey)
    if (todayIndex >= 0) {
      week[todayIndex].minutes = Math.floor(timeSpent / 60)
    } else {
      week.push({
        date: dateKey,
        day: dayName,
        minutes: Math.floor(timeSpent / 60),
      })
    }

    setWeekData(week)
    localStorage.setItem('lifeosWebTimerWeek', JSON.stringify(week))
  }

  // Handle pause/play
  const togglePause = () => {
    setIsPaused(!isPaused)
    if (!isPaused) {
      // Starting a new session
      setSessions((prev) => prev + 1)
    }
  }

  // Handle goal change
  const handleSetGoal = () => {
    const newGoal = parseInt(goalInput) || 60
    setDailyGoal(newGoal)
    setShowGoalInput(false)
    setGoalInput('')
  }

  const minutes = Math.floor(seconds / 60)
  const progressPercent = Math.min(100, (minutes / dailyGoal) * 100)

  // Prepare chart data
  const chartData = weekData.map((entry) => ({
    day: entry.day,
    time: entry.minutes,
  }))

  return (
    <CardWrapper
      icon={<Clock className="w-4 h-4 text-[#059669]" />}
      title="Daily Web Time"
      badge={`${sessions} ${sessions === 1 ? 'session' : 'sessions'}`}
    >
      <div className="space-y-6">
        {/* Timer Display */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={goalReached ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 2, repeat: goalReached ? Infinity : 0 }}
            className="text-6xl font-bold text-[#059669] font-mono mb-2"
          >
            {formatTime(seconds)}
          </motion.div>
          {goalReached && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-[#059669] font-medium"
            >
              ✨ Daily goal reached!
            </motion.p>
          )}
        </motion.div>

        {/* Circular Progress Ring */}
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#1e3028"
                strokeWidth="6"
              />
              {/* Progress circle */}
              <motion.circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#059669"
                strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 50}`}
                initial={{ strokeDashoffset: `${2 * Math.PI * 50}` }}
                animate={{
                  strokeDashoffset: `${2 * Math.PI * 50 * (1 - progressPercent / 100)}`,
                }}
                transition={{ duration: 0.5 }}
                strokeLinecap="round"
                filter="url(#glow)"
              />
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-sm text-gray-400">of daily goal</div>
                <div className="text-lg font-bold text-white">{progressPercent.toFixed(0)}%</div>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">{minutes} / {dailyGoal} minutes</p>
        </div>

        {/* Goal Setting */}
        <div className="px-3 py-2 bg-[#071a0f] rounded-lg border border-[#1e3028]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Daily Goal</span>
            {!showGoalInput ? (
              <button
                onClick={() => setShowGoalInput(true)}
                className="flex items-center gap-2 text-[#059669] hover:text-[#10b981] transition-colors"
              >
                <span className="font-medium">{dailyGoal} min</span>
                <Settings className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex gap-2">
                <input
                  type="number"
                  autoFocus
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  placeholder={dailyGoal.toString()}
                  className="w-16 bg-[#0a0f0a] border border-[#1e3028] rounded px-2 py-1 text-white text-sm"
                />
                <button
                  onClick={handleSetGoal}
                  className="px-2 py-1 bg-[#059669] hover:bg-[#047857] text-white text-xs rounded transition-colors"
                >
                  Set
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Pause/Play Button */}
        <button
          onClick={togglePause}
          className="w-full flex items-center justify-center gap-2 py-2 bg-[#059669] hover:bg-[#047857] text-white rounded-lg transition-colors font-medium"
        >
          {isPaused ? (
            <>
              <Play className="w-4 h-4" /> Resume
            </>
          ) : (
            <>
              <Pause className="w-4 h-4" /> Pause
            </>
          )}
        </button>

        {/* Weekly Chart */}
        {chartData.length > 0 && (
          <div className="pt-2">
            <p className="text-xs text-gray-400 mb-2">Last 7 days</p>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3028" />
                <XAxis dataKey="day" stroke="#8aa89a" tick={{ fontSize: 12 }} />
                <YAxis stroke="#8aa89a" tick={{ fontSize: 12 }} width={30} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a0f0a',
                    border: '1px solid #1e3028',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#059669' }}
                  formatter={(value) => `${value}m`}
                />
                <Line
                  type="monotone"
                  dataKey="time"
                  stroke="#059669"
                  dot={{ fill: '#059669', r: 3 }}
                  animationDuration={500}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </CardWrapper>
  )
}
