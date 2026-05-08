import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Plus, Trash2, Users, X } from 'lucide-react'
import CardWrapper from './CardWrapper'
import { getDateISO, readRoot, updateRoot } from './storage'

export default function NetworkingCard() {
  const timerRef = useRef({})
  const [showForm, setShowForm] = useState(false)
  const [confirmId, setConfirmId] = useState(null)
  const [contacts, setContacts] = useState([])
  const [form, setForm] = useState({ name: '', company: '', source: '', followUpDate: '' })
  useEffect(() => setContacts(readRoot('lifeosOpportunitiesData').contacts || []), [])
  const save = (next) => { setContacts(next); updateRoot('lifeosOpportunitiesData', (current) => ({ ...current, contacts: next })) }
  const remove = (id) => { if (confirmId === id) { save(contacts.filter((item) => item.id !== id)); setConfirmId(null); return } setConfirmId(id); clearTimeout(timerRef.current[id]); timerRef.current[id] = setTimeout(() => setConfirmId((prev) => (prev === id ? null : prev)), 2000) }
  const today = getDateISO()
  return (
    <CardWrapper icon={<Users className="w-4 h-4 text-[#059669]" />} title="Networking" badge={`${contacts.length}`}>
      <div className="space-y-3">
        <AnimatePresence>{showForm && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-[#071a0f] rounded-xl p-4 border border-[#1e3028] overflow-hidden space-y-2"><input className="bg-[#0a0f0a] border border-[#1e3028] rounded-lg px-3 py-2 text-white w-full" placeholder="Full name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /><input className="bg-[#0a0f0a] border border-[#1e3028] rounded-lg px-3 py-2 text-white w-full" placeholder="Company" value={form.company} onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))} /><input className="bg-[#0a0f0a] border border-[#1e3028] rounded-lg px-3 py-2 text-white w-full" placeholder="How you met" value={form.source} onChange={(e) => setForm((p) => ({ ...p, source: e.target.value }))} /><input type="date" className="bg-[#0a0f0a] border border-[#1e3028] rounded-lg px-3 py-2 text-white w-full" value={form.followUpDate} onChange={(e) => setForm((p) => ({ ...p, followUpDate: e.target.value }))} /><div className="flex gap-2 mt-2"><button onClick={() => { if (!form.name || !form.company || !form.followUpDate) return; save([...contacts, { id: Date.now(), ...form }]); setShowForm(false); setForm({ name: '', company: '', source: '', followUpDate: '' }) }} className="bg-[#059669] hover:bg-[#047857] text-white rounded-lg px-4 py-2 flex-1">Add Contact</button><button onClick={() => { setShowForm(false); setForm({ name: '', company: '', source: '', followUpDate: '' }) }} className="w-10 h-10 rounded-lg bg-[#0a0f0a] border border-[#1e3028] flex items-center justify-center text-gray-400 hover:text-white"><X className="w-4 h-4" /></button></div></motion.div>}</AnimatePresence>
        {!showForm && <button onClick={() => setShowForm(true)} className="w-full border-2 border-dashed border-[#1e3028] rounded-xl p-2 flex items-center justify-center gap-2 hover:border-[#059669]"><Plus size={14} className="text-[#059669]" /><span className="text-gray-400 text-sm">Add contact</span></button>}
        {contacts.map((contact) => { const overdue = contact.followUpDate < today; const dueToday = contact.followUpDate === today; return <div key={contact.id} className={`bg-[#071a0f] border rounded-lg px-3 py-2 text-sm flex items-center justify-between ${dueToday ? 'border-green-700 border-l-4' : overdue ? 'border-orange-700 border-l-4' : 'border-[#1e3028]'}`}><div><div className="text-white font-medium">{contact.name}</div><div className="text-gray-400 text-xs">{contact.company}</div><div className="text-gray-400 text-xs">{contact.followUpDate}</div></div><div className="flex items-center gap-2">{overdue && !dueToday && <AlertTriangle className="w-4 h-4 text-orange-400" />}{dueToday && <span className="text-green-400 text-xs">Follow up today!</span>}<button onClick={() => remove(contact.id)} className={confirmId === contact.id ? 'bg-red-900/50 text-red-400 border border-red-800 px-2 rounded text-xs' : 'text-gray-400 hover:text-red-400'}>{confirmId === contact.id ? 'Confirm?' : <Trash2 size={14} />}</button></div></div> })}
      </div>
    </CardWrapper>
  )
}
