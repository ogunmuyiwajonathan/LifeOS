import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Pencil, HeartPulse, TrendingUp, TrendingDown, Activity, X, Check } from 'lucide-react'
import CardWrapper from './CardWrapper'
import { readRoot, updateRoot } from './storage'

const UNITS = ['kg', 'lbs', 'bpm', 'hrs', 'steps', '%', 'custom']

const metricIcons = {
  weight: Activity,
  heart: HeartPulse,
  steps: TrendingUp,
  sleep: TrendingDown,
  default: Activity,
}

export default function HealthMetricsCard() {
  const [metrics, setMetrics] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [confirmId, setConfirmId] = useState(null)
  const [draft, setDraft] = useState({ name: '', value: '', unit: 'kg', customUnit: '' })

  useEffect(() => {
    setMetrics(readRoot('lifeosHabitsData').metrics || [])
  }, [])

  const save = (next) => {
    setMetrics(next)
    updateRoot('lifeosHabitsData', (current) => ({ ...current, metrics: next }))
  }

  const addMetric = () => {
    if (!draft.name.trim()) return
    const unit = draft.unit === 'custom' ? draft.customUnit.trim() || 'custom' : draft.unit
    save([...metrics, { id: Date.now(), name: draft.name.trim(), value: Number(draft.value || 0), unit }])
    setDraft({ name: '', value: '', unit: 'kg', customUnit: '' })
    setShowForm(false)
  }

  const removeMetric = (id) => {
    if (confirmId === id) {
      save(metrics.filter((metric) => metric.id !== id))
      setConfirmId(null)
      return
    }
    setConfirmId(id)
    setTimeout(() => setConfirmId((prev) => (prev === id ? null : prev)), 2000)
  }

  const handleNumberInput = (value, field) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setDraft((p) => ({ ...p, [field]: value }))
    }
  }

  const getTrend = (current, previous) => {
    if (!previous) return 'neutral'
    return current > previous ? 'up' : current < previous ? 'down' : 'neutral'
  }

  return (
    <CardWrapper 
      icon={<HeartPulse className="w-4 h-4 text-[#059669]" />} 
      title="Health Metrics" 
      badge={`${metrics.length} tracked`}
    >
      <div className="space-y-4 p-1">
        {/* Add Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[#071a0f] rounded-2xl p-5 border border-[#1e3028] overflow-hidden space-y-3"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium text-sm">New Metric</span>
                <button 
                  onClick={() => setShowForm(false)}
                  className="w-7 h-7 rounded-lg bg-[#1e3028] hover:bg-[#2a4035] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="relative">
                <input 
                  className="bg-[#0a0f0a] border border-[#1e3028] rounded-xl px-4 py-3 text-white w-full text-sm outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-colors placeholder:text-gray-600" 
                  placeholder="Metric name (e.g. Weight, Heart Rate)" 
                  value={draft.name} 
                  onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))} 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <input 
                    type="text"
                    inputMode="decimal"
                    className="bg-[#0a0f0a] border border-[#1e3028] rounded-xl px-4 py-3 text-white w-full text-sm outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-colors placeholder:text-gray-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                    placeholder="Value" 
                    value={draft.value} 
                    onChange={(e) => handleNumberInput(e.target.value, 'value')} 
                  />
                </div>
                <select 
                  className="bg-[#0a0f0a] border border-[#1e3028] rounded-xl px-4 py-3 text-white w-full text-sm outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-colors cursor-pointer appearance-none" 
                  value={draft.unit} 
                  onChange={(e) => setDraft((p) => ({ ...p, unit: e.target.value }))}
                >
                  {UNITS.map((unit) => (
                    <option key={unit} value={unit} className="bg-[#0a0f0a]">
                      {unit === 'custom' ? 'Custom...' : unit}
                    </option>
                  ))}
                </select>
              </div>

              {draft.unit === 'custom' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <input 
                    className="bg-[#0a0f0a] border border-[#1e3028] rounded-xl px-4 py-3 text-white w-full text-sm outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-colors placeholder:text-gray-600" 
                    placeholder="Enter custom unit" 
                    value={draft.customUnit} 
                    onChange={(e) => setDraft((p) => ({ ...p, customUnit: e.target.value }))} 
                  />
                </motion.div>
              )}

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#059669] hover:bg-[#047857] text-white rounded-xl px-4 py-3 w-full text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                onClick={addMetric}
              >
                <Check className="w-4 h-4" />
                Add Metric
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Button */}
        {!showForm && (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setShowForm(true)}
            className="w-full border-2 border-dashed border-[#1e3028] rounded-xl p-4 flex items-center justify-center gap-2 hover:border-[#059669] hover:bg-[#059669]/5 transition-all group"
          >
            <div className="w-8 h-8 rounded-full bg-[#059669]/10 flex items-center justify-center group-hover:bg-[#059669]/20 transition-colors">
              <Plus className="w-4 h-4 text-[#059669]" />
            </div>
            <span className="text-gray-400 text-sm group-hover:text-[#059669] transition-colors">Add new metric</span>
          </motion.button>
        )}

        {/* Metrics List */}
        <div className="space-y-2.5">
          <AnimatePresence>
            {metrics.map((metric, index) => {
              const Icon = metricIcons[metric.name.toLowerCase()] || metricIcons.default
              const isEditing = editingId === metric.id
              const isConfirming = confirmId === metric.id

              return (
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="group relative bg-[#071a0f] border border-[#1e3028] hover:border-[#059669]/30 rounded-xl px-4 py-3 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div className="w-9 h-9 rounded-lg bg-[#059669]/10 border border-[#059669]/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-[#059669]" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium text-sm truncate">{metric.name}</span>
                        
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input 
                              autoFocus 
                              type="text"
                              inputMode="decimal"
                              className="w-20 bg-[#0a0f0a] border border-[#059669] rounded-lg px-2 py-1 text-white text-sm text-right outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                              defaultValue={metric.value} 
                              onBlur={(e) => {
                                const val = parseFloat(e.target.value) || 0
                                save(metrics.map((m) => (m.id === metric.id ? { ...m, value: val } : m)))
                                setEditingId(null)
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.target.blur()
                                }
                              }}
                            />
                            <span className="text-[#8AA89A] text-xs">{metric.unit}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-[#059669] font-bold text-sm">{metric.value}</span>
                            <span className="text-[#8AA89A] text-xs">{metric.unit}</span>
                          </div>
                        )}
                      </div>

                      {/* Progress bar */}
                      <div className="mt-2">
                        <div className="w-full h-1.5 bg-[#0a0f0a] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (metric.value / 100) * 100)}%` }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="h-full bg-gradient-to-r from-[#059669] to-[#34d399] rounded-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setEditingId(metric.id)}
                        className="w-8 h-8 rounded-lg hover:bg-[#059669]/10 flex items-center justify-center text-gray-400 hover:text-[#059669] transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeMetric(metric.id)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          isConfirming 
                            ? 'bg-red-500/20 text-red-400' 
                            : 'hover:bg-red-500/10 text-gray-400 hover:text-red-400'
                        }`}
                      >
                        {isConfirming ? (
                          <span className="text-[10px] font-bold">Sure?</span>
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {metrics.length === 0 && !showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 rounded-full bg-[#059669]/5 border border-[#1e3028] flex items-center justify-center mx-auto mb-3">
              <HeartPulse className="w-8 h-8 text-[#059669]/30" />
            </div>
            <p className="text-gray-500 text-sm">No metrics tracked yet</p>
            <p className="text-gray-600 text-xs mt-1">Add your first health metric above</p>
          </motion.div>
        )}
      </div>
    </CardWrapper>
  )
}