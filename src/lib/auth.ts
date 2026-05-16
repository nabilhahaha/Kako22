import { supabase } from './supabase'
import type { User } from './types'

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()
  if (error) throw error
  return session
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const session = await getSession()
    if (!session?.user) return null

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', session.user.id)
      .single()

    if (error) return null
    return data as User
  } catch {
    return null
  }
}
