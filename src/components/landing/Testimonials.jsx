import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Manager',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    initials: 'SC',
    quote:
      'LifeOS completely changed how I approach my daily decisions. The decision engine alone has saved me from countless poor choices.',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Software Engineer',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    initials: 'MJ',
    quote:
      'I have tried dozens of productivity apps. LifeOS is the first one that actually keeps me accountable across all life areas.',
    rating: 5,
  },
  {
    name: 'Aisha Patel',
    role: 'Startup Founder',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    initials: 'AP',
    quote:
      'The opportunity tracker helped me secure $50K in grants I would have missed.',
    rating: 5,
  },
  {
    name: 'David Kim',
    role: 'Financial Analyst',
    image: 'https://randomuser.me/api/portraits/men/75.jpg',
    initials: 'DK',
    quote:
      'The money tracking features are incredible. I finally understand where every dollar goes.',
    rating: 5,
  },
  {
    name: 'Elena Rodriguez',
    role: 'Graduate Student',
    image: 'https://randomuser.me/api/portraits/women/65.jpg',
    initials: 'ER',
    quote:
      'Balancing school, work, and personal life was impossible before LifeOS.',
    rating: 5,
  },
  {
    name: 'James Wilson',
    role: 'Entrepreneur',
    image: 'https://randomuser.me/api/portraits/men/41.jpg',
    initials: 'JW',
    quote:
      'The habit streak feature gamified my routine. 90 days in and I have built habits I failed at for years.',
    rating: 5,
  },
]

function TestimonialCard({ t, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="w-[340px] sm:w-[380px] flex-shrink-0 snap-center"
    >
      <div className="relative h-full rounded-3xl border border-[#1E3028] bg-[#101915]/80 backdrop-blur-xl overflow-hidden p-6 sm:p-8 group hover:border-[#10b981]/40 transition-all duration-500">

        {/* glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_60%)] pointer-events-none" />

        {/* quote icon */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center mb-5 sm:mb-6">
          <Quote className="w-4 h-4 sm:w-5 sm:h-5 text-[#10b981]" />
        </div>

        {/* stars */}
        <div className="flex gap-1 mb-4 sm:mb-5">
          {Array.from({ length: t.rating }).map((_, j) => (
            <Star
              key={j}
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#F59E0B] text-[#F59E0B]"
            />
          ))}
        </div>

        {/* quote */}
        <p className="text-[#B4C7BE] leading-relaxed text-sm sm:text-[15px] mb-8 sm:mb-10 min-h-[100px] sm:min-h-[120px]">
          "{t.quote}"
        </p>

        {/* author */}
        <div className="flex items-center gap-3 sm:gap-4 border-t border-[#1E3028] pt-5 sm:pt-6">
          <Avatar className="w-11 h-11 sm:w-14 sm:h-14 ring-2 ring-[#10b981]/20">
            <AvatarImage src={t.image} alt={t.name} />
            <AvatarFallback>{t.initials}</AvatarFallback>
          </Avatar>

          <div>
            <h4 className="text-white font-semibold text-sm sm:text-base">
              {t.name}
            </h4>
            <p className="text-xs sm:text-sm text-[#8AA89A]">
              {t.role}
            </p>
          </div>
        </div>

      </div>
    </motion.div>
  )
}

export default function Testimonials() {
  const headerRef = useRef(null)
  const scrollRef = useRef(null)
  const isHeaderInView = useInView(headerRef, {
    once: true,
    margin: '-100px',
  })

  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll, { passive: true })
    checkScroll()
    return () => el.removeEventListener('scroll', checkScroll)
  }, [checkScroll])

  const scroll = (direction) => {
    const el = scrollRef.current
    if (!el) return
    const scrollAmount = 400
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <section
      id="testimonials"
      className="relative bg-background dark:bg-[#090E0D] py-24 lg:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#059669]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#059669]/10 border border-[#059669]/20 text-sm text-[#10b981] mb-6">
            <Quote className="w-4 h-4" />
            Testimonials
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5">
            Loved by <span className="text-[#10b981]">Thousands</span>
          </h2>

          <p className="text-[#8AA89A] max-w-2xl mx-auto text-base sm:text-lg">
            Real people using LifeOS to improve decisions, habits, and productivity.
          </p>
        </motion.div>

        {/* Desktop: Horizontal scroll with buttons */}
        <div className="hidden lg:block relative group">
          {/* Navigation Buttons */}
          <button
            onClick={() => scroll('left')}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-[#0F1610]/90 border border-[#1E3028] backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-lg ${
              canScrollLeft
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-4 pointer-events-none'
            } hover:border-[#10b981]/30 hover:text-[#10b981] text-gray-400`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => scroll('right')}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-[#0F1610]/90 border border-[#1E3028] backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-lg ${
              canScrollRight
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-4 pointer-events-none'
            } hover:border-[#10b981]/30 hover:text-[#10b981] text-gray-400`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#090E0D] to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#090E0D] to-transparent z-20 pointer-events-none" />

          {/* Scrollable container */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {testimonials.map((t, i) => (
              <TestimonialCard key={t.name} t={t} index={i} />
            ))}
          </div>
        </div>

        {/* Mobile/Tablet: Swipeable carousel with snap */}
        <div className="lg:hidden relative">
          {/* Fade edges for mobile */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#090E0D] to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#090E0D] to-transparent z-20 pointer-events-none" />

          <div
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-4 -mx-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {testimonials.map((t, i) => (
              <TestimonialCard key={t.name} t={t} index={i} />
            ))}
          </div>

          {/* Mobile swipe indicator */}
          <div className="flex justify-center gap-1.5 mt-4">
            {testimonials.map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-[#1E3028]"
              />
            ))}
          </div>
          <p className="text-center text-xs text-gray-600 mt-2">Swipe to see more</p>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}