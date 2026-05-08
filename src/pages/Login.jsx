import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Eye, EyeOff, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { useAuthStore } from '@/store/useAuthStore'

const fieldBaseClass =
  'h-11 rounded-xl border border-[#1E3028] bg-[#090E0D] text-white placeholder:text-[#8AA89A] focus-visible:ring-[#059669]/60 focus-visible:border-[#059669]'

const errorShake = {
  initial: { opacity: 0, x: -8 },
  animate: { opacity: 1, x: [0, -4, 4, -3, 3, 0] },
  transition: { duration: 0.35 },
}

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, signInWithGoogle, isAuthenticated, profile, isLoading } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const from = location.state?.from

  useEffect(() => {
    if (!isAuthenticated || isLoading) return
    if (from) {
      navigate(from, { replace: true })
      return
    }
    navigate(profile?.is_onboarded ? '/dashboard' : '/onboarding', { replace: true })
  }, [from, isAuthenticated, isLoading, navigate, profile?.is_onboarded])

  const validate = () => {
    const nextErrors = {}
    if (!email.trim()) nextErrors.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = 'Enter a valid email.'

    if (!password.trim()) nextErrors.password = 'Password is required.'
    else if (password.length < 8) nextErrors.password = 'Password must be at least 8 characters.'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitError('')
    if (!validate()) return

    try {
      setIsSubmitting(true)
      const redirectPath = await signIn(email, password)
      setIsSuccess(true)
      setTimeout(() => navigate(redirectPath, { replace: true }), 500)
    } catch (error) {
      setSubmitError(error.message ?? 'Unable to sign in right now.')
      setIsSuccess(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogle = async () => {
    setSubmitError('')
    try {
      await signInWithGoogle('login')
    } catch (error) {
      setSubmitError(error.message ?? 'Google sign in failed.')
    }
  }

  if (isAuthenticated && !isLoading) {
    return <Navigate to={profile?.is_onboarded ? '/dashboard' : '/onboarding'} replace />
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
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-lg bg-[#059669] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-white">LifeOS</span>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-[#8AA89A] mt-1">Sign in to your command center</p>
        </div>

        <motion.button
          initial={{ opacity: 0.9, scale: 0.98 }}
          animate={{ opacity: [0.9, 1, 0.9], scale: [0.98, 1, 0.98] }}
          transition={{ duration: 2.8, repeat: 2, repeatType: 'reverse' }}
          onClick={handleGoogle}
          className="w-full h-11 rounded-xl border border-[#1E3028] text-white hover:border-[#059669] transition-colors flex items-center justify-center gap-2 mb-5"
        >
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.656 32.657 29.219 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.153 7.961 3.039l5.657-5.657C34.046 6.053 29.27 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 16.108 19.001 12 24 12c3.059 0 5.842 1.153 7.961 3.039l5.657-5.657C34.046 6.053 29.27 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
            <path fill="#4CAF50" d="M24 44c5.117 0 9.786-1.963 13.334-5.166l-6.156-5.211C29.102 35.091 26.672 36 24 36c-5.198 0-9.623-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.049 12.049 0 0 1-4.125 5.623l.004-.003 6.156 5.211C36.901 39.206 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
          </svg>
          Continue with Google
        </motion.button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className={fieldBaseClass}
            />
            <AnimatePresence>
              {errors.email && (
                <motion.p {...errorShake} className="text-sm text-[#EF4444] mt-1">
                  {errors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={`${fieldBaseClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-0 px-3 text-[#8AA89A] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <AnimatePresence>
              {errors.password && (
                <motion.p {...errorShake} className="text-sm text-[#EF4444] mt-1">
                  {errors.password}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-[#8AA89A] hover:text-[#059669] transition-colors">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className={`w-full h-11 relative overflow-hidden rounded-xl text-white ${
              isSuccess ? 'bg-[#10B981] hover:bg-[#10B981]' : 'bg-[#059669] hover:bg-[#047857]'
            } group`}
          >
            <span className="absolute inset-y-0 -left-1/3 w-1/3 bg-white/15 skew-x-[-20deg] transition-transform duration-700 group-hover:translate-x-[340%]" />
            {isSubmitting ? (
              <>
                <Spinner className="w-4 h-4" />
                Signing in...
              </>
            ) : isSuccess ? (
              <motion.span initial={{ scale: 0.8 }} animate={{ scale: [0.8, 1.2, 1] }} className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                Signed in
              </motion.span>
            ) : (
              'Sign In'
            )}
          </Button>

          <AnimatePresence>
            {submitError && (
              <motion.p {...errorShake} className="text-sm text-[#EF4444] text-center">
                {submitError}
              </motion.p>
            )}
          </AnimatePresence>
        </form>

        <p className="text-sm text-[#8AA89A] text-center mt-5">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-white hover:text-[#059669] transition-colors">
            Create one
          </Link>
        </p>
      </motion.div>
    </motion.div>
  )
}
