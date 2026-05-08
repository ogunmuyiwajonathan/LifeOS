import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BookMarked, Plus, X } from 'lucide-react'
import CardWrapper from './CardWrapper'
import { readRoot, updateRoot } from './storage'

export default function ReadingListCard() {
  const [books, setBooks] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [adding, setAdding] = useState(null)
  const [form, setForm] = useState({ title: '', author: '', total: '', current: '0' })
  useEffect(() => setBooks(readRoot('lifeosLearningData').books || []), [])
  const save = (next) => { setBooks(next); updateRoot('lifeosLearningData', (current) => ({ ...current, books: next })) }
  const status = (book) => (book.current <= 0 ? 'Not Started' : book.current >= book.total ? 'Finished' : 'Reading')
  const badgeClass = { 'Not Started': 'bg-gray-800 text-gray-400', Reading: 'bg-blue-900 text-blue-300', Finished: 'bg-green-900 text-green-300' }
  return (
    <CardWrapper icon={<BookMarked className="w-4 h-4 text-[#059669]" />} title="Reading List" badge={`${books.length} books`}>
      <div className="space-y-3">
        <AnimatePresence>{showForm && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-[#071a0f] rounded-xl p-4 border border-[#1e3028] space-y-2 overflow-hidden"><input className="bg-[#0a0f0a] border border-[#1e3028] rounded-lg px-3 py-2 text-white w-full" placeholder="Book title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} /><input className="bg-[#0a0f0a] border border-[#1e3028] rounded-lg px-3 py-2 text-white w-full" placeholder="Author" value={form.author} onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))} /><input type="number" className="bg-[#0a0f0a] border border-[#1e3028] rounded-lg px-3 py-2 text-white w-full" placeholder="Total pages" value={form.total} onChange={(e) => setForm((p) => ({ ...p, total: e.target.value }))} /><input type="number" className="bg-[#0a0f0a] border border-[#1e3028] rounded-lg px-3 py-2 text-white w-full" placeholder="Current page" value={form.current} onChange={(e) => setForm((p) => ({ ...p, current: e.target.value }))} /><div className="flex gap-2 mt-2"><button onClick={() => { if (!form.title.trim() || !form.total) return; save([...books, { id: Date.now(), ...form, total: Number(form.total), current: Number(form.current || 0) }]); setShowForm(false); setForm({ title: '', author: '', total: '', current: '0' }) }} className="bg-[#059669] hover:bg-[#047857] text-white rounded-lg px-4 py-2 flex-1">Add Book</button><button onClick={() => { setShowForm(false); setForm({ title: '', author: '', total: '', current: '0' }) }} className="w-10 h-10 rounded-lg bg-[#0a0f0a] border border-[#1e3028] flex items-center justify-center text-gray-400 hover:text-white"><X className="w-4 h-4" /></button></div></motion.div>}</AnimatePresence>
        {!showForm && <button onClick={() => setShowForm(true)} className="w-full border-2 border-dashed border-[#1e3028] rounded-xl p-2 flex items-center justify-center gap-2 hover:border-[#059669]"><Plus size={14} className="text-[#059669]" /><span className="text-gray-400 text-sm">Add book</span></button>}
        {books.map((book) => { const pct = Math.min(100, book.total ? (book.current / book.total) * 100 : 0); const state = status(book); return <div key={book.id} className="bg-[#071a0f] border border-[#1e3028] rounded-lg p-3 text-sm"><div className="flex justify-between gap-2"><div><div className="text-white font-medium">{book.title}</div><div className="text-gray-400 text-xs">{book.author}</div></div><span className={`px-2 py-0.5 rounded text-xs ${badgeClass[state]}`}>{state}</span></div><div className="w-full h-2 bg-[#0a0f0a] rounded border border-[#1e3028] overflow-hidden mt-2"><div className="h-full bg-[#059669]" style={{ width: `${pct}%` }} /></div><div className="text-xs text-gray-400 mt-1">page {book.current} of {book.total}</div><div className="flex gap-2 mt-2">{state !== 'Finished' && <button onClick={() => save(books.map((item) => item.id === book.id ? { ...item, current: item.total } : item))} className="text-xs text-[#059669]">Mark Finished</button>}<button onClick={() => setAdding(adding === book.id ? null : book.id)} className="text-xs text-[#059669] inline-flex items-center gap-1"><Plus className="w-4 h-4" /> pages</button></div>{adding === book.id && <input type="number" autoFocus placeholder="Add pages" className="mt-2 bg-[#0a0f0a] border border-[#1e3028] rounded px-2 py-1 text-white w-full" onBlur={(e) => { const add = Number(e.target.value || 0); save(books.map((item) => item.id === book.id ? { ...item, current: Math.min(item.total, item.current + add) } : item)); setAdding(null) }} />}</div> })}
      </div>
    </CardWrapper>
  )
}
