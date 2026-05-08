import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ClipboardList, Plus, Trash2, X } from 'lucide-react'
import CardWrapper from './CardWrapper'
import { readRoot, updateRoot } from './storage'

const STATUS = ['Applied', 'Interview', 'Offer', 'Rejected', 'Ghosted']
const STATUS_CLASS = { Applied: 'bg-blue-900 text-blue-300', Interview: 'bg-yellow-900 text-yellow-300', Offer: 'bg-green-900 text-green-300', Rejected: 'bg-red-900 text-red-300', Ghosted: 'bg-gray-800 text-gray-400' }

export default function ApplicationsCard() {
  const [showForm, setShowForm] = useState(false)
  const [applications, setApplications] = useState([])
  const [confirmId, setConfirmId] = useState(null)
  const [form, setForm] = useState({ company: '', role: '', date: '', status: 'Applied' })
  useEffect(() => setApplications(readRoot('lifeosOpportunitiesData').applications || []), [])
  const save = (next) => { setApplications(next); updateRoot('lifeosOpportunitiesData', (current) => ({ ...current, applications: next })) }
  const remove = (id) => {
    if (confirmId === id) {
      save(applications.filter((item) => item.id !== id))
      setConfirmId(null)
      return
    }
    setConfirmId(id)
    setTimeout(() => setConfirmId((prev) => (prev === id ? null : prev)), 2000)
  }

  
  return (
    <CardWrapper icon={<ClipboardList className="w-4 h-4 text-[#059669]" />} title="My Applications" badge={`${applications.filter((item) => ['Applied', 'Interview', 'Offer'].includes(item.status)).length}`}>
      <div className="space-y-3">
        <AnimatePresence>{showForm && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-[#071a0f] rounded-xl p-4 border border-[#1e3028] overflow-hidden space-y-2"><input className="bg-[#0a0f0a] border border-[#1e3028] rounded-lg px-3 py-2 text-white w-full" placeholder="Company name" value={form.company} onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))} /><input className="bg-[#0a0f0a] border border-[#1e3028] rounded-lg px-3 py-2 text-white w-full" placeholder="Role / Position" value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} /><input type="date" className="bg-[#0a0f0a] border border-[#1e3028] rounded-lg px-3 py-2 text-white w-full" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} /><select className="bg-[#0a0f0a] border border-[#1e3028] rounded-lg px-3 py-2 text-white w-full" value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>{STATUS.map((item) => <option key={item}>{item}</option>)}</select><div className="flex gap-2 mt-2"><button onClick={() => { if (!form.company || !form.role || !form.date) return; save([...applications, { id: Date.now(), ...form }]); setShowForm(false); setForm({ company: '', role: '', date: '', status: 'Applied' }) }} className="bg-[#059669] hover:bg-[#047857] text-white rounded-lg px-4 py-2 flex-1">Add Application</button><button onClick={() => { setShowForm(false); setForm({ company: '', role: '', date: '', status: 'Applied' }) }} className="w-10 h-10 rounded-lg bg-[#0a0f0a] border border-[#1e3028] flex items-center justify-center text-gray-400 hover:text-white"><X className="w-4 h-4" /></button></div></motion.div>}</AnimatePresence>
        {!showForm && <button onClick={() => setShowForm(true)} className="w-full border-2 border-dashed border-[#1e3028] rounded-xl p-2 flex items-center justify-center gap-2 hover:border-[#059669]"><Plus size={14} className="text-[#059669]" /><span className="text-gray-400 text-sm">Add application</span></button>}
        {applications.map((app) => <div key={app.id} className="bg-[#071a0f] border border-[#1e3028] rounded-lg px-3 py-2 text-sm flex items-center justify-between"><div><div className="text-white">{app.role} @ {app.company}</div><div className="text-gray-400 text-xs">{app.date}</div></div><button onClick={() => { const idx = STATUS.indexOf(app.status); save(applications.map((item) => item.id === app.id ? { ...item, status: STATUS[(idx + 1) % STATUS.length] } : item)) }} className={`px-2 py-1 rounded text-xs ${STATUS_CLASS[app.status]}`}>{app.status}</button><button onClick={() => remove(app.id)} className={confirmId === app.id ? 'bg-red-900/50 text-red-400 border border-red-800 rounded px-2 text-xs' : 'text-gray-400 hover:text-red-400'}>{confirmId === app.id ? 'Confirm?' : <Trash2 size={14} />}</button></div>)}
      </div>
    </CardWrapper>
  )
}
