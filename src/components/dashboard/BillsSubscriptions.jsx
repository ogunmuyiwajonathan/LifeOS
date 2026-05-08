import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  RefreshCw,
  Trash2,
  X,
  ChevronDown,
  Calendar,
  CreditCard,
} from 'lucide-react'

import CardWrapper from './CardWrapper'
import { formatCurrency, updateRoot } from './storage'

export default function BillsSubscriptions() {
  const [bills, setBills] = useState([])
  const [showForm, setShowForm] = useState(false)

  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDay, setDueDay] = useState('1')

  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const dropdownRef = useRef(null)

  useEffect(() => {
    loadBills()
  }, [])

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener(
      'mousedown',
      handleClickOutside
    )

    return () =>
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      )
  }, [])

  const loadBills = () => {
    const stored = localStorage.getItem(
      'lifeosMoneyData'
    )

    if (stored) {
      const data = JSON.parse(stored)
      setBills(data.bills || [])
    }
  }

  const saveBills = (updated) => {
    updateRoot('lifeosMoneyData', (current) => ({
      ...current,
      bills: updated,
    }))

    setBills(updated)
  }

  const addBill = () => {
    if (!name.trim() || !amount.trim()) return

    const newBill = {
      id: Date.now(),
      name: name.trim(),
      amount: parseFloat(amount),
      dueDay: parseInt(dueDay),
    }

    saveBills([...bills, newBill])

    setName('')
    setAmount('')
    setDueDay('1')
    setShowForm(false)
  }

  const handleDelete = (id) => {
    if (deleteConfirm === id) {
      saveBills(
        bills.filter((b) => b.id !== id)
      )

      setDeleteConfirm(null)
    } else {
      setDeleteConfirm(id)

      setTimeout(() => {
        setDeleteConfirm(null)
      }, 2000)
    }
  }

  const today = new Date().getDate()

  const totalMonthly = bills.reduce(
    (sum, b) => sum + b.amount,
    0
  )

  const dayOptions = Array.from(
    { length: 31 },
    (_, i) => i + 1
  )

  return (
    <CardWrapper
      icon={
        <RefreshCw className="w-4 h-4 text-[#34d399]" />
      }
      title="Bills & Subscriptions"
      badge={`${formatCurrency(totalMonthly)}/month`}
    >
      <div className="space-y-4 p-1">
        
        {/* TOP SUMMARY */}
        <div className="grid grid-cols-2 gap-3">
          
          <div className="rounded-2xl border border-[#1e3028] bg-gradient-to-br from-[#0b1c14] to-[#08120d] p-4">
            <div className="text-xs text-gray-500 mb-1">
              Total Bills
            </div>

            <div className="text-3xl font-bold text-white">
              {bills.length}
            </div>
          </div>

          <div className="rounded-2xl border border-[#1e3028] bg-gradient-to-br from-[#0b1c14] to-[#08120d] p-4">
            <div className="text-xs text-gray-500 mb-1">
              Monthly Cost
            </div>

            <div className="text-2xl font-bold text-[#34d399]">
              {formatCurrency(totalMonthly)}
            </div>
          </div>
        </div>

        {/* FORM */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              className="rounded-3xl border border-[#1e3028] bg-[#07120d] p-5 space-y-4"
            >
              {/* NAME */}
              <div>
                <label className="text-xs text-gray-500 mb-2 block">
                  Bill Name
                </label>

                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#34d399]" />

                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Netflix, Spotify..."
                    className="w-full bg-[#0b1510] border border-[#1e3028] rounded-2xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-[#34d399]"
                  />
                </div>
              </div>

              {/* AMOUNT */}
              <div>
                <label className="text-xs text-gray-500 mb-2 block">
                  Monthly Amount
                </label>

                <input
                  type="number"
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value)
                  }
                  placeholder="₦15.99"
                  className="w-full bg-[#0b1510] border border-[#1e3028] rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#34d399]"
                />
              </div>

              {/* CUSTOM DAY SELECT */}
              <div ref={dropdownRef}>
                <label className="text-xs text-gray-500 mb-2 block">
                  Due Date
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setDropdownOpen(
                      !dropdownOpen
                    )
                  }
                  className="w-full flex items-center justify-between bg-[#0b1510] border border-[#1e3028] rounded-2xl px-4 py-3 text-white hover:border-[#34d399]/50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-[#34d399]" />

                    <span>
                      Due on day {dueDay}
                    </span>
                  </div>

                  <motion.div
                    animate={{
                      rotate: dropdownOpen
                        ? 180
                        : 0,
                    }}
                  >
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: -5,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -5,
                      }}
                      className="mt-3 rounded-2xl border border-[#1e3028] bg-[#0f1610] p-4"
                    >
                      <div className="grid grid-cols-7 gap-2">
                        {dayOptions.map((day) => (
                          <button
                            key={day}
                            type="button"
                            onClick={() => {
                              setDueDay(
                                day.toString()
                              )

                              setDropdownOpen(
                                false
                              )
                            }}
                            className={`h-10 rounded-xl text-sm transition-all ${
                              dueDay ===
                              day.toString()
                                ? 'bg-[#059669] text-white'
                                : 'bg-[#09120d] text-gray-400 hover:bg-[#1e3028]'
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3 pt-2">
                <motion.button
                  whileHover={{
                    scale: 1.02,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  onClick={addBill}
                  className="flex-1 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white py-3 font-semibold transition-colors"
                >
                  Add Bill
                </motion.button>

                <button
                  onClick={() => {
                    setShowForm(false)

                    setName('')
                    setAmount('')
                    setDueDay('1')
                  }}
                  className="w-12 h-12 rounded-2xl bg-[#0b1510] border border-[#1e3028] flex items-center justify-center text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* EMPTY STATE */}
        {bills.length === 0 && !showForm && (
          <motion.button
            whileHover={{
              scale: 1.01,
            }}
            whileTap={{
              scale: 0.99,
            }}
            onClick={() => setShowForm(true)}
            className="w-full rounded-3xl border-2 border-dashed border-[#1e3028] p-10 flex flex-col items-center justify-center gap-3 hover:border-[#34d399] hover:bg-[#059669]/5 transition-all"
          >
            <div className="w-14 h-14 rounded-full bg-[#059669]/10 flex items-center justify-center">
              <Plus className="w-6 h-6 text-[#34d399]" />
            </div>

            <div className="text-center">
              <div className="text-[#34d399] font-semibold">
                Add your first subscription
              </div>

              <div className="text-sm text-gray-500 mt-1">
                Track recurring payments easily
              </div>
            </div>
          </motion.button>
        )}

        {/* BILL LIST */}
        {bills.length > 0 && (
          <div className="space-y-3">
            {bills.map((bill, index) => {
              const daysUntilDue =
                bill.dueDay - today

              const isDueToday =
                daysUntilDue === 0

              const isDueSoon =
                daysUntilDue > 0 &&
                daysUntilDue <= 7

              const isOverdue =
                daysUntilDue < 0

              return (
                <motion.div
                  key={bill.id}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.05,
                  }}
                  className={`rounded-2xl border p-4 transition-all ${
                    isDueToday
                      ? 'border-[#059669] bg-[#059669]/5'
                      : isDueSoon
                      ? 'border-orange-500/40 bg-orange-500/5'
                      : isOverdue
                      ? 'border-red-500/40 bg-red-500/5'
                      : 'border-[#1e3028] bg-[#07120d]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    
                    <div className="flex items-center gap-4 min-w-0">
                      
                      <div
                        className={`w-3 h-3 rounded-full ${
                          isDueToday
                            ? 'bg-[#34d399]'
                            : isDueSoon
                            ? 'bg-orange-400'
                            : isOverdue
                            ? 'bg-red-400'
                            : 'bg-gray-600'
                        }`}
                      />

                      <div className="min-w-0">
                        <div className="text-white font-semibold truncate">
                          {bill.name}
                        </div>

                        <div className="text-xs text-gray-500 mt-1">
                          Due on day{' '}
                          {bill.dueDay}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      
                      <div className="text-right">
                        <div className="text-white font-bold">
                          {formatCurrency(
                            bill.amount
                          )}
                        </div>

                        <div
                          className={`text-xs mt-1 ${
                            isDueToday
                              ? 'text-[#34d399]'
                              : isDueSoon
                              ? 'text-orange-400'
                              : isOverdue
                              ? 'text-red-400'
                              : 'text-gray-500'
                          }`}
                        >
                          {isDueToday
                            ? 'Due Today'
                            : isDueSoon
                            ? `${daysUntilDue} days left`
                            : isOverdue
                            ? `${Math.abs(
                                daysUntilDue
                              )} days overdue`
                            : 'Upcoming'}
                        </div>
                      </div>

                      <motion.button
                        whileHover={{
                          scale: 1.08,
                        }}
                        whileTap={{
                          scale: 0.92,
                        }}
                        onClick={() =>
                          handleDelete(
                            bill.id
                          )
                        }
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          deleteConfirm ===
                          bill.id
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-[#0b1510] text-gray-500 hover:bg-red-500/10 hover:text-red-400'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )
            })}

            {/* ADD BUTTON */}
            {!showForm && (
              <motion.button
                whileHover={{
                  scale: 1.01,
                }}
                whileTap={{
                  scale: 0.99,
                }}
                onClick={() =>
                  setShowForm(true)
                }
                className="w-full rounded-2xl border-2 border-dashed border-[#1e3028] py-4 flex items-center justify-center gap-2 text-[#34d399] hover:border-[#34d399] hover:bg-[#059669]/5 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Another Bill
              </motion.button>
            )}
          </div>
        )}
      </div>
    </CardWrapper>
  )
}