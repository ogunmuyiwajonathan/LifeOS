import { create } from 'zustand'

// Demo profile for local development (Supabase archived)
const demoProfile = {
  id: 'demo-user',
  full_name: 'Demo User',
  is_onboarded: false,
  created_at: new Date().toISOString(),
}

async function fetchProfileById(userId) {
  // Archived: Original Supabase logic
  // if (!userId) return null
  // const { data, error } = await supabase.from('profiles')...
  return demoProfile
}

async function ensureProfile(user) {
  // Archived: Original Supabase logic
  // if (!user?.id) return null
  // let profile = await fetchProfileById(user.id)...
  return demoProfile
}

let authSubscription = null

export const useAuthStore = create((set, get) => ({
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,

  initializeAuth: async () => {
    // Demo mode: Grant immediate access (Supabase auth archived)
    set({
      session: { user: demoProfile },
      user: demoProfile,
      profile: demoProfile,
      isAuthenticated: true,
      isLoading: false,
    })
  },

  refreshProfile: async () => {
    // Archived: Supabase implementation removed
    return demoProfile
  },

  signIn: async (email, password) => {
    // Archived: Email sign-in disabled
    console.warn('Email sign-in is disabled. Use demo mode.')
    throw new Error('Email sign-in is archived.')
  },

  signUp: async ({ fullName, email, password }) => {
    // Archived: Email sign-up disabled
    console.warn('Email sign-up is disabled. Use demo mode.')
    throw new Error('Email sign-up is archived.')
  },

  signInWithGoogle: async (mode = 'login') => {
    // Archived: Google sign-in disabled
    console.warn('Google sign-in is disabled. Use demo mode.')
    throw new Error('Google sign-in is archived.')
  },

  sendPasswordReset: async (email) => {
    // Archived: Password reset disabled
    console.warn('Password reset is disabled.')
    throw new Error('Password reset is archived.')
  },

  setOnboarded: async () => {
    // Archived: Supabase implementation removed
    const updated = { ...demoProfile, is_onboarded: true }
    set({ profile: updated })
    return updated
  },

  signOut: async () => {
    // Archived: Supabase implementation removed
    set({
      user: null,
      session: null,
      profile: null,
      isLoading: false,
      isAuthenticated: false,
    })
  },
}))
