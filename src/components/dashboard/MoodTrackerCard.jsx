import { useEffect, useMemo, useState } from 'react'
import { Smile } from 'lucide-react'
import CardWrapper from './CardWrapper'
import { getDateISO, readRoot, updateRoot } from './storage'

const MOODS = [
  { mood: '😢', label: 'Awful' },
  { mood: '😟', label: 'Bad' },
  { mood: '😐', label: 'Okay' },
  { mood: '😊', label: 'Good' },
  { mood: '😄', label: 'Great' },
]

const MOTIVATION = {
  '😢': ["Tough times never last, but tough people do.", "Your story isn't over.", "Be proud of yourself."],
  '😟': ["Your success rate is 100%.", "Beautiful things happen.", "Small steps still add up."],
  '😐': ["Start where you are.", "Do what you can.", "Small steps matter."],
  '😊': ["Celebrate your progress!", "Enjoy this moment.", "Let your joy be contagious."],
  '😄': ["Keep that momentum going!", "You're doing great.", "Share your positive energy!"],
}

export default function MoodTrackerCard() {
  const [history, setHistory] = useState([])
  const [motivation, setMotivation] = useState('')

  useEffect(() => {
    setHistory(readRoot('lifeosHabitsData').moodHistory || [])
  }, [])

  const save = (next) => {
    setHistory(next)
    updateRoot('lifeosHabitsData', (current) => ({
      ...current,
      moodHistory: next,
    }))
  }

  const today = getDateISO()
  const todayEntry = history.find((item) => item.date === today)

  useEffect(() => {
    if (todayEntry) {
      const messages = MOTIVATION[todayEntry.mood]
      const random = messages[Math.floor(Math.random() * messages.length)]
      setMotivation(random)
    } else {
      setMotivation('')
    }
  }, [todayEntry])

  const selectMood = (entry) => {
    if (todayEntry?.mood === entry.mood) {
      return save(history.filter((item) => item.date !== today))
    }
    save([...history.filter((item) => item.date !== today), { date: today, mood: entry.mood, label: entry.label }])
  }

  const last7 = Array.from({ length: 7 }, (_, idx) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - idx))
    const date = d.toISOString().split('T')[0]
    return {
      date,
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      entry: history.find((item) => item.date === date),
    }
  })

  const mostCommon = useMemo(() => {
    const weekly = last7.filter((item) => item.entry).map((item) => item.entry)
    if (!weekly.length) return null
    const count = weekly.reduce((acc, item) => ({ ...acc, [item.mood]: (acc[item.mood] || 0) + 1 }), {})
    const mood = Object.keys(count).sort((a, b) => count[b] - count[a])[0]
    return MOODS.find((item) => item.mood === mood)
  }, [history])

  return (
    <CardWrapper
      icon={<Smile className="w-4 h-4 text-[#059669]" />}
      title="Mood Tracker"
      badge={todayEntry?.mood || '—'}
    >
      {/* The "px-0" ensures the content hits the edges of the card if needed, 
        while "pb-2" ensures the bottom text isn't cut off by the card's rounded corner.
      */}
      <div className="space-y-6 p-2">
        
        {/* Motivation Quote */}
        {todayEntry && (
          <div className="mx-1 p-3 rounded-xl bg-[#0b1f18] border border-[#1e3028] text-sm text-[#86efac] animate-in fade-in slide-in-from-top-1">
            ✨ {motivation}
          </div>
        )}

        {/* Mood Selector Grid */}
        <div className="grid grid-cols-5 gap-1 sm:gap-2">
          {MOODS.map((entry) => {
            const isSelected = todayEntry?.mood === entry.mood;
            return (
              <div key={entry.mood} className="flex flex-col items-center gap-2">
                <button
                  onClick={() => selectMood(entry)}
                  className={`w-full aspect-square flex items-center justify-center text-2xl sm:text-3xl rounded-2xl border transition-all duration-300 ${
                    isSelected
                      ? 'border-[#059669] bg-[#059669]/20 shadow-[0_0_15px_rgba(5,150,105,0.4)] scale-105 z-10'
                      : 'border-[#1e3028] bg-[#0a120e]/50 opacity-60 hover:opacity-100'
                  }`}
                >
                  {entry.mood}
                </button>
                <span className={`text-[10px] uppercase tracking-tight ${isSelected ? 'text-[#059669] font-bold' : 'text-gray-500'}`}>
                  {entry.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[#1e3028] to-transparent" />

        {/* History Section */}
        <div className="space-y-4">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] pl-1">
            Last 7 Days
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {last7.map((day) => (
              <div key={day.date} className="flex flex-col items-center gap-2">
                <span className="text-[10px] text-gray-600 font-medium">{day.day[0]}</span>
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm ${
                  day.entry ? 'border-[#059669]/50 bg-[#059669]/10' : 'border-[#1e3028] bg-[#070c09]'
                }`}>
                  {day.entry?.mood || <div className="w-1 h-1 rounded-full bg-gray-800" />}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Summary */}
          <div className="flex items-center gap-2 px-1 pt-2">
            {mostCommon ? (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="text-lg">{mostCommon.mood}</span>
                <span>Weekly peak: <b className="text-gray-200">{mostCommon.label}</b></span>
              </div>
            ) : (
              <span className="text-xs text-gray-500 italic font-light">No data recorded this week</span>
            )}
          </div>
        </div>
      </div>
    </CardWrapper>
  )
}