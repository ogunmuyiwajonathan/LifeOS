import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useDecisionStore = create(
  persist(
    (set, get) => ({
      decisions: [
        
      ],
      addDecision: (decision) =>
        set((state) => ({
          decisions: [decision, ...state.decisions],
        })),
      removeDecision: (id) =>
        set((state) => ({
          decisions: state.decisions.filter((d) => d.id !== id),
        })),
    }),
    { name: 'lifeos-decisions' }
  )
)
