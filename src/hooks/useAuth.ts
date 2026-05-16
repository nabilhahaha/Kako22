import { useAuthStore } from '@/stores/authStore'
import { signOut as authSignOut } from '@/lib/auth'

export function useAuth() {
  const { user, isLoading, isAuthenticated, clear } = useAuthStore()

  const signOut = async () => {
    await authSignOut()
    clear()
  }

  return { user, isLoading, isAuthenticated, signOut }
}
