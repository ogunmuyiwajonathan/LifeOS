import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Landmark, Calculator, TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import CardWrapper from './CardWrapper'
import { formatCurrency, updateRoot } from './storage'

export default function NetWorth() {
  const [assets, setAssets] = useState('')
  const [liabilities, setLiabilities] = useState('')
  const [netWorth, setNetWorth] = useState(0)
  const [isPositive, setIsPositive] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const stored = localStorage.getItem('lifeosMoneyData')
    if (stored) {
      const data = JSON.parse(stored)
      const savedAssets = data.netWorth?.assets || 0
      const savedLiabilities = data.netWorth?.liabilities || 0
      setAssets(savedAssets ? savedAssets.toString() : '')
      setLiabilities(savedLiabilities ? savedLiabilities.toString() : '')
      calculateNetWorth(savedAssets, savedLiabilities)
    }
  }

  const calculateNetWorth = (a, l) => {
    const assetVal = parseFloat(a) || 0
    const liabilityVal = parseFloat(l) || 0
    const result = assetVal - liabilityVal
    setNetWorth(result)
    setIsPositive(result >= 0)
  }

  const handleCalculate = () => {
    const assetVal = parseFloat(assets) || 0
    const liabilityVal = parseFloat(liabilities) || 0
    calculateNetWorth(assetVal, liabilityVal)

    updateRoot('lifeosMoneyData', (current) => ({
      ...current,
      netWorth: {
        assets: assetVal,
        liabilities: liabilityVal,
      },
    }))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCalculate()
    }
  }

  // Block non-numeric input
  const handleNumberInput = (value, setter) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setter(value)
    }
  }

  return (
    <CardWrapper
      icon={<Landmark className="w-4 h-4 text-[#059669]" />}
      title="Net Worth"
      badge={
        <motion.span
          key={netWorth}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 16 }}
          className={`font-bold ${isPositive ? 'text-[#059669]' : 'text-red-400'}`}
        >
          {formatCurrency(netWorth)}
        </motion.span>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="text-gray-400 text-sm block mb-2">Total Assets</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <TrendingUp className="w-4 h-4 text-[#059669]/50" />
            </div>
            <input
              type="text"
              inputMode="decimal"
              value={assets}
              onChange={(e) => handleNumberInput(e.target.value, setAssets)}
              onKeyDown={handleKeyDown}
              placeholder="0.00"
              className="w-full bg-[#0a0f0a] border border-[#1e3028] rounded-lg pl-10 pr-3 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#059669] focus:border-[#059669] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        <div>
          <label className="text-gray-400 text-sm block mb-2">Total Liabilities</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <TrendingDown className="w-4 h-4 text-red-400/50" />
            </div>
            <input
              type="text"
              inputMode="decimal"
              value={liabilities}
              onChange={(e) => handleNumberInput(e.target.value, setLiabilities)}
              onKeyDown={handleKeyDown}
              placeholder="0.00"
              className="w-full bg-[#0a0f0a] border border-[#1e3028] rounded-lg pl-10 pr-3 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#059669] focus:border-[#059669] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        {/* Calculate Button */}
        <motion.button
          onClick={handleCalculate}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 bg-[#059669] hover:bg-[#047857] text-white font-medium text-sm py-2.5 rounded-lg transition-colors"
        >
          <Calculator className="w-4 h-4" />
          Calculate Net Worth
        </motion.button>

        <div className="pt-4 border-t border-[#1e3028]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className={`w-4 h-4 ${isPositive ? 'text-[#059669]' : 'text-red-400'}`} />
              <span className="text-gray-400 text-sm">Net Worth</span>
            </div>
            <motion.span
              key={netWorth}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 180, damping: 16 }}
              className={`font-bold text-lg ${isPositive ? 'text-[#059669]' : 'text-red-400'}`}
            >
              {formatCurrency(netWorth)}
            </motion.span>
          </div>
        </div>
      </div>
    </CardWrapper>
  )
}