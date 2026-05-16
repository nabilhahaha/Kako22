import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://zcejjtzxpeqclelizeie.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_pKda7cpqZKkB8Ncp0U2_Ng_Jcmk4HVR'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'fieldsync-auth',
    storage: window.localStorage,
  },
  global: {
    headers: {
      'x-application-name': 'fieldsync',
    },
  },
})
