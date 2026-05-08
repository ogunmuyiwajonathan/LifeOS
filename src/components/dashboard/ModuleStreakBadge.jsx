import { getStreakData } from '@/utils/streak'
import { Flame } from 'lucide-react'

export default function ModuleStreakBadge({ moduleName }) {
  const data = getStreakData()
  const moduleStreak = data.moduleStreaks?.[moduleName]

  if (!moduleStreak || moduleStreak.current === 0) {
    return null
  }

  return (
    <div className="bg-[#052e16] text-[#059669] text-xs px-2 py-0.5 rounded-full font-semibold inline-flex items-center gap-1">
      <Flame className="w-4 h-4 text-orange-400" /> {moduleStreak.current}
    </div>
  )
}
