import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { LayoutDashboard, ArrowRight, Sparkles, TrendingUp, Target, CheckCircle2 } from 'lucide-react'

const steps = [
  {
    icon: CheckCircle2,
    title: 'Get Started',
    description: 'Sign up and create your account in seconds. Join thousands of users taking control of their lives with LifeOS.',
    gradient: 'from-[#059669] to-[#10b981]',
    glow: 'shadow-[#059669]/20',
    bgGlow: 'from-[#059669]/10 to-transparent',
    features: ['Quick signup', 'Email verification', 'Secure login'],
  },
  {
    icon: LayoutDashboard,
    title: 'Set Up Your Dashboard',
    description: 'Complete the onboarding process to customize your dashboard. Choose your modules (Money, Habits, Learning, Opportunities) and start tracking what matters most.',
    gradient: 'from-[#10b981] to-[#34d399]',
    glow: 'shadow-[#10b981]/20',
    bgGlow: 'from-[#10b981]/10 to-transparent',
    features: ['Select modules', 'Customize widgets', 'Start tracking'],
  },
  {
    icon: Target,
    title: 'Make Better Decisions',
    description: 'Use structured decision analysis and AI insights to choose the best path forward. Turn uncertainty into clarity.',
    gradient: 'from-[#34d399] to-[#6ee7b7]',
    glow: 'shadow-[#34d399]/20',
    bgGlow: 'from-[#34d399]/10 to-transparent',
    features: ['AI-powered insights', 'Decision framework', 'Outcome tracking'],
  },
]

export default function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="how-it-works" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#059669]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#059669]/10 border border-[#059669]/20 text-sm font-medium text-[#059669] mb-8"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Simple Process
          </motion.div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            How It{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#059669]">Works</span>
              <svg
                className="absolute -bottom-3 left-0 w-full h-auto pointer-events-none"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
                style={{ minHeight: '12px' }}
              >
                <motion.path
                  d="M0 8 Q50 2 100 8 T200 8"
                  stroke="#059669"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                  transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
                />
              </svg>
            </span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Two simple steps to transform how you manage your life and unlock your full potential.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="relative">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-6 max-w-full mx-auto">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.7,
                  delay: 0.4 + i * 0.25,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="relative group"
              >
                {/* Card */}
                <div className="relative p-8 rounded-3xl bg-card/50 dark:bg-[#0F1610]/60 border border-border/50 dark:border-[#1E3028]/60 backdrop-blur-sm hover:border-[#059669]/30 dark:hover:border-[#059669]/30 transition-all duration-500 hover:shadow-xl hover:shadow-[#059669]/5">

                  {/* Step Number Badge */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 lg:left-8 lg:translate-x-0">
                    <div className={`w-8 h-8 rounded-full bg-[#059669] text-white text-sm font-bold flex items-center justify-center shadow-lg ${step.glow}`}>
                      {i + 1}
                    </div>
                  </div>

                  {/* Icon Container */}
                  <div className="mt-4 mb-6 flex justify-center lg:justify-start">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg ${step.glow} group-hover:scale-110 transition-transform duration-500`}>
                      <step.icon className="w-7 h-7 text-white" strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-3 text-center lg:text-left group-hover:text-[#059669] transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed text-center lg:text-left mb-6">
                    {step.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-2 mb-6">
                    {step.features.map((feature, idx) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.5 + i * 0.2 + idx * 0.1 }}
                        className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#059669] flex-shrink-0" />
                        <span>{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Hover arrow indicator */}
                  <div className="flex justify-center lg:justify-start">
                    <motion.div
                      className="flex items-center gap-1 text-[#059669] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ x: 4 }}
                    >
                      Learn more <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </div>

                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-3xl">
                    <div className={`absolute top-0 right-0 w-full h-full bg-gradient-to-bl ${step.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  </div>
                </div>

                {/* Mobile connector */}
                {i < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center py-4">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={isInView ? { height: 32 } : {}}
                      transition={{ delay: 0.8 + i * 0.3, duration: 0.5 }}
                      className="w-[2px] bg-[#059669]/30"
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#059669]/5 border border-[#059669]/10 text-sm text-[#059669]">
            <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
            Start your journey in under 2 minutes
          </div>
        </motion.div>
      </div>
    </section>
  )
}