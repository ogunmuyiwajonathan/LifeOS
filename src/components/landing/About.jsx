import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ImageIcon, CheckCircle2 } from 'lucide-react'

const benefits = [
  'Track your money, habits and learning in one place',
  'Make better decisions with structured AI-powered analysis',
  'Built for students, professionals and entrepreneurs',
]

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <section id='about' className="py-24 lg:py-32 relative bg-background dark:bg-[#090E0D] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          {/* Left Column - Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="order-1"
          >
            <div className="relative aspect-[4/3] rounded-3xl bg-[#071311] border border-[#1E3028] overflow-hidden group">
            <img src="about.png" alt="LifeOS" className="w-full h-full object-contain" />
              {/* <div className="absolute inset-0 bg-[#059669]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-2xl bg-[#059669]/10 border border-[#059669]/20 flex items-center justify-center mb-4">
                  <ImageIcon className="w-10 h-10 text-[#059669]/60" />
                </div>
                <p className="text-sm text-[#8AA89A]/60 font-medium">Product screenshot</p>
                <p className="text-xs text-[#8AA89A]/40 mt-1">Coming soon</p>
              </div>

              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#059669]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" /> */}
            </div>
          </motion.div>

          {/* Right Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="order-2"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#059669]/10 border border-[#059669]/20 text-sm font-medium text-[#059669] mb-6"
            >
              About LifeOS
            </motion.div>

            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
              Life Operating System
            </h2>

            <p className="text-lg text-[#8AA89A] mb-6 leading-relaxed">
              One dashboard to run every area of your life
            </p>

            <p className="text-[#8AA89A] leading-relaxed mb-8">
              LifeOS was built for people who are tired of juggling five different apps to manage their money, habits, learning, and decisions. We built one clean command center that brings everything together — so you spend less time organising and more time actually living.
            </p>

            <div className="space-y-3">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                  className="flex items-start gap-3 group"
                >
                  <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[#059669]/10 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                  </div>
                  <span className="text-[#8AA89A] group-hover:text-white transition-colors duration-300 text-[15px]">
                    {benefit}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}