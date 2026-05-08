import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, MailCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { useAuthStore } from '@/store/useAuthStore'

const fieldBaseClass =
  'h-11 rounded-xl border border-[#1E3028] bg-[#090E0D] text-white placeholder:text-[#8AA89A] focus-visible:ring-[#059669]/60 focus-visible:border-[#059669]'

export default function ForgotPassword() {
  const { sendPasswordReset } = useAuthStore()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess(false)

    if (!email.trim()) {
      setError('Email is required.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email.')
      return
    }

    try {
      setIsSubmitting(true)
      await sendPasswordReset(email)
      setSuccess(true)
    } catch (submitError) {
      setError(submitError.message ?? 'Unable to send reset link.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="min-h-screen bg-[#090E0D] px-4 py-10 flex items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-md rounded-2xl border border-[#059669] bg-[#0F1610] p-6 sm:p-8 shadow-[0_0_40px_rgba(5,150,105,0.1)]"
      >
        <h1 className="text-2xl font-bold text-white text-center">Reset Password</h1>
        <p className="text-[#8AA89A] text-center mt-1 mb-6">We&apos;ll send you a secure reset link.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className={fieldBaseClass}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 rounded-xl bg-[#059669] hover:bg-[#047857] text-white"
          >
            {isSubmitting ? (
              <>
                <Spinner className="w-4 h-4" />
                Sending...
              </>
            ) : (
              'Send Reset Link'
            )}
          </Button>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: [0, -4, 4, -3, 3, 0] }}
                className="text-sm text-[#EF4444] text-center"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </form>

        {success && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-sm text-[#10B981] flex items-center justify-center gap-2"
          >
            <MailCheck className="w-4 h-4" />
            Check your inbox for a reset link.
          </motion.div>
        )}

        <Link to="/login" className="mt-6 inline-flex items-center gap-2 text-sm text-[#8AA89A] hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>
      </motion.div>
    </motion.div>
  )
}
