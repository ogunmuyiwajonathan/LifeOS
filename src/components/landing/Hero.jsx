import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import HeroOrb from '@/components/three/HeroOrb'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(5,150,105,0.16),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_70%,rgba(5,150,105,0.12),transparent_60%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card dark:bg-[#0F1610] border border-border dark:border-[#1E3028] text-sm font-medium text-[#059669] mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
              Your Personal Life Command Center
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              Take Control of{' '}
              <span className="text-[#059669]">
                Your Life
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0"
            >
              Track your money, build habits, accelerate learning, capture opportunities, 
              and make better decisions — all in one powerful dashboard.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link to="/onboarding">
                <Button size="lg" className="bg-[#059669] hover:bg-[#047857] text-white gap-2 group">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <button onClick={() => document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
                <Button size="lg" variant="outline" className="gap-2 border-foreground text-foreground dark:border-white dark:text-white hover:bg-muted dark:hover:bg-[#152018]">
                  <Play className="w-4 h-4" />
                  See How It Works
                </Button>
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="relative"
          >
            <HeroOrb />
          </motion.div>
        </div>
      </div>
    </section>
  )
}