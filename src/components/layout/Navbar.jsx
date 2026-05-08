import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isLanding = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'About', href: '#about' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '#contact' },
  ]

  const scrollTo = (href) => {
    if (!isLanding) {
      navigate('/')
      setTimeout(() => {
        const el = document.querySelector(href)
        el?.scrollIntoView({ behavior: 'smooth' })
      }, 300)
      return
    }
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass shadow-lg shadow-black/40'
          : 'bg-background/80 dark:bg-[#090E0D]/80 backdrop-blur-xl'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <img className='h-7' src="logo.png" alt="LifeOS logo" />
            <span className="text-xl font-bold text-foreground dark:text-white">
              Life<span className='text-[#059669]'>OS</span>
            </span>
          </Link>

          {isLanding && (
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="text-sm font-medium text-foreground dark:text-white hover:text-[#059669] transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            {!isLanding && !location.pathname.startsWith('/onboarding') && (
              <Button 
                size="sm" 
                className="bg-[#059669] hover:bg-[#047857] text-white hidden sm:flex"
                onClick={() => {
                  if (location.pathname === '/dashboard') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    navigate('/dashboard');
                  }
                }}
              >
                Dashboard
              </Button>
            )}

            {isLanding && (
              <Link to="/onboarding" onClick={() => { localStorage.clear(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                <Button size="sm" className="bg-[#059669] hover:bg-[#047857] text-white hidden sm:flex">
                  Get Started
                </Button>
              </Link>
            )}

            {!location.pathname.startsWith('/onboarding') && (
              <button
                className="md:hidden p-2 rounded-lg hover:bg-muted dark:hover:bg-[#152018] transition-colors border border-border dark:border-[#1E3028]"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden glass border-t overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              {isLanding && navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="block w-full text-left text-sm font-medium py-2 text-foreground dark:text-white hover:text-[#059669]"
                >
                  {link.label}
                </button>
              ))}
              {isLanding ? (
                <Link to="/onboarding" onClick={() => { localStorage.clear(); window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileOpen(false); }}>
                  <Button className="w-full bg-[#059669] hover:bg-[#047857] text-white">
                    Get Started
                  </Button>
                </Link>
              ) : (
                <Button 
                  className="w-full bg-[#059669] hover:bg-[#047857] text-white"
                  onClick={() => { 
                    setMobileOpen(false);
                    if (location.pathname === '/dashboard') {
                      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
                    } else {
                      navigate('/dashboard');
                    }
                  }}
                >
                  Dashboard
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
