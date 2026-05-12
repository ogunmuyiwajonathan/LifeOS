import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, Trash2, RotateCcw } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import ParticleBackground from '@/components/three/ParticleBackground'

const MODES = {
  BASIC: 'basic',
  SCIENTIFIC: 'scientific',
  PROGRAMMING: 'programming',
}

export default function Calculator() {
  const navigate = useNavigate()
  const [mode, setMode] = useState(MODES.SCIENTIFIC)
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState(null)
  const [operation, setOperation] = useState(null)
  const [waitingForNewValue, setWaitingForNewValue] = useState(false)
  const [angleMode, setAngleMode] = useState('DEG') // DEG or RAD
  const [history, setHistory] = useState([])

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('calculatorHistory')
    if (saved) {
      try {
        setHistory(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load history:', e)
      }
    }
  }, [])

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('calculatorHistory', JSON.stringify(history.slice(0, 20)))
  }, [history])

  const convertAngle = (value, toRad = true) => {
    if (toRad && angleMode === 'DEG') {
      return (value * Math.PI) / 180
    }
    if (!toRad && angleMode === 'DEG') {
      return (value * 180) / Math.PI
    }
    return value
  }

  const handleNumber = (num) => {
    if (waitingForNewValue) {
      setDisplay(String(num))
      setWaitingForNewValue(false)
    } else {
      setDisplay(display === '0' ? String(num) : display + num)
    }
  }

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.')
      setWaitingForNewValue(false)
    }
  }

  const handleOperation = (op) => {
    const currentValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(currentValue)
    } else if (operation) {
      const result = performCalculation(previousValue, currentValue, operation)
      setDisplay(String(result))
      setPreviousValue(result)
    }

    setOperation(op)
    setWaitingForNewValue(true)
  }

  const handleScientific = (func) => {
    const currentValue = parseFloat(display)
    let result

    switch (func) {
      case 'sin':
        result = Math.sin(convertAngle(currentValue, true))
        break
      case 'cos':
        result = Math.cos(convertAngle(currentValue, true))
        break
      case 'tan':
        result = Math.tan(convertAngle(currentValue, true))
        break
      case 'asin':
        if (currentValue < -1 || currentValue > 1) {
          setDisplay('Error: Domain')
          return
        }
        result = convertAngle(Math.asin(currentValue), false)
        break
      case 'acos':
        if (currentValue < -1 || currentValue > 1) {
          setDisplay('Error: Domain')
          return
        }
        result = convertAngle(Math.acos(currentValue), false)
        break
      case 'atan':
        result = convertAngle(Math.atan(currentValue), false)
        break
      case 'log':
        if (currentValue <= 0) {
          setDisplay('Error: Domain')
          return
        }
        result = Math.log10(currentValue)
        break
      case 'ln':
        if (currentValue <= 0) {
          setDisplay('Error: Domain')
          return
        }
        result = Math.log(currentValue)
        break
      case 'sqrt':
        if (currentValue < 0) {
          setDisplay('Error: Domain')
          return
        }
        result = Math.sqrt(currentValue)
        break
      case 'factorial':
        if (currentValue < 0 || !Number.isInteger(currentValue)) {
          setDisplay('Error: Invalid')
          return
        }
        result = factorial(currentValue)
        break
      case 'exp':
        result = Math.exp(currentValue)
        break
      case 'negate':
        result = -currentValue
        break
      case 'percent':
        result = currentValue / 100
        break
      default:
        return
    }

    addToHistory(`${func}(${currentValue})`, result)
    setDisplay(String(result))
    setPreviousValue(null)
    setOperation(null)
    setWaitingForNewValue(true)
  }

  const factorial = (n) => {
    if (n > 170) return Infinity
    if (n < 0) return NaN
    if (n === 0 || n === 1) return 1
    let result = 1
    for (let i = 2; i <= n; i++) result *= i
    return result
  }

  const performCalculation = (prev, current, op) => {
    let result
    switch (op) {
      case '+':
        result = prev + current
        break
      case '-':
        result = prev - current
        break
      case '×':
        result = prev * current
        break
      case '÷':
        result = current !== 0 ? prev / current : Infinity
        break
      case '^':
        result = Math.pow(prev, current)
        break
      case 'mod':
        result = prev % current
        break
      default:
        result = current
    }
    return result
  }

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const currentValue = parseFloat(display)
      const result = performCalculation(previousValue, currentValue, operation)
      addToHistory(`${previousValue} ${operation} ${currentValue}`, result)
      setDisplay(String(result))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForNewValue(true)
    }
  }

  const addToHistory = (expression, result) => {
    setHistory((prev) => [{ expression, result: String(result), timestamp: new Date().toLocaleTimeString() }, ...prev.slice(0, 19)])
  }

  const handleClear = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForNewValue(false)
  }

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1))
    } else {
      setDisplay('0')
    }
    setWaitingForNewValue(false)
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('calculatorHistory')
  }

  const basicButton = 'rounded-lg py-2 px-2.5 font-medium transition-all hover:scale-105 border text-sm'
  const numberButtonClass = `${basicButton} bg-[#071a0f] border-[#1e3028] text-white hover:bg-[#0a2615]`
  const operationButtonClass = `${basicButton} bg-[#052e16] border-[#1e3028] text-[#059669] hover:bg-[#0a4f2a]`
  const scientificButtonClass = `rounded-lg py-1.5 px-2 font-medium transition-all hover:scale-105 border bg-[#0a1f1a] border-[#1e3028] text-[#059669] hover:bg-[#0f2f28] text-xs`
  const equalsButtonClass = `${basicButton} bg-[#059669] text-white hover:bg-[#047857]`

  return (
    <div className="min-h-screen bg-[#0a0f0a] relative flex flex-col">
      <ParticleBackground />
      <Navbar />

      <div className="relative z-10 flex-1 flex flex-col pt-20 px-4 overflow-hidden">
        <div className="max-w-4xl w-full mx-auto flex flex-col h-full">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-3"
          >
            <button
              onClick={() => navigate('/dashboard')}
              className="w-10 h-10 rounded-lg border border-[#1e3028] flex items-center justify-center hover:bg-[#0f1a13] transition"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Calculator</h1>
              <p className="text-sm text-gray-400">Scientific & Advanced Calculator for Learning</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 overflow-hidden">
            {/* Main Calculator */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 rounded-2xl bg-[#0f1a13] border border-[#1e3028] p-3 flex flex-col h-full overflow-hidden"
            >
              {/* Mode Selector */}
              <div className="flex gap-2 mb-2 bg-[#0a0f0a] rounded-lg p-1">
                {Object.entries(MODES).map(([key, value]) => (
                  <button
                    key={value}
                    onClick={() => setMode(value)}
                    className={`flex-1 py-2 rounded-md text-xs font-semibold transition ${
                      mode === value
                        ? 'bg-[#059669] text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>

              {/* Display */}
              <div className="bg-[#0a0f0a] border border-[#1e3028] rounded-lg p-3 mb-2">
                <div className="text-right">
                  <div className="text-[#059669] text-sm mb-2 h-6">
                    {operation ? `${previousValue} ${operation}` : ''}
                  </div>
                  <div className="text-white text-4xl font-bold break-words">
                    {display.length > 15 ? display.substring(0, 15) + '...' : display}
                  </div>
                  {mode === MODES.SCIENTIFIC && (
                    <div className="text-xs text-gray-500 mt-2">
                      Angle Mode: <span className="text-[#059669]">{angleMode}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Basic Controls */}
              <div className="grid grid-cols-4 gap-1.5 mb-2">
                {/* Row 1 */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClear}
                  className={`${operationButtonClass} col-span-2`}
                >
                  Clear
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBackspace}
                  className={operationButtonClass}
                >
                  ←
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleOperation('÷')}
                  className={operationButtonClass}
                >
                  ÷
                </motion.button>

                {/* Rows 2-5: Numbers and Basic Operations */}
                {[
                  [7, 8, 9, '×'],
                  [4, 5, 6, '-'],
                  [1, 2, 3, '+'],
                  [0, '.', '^', '='],
                ].map((row, rowIdx) => (
                  <div key={rowIdx} className="contents">
                    {row.map((item, idx) => {
                      if (item === '=') {
                        return (
                          <motion.button
                            key={item}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleEquals}
                            className={equalsButtonClass}
                          >
                            {item}
                          </motion.button>
                        )
                      } else if (item === '.' || typeof item === 'number') {
                        if (item === '.') {
                          return (
                            <motion.button
                              key={item}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleDecimal}
                              className={numberButtonClass}
                            >
                              {item}
                            </motion.button>
                          )
                        }
                        return (
                          <motion.button
                            key={item}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleNumber(item)}
                            className={numberButtonClass}
                          >
                            {item}
                          </motion.button>
                        )
                      } else {
                        return (
                          <motion.button
                            key={item}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleOperation(item)}
                            className={operationButtonClass}
                          >
                            {item}
                          </motion.button>
                        )
                      }
                    })}
                  </div>
                ))}
              </div>

              {/* Scientific Functions */}
              {mode === MODES.SCIENTIFIC && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 border-t border-[#1e3028] pt-2 flex-1 overflow-y-auto"
                >
                  <div className="flex gap-2 justify-between items-center mb-3">
                    <h3 className="text-sm font-semibold text-gray-400">Trigonometric</h3>
                    <button
                      onClick={() => setAngleMode(angleMode === 'DEG' ? 'RAD' : 'DEG')}
                      className="px-2 py-1 bg-[#052e16] border border-[#1e3028] rounded text-xs text-[#059669] hover:bg-[#0a4f2a]"
                    >
                      {angleMode}
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 mb-2">
                    {['sin', 'cos', 'tan', 'asin', 'acos', 'atan'].map((func) => (
                      <motion.button
                        key={func}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleScientific(func)}
                        className={scientificButtonClass}
                      >
                        {func}
                      </motion.button>
                    ))}
                  </div>

                  <h3 className="text-sm font-semibold text-gray-400 mt-2">Logarithmic & Other</h3>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['log', 'ln', 'sqrt', 'factorial', 'exp', 'negate', 'percent', 'mod'].map((func) => (
                      <motion.button
                        key={func}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleScientific(func === 'mod' ? 'mod' : func)}
                        className={scientificButtonClass}
                      >
                        {func === 'mod' ? 'mod' : func}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Programming Mode */}
              {mode === MODES.PROGRAMMING && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 border-t border-[#1e3028] pt-2 flex-1 overflow-y-auto"
                >
                  <h3 className="text-sm font-semibold text-gray-400">Bitwise Operations</h3>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['mod'].map((func) => (
                      <motion.button
                        key={func}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleScientific(func)}
                        className={scientificButtonClass}
                      >
                        {func}
                      </motion.button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">More programming features coming soon...</p>
                </motion.div>
              )}
            </motion.div>

            {/* History Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl bg-[#0f1a13] border border-[#1e3028] p-3 h-full flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2 flex-shrink-0">
                <h3 className="font-semibold text-white text-sm">History</h3>
                <button
                  onClick={clearHistory}
                  className="p-1 hover:bg-[#0a0f0a] rounded transition"
                  title="Clear history"
                >
                  <Trash2 className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div className="space-y-1 overflow-y-auto flex-1">
                {history.length === 0 ? (
                  <div className="text-xs text-gray-500 text-center py-4">No history yet</div>
                ) : (
                  history.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-[#0a0f0a] border border-[#1e3028] rounded p-1.5 text-xs cursor-pointer hover:border-[#059669] transition"
                      onClick={() => {
                        setDisplay(item.result)
                        setWaitingForNewValue(true)
                      }}
                    >
                      <div className="text-gray-400 text-xs">{item.expression}</div>
                      <div className="text-[#059669] font-semibold text-xs">{item.result}</div>
                      <div className="text-gray-600 text-xs mt-0.5">{item.timestamp}</div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
