import { useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircle2, Timer } from 'lucide-react'
import CardWrapper from './CardWrapper'
import { getDateISO, readRoot, updateRoot } from './storage'

export default function StudySessionsCard() {
  const intervalRef = useRef(null)
  const [sessions, setSessions] = useState([])
  const [subject, setSubject] = useState('')
  const [duration, setDuration] = useState(25)
  const [remaining, setRemaining] = useState(0)
  const [paused, setPaused] = useState(false)
  const [flash, setFlash] = useState(false)
  const running = remaining > 0 && !paused
  useEffect(() => setSessions(readRoot('lifeosLearningData').studySessions || []), [])
  useEffect(() => () => clearInterval(intervalRef.current), [])
  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000)
    return () => clearInterval(intervalRef.current)
  }, [running])
  useEffect(() => {
    if (remaining !== 0) return
    if (!subject || !duration) return
    const entry = { id: Date.now(), subject, duration: Number(duration), completedAt: new Date().toISOString() }
    const next = [...sessions, entry]
    setSessions(next)
    updateRoot('lifeosLearningData', (current) => ({ ...current, studySessions: next }))
    setFlash(true)
    setTimeout(() => setFlash(false), 900)
    setSubject('')
  }, [remaining])
  const startTimer = () => setRemaining(Math.max(0, Number(duration || 0) * 60))
  const reset = () => { setRemaining(0); setPaused(false) }
  const todaySessions = sessions.filter((item) => item.completedAt.startsWith(getDateISO()))
  const todayMinutes = todaySessions.reduce((sum, item) => sum + Number(item.duration || 0), 0)
  const thisWeek = useMemo(() => {
    const now = new Date()
    const start = new Date(now)
    start.setDate(now.getDate() - 6)
    return sessions.filter((item) => new Date(item.completedAt) >= start).length
  }, [sessions])
  const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss = String(remaining % 60).padStart(2, '0')
  return (
    <CardWrapper icon={<Timer className="w-4 h-4 text-[#059669]" />} title="Study Sessions" badge={`${Math.floor(todayMinutes / 60)}h ${todayMinutes % 60}m today`}>
      <div className={`space-y-3 ${flash ? 'bg-green-900/20 rounded-lg p-2' : ''}`}>
        <input className="bg-[#0a0f0a] border border-[#1e3028] rounded-lg px-3 py-2 text-white w-full" placeholder="Subject name" value={subject} onChange={(e) => setSubject(e.target.value)} />
        <input type="number" className="bg-[#0a0f0a] border border-[#1e3028] rounded-lg px-3 py-2 text-white w-full" placeholder="Duration in minutes" value={duration} onChange={(e) => setDuration(e.target.value)} />
        {remaining === 0 ? <button onClick={startTimer} className="bg-[#059669] hover:bg-[#047857] text-white rounded-lg px-4 py-2 w-full">Start Timer</button> : <div className={`text-center text-2xl font-bold text-white ${running ? 'animate-pulse' : ''}`}>{mm}:{ss}</div>}
        {remaining > 0 && <div className="flex gap-2"><button onClick={() => setPaused((v) => !v)} className="flex-1 bg-[#052e16] text-[#059669] rounded-lg px-3 py-2">{paused ? 'Resume' : 'Pause'}</button><button onClick={reset} className="flex-1 bg-[#1f2937] text-gray-300 rounded-lg px-3 py-2">Reset</button></div>}
        {flash && <div className="text-sm text-green-300 inline-flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-400" /> Session complete! Great work.</div>}
        <div className="space-y-2">{todaySessions.map((entry) => <div key={entry.id} className="bg-[#071a0f] border border-[#1e3028] rounded-lg px-3 py-2 text-sm flex justify-between"><span className="text-white">{entry.subject}</span><span className="text-gray-300">{entry.duration} min</span><span className="text-gray-400">{new Date(entry.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>)}</div>
        <div className="text-sm text-gray-400">Today: {Math.floor(todayMinutes / 60)}h {todayMinutes % 60}m total | This week: {thisWeek} sessions</div>
      </div>
    </CardWrapper>
  )
}
