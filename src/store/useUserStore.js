import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUserStore = create(
  persist(
    (set) => ({
      profile: {
        name: '',
        role: '',
        areas: [],
        biggestDecision: '',
      },
      setProfile: (profile) => set({ profile }),
      hasCompletedOnboarding: false,
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      resetOnboarding: () =>
        set({
          profile: { name: '', role: '', areas: [], biggestDecision: '' },
          hasCompletedOnboarding: false,
        }),
    }),
    { name: 'lifeos-user' }
  )
)
