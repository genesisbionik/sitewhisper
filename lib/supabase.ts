import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Create and export a function to get the client
export const getSupabaseBrowserClient = () => {
  return createClientComponentClient()
}

