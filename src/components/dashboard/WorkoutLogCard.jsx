import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Dumbbell, Plus } from 'lucide-react'
import CardWrapper from './CardWrapper'
import { getDateISO, readRoot, updateRoot } from './storage'

export default function WorkoutLogCard() {
  const [showForm, setShowForm] = useState(false)
  const [pendingSession, setPendingSession] = useState(false)
  const [data, setData] = useState({ workoutLog: [], archived: [], weekSessions: 0, weekKey: '' })
  const [form, setForm] = useState({ exercise: '', sets: '', reps: '', weight: '' })

  useEffect(() => {
    const now = new Date()
    const weekKey = `${now.getFullYear()}-${Math.ceil((now.getDate() + 6 - now.getDay()) / 7)}`
    const stored = readRoot('lifeosHabitsData')
    const next = { workoutLog: stored.workoutLog || [], archived: stored.workoutArchive || [], weekSessions: stored.weekSessions || 0, weekKey: stored.weekKey || weekKey }
    if (next.weekKey !== weekKey) next.weekSessions = 0
    next.weekKey = weekKey
    setData(next)
    updateRoot('lifeosHabitsData', (current) => ({ ...current, workoutLog: next.workoutLog, workoutArchive: next.archived, weekSessions: next.weekSessions, weekKey: next.weekKey }))
  }, [])

  const save = (next) => {
    setData(next)
    updateRoot('lifeosHabitsData', (current) => ({ ...current, workoutLog: next.workoutLog, workoutArchive: next.archived, weekSessions: next.weekSessions, weekKey: next.weekKey }))
  }

  const addExercise = () => {
    if (!form.exercise.trim() || !form.sets || !form.reps) return
    save({ ...data, workoutLog: [...data.workoutLog, { id: Date.now(), ...form, date: getDateISO() }] })
    setForm({ exercise: '', sets: '', reps: '', weight: '' })
    setShowForm(false)
  }

  const sessionsThisWeek = useMemo(() => data.weekSessions, [data.weekSessions])

  return (
    <CardWrapper icon={<Dumbbell className="w-4 h-4 text-[#059669]" />} title="Workout Log" badge={`${sessionsThisWeek} sessions this week`}>
      <div className="space-y-3">
        <AnimatePresence>
          {showForm && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-[#071a0f] rounded-xl p-4 border border-[#1e3028] mb-3 overflow-hidden space-y-2">
            <input className="bg-[#0a0f0a] border border-[#1e3028] rounded-lg px-3 py-2 text-white w-full" placeholder="Exercise name" value={form.exercise} onChange={(e) => setForm((p) => ({ ...p, exercise: e.target.value }))} />
            <input type="number" className="bg-[#0a0f0a] border border-[#1e3028] rounded-lg px-3 py-2 text-white w-full" placeholder="Sets" value={form.sets} onChange={(e) => setForm((p) => ({ ...p, sets: e.target.value }))} />
            <input type="number" className="bg-[#0a0f0a] border border-[#1e3028] rounded-lg px-3 py-2 text-white w-full" placeholder="Reps" value={form.reps} onChange={(e) => setForm((p) => ({ ...p, reps: e.target.value }))} />
            <input type="number" className="bg-[#0a0f0a] border border-[#1e3028] rounded-lg px-3 py-2 text-white w-full" placeholder="Weight in kg (optional)" value={form.weight} onChange={(e) => setForm((p) => ({ ...p, weight: e.target.value }))} />
            <button onClick={addExercise} className="bg-[#059669] hover:bg-[#047857] text-white rounded-lg px-4 py-2 w-full mt-2">Log Exercise</button>
          </motion.div>}
        </AnimatePresence>
        {!showForm && <button onClick={() => setShowForm(true)} className="w-full border-2 border-dashed border-[#1e3028] rounded-xl p-2 flex items-center justify-center gap-2 hover:border-[#059669]"><Plus size={14} className="text-[#059669]" /><span className="text-gray-400 text-sm">Log exercise</span></button>}
        <div className="space-y-2">{data.workoutLog.map((row) => <div key={row.id} className="bg-[#071a0f] border border-[#1e3028] rounded-lg px-3 py-2 text-sm grid grid-cols-3 gap-2"><span className="text-white">{row.exercise}</span><span className="text-gray-300">{row.sets} × {row.reps}</span><span className="text-gray-400 text-right">{row.weight ? `${row.weight}kg` : '—'}</span></div>)}</div>
        <button onClick={() => { if (!pendingSession) { setPendingSession(true); return } save({ ...data, archived: [...data.archived, { date: getDateISO(), entries: data.workoutLog }], workoutLog: [], weekSessions: data.weekSessions + 1 }); setPendingSession(false) }} className={`w-full rounded-lg px-4 py-2 ${pendingSession ? 'bg-orange-700 text-white' : 'bg-[#052e16] text-[#059669]'}`}>{pendingSession ? 'Confirm new session?' : 'New Session'}</button>
      </div>
    </CardWrapper>
  )
}
