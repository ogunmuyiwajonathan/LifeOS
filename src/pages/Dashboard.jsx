import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import ParticleBackground from '@/components/three/ParticleBackground'
import StreakBanner from '@/components/dashboard/StreakBanner'
import DecisionInboxNew from '@/components/dashboard/DecisionInboxNew'
import DecisionHistory from '@/components/dashboard/DecisionHistory'
import IncomeTracker from '@/components/dashboard/IncomeTracker'
import ExpenseTracker from '@/components/dashboard/ExpenseTracker'
import BudgetSummary from '@/components/dashboard/BudgetSummary'
import NetWorth from '@/components/dashboard/NetWorth'
import BillsSubscriptions from '@/components/dashboard/BillsSubscriptions'
import SavingsGoals from '@/components/dashboard/SavingsGoals'
import HabitsDailyCard from '@/components/dashboard/HabitsDailyCard'
import HealthMetricsCard from '@/components/dashboard/HealthMetricsCard'
import WaterNutritionCard from '@/components/dashboard/WaterNutritionCard'
import WorkoutLogCard from '@/components/dashboard/WorkoutLogCard'
import MoodTrackerCard from '@/components/dashboard/MoodTrackerCard'
import CourseTrackerCard from '@/components/dashboard/CourseTrackerCard'
import SkillsCard from '@/components/dashboard/SkillsCard'
import ReadingListCard from '@/components/dashboard/ReadingListCard'
import StudySessionsCard from '@/components/dashboard/StudySessionsCard'
import NotesInsightsCard from '@/components/dashboard/NotesInsightsCard'
import JobFieldsCard from '@/components/dashboard/JobFieldsCard'
import OpportunityFeedCard from '@/components/dashboard/OpportunityFeedCard'
import ApplicationsCard from '@/components/dashboard/ApplicationsCard'
import NetworkingCard from '@/components/dashboard/NetworkingCard'
import OpportunityNotesCard from '@/components/dashboard/OpportunityNotesCard'
import { updateGlobalStreak } from '@/utils/streak'
import { useUserStore } from '@/store/useUserStore'

export default function Dashboard() {
  const [selectedModules, setSelectedModules] = useState([])
  const userName = useUserStore((state) => state.profile?.name || '')

  useEffect(() => {
    updateGlobalStreak()
    const stored = localStorage.getItem('lifeosModules')
    if (stored) {
      try {
        const rawModules = JSON.parse(stored)
        const mapper = {
          money: 'Money & Finance',
          habits: 'Habits & Health',
          learning: 'Learning & Skills',
          opportunities: 'Opportunities',
        }
        const normalized = rawModules.map((module) => mapper[module] || module)
        console.log('Modules selected:', normalized)
        setSelectedModules(normalized)
      } catch (e) {
        console.error('Failed to load modules:', e)
      }
    } else {
      console.log('Modules selected:', [])
    }
  }, [])

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="min-h-screen bg-[#0a0f0a] relative">
      <ParticleBackground />
      <Navbar />

      <div className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Streak Banner */}
          <StreakBanner />

          {/* Dashboard Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start justify-between mb-8"
          >
            <div>
              <h1 className="text-2xl font-bold text-white">
                {userName ? `${userName}'s Dashboard` : 'Your Dashboard'}
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {userName
                  ? `Hi ${userName}, how are you doing today 🙃`
                  : 'Hi there, how are you doing today 🙃'}
              </p>
            </div>
            <span className="text-sm text-gray-400">{today}</span>
          </motion.div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3 text-xs font-semibold tracking-widest text-gray-500 uppercase mb-3 mt-6">Decisions</div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <DecisionInboxNew />
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
              <DecisionHistory />
            </motion.div>

            {selectedModules.length === 0 && (
              <div className="lg:col-span-3 rounded-2xl bg-[#0f1a13] border border-[#1e3028] p-5 text-center">
                <p className="text-gray-300 mb-3">No modules selected yet.</p>
                <Link to="/onboarding" className="text-[#059669] hover:underline">Go to onboarding</Link>
              </div>
            )}

            {selectedModules.includes('Money & Finance') && (
              <>
                <div className="lg:col-span-3 text-xs font-semibold tracking-widest text-gray-500 uppercase mb-3 mt-6">Money & Finance</div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  <IncomeTracker />
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
                  <ExpenseTracker />
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  <BudgetSummary />
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
                  <NetWorth />
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                  <BillsSubscriptions />
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
                  <SavingsGoals />
                </motion.div>
              </>
            )}

            {selectedModules.includes('Habits & Health') && (
              <>
                <div className="lg:col-span-3 text-xs font-semibold tracking-widest text-gray-500 uppercase mb-3 mt-6">Habits & Health</div>
                <HabitsDailyCard />
                <HealthMetricsCard />
                <WaterNutritionCard />
                <WorkoutLogCard />
                <MoodTrackerCard />
              </>
            )}

            {selectedModules.includes('Learning & Skills') && (
              <>
                <div className="lg:col-span-3 text-xs font-semibold tracking-widest text-gray-500 uppercase mb-3 mt-6">Learning & Skills</div>
                <CourseTrackerCard />
                <SkillsCard />
                <ReadingListCard />
                <StudySessionsCard />
                <NotesInsightsCard />
              </>
            )}

            {selectedModules.includes('Opportunities') && (
              <>
                <div className="lg:col-span-3 text-xs font-semibold tracking-widest text-gray-500 uppercase mb-3 mt-6">Opportunities</div>
                <JobFieldsCard />
                <OpportunityFeedCard />
                <ApplicationsCard />
                <NetworkingCard />
                <OpportunityNotesCard />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
