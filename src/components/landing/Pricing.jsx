import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Check, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      '5 Dashboard widgets',
      '5 ai-powered decisions per day',
      'Basic habit tracking',
      'Money tracking',
      'Learning goals',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: '/month',
    description: 'For serious life optimizers',
    features: [
      'Unlimited widgets & decisions',
      'Advanced analytics & charts',
      'AI-powered insights',
      'Ai decision making chatbot',
      'Export & backup data',
      'Custom themes',
    ],
    cta: 'Upgrade to Pro',
    highlighted: true,
  },
]

export default function Pricing() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="pricing" className="py-24 relative bg-background dark:bg-[#090E0D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Simple <span className="text-gradient">Pricing</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Start free, upgrade when you are ready to unlock the full power of LifeOS.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className={`relative p-8 rounded-2xl border ${
                plan.highlighted
                  ? 'border-[#059669] bg-card dark:bg-[#0F1610] shadow-[0_0_28px_rgba(5,150,105,0.25)]'
                  : 'border-border dark:border-[#1E3028] bg-card dark:bg-[#0F1610]'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#059669] text-white text-xs font-medium flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-[#059669]" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link to="/onboarding">
                <Button
                  className={`w-full ${
                    plan.highlighted
                      ? 'bg-[#059669] hover:bg-[#047857] text-white'
                      : 'bg-transparent border border-border dark:border-[#1E3028] hover:bg-muted dark:hover:bg-[#152018] text-foreground dark:text-white'
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
