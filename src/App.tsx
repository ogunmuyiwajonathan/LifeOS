import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Landing from './pages/Landing'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import DecisionEngine from './pages/DecisionEngine'
import DecisionAnalyser from './pages/DecisionAnalyser'
import Insights from './pages/Insights'
import Calculator from './pages/Calculator'
import type { ReactNode } from 'react'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuthStore } from './store/useAuthStore'

function PageWrapper({ children }: { children: ReactNode }) {
  const location = useLocation()
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()
  const { initializeAuth } = useAuthStore()

  // #region agent log
  fetch('http://127.0.0.1:7833/ingest/1f6198bd-9e17-4efa-be10-156539998948',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'862735'},body:JSON.stringify({sessionId:'862735',runId:'pre-fix',hypothesisId:'H2',location:'src/App.tsx:37',message:'App render auth snapshot',data:{path:location.pathname},timestamp:Date.now()})}).catch(()=>{});
  // #endregion

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  // Scroll to top with smooth animation when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
        {/* Email sign-in routes archived - see git history to restore */}
        {/* <Route path="/login" ... />
            <Route path="/signup" ... />
            <Route path="/forgot-password" ... />
            <Route path="/auth/callback" ... /> */}
        <Route
          path="/onboarding"
          element={<ProtectedRoute><PageWrapper><Onboarding /></PageWrapper></ProtectedRoute>}
        />
        <Route
          path="/dashboard"
          element={<ProtectedRoute><PageWrapper><Dashboard /></PageWrapper></ProtectedRoute>}
        />
        <Route
          path="/decisions"
          element={<ProtectedRoute><PageWrapper><DecisionEngine /></PageWrapper></ProtectedRoute>}
        />
        <Route
          path="/analyser"
          element={<ProtectedRoute><PageWrapper><DecisionAnalyser /></PageWrapper></ProtectedRoute>}
        />
        <Route
          path="/insights"
          element={<ProtectedRoute><PageWrapper><Insights /></PageWrapper></ProtectedRoute>}
        />
        <Route
          path="/calculator"
          element={<ProtectedRoute><PageWrapper><Calculator /></PageWrapper></ProtectedRoute>}
        />
      </Routes>
    </AnimatePresence>
  )
}
