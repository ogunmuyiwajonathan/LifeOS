import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calculator, Maximize2, Delete } from 'lucide-react'
import CardWrapper from './CardWrapper'

export default function CalculatorWidget() {
  const navigate = useNavigate()
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState(null)
  const [operation, setOperation] = useState(null)
  const [waitingForNewValue, setWaitingForNewValue] = useState(false)

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

  const performCalculation = (prev, current, op) => {
    switch (op) {
      case '+':
        return prev + current
      case '-':
        return prev - current
      case '×':
        return prev * current
      case '÷':
        return current !== 0 ? prev / current : 0
      case '^':
        return Math.pow(prev, current)
      default:
        return current
    }
  }

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const result = performCalculation(previousValue, parseFloat(display), operation)
      setDisplay(String(result))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForNewValue(true)
    }
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

  const handleExpandClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    navigate('/calculator')
  }

  const buttonClass = 'rounded-lg p-2 text-xs font-medium transition-all hover:scale-105'
  const numberButtonClass = `${buttonClass} bg-[#071a0f] border border-[#1e3028] text-white hover:bg-[#0a2615]`
  const operationButtonClass = `${buttonClass} bg-[#052e16] border border-[#1e3028] text-[#059669] hover:bg-[#0a4f2a]`
  const equalsButtonClass = `${buttonClass} bg-[#059669] text-white hover:bg-[#047857]`

  return (
    <CardWrapper
      className="h-full"
      icon={<Calculator className="w-4 h-4 text-[#059669]" />}
      title="Calculator"
      badge={
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExpandClick}
          className="flex items-center gap-1 text-[#059669] hover:text-[#059669]/80 transition"
          title="Open full calculator"
        >
          <Maximize2 className="w-4 h-4" />
        </motion.button>
      }
    >
      <div className="space-y-2 h-full flex flex-col justify-between">

        {/* Display */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#0a0f0a] to-[#050807] border border-[#1e3028] rounded-lg p-3 text-right overflow-hidden"
        >
          <div className="flex justify-between items-center mb-1">
            <div className="text-[#059669] text-[10px] font-mono h-4 flex-1">
              {operation ? `${previousValue} ${operation}` : ''}
            </div>
          </div>

          <motion.div
            key={display}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white text-3xl font-bold font-mono tracking-wider break-words"
          >
            {display.length > 12 ? display.substring(0, 12) : display}
          </motion.div>
        </motion.div>

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-1 flex-1">

          {/* Row 1 */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClear}
            className={`${operationButtonClass} col-span-2`}
          >
            Clear
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBackspace}
            className={operationButtonClass}
          >
            <Delete className="w-3 h-3 mx-auto" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOperation('÷')}
            className={operationButtonClass}
          >
            ÷
          </motion.button>

          {/* Row 2 */}
          {[7, 8, 9].map((num) => (
            <motion.button
              key={num}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNumber(num)}
              className={numberButtonClass}
            >
              {num}
            </motion.button>
          ))}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOperation('×')}
            className={operationButtonClass}
          >
            ×
          </motion.button>

          {/* Row 3 */}
          {[4, 5, 6].map((num) => (
            <motion.button
              key={num}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNumber(num)}
              className={numberButtonClass}
            >
              {num}
            </motion.button>
          ))}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOperation('-')}
            className={operationButtonClass}
          >
            −
          </motion.button>

          {/* Row 4 */}
          {[1, 2, 3].map((num) => (
            <motion.button
              key={num}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNumber(num)}
              className={numberButtonClass}
            >
              {num}
            </motion.button>
          ))}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOperation('+')}
            className={operationButtonClass}
          >
            +
          </motion.button>

          {/* Row 5 */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNumber(0)}
            className={`${numberButtonClass} col-span-2`}
          >
            0
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDecimal}
            className={numberButtonClass}
          >
            .
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEquals}
            className={equalsButtonClass}
          >
            =
          </motion.button>

          {/* Last Row */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOperation('^')}
            className={`${operationButtonClass} text-[10px]`}
          >
            x^y
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExpandClick}
            className={`${operationButtonClass} col-span-3 text-[10px]`}
          >
            Expand
          </motion.button>
        </div>
      </div>
    </CardWrapper>
  )
}
