import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Brain, Plus, X } from 'lucide-react'
import CardWrapper from './CardWrapper'
import { readRoot, updateRoot } from './storage'

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert']
const MAP = { Beginner: { pct: 25, color: 'bg-blue-500' }, Intermediate: { pct: 50, color: 'bg-yellow-500' }, Advanced: { pct: 75, color: 'bg-orange-500' }, Expert: { pct: 100, color: 'bg-green-500' } }

export default function SkillsCard() {
  const [skills, setSkills] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', level: 'Beginner' })
  useEffect(() => setSkills(readRoot('lifeosLearningData').skills || []), [])
  const save = (next) => { setSkills(next); updateRoot('lifeosLearningData', (current) => ({ ...current, skills: next })) }
  return (
    <CardWrapper icon={<Brain className="w-4 h-4 text-[#059669]" />} title="Skills" badge={`${skills.length}`}>
      <div className="space-y-3">
        <AnimatePresence>{showForm && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-[#071a0f] rounded-xl p-4 border border-[#1e3028] space-y-2 overflow-hidden"><input className="bg-[#0a0f0a] border border-[#1e3028] rounded-lg px-3 py-2 text-white w-full" placeholder="Skill name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /><select className="bg-[#0a0f0a] border border-[#1e3028] rounded-lg px-3 py-2 text-white w-full" value={form.level} onChange={(e) => setForm((p) => ({ ...p, level: e.target.value }))}>{LEVELS.map((level) => <option key={level}>{level}</option>)}</select><div className="flex gap-2 mt-2"><button onClick={() => { if (!form.name.trim()) return; save([...skills, { id: Date.now(), ...form }]); setShowForm(false); setForm({ name: '', level: 'Beginner' }) }} className="bg-[#059669] hover:bg-[#047857] text-white rounded-lg px-4 py-2 flex-1">Add Skill</button><button onClick={() => { setShowForm(false); setForm({ name: '', level: 'Beginner' }) }} className="w-10 h-10 rounded-lg bg-[#0a0f0a] border border-[#1e3028] flex items-center justify-center text-gray-400 hover:text-white"><X className="w-4 h-4" /></button></div></motion.div>}</AnimatePresence>
        {!showForm && <button onClick={() => setShowForm(true)} className="w-full border-2 border-dashed border-[#1e3028] rounded-xl p-2 flex items-center justify-center gap-2 hover:border-[#059669]"><Plus size={14} className="text-[#059669]" /><span className="text-gray-400 text-sm">Add skill</span></button>}
        {skills.map((skill) => { const levelData = MAP[skill.level]; return <div key={skill.id} className="bg-[#071a0f] border border-[#1e3028] rounded-lg p-3 text-sm"><div className="flex justify-between"><span className="text-white">{skill.name}</span><button onClick={() => { const idx = LEVELS.indexOf(skill.level); save(skills.map((item) => item.id === skill.id ? { ...item, level: LEVELS[(idx + 1) % LEVELS.length] } : item)) }} className="px-2 py-0.5 rounded text-xs bg-[#052e16] text-[#059669]">{skill.level}</button></div><div className="w-full h-2 bg-[#0a0f0a] rounded border border-[#1e3028] overflow-hidden mt-2"><div className={`h-full ${levelData.color}`} style={{ width: `${levelData.pct}%` }} /></div></div> })}
      </div>
    </CardWrapper>
  )
}
