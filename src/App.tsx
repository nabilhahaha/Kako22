import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

import { supabase } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'
import { getHomeRoute } from '@/lib/permissions'
import { useAuthStore } from '@/stores/authStore'

import AppShell from '@/components/layout/AppShell'
import AuthGuard from '@/components/auth/AuthGuard'
import RoleGuard from '@/components/auth/RoleGuard'

import LoginPage from '@/pages/auth/LoginPage'
import DashboardRedirect from '@/pages/DashboardRedirect'
import SalesmanDashboard from '@/pages/salesman/SalesmanDashboard'
import ComingSoon from '@/pages/ComingSoon'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 2 * 60 * 1000,
    },
  },
})

function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading, clear } = useAuthStore()

  useEffect(() => {
    let mounted = true

    // Initialize auth state
    const init = async () => {
      setLoading(true)
      const user = await getCurrentUser()
      if (mounted) setUser(user)
    }
    init()

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      if (event === 'SIGNED_OUT' || !session) {
        clear()
        return
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        const user = await getCurrentUser()
        if (mounted) setUser(user)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return <>{children}</>
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected shell */}
            <Route
              element={
                <AuthGuard>
                  <AppShell />
                </AuthGuard>
              }
            >
              {/* Root redirect to role home */}
              <Route index element={<DashboardRedirect />} />

              {/* Salesman routes */}
              <Route
                path="salesman/dashboard"
                element={
                  <RoleGuard allowedRoles={['presales_rep']}>
                    <SalesmanDashboard />
                  </RoleGuard>
                }
              />
              <Route path="salesman/customers"    element={<RoleGuard allowedRoles={['presales_rep']}><ComingSoon /></RoleGuard>} />
              <Route path="salesman/visits"        element={<RoleGuard allowedRoles={['presales_rep']}><ComingSoon /></RoleGuard>} />
              <Route path="salesman/visits/new"    element={<RoleGuard allowedRoles={['presales_rep']}><ComingSoon /></RoleGuard>} />
              <Route path="salesman/near-expiry"   element={<RoleGuard allowedRoles={['presales_rep']}><ComingSoon /></RoleGuard>} />
              <Route path="salesman/notifications" element={<RoleGuard allowedRoles={['presales_rep']}><ComingSoon /></RoleGuard>} />

              {/* Supervisor routes */}
              <Route path="supervisor/dashboard"    element={<RoleGuard allowedRoles={['presales_supervisor','cashvan_supervisor']}><ComingSoon /></RoleGuard>} />
              <Route path="supervisor/map"          element={<RoleGuard allowedRoles={['presales_supervisor','cashvan_supervisor']}><ComingSoon /></RoleGuard>} />
              <Route path="supervisor/approvals"    element={<RoleGuard allowedRoles={['presales_supervisor','cashvan_supervisor']}><ComingSoon /></RoleGuard>} />
              <Route path="supervisor/near-expiry"  element={<RoleGuard allowedRoles={['presales_supervisor','cashvan_supervisor']}><ComingSoon /></RoleGuard>} />
              <Route path="supervisor/requests"     element={<RoleGuard allowedRoles={['presales_supervisor','cashvan_supervisor']}><ComingSoon /></RoleGuard>} />
              <Route path="supervisor/financial"    element={<RoleGuard allowedRoles={['presales_supervisor','cashvan_supervisor']}><ComingSoon /></RoleGuard>} />
              <Route path="supervisor/reports"      element={<RoleGuard allowedRoles={['presales_supervisor','cashvan_supervisor']}><ComingSoon /></RoleGuard>} />

              {/* Regional Manager routes */}
              <Route path="regional/*" element={<RoleGuard allowedRoles={['regional_manager_roshen']}><ComingSoon /></RoleGuard>} />

              {/* Trade Marketing routes */}
              <Route path="trade-marketing/*" element={<RoleGuard allowedRoles={['trade_marketing_manager']}><ComingSoon /></RoleGuard>} />

              {/* Executive routes */}
              <Route path="executive/*" element={<RoleGuard allowedRoles={['top_management_relia','top_management_roshen']}><ComingSoon /></RoleGuard>} />

              {/* Admin routes */}
              <Route path="admin/*" element={<RoleGuard allowedRoles={['admin_relia']}><ComingSoon /></RoleGuard>} />

              {/* Profile (all roles) */}
              <Route path="profile" element={<ComingSoon />} />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>

          <Toaster
            position="top-center"
            dir="rtl"
            richColors
            toastOptions={{
              classNames: {
                toast: 'font-arabic',
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
