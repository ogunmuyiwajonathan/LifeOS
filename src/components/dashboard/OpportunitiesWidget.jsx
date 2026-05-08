import { useDashboardStore } from '@/store/useDashboardStore'
import { motion } from 'framer-motion'
import { Lightbulb, Briefcase, Gift, ArrowUpRight, Clock } from 'lucide-react'

const typeIcons = {
  job: Briefcase,
  grant: Gift,
}

const statusColors = {
  applied: 'bg-brand-green/10 text-brand-green',
  draft: 'bg-brand-orange/10 text-brand-orange',
  interested: 'bg-brand-blue/10 text-brand-blue',
}

export default function OpportunitiesWidget() {
  const { opportunities } = useDashboardStore()
  
  const fields = opportunities.reduce((acc, opp) => {
    const field = opp.field || 'Other'
    if (!acc[field]) acc[field] = []
    acc[field].push(opp)
    return acc
  }, {})

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-brand-cyan/10 flex items-center justify-center">
          <Lightbulb className="w-4 h-4 text-brand-cyan" />
        </div>
        <h3 className="font-semibold">Opportunities</h3>
      </div>

      <div className="space-y-6 overflow-y-auto min-h-0 flex-1 pr-1 hide-scrollbar">
        {Object.entries(fields).map(([fieldName, opps], fieldIndex) => (
          <div key={fieldName} className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground">{fieldName}</h4>
            <div className="flex overflow-x-auto gap-3 pb-2 snap-x hide-scrollbar">
              {opps.map((opp, i) => {
                const Icon = typeIcons[opp.type] || Lightbulb
                const daysLeft = Math.ceil((new Date(opp.deadline) - new Date()) / (1000 * 60 * 60 * 24))
                
                return (
                  <motion.div
                    key={opp.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + fieldIndex * 0.1 }}
                    className="p-3 rounded-xl border border-border bg-card hover:border-brand-cyan/30 transition-colors group min-w-[240px] snap-start"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-cyan/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-brand-cyan" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-medium truncate">{opp.title}</h4>
                          <ArrowUpRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap ${statusColors[opp.status]}`}>
                            {opp.status}
                          </span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1 whitespace-nowrap">
                            <Clock className="w-3 h-3" />
                            {daysLeft > 0 ? `${daysLeft}d left` : 'Expired'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
