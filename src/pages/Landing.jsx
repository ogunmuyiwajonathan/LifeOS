import Navbar from '@/components/layout/Navbar'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import HowItWorks from '@/components/landing/HowItWorks'
import Testimonials from '@/components/landing/Testimonials'
import Pricing from '@/components/landing/Pricing'
import CTABanner from '@/components/landing/CTABanner'
import Footer from '@/components/landing/Footer'
import About from '@/components/landing/About'
import Contact from '@/components/landing/Contact'
export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <About />
      <Testimonials />
      <Pricing />
      <CTABanner />
      <Contact />
      <Footer />
    </div>
  )
}
