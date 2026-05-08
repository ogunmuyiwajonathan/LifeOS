import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Target } from 'lucide-react'
import CardWrapper from './CardWrapper'

const FIELDS = ['Tech/Software', 'Business/Finance', 'Creative/Design', 'Healthcare', 'Marketing', 'Education', 'Engineering', 'Legal', 'Sales', 'Entrepreneurship']

export default function JobFieldsCard() {
  const [fields, setFields] = useState([])
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState([])
  useEffect(() => { const next = JSON.parse(localStorage.getItem('lifeosJobFields') || '[]'); setFields(next); setDraft(next) }, [])
  const save = () => { setFields(draft); localStorage.setItem('lifeosJobFields', JSON.stringify(draft)); setEditing(false); window.dispatchEvent(new Event('jobFieldsUpdated')); }
  return (
    <CardWrapper icon={<Target className="w-4 h-4 text-[#059669]" />} title="My Job Fields" badge={`${fields.length}`}>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">{fields.map((field) => <span key={field} className="px-2 py-1 rounded bg-[#052e16] text-[#059669] text-xs">{field}</span>)}</div>
        <button onClick={() => setEditing((v) => !v)} className="text-[#059669] text-sm">Edit Preferences</button>
        <AnimatePresence>{editing && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-[#071a0f] rounded-xl p-4 border border-[#1e3028] overflow-hidden"><div className="grid grid-cols-2 gap-2">{FIELDS.map((field) => <button key={field} onClick={() => setDraft((prev) => prev.includes(field) ? prev.filter((item) => item !== field) : [...prev, field])} className={`text-xs rounded-lg px-2 py-2 border ${draft.includes(field) ? 'border-[#059669] text-[#059669] bg-[#052e16]' : 'border-[#1e3028] text-gray-400'}`}>{field}</button>)}</div><button onClick={save} className="bg-[#059669] hover:bg-[#047857] text-white rounded-lg px-4 py-2 w-full mt-3">Save</button></motion.div>}</AnimatePresence>
      </div>
    </CardWrapper>
  )
}
