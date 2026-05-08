// ARCHIVED: Supabase integration temporarily disabled
// To re-enable, restore the original implementation and add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env

// Original code:
// import { createClient } from '@supabase/supabase-js'
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
// export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Mock Supabase client for local development
export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: (callback) => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: async () => ({ data: null, error: new Error('Auth disabled') }),
    signUp: async () => ({ data: null, error: new Error('Auth disabled') }),
    signOut: async () => ({ error: null }),
    resetPasswordForEmail: async () => ({ data: null, error: new Error('Auth disabled') }),
  },
  from: (table) => ({
    select: () => ({
      eq: () => ({
        maybeSingle: async () => ({ data: null, error: null }),
      }),
    }),
    upsert: async () => ({ error: null }),
  }),
}
