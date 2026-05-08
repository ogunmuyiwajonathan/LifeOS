import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Flame,
  Trophy,
  Calendar,
  Timer,
} from 'lucide-react'

import {
  getStreakData,
  getLast7DaysActivity,
  getStreakMessage,
} from '@/utils/streak'

function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  
  const pad = (n) => n.toString().padStart(2, '0')
  return { hours: pad(hours), minutes: pad(minutes), seconds: pad(seconds) }
}

export default function StreakBanner() {
  const [streakData, setStreakData] = useState(null)
  const [last7Days, setLast7Days] = useState([])
  const [secondsToday, setSecondsToday] = useState(0)

  useEffect(() => {
    const data = getStreakData()
    setStreakData(data)
    setLast7Days(getLast7DaysActivity())

    // Check date and reset if new day
    const today = new Date().toDateString()
    const savedDate = localStorage.getItem('lifeos_session_date')
    const savedSeconds = Number(localStorage.getItem('lifeos_seconds_today')) || 0

    if (savedDate !== today) {
      // New day - reset everything
      localStorage.setItem('lifeos_session_date', today)
      localStorage.setItem('lifeos_seconds_today', '0')
      localStorage.setItem('lifeos_session_start', Date.now().toString())
      setSecondsToday(0)
    } else {
      // Same day - calculate elapsed time since last visit
      const sessionStart = Number(localStorage.getItem('lifeos_session_start')) || Date.now()
      const elapsed = Math.floor((Date.now() - sessionStart) / 1000)
      const total = savedSeconds + Math.max(0, elapsed)
      setSecondsToday(total)
    }

    // Update session start for this visit
    localStorage.setItem('lifeos_session_start', Date.now().toString())
  }, [])

  // Live timer - counts every second while on page
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsToday((prev) => {
        const next = prev + 1
        localStorage.setItem('lifeos_seconds_today', next.toString())
        return next
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Handle page visibility changes (pause when tab hidden)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Save current time when leaving
        localStorage.setItem('lifeos_seconds_today', secondsToday.toString())
      } else {
        // Update session start when returning
        localStorage.setItem('lifeos_session_start', Date.now().toString())
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [secondsToday])

  if (!streakData) return null

  const {
    currentStreak,
    longestStreak,
    totalDaysActive,
  } = streakData

  const message = getStreakMessage(currentStreak)
  const time = formatTime(secondsToday)

  const currentWeekday = new Date().toLocaleDateString(
    'en-US',
    { weekday: 'long' }
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-[32px] border border-[#1e3028] bg-gradient-to-br from-[#07110b] via-[#0c1c14] to-[#07110b] p-8 mb-6 shadow-[0_0_50px_rgba(5,150,105,0.08)]"
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#059669]/10 blur-3xl rounded-full" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-[#059669]/5 blur-[100px] rounded-full" />

      {/* Weekday Badge */}
      <div className="absolute left-1/2 top-6 -translate-x-1/2">
        <div className="px-6 py-3 rounded-full border border-[#1e3028] bg-[#0f1f18]/70 backdrop-blur-xl shadow-[0_0_18px_rgba(5,150,105,0.12)]">
          <span className="text-[#34d399] text-sm font-semibold tracking-wide">
            {currentWeekday}
          </span>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 xl:grid-cols-3 gap-10 items-center pt-10">
        
        {/* LEFT - Streak Info */}
        <div className="space-y-5">
          <motion.div
            key={currentStreak}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 120 }}
            className="flex items-center gap-4"
          >
            <div className="w-16 h-16 rounded-3xl bg-[#059669]/15 border border-[#059669]/30 flex items-center justify-center shadow-[0_0_25px_rgba(5,150,105,0.2)]">
              <Flame className="w-8 h-8 text-orange-400" />
            </div>

            <div>
              <h2 className="text-4xl font-bold text-white leading-none">
                {currentStreak} <span className="text-2xl text-gray-400 font-medium">Day Streak</span>
              </h2>
              <p className="text-[#34d399] text-lg mt-2">Keep going🫡</p>
            </div>
          </motion.div>

          <div className="flex flex-wrap gap-4">
            <div className="bg-[#0f1f18]/80 border border-[#1e3028] rounded-2xl px-5 py-4 min-w-[170px] backdrop-blur-xl">
              <div className="flex items-center gap-2 text-[#34d399] text-sm mb-2">
                <Trophy className="w-4 h-4" />
                Longest Streak
              </div>
              <div className="text-white text-3xl font-bold">{longestStreak}</div>
              <div className="text-gray-500 text-sm">days</div>
            </div>

            <div className="bg-[#0f1f18]/80 border border-[#1e3028] rounded-2xl px-5 py-4 min-w-[170px] backdrop-blur-xl">
              <div className="flex items-center gap-2 text-[#34d399] text-sm mb-2">
                <Calendar className="w-4 h-4" />
                Active Days
              </div>
              <div className="text-white text-3xl font-bold">{totalDaysActive}</div>
              <div className="text-gray-500 text-sm">total</div>
            </div>
          </div>
        </div>

        {/* CENTER - Digital Session Timer */}
        <div className="flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            {/* Outer glow */}
            <div className="absolute inset-0 rounded-[28px] bg-gradient-to-b from-[#059669]/20 to-transparent blur-xl" />
            
            <div className="relative bg-[#050a07] border border-[#1e3028] rounded-[24px] p-6 shadow-[0_0_60px_rgba(5,150,105,0.1),inset_0_1px_0_rgba(255,255,255,0.05)]">
              {/* Timer Header */}
              <div className="flex items-center justify-center gap-2 mb-5">
                <Timer className="w-4 h-4 text-[#34d399]" />
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Time on Site Today</span>
                <div className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
              </div>

              {/* Digital Display */}
              <div className="flex items-baseline justify-center gap-1 font-mono">
                {/* Hours */}
                <div className="flex flex-col items-center">
                  <div className="bg-[#0a120d] border border-[#1e3028] rounded-xl px-3 py-2 min-w-[64px] text-center">
                    <span className="text-4xl font-bold text-white tabular-nums tracking-tight">
                      {time.hours}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-600 mt-1 uppercase">Hrs</span>
                </div>

                {/* Separator */}
                <span className="text-2xl text-[#1e3028] font-bold pb-6">:</span>

                {/* Minutes */}
                <div className="flex flex-col items-center">
                  <div className="bg-[#0a120d] border border-[#1e3028] rounded-xl px-3 py-2 min-w-[64px] text-center">
                    <span className="text-4xl font-bold text-white tabular-nums tracking-tight">
                      {time.minutes}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-600 mt-1 uppercase">Min</span>
                </div>

                {/* Separator */}
                <span className="text-2xl text-[#1e3028] font-bold pb-6">:</span>

                {/* Seconds */}
                <div className="flex flex-col items-center">
                  <div className="bg-[#0a120d] border border-[#1e3028] rounded-xl px-3 py-2 min-w-[64px] text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#059669]/5 to-transparent" />
                    <span className="relative text-4xl font-bold text-[#34d399] tabular-nums tracking-tight">
                      {time.seconds}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-600 mt-1 uppercase">Sec</span>
                </div>
              </div>

              {/* Subtle footer */}
              <div className="mt-4 text-center">
                <span className="text-[10px] text-gray-600">Resets at midnight</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT - 7 Day Activity */}
        <div className="flex justify-end">
          <div className="flex items-end gap-3">
            {last7Days.map((day, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-2"
              >
                <span className="text-xs text-gray-500 font-medium">
                  {day.dayName.slice(0, 3)}
                </span>

                <motion.div
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    day.isActive
                      ? 'bg-gradient-to-b from-[#059669] to-[#047857] shadow-[0_0_20px_rgba(5,150,105,0.4)]'
                      : 'bg-[#08120d] border border-[#1e3028]'
                  } ${
                    day.isToday
                      ? 'ring-2 ring-[#34d399] ring-offset-2 ring-offset-[#07110b]'
                      : ''
                  }`}
                >
                  {day.isActive && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <Flame className="w-5 h-5 text-white" />
                    </motion.div>
                  )}
                </motion.div>

                {day.isToday && (
                  <span className="text-[10px] font-bold text-[#34d399]">
                    NOW
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}