import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useDashboardStore = create(
  persist(
    (set, get) => ({
      widgets: [
        { id: 'money', type: 'money', title: 'Money', order: 0 },
        { id: 'habits', type: 'habits', title: 'Habits', order: 1 },
        { id: 'learning', type: 'learning', title: 'Learning', order: 2 },
        { id: 'opportunities', type: 'opportunities', title: 'Opportunities', order: 3 },
        { id: 'decisions', type: 'decisions', title: 'Decision Inbox', order: 4 },
      ],
      money: {
        income: 5000,
        expenses: 3200,
        savings: 1800,
        savingsGoal: 3000,
        history: [
          { month: 'Jan', income: 4800, expenses: 3100 },
          { month: 'Feb', income: 4900, expenses: 3000 },
          { month: 'Mar', income: 5000, expenses: 3200 },
          { month: 'Apr', income: 5100, expenses: 3150 },
          { month: 'May', income: 5000, expenses: 3200 },
        ],
      },
      habits: [
        { id: 'h1', name: 'Morning Meditation', streak: 12, completed: true, target: 30 },
        { id: 'h2', name: 'Read 30 Minutes', streak: 8, completed: true, target: 30 },
        { id: 'h3', name: 'Exercise', streak: 5, completed: false, target: 5 },
        { id: 'h4', name: 'Drink 2L Water', streak: 15, completed: true, target: 20 },
        { id: 'h5', name: 'No Social Media', streak: 3, completed: false, target: 7 },
      ],
      learning: {
        goals: [
          { id: 'g1', title: 'React Advanced Patterns', progress: 75, total: 100 },
          { id: 'g2', title: 'System Design Fundamentals', progress: 40, total: 100 },
          { id: 'g3', title: 'Public Speaking', progress: 20, total: 50 },
        ],
        streak: 9,
        weeklyHours: [4, 6, 3, 5, 7, 2, 5],
      },
      opportunities: [
        { id: 'o1', title: 'Frontend Engineer at Stripe', deadline: '2026-05-15', type: 'job', status: 'applied', field: 'Software Engineering' },
        { id: 'o2', title: 'Backend Developer at Vercel', deadline: '2026-06-01', type: 'job', status: 'draft', field: 'Software Engineering' },
        { id: 'o3', title: 'Fullstack Dev at Supabase', deadline: '2026-05-20', type: 'job', status: 'interested', field: 'Software Engineering' },
        { id: 'o4', title: 'Product Designer at Figma', deadline: '2026-05-30', type: 'job', status: 'interested', field: 'Design' },
        { id: 'o5', title: 'UI/UX Designer at Apple', deadline: '2026-06-15', type: 'job', status: 'applied', field: 'Design' },
        { id: 'o6', title: 'Brand Designer at Linear', deadline: '2026-06-10', type: 'job', status: 'draft', field: 'Design' },
      ],
      updateWidgetOrder: (widgets) => set({ widgets }),
      toggleHabit: (id) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, completed: !h.completed, streak: h.completed ? Math.max(0, h.streak - 1) : h.streak + 1 } : h
          ),
        })),
      updateMoney: (money) => set({ money: { ...get().money, ...money } }),
      updateLearningGoal: (id, progress) =>
        set((state) => ({
          learning: {
            ...state.learning,
            goals: state.learning.goals.map((g) => (g.id === id ? { ...g, progress } : g)),
          },
        })),
    }),
    { name: 'lifeos-dashboard' }
  )
)
