import { useEffect, useMemo, useState } from 'react'
import { Droplets, Flame, Target, Beef, Wheat, Droplet } from 'lucide-react'
import { motion } from 'framer-motion'
import CardWrapper from './CardWrapper'
import {
  getDateISO,
  readRoot,
  updateRoot,
} from './storage'

const getDefaultNutrition = () => ({
  date: getDateISO(),
  glasses: Array(8).fill(false),
  calories: '',
  goal: '2500',
  macros: {
    protein: '',
    carbs: '',
    fats: '',
  },
})

export default function WaterNutritionCard() {
  const [data, setData] = useState(
    getDefaultNutrition()
  )

  useEffect(() => {
    const stored =
      readRoot('lifeosHabitsData')
        .nutrition || getDefaultNutrition()

    const next =
      stored.date === getDateISO()
        ? stored
        : getDefaultNutrition()

    setData(next)

    updateRoot(
      'lifeosHabitsData',
      (current) => ({
        ...current,
        nutrition: next,
      })
    )
  }, [])

  const save = (next) => {
    setData(next)

    updateRoot(
      'lifeosHabitsData',
      (current) => ({
        ...current,
        nutrition: next,
      })
    )
  }

  // ONLY NUMBERS + ONE DECIMAL
  const handleNumberInput = (
    value,
    callback
  ) => {
    if (/^\d*\.?\d*$/.test(value)) {
      callback(value)
    }
  }

  const glassCount = useMemo(
    () =>
      data.glasses.filter(Boolean)
        .length,
    [data.glasses]
  )

  const progress = Math.min(
    100,
    Number(data.goal) > 0
      ? (Number(data.calories || 0) /
          Number(data.goal)) *
          100
      : 0
  )

  return (
    <CardWrapper
      icon={
        <Droplets className="w-4 h-4 text-[#059669]" />
      }
      title="Water & Nutrition"
      badge={`${glassCount}/8 glasses`}
    >
      <div className="space-y-5 text-sm">
        
        {/* WATER TRACKER */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Droplet className="w-4 h-4 text-blue-400" />
            <span className="text-gray-300 font-medium">Hydration</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {data.glasses.map(
              (filled, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    save({
                      ...data,
                      glasses:
                        data.glasses.map(
                          (
                            item,
                            i
                          ) =>
                            i === index
                              ? !item
                              : item
                        ),
                    })
                  }
                  className={`w-9 h-9 rounded-xl border transition-all duration-300 flex items-center justify-center ${
                    filled
                      ? 'bg-blue-500/20 border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.4)]'
                      : 'bg-[#0a0f0a] border-[#1e3028] hover:border-[#1e3028]/60'
                  }`}
                >
                  {filled && (
                    <Droplet className="w-4 h-4 text-blue-400" />
                  )}
                </motion.button>
              )
            )}
          </div>

          <div className="text-gray-500 mt-2 text-xs">
            {glassCount} of 8 glasses today
          </div>
        </div>

        {/* CALORIES */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-gray-300 font-medium">Calories</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                placeholder="Eaten"
                value={data.calories}
                onChange={(e) =>
                  handleNumberInput(
                    e.target.value,
                    (value) =>
                      save({
                        ...data,
                        calories: value,
                      })
                  )
                }
                className="bg-[#0a0f0a] border border-[#1e3028] rounded-xl px-4 py-3 text-white w-full focus:outline-none focus:border-[#059669] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-xs">kcal</span>
            </div>

            <div className="relative">
              <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#059669]/50" />
              <input
                type="text"
                inputMode="decimal"
                placeholder="Goal"
                value={data.goal}
                onChange={(e) =>
                  handleNumberInput(
                    e.target.value,
                    (value) =>
                      save({
                        ...data,
                        goal: value,
                      })
                  )
                }
                className="bg-[#0a0f0a] border border-[#1e3028] rounded-xl pl-10 pr-4 py-3 text-white w-full focus:outline-none focus:border-[#059669] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-xs">kcal</span>
            </div>
          </div>

          {/* PROGRESS BAR */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Progress</span>
              <span className="text-[#059669] font-medium">{progress.toFixed(0)}%</span>
            </div>
            <div className="w-full h-2 bg-[#071a0f] rounded-full overflow-hidden border border-[#1e3028]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`h-full rounded-full ${progress > 100 ? 'bg-red-500' : 'bg-gradient-to-r from-[#059669] to-[#34d399]'}`}
              />
            </div>

            <div className="text-xs text-gray-500">
              <span className="text-white font-medium">{data.calories || '0'}</span> / <span className="text-[#059669] font-medium">{data.goal || '2500'}</span> kcal
            </div>
          </div>
        </div>

        {/* MACROS */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Beef className="w-4 h-4 text-[#059669]" />
            <span className="text-gray-300 font-medium">Macros</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: 'protein', icon: Beef, color: 'text-red-400', label: 'Protein' },
              { key: 'carbs', icon: Wheat, color: 'text-yellow-400', label: 'Carbs' },
              { key: 'fats', icon: Droplet, color: 'text-blue-400', label: 'Fats' },
            ].map((macro) => (
              <div
                key={macro.key}
                className="space-y-2"
              >
                <div className="flex items-center gap-1.5">
                  <macro.icon className={`w-3 h-3 ${macro.color}`} />
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider">
                    {macro.label}
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="0"
                    value={
                      data.macros[macro.key]
                    }
                    onChange={(e) =>
                      handleNumberInput(
                        e.target.value,
                        (value) =>
                          save({
                            ...data,
                            macros: {
                              ...data.macros,
                              [macro.key]:
                                value,
                            },
                          })
                      )
                    }
                    className="bg-[#0a0f0a] border border-[#1e3028] rounded-xl px-3 py-2.5 text-white w-full text-center focus:outline-none focus:border-[#059669] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-sm"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 text-[10px]">g</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardWrapper>
  )
}