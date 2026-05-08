import { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Spinner } from '@/components/ui/spinner'
import { useAuthStore } from '@/store/useAuthStore'

export default function AuthCallback() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading, profile, refreshProfile } = useAuthStore()

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) {
      navigate('/login', { replace: true })
      return
    }

    const resolve = async () => {
      const latestProfile = profile ?? (await refreshProfile())
      navigate(latestProfile?.is_onboarded ? '/dashboard' : '/onboarding', { replace: true })
    }

    resolve()
  }, [isAuthenticated, isLoading, navigate, profile, refreshProfile])

  if (!isAuthenticated && !isLoading) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen bg-[#090E0D] flex items-center justify-center text-[#8AA89A]">
      <div className="flex items-center gap-3">
        <Spinner className="w-5 h-5" />
        Completing sign in...
      </div>
    </div>
  )
}
