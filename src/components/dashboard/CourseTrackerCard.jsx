import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, CheckCircle2, Flame, Plus, X } from 'lucide-react'
import CardWrapper from './CardWrapper'
import { getDateISO, getYesterdayISO, readRoot, updateRoot } from './storage'

export default function CourseTrackerCard() {
  const [courses, setCourses] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [streak, setStreak] = useState(0)
  const [form, setForm] = useState({ name: '', total: '', current: '0' })
  useEffect(() => {
    setCourses(readRoot('lifeosLearningData').courses || [])
    setStreak(readRoot('lifeosStreakData').moduleStreaks?.learning?.current || 0)
  }, [])
  const save = (next) => { setCourses(next); updateRoot('lifeosLearningData', (current) => ({ ...current, courses: next })) }
  const bumpStreak = () => {
    const today = getDateISO(); const yesterday = getYesterdayISO()
    const data = updateRoot('lifeosStreakData', (current) => { const learning = current.moduleStreaks?.learning || { current: 0, longest: 0, lastActive: null }; const next = learning.lastActive === today ? learning.current : learning.lastActive === yesterday ? learning.current + 1 : 1; return { ...current, moduleStreaks: { ...(current.moduleStreaks || {}), learning: { current: next, longest: Math.max(learning.longest || 0, next), lastActive: today } } } })
    setStreak(data.moduleStreaks.learning.current)
  }
  return (
    <CardWrapper icon={<BookOpen className="w-4 h-4 text-[#059669]" />} title="Course Tracker" badge={<span className="inline-flex items-center gap-1"><Flame className="w-4 h-4 text-orange-400" /> {streak} day streak</span>}>
      <div className="space-y-3">
        <AnimatePresence>{showForm && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-[#071a0f] rounded-xl p-4 border border-[#1e3028] space-y-2 overflow-hidden"><input className="bg-[#0a0f0a] border border-[#1e3028] rounded-lg px-3 py-2 text-white w-full" placeholder="Course/skill name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /><input type="number" className="bg-[#0a0f0a] border border-[#1e3028] rounded-lg px-3 py-2 text-white w-full" placeholder="Total lessons" value={form.total} onChange={(e) => setForm((p) => ({ ...p, total: e.target.value }))} /><input type="number" className="bg-[#0a0f0a] border border-[#1e3028] rounded-lg px-3 py-2 text-white w-full" placeholder="Current lesson" value={form.current} onChange={(e) => setForm((p) => ({ ...p, current: e.target.value }))} /><div className="flex gap-2 mt-2"><button onClick={() => { if (!form.name || !form.total) return; save([...courses, { id: Date.now(), name: form.name, total: Number(form.total), current: Number(form.current || 0) }]); setShowForm(false); setForm({ name: '', total: '', current: '0' }) }} className="bg-[#059669] hover:bg-[#047857] text-white rounded-lg px-4 py-2 flex-1">Add Course</button><button onClick={() => { setShowForm(false); setForm({ name: '', total: '', current: '0' }) }} className="w-10 h-10 rounded-lg bg-[#0a0f0a] border border-[#1e3028] flex items-center justify-center text-gray-400 hover:text-white"><X className="w-4 h-4" /></button></div></motion.div>}</AnimatePresence>
        {!showForm && <button onClick={() => setShowForm(true)} className="w-full border-2 border-dashed border-[#1e3028] rounded-xl p-2 flex items-center justify-center gap-2 hover:border-[#059669]"><Plus size={14} className="text-[#059669]" /><span className="text-gray-400 text-sm">Add course</span></button>}
        {courses.map((course) => { const pct = Math.min(100, course.total ? (course.current / course.total) * 100 : 0); return <div key={course.id} className="bg-[#071a0f] border border-[#1e3028] rounded-lg p-3 text-sm"><div className="flex justify-between"><span className="text-white font-medium">{course.name}</span>{course.current >= course.total && <CheckCircle2 className="w-4 h-4 text-green-400" />}</div><div className="w-full h-2 bg-[#0a0f0a] rounded border border-[#1e3028] overflow-hidden mt-2"><div className="h-full bg-[#059669]" style={{ width: `${pct}%` }} /></div><div className="flex justify-between mt-1 text-xs text-gray-400"><span>{course.current} / {course.total} lessons</span><span>{Math.round(pct)}%</span></div><button onClick={() => { save(courses.map((item) => item.id === course.id ? { ...item, current: Math.min(item.total, item.current + 1) } : item)); bumpStreak() }} className="mt-2 text-xs text-[#059669] inline-flex items-center gap-1"><Plus className="w-4 h-4" /> lesson</button></div> })}
      </div>
    </CardWrapper>
  )
}
