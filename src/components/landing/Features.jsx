import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Wallet, Target, BookOpen, Lightbulb, GitBranch, BarChart3 } from 'lucide-react'

const features = [
  {
    icon: Wallet,
    title: 'Money',
    description: 'Track income, expenses, and savings goals with visual progress and smart budgeting.',
    color: 'text-white',
    bg: 'bg-[#059669]',
    border: 'border-[#059669]',
  },
  {
    icon: Target,
    title: 'Habits',
    description: 'Build lasting habits with daily checklists, streak counters, and milestone rewards.',
    color: 'text-white',
    bg: 'bg-[#059669]',
    border: 'border-[#059669]',
  },
  {
    icon: BookOpen,
    title: 'Learning',
    description: 'Set learning goals, track progress, and maintain consistent study streaks.',
    color: 'text-white',
    bg: 'bg-[#059669]',
    border: 'border-[#059669]',
  },
  {
    icon: Lightbulb,
    title: 'Opportunities',
    description: 'Capture jobs, grants, and opportunities with deadlines and application status.',
    color: 'text-white',
    bg: 'bg-[#059669]',
    border: 'border-[#059669]',
  },
  {
    icon: GitBranch,
    title: 'Decisions',
    description: 'Make better decisions with structured analysis, pros/cons, and outcome scenarios.',
    color: 'text-white',
    bg: 'bg-[#059669]',
    border: 'border-[#059669]',
  },
  {
    icon: BarChart3,
    title: 'Insights',
    description: 'Get powerful visual insights into your money, habits, and learning patterns.',
    color: 'text-white',
    bg: 'bg-[#059669]',
    border: 'border-[#059669]',
  },
]

function FeatureCard({ feature, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group p-6 rounded-2xl border border-border dark:border-[#1E3028] bg-card dark:bg-[#0F1610] hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(5,150,105,0.22)] transition-all duration-300 border-l-4 border-l-[#059669]"
    >
      <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
        <feature.icon className={`w-6 h-6 ${feature.color}`} />
      </div>
      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
    </motion.div>
  )
}

export default function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="features" className="py-24 relative bg-background dark:bg-[#090E0D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything You Need to{' '}
            <span className="text-gradient">Thrive</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Six powerful modules designed to help you take control of every aspect of your life.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
