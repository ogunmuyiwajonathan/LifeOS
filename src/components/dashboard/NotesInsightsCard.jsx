import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FileText, Pencil, Plus, Trash2, X } from 'lucide-react'
import CardWrapper from './CardWrapper'
import { readRoot, updateRoot } from './storage'

export default function NotesInsightsCard() {
  const timers = useRef({})
  const [notes, setNotes] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [expanded, setExpanded] = useState({})
  const [editing, setEditing] = useState(null)
  const [confirmId, setConfirmId] = useState(null)
  const [form, setForm] = useState({ title: '', content: '' })
  useEffect(() => setNotes(readRoot('lifeosLearningData').notes || []), [])
  const save = (next) => { setNotes(next); updateRoot('lifeosLearningData', (current) => ({ ...current, notes: next })) }
  const deleteWithConfirm = (id) => {
    if (confirmId === id) { save(notes.filter((item) => item.id !== id)); setConfirmId(null); return }
    setConfirmId(id)
    clearTimeout(timers.current[id])
    timers.current[id] = setTimeout(() => setConfirmId((prev) => (prev === id ? null : prev)), 2000)
  }
  return (
    <CardWrapper icon={<FileText className="w-4 h-4 text-[#059669]" />} title="Notes & Insights" badge={`${notes.length}`}>
      <div className="space-y-3">
        <AnimatePresence>{showForm && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-[#071a0f] rounded-xl p-4 border border-[#1e3028] mb-3 overflow-hidden space-y-2"><input className="bg-[#0a0f0a] border border-[#1e3028] rounded-lg px-3 py-2 text-white w-full" placeholder="Note title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} /><textarea rows={3} className="bg-[#0a0f0a] border border-[#1e3028] rounded-lg px-3 py-2 text-white w-full" placeholder="Note content" value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} /><div className="flex gap-2 mt-2"><button onClick={() => { if (!form.title.trim() || !form.content.trim()) return; save([...notes, { id: Date.now(), ...form }]); setShowForm(false); setForm({ title: '', content: '' }) }} className="bg-[#059669] hover:bg-[#047857] text-white rounded-lg px-4 py-2 flex-1">Save Note</button><button onClick={() => { setShowForm(false); setForm({ title: '', content: '' }) }} className="w-10 h-10 rounded-lg bg-[#0a0f0a] border border-[#1e3028] flex items-center justify-center text-gray-400 hover:text-white"><X className="w-4 h-4" /></button></div></motion.div>}</AnimatePresence>
        {!showForm && <button onClick={() => setShowForm(true)} className="w-full border-2 border-dashed border-[#1e3028] rounded-xl p-2 flex items-center justify-center gap-2 hover:border-[#059669]"><Plus size={14} className="text-[#059669]" /><span className="text-gray-400 text-sm">Add note</span></button>}
        {notes.map((note) => <div key={note.id} className="bg-[#071a0f] border border-[#1e3028] rounded-lg p-3 text-sm"><button className="w-full text-left" onClick={() => setExpanded((prev) => ({ ...prev, [note.id]: !prev[note.id] }))}><div className="text-white font-medium">{note.title}</div><div className="text-gray-400 text-xs mt-1">{(expanded[note.id] ? note.content : note.content.slice(0, 80))}{!expanded[note.id] && note.content.length > 80 ? '...' : ''}</div></button>{editing === note.id ? <div className="space-y-2 mt-2"><input className="bg-[#0a0f0a] border border-[#1e3028] rounded px-2 py-1 text-white w-full" defaultValue={note.title} id={`title-${note.id}`} /><textarea rows={3} className="bg-[#0a0f0a] border border-[#1e3028] rounded px-2 py-1 text-white w-full" defaultValue={note.content} id={`content-${note.id}`} /><button onClick={() => { const title = document.getElementById(`title-${note.id}`).value; const content = document.getElementById(`content-${note.id}`).value; save(notes.map((item) => item.id === note.id ? { ...item, title, content } : item)); setEditing(null) }} className="bg-[#059669] text-white rounded px-3 py-1 text-xs">Save</button></div> : <div className="flex gap-3 mt-2 text-xs"><button onClick={() => setEditing(note.id)} className="text-[#059669] inline-flex items-center gap-1"><Pencil className="w-4 h-4" /> Edit</button><button onClick={() => deleteWithConfirm(note.id)} className={confirmId === note.id ? 'bg-red-900/50 text-red-400 border border-red-800 px-2 rounded inline-flex items-center gap-1' : 'text-red-400 inline-flex items-center gap-1'}>{confirmId === note.id ? 'Confirm?' : <><Trash2 className="w-4 h-4" /> Delete</>}</button></div>}</div>)}
      </div>
    </CardWrapper>
  )
}
