import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion'
import { User, Mail, MessageSquare, ArrowRight, ArrowLeft, Send, CheckCircle2, BrainCircuit } from 'lucide-react'

// Typewriter hook
function useTypewriter(text, speed = 40, start = true) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!start) return
    let i = 0
    setDisplayed('')
    setDone(false)
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        setDone(true)
        clearInterval(timer)
      }
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed, start])

  return { displayed, done }
}

// Step 1: Intro with typing animation
function Step1({ onNext, name, setName, isActive }) {
  const title = useTypewriter("We're here to help", 60, isActive)
  const subtitle = useTypewriter("Complete the form to get in touch with our LifeOS Team.", 30, title.done)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center text-center h-full justify-center"
    >
      {/* Logo */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        className="flex items-center gap-2 mb-6"
      >
        <img src="logo.png" alt="LifeOS logo" className="w-7 h-7 text-[#059669]" />
        <span className="text-xl font-bold text-white">Life<span className="text-[#059669]">OS</span></span>
      </motion.div>

      {/* Title with cursor */}
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 min-h-[40px]">
        {title.displayed}
        {!title.done && <span className="animate-pulse text-[#059669]">|</span>}
      </h2>

      {/* Subtitle with cursor */}
      <p className="text-[#8AA89A] text-base mb-8 max-w-sm min-h-[48px] px-4">
        {subtitle.displayed}
        {title.done && !subtitle.done && <span className="animate-pulse text-[#059669]">|</span>}
      </p>

      {/* Name input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: subtitle.done ? 1 : 0, y: subtitle.done ? 0 : 20 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xs"
      >
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Please enter your name"
            className="w-full bg-white rounded-xl pl-10 pr-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#059669] placeholder:text-gray-400"
            onKeyDown={(e) => e.key === 'Enter' && name.trim() && onNext()}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          disabled={!name.trim()}
          className="w-full mt-3 bg-[#059669] hover:bg-[#047857] disabled:bg-[#1e3028] disabled:text-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          Get Started
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

// Step 2: Sliding box from right + typing
function Step2({ onNext, onBack, email, setEmail, message, setMessage, isActive }) {
  const [showForm, setShowForm] = useState(false)
  const controls = useAnimation()

  useEffect(() => {
    if (!isActive) return
    controls.start({
      x: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }).then(() => {
      setShowForm(true)
    })
  }, [controls, isActive])

  const title = useTypewriter("How can we help you?", 50, showForm)
  const emailLabel = useTypewriter("Your email", 40, title.done)
  const msgLabel = useTypewriter("Tell us about your needs", 30, emailLabel.done)

  return (
    <div className="relative h-full overflow-hidden">
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={controls}
        className="absolute inset-0 bg-[#0a0a0a] rounded-3xl p-5 sm:p-8 flex flex-col"
      >
        <button
          onClick={onBack}
          className="absolute top-4 left-4 w-9 h-9 rounded-lg bg-[#1a1a1a] hover:bg-[#2a2a2a] flex items-center justify-center text-white transition-colors z-10"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full pt-6">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 min-h-[32px]">
              {title.displayed}
              {!title.done && <span className="animate-pulse text-[#059669]">|</span>}
            </h2>
          </div>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: emailLabel.done ? 1 : 0, y: emailLabel.done ? 0 : 10 }}
              transition={{ duration: 0.3 }}
            >
              <label className="text-white text-base mb-1.5 block min-h-[24px]">
                {emailLabel.displayed}
                {title.done && !emailLabel.done && <span className="animate-pulse text-[#059669]">|</span>}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex. yourname@company.com"
                  className="w-full bg-white rounded-xl pl-10 pr-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#059669] placeholder:text-gray-400"
                  onKeyDown={(e) => e.key === 'Enter' && email.trim() && message.trim() && onNext()}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: msgLabel.done ? 1 : 0, y: msgLabel.done ? 0 : 10 }}
              transition={{ duration: 0.3 }}
            >
              <label className="text-white text-base mb-1.5 block min-h-[24px]">
                {msgLabel.displayed}
                {emailLabel.done && !msgLabel.done && <span className="animate-pulse text-[#059669]">|</span>}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your needs"
                rows={3}
                className="w-full bg-white rounded-xl p-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#059669] placeholder:text-gray-400 resize-none"
              />
              <div className="text-right text-xs text-gray-500 mt-1">{message.length}/128</div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: msgLabel.done ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNext}
              disabled={!email.trim() || !message.trim()}
              className="w-full bg-[#059669] hover:bg-[#047857] disabled:bg-[#1e3028] disabled:text-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>

        <div className="absolute bottom-3 right-5 text-xs text-gray-500">
          Step 2 of 2
        </div>
      </motion.div>
    </div>
  )
}

// Step 3: Thank you
function Step3({ name }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center text-center h-full justify-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        className="flex items-center gap-2 mb-6"
      >
        <img src="logo.png" alt="LifeOS logo" className="w-7 h-7 text-[#059669]" />
        <span className="text-xl font-bold text-white">Life<span className="text-[#059669]">OS</span></span>
      </motion.div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
        className="w-16 h-16 rounded-full bg-[#059669]/20 flex items-center justify-center mb-4"
      >
        <CheckCircle2 className="w-8 h-8 text-[#059669]" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-3xl sm:text-4xl font-bold text-white mb-3"
      >
        Thank you!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-[#8AA89A] text-base max-w-sm px-4"
      >
        Your message is on its way and our experts will respond soon.
      </motion.p>

      {name && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-gray-500 text-xs mt-4"
        >
          We'll reach out to you at your provided email, {name}.
        </motion.p>
      )}
    </motion.div>
  )
}

// Main Contact Component
export default function Contact() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true)
    }
  }, [isInView, hasAnimated])

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      handleNext()
    }, 1500)
  }

  const resetForm = () => {
    setStep(1)
    setName('')
    setEmail('')
    setMessage('')
    setHasAnimated(false)
  }

  return (
    <section 
      ref={sectionRef}
      id="contact" 
      className="min-h-screen bg-[#090E0D] flex flex-col items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#059669]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      {/* Header - Now properly visible above card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center mb-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#059669]/10 border border-[#059669]/20 text-sm font-medium text-[#059669] mb-3">
          <MessageSquare className="w-3.5 h-3.5" />
          Get in Touch
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          Contact <span className="text-[#059669]">Us</span>
        </h2>
      </motion.div>

      {/* Main Card - Reduced size */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md bg-[#0a0a0a] border border-[#1e3028] rounded-3xl overflow-hidden shadow-2xl shadow-black/50"
        style={{ minHeight: '480px', maxHeight: '520px' }}
      >
        <AnimatePresence mode="wait">
          {hasAnimated && step === 1 && (
            <motion.div
              key="step1"
              className="absolute inset-0 p-6 sm:p-8"
            >
              <Step1
                onNext={handleNext}
                name={name}
                setName={setName}
                isActive={hasAnimated}
              />
            </motion.div>
          )}

          {hasAnimated && step === 2 && (
            <motion.div
              key="step2"
              className="absolute inset-0"
            >
              <Step2
                onNext={handleSubmit}
                onBack={handleBack}
                email={email}
                setEmail={setEmail}
                message={message}
                setMessage={setMessage}
                isActive={step === 2}
              />
            </motion.div>
          )}

          {hasAnimated && step === 3 && (
            <motion.div
              key="step3"
              className="absolute inset-0 p-6 sm:p-8"
            >
              <Step3 name={name} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading overlay */}
        <AnimatePresence>
          {isSubmitting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Send className="w-8 h-8 text-[#059669]" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Reset button */}
      {step === 3 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={resetForm}
          className="relative z-10 mt-6 text-sm text-gray-500 hover:text-[#059669] transition-colors"
        >
          Send another message
        </motion.button>
      )}
    </section>
  )
}