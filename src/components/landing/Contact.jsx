import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { User, Mail, MessageSquare, ArrowRight, ArrowLeft, Send, CheckCircle2, BrainCircuit } from 'lucide-react'
import { useUserStore } from '@/store/useUserStore'

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
function Step1({ onNext, name, setName }) {
  const title = useTypewriter("We're here to help", 60, true)
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
        className="flex items-center gap-2 mb-8"
      >
        <BrainCircuit className="w-8 h-8 text-[#059669]" />
        <span className="text-2xl font-bold text-white">Life<span className="text-[#059669]">OS</span></span>
      </motion.div>

      {/* Title with cursor */}
      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 min-h-[48px]">
        {title.displayed}
        {!title.done && <span className="animate-pulse text-[#059669]">|</span>}
      </h2>

      {/* Subtitle with cursor */}
      <p className="text-[#8AA89A] text-lg mb-10 max-w-md min-h-[56px]">
        {subtitle.displayed}
        {title.done && !subtitle.done && <span className="animate-pulse text-[#059669]">|</span>}
      </p>

      {/* Name input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: subtitle.done ? 1 : 0, y: subtitle.done ? 0 : 20 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Please enter your name"
            className="w-full bg-white rounded-xl pl-12 pr-4 py-4 text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[#059669] placeholder:text-gray-400"
            onKeyDown={(e) => e.key === 'Enter' && name.trim() && onNext()}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          disabled={!name.trim()}
          className="w-full mt-4 bg-[#059669] hover:bg-[#047857] disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold text-lg py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          Get Started
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

// Step 2: Sliding box from right + typing
function Step2({ onNext, onBack, email, setEmail, message, setMessage }) {
  const [showForm, setShowForm] = useState(false)
  const controls = useAnimation()

  useEffect(() => {
    // Start the sliding animation
    controls.start({
      x: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }).then(() => {
      setShowForm(true)
    })
  }, [controls])

  const title = useTypewriter("How can we help you?", 50, showForm)
  const emailLabel = useTypewriter("Your email", 40, title.done)
  const msgLabel = useTypewriter("Tell us about your needs", 30, emailLabel.done)

  return (
    <div className="relative h-full overflow-hidden">
      {/* Sliding panel from right */}
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={controls}
        className="absolute inset-0 bg-[#0a0a0a] rounded-3xl p-6 sm:p-10 flex flex-col"
      >
        {/* Back button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 w-10 h-10 rounded-xl bg-[#1a1a1a] hover:bg-[#2a2a2a] flex items-center justify-center text-white transition-colors z-10"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">
          {/* Title with typing */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 min-h-[40px]">
              {title.displayed}
              {!title.done && <span className="animate-pulse text-[#059669]">|</span>}
            </h2>
          </div>

          {/* Form fields */}
          <div className="space-y-6">
            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: emailLabel.done ? 1 : 0, y: emailLabel.done ? 0 : 10 }}
              transition={{ duration: 0.3 }}
            >
              <label className="text-white text-lg mb-2 block min-h-[28px]">
                {emailLabel.displayed}
                {title.done && !emailLabel.done && <span className="animate-pulse text-[#059669]">|</span>}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex. yourname@company.com"
                  className="w-full bg-white rounded-xl pl-12 pr-4 py-4 text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[#059669] placeholder:text-gray-400"
                  onKeyDown={(e) => e.key === 'Enter' && email.trim() && message.trim() && onNext()}
                />
              </div>
            </motion.div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: msgLabel.done ? 1 : 0, y: msgLabel.done ? 0 : 10 }}
              transition={{ duration: 0.3 }}
            >
              <label className="text-white text-lg mb-2 block min-h-[28px]">
                {msgLabel.displayed}
                {emailLabel.done && !msgLabel.done && <span className="animate-pulse text-[#059669]">|</span>}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your needs"
                rows={4}
                className="w-full bg-white rounded-xl p-4 text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[#059669] placeholder:text-gray-400 resize-none"
              />
              <div className="text-right text-xs text-gray-500 mt-1">{message.length}/128</div>
            </motion.div>
          </div>

          {/* Continue button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: msgLabel.done ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNext}
              disabled={!email.trim() || !message.trim()}
              className="w-full bg-[#059669] hover:bg-[#047857] disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold text-lg py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>

        {/* Step indicator */}
        <div className="absolute bottom-4 right-6 text-xs text-gray-500">
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
        className="flex items-center gap-2 mb-8"
      >
        <BrainCircuit className="w-8 h-8 text-[#059669]" />
        <span className="text-2xl font-bold text-white">Life<span className="text-[#059669]">OS</span></span>
      </motion.div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
        className="w-20 h-20 rounded-full bg-[#059669]/20 flex items-center justify-center mb-6"
      >
        <CheckCircle2 className="w-10 h-10 text-[#059669]" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-4xl sm:text-5xl font-bold text-white mb-4"
      >
        Thank you!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-[#8AA89A] text-lg max-w-md"
      >
        Your message is on its way and our experts will respond soon.
      </motion.p>

      {name && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-gray-500 text-sm mt-6"
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
  const { profile, setProfile } = useUserStore()

  const handleNext = () => {
    if (step === 1 && name.trim()) {
      setProfile({
        ...profile,
        name: name.trim(),
      })
    }
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      handleNext()
    }, 1500)
  }

  return (
    <section className="min-h-screen bg-[#090E0D] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#059669]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-lg bg-[#0a0a0a] border border-[#1e3028] rounded-3xl overflow-hidden shadow-2xl shadow-black/50"
        style={{ minHeight: '600px' }}
      >
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              className="absolute inset-0 p-8 sm:p-10"
            >
              <Step1
                onNext={handleNext}
                name={name}
                setName={setName}
              />
            </motion.div>
          )}

          {step === 2 && (
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
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              className="absolute inset-0 p-8 sm:p-10"
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
    </section>
  )
}