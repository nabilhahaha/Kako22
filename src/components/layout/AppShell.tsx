import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import BottomNav from './BottomNav'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { ROLE_LABELS } from '@/lib/permissions'

export default function AppShell() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const { user } = useAuth()

  return (
    <div className="flex h-screen bg-background" dir="rtl">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile sidebar sheet */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="right" className="p-0 w-[280px]">
          <div className="flex items-center gap-3 px-6 h-[60px] border-b border-border">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white text-sm font-bold">F</span>
            </div>
            <div>
              <p className="text-sm font-semibold">FieldSync</p>
              <p className="text-[10px] text-muted-foreground font-latin">Relia × Roshen</p>
            </div>
          </div>

          {user && (
            <nav className="p-3">
              <div className="mb-3 px-3">
                <p className="text-xs font-medium text-foreground">{user.full_name_ar ?? user.full_name}</p>
                <p className="text-[10px] text-muted-foreground">{ROLE_LABELS[user.role]?.ar}</p>
              </div>
            </nav>
          )}
        </SheetContent>
      </Sheet>

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar onMenuClick={() => setMobileSidebarOpen(true)} />

        <main
          className={cn(
            'flex-1 overflow-y-auto scrollbar-thin',
            'pb-16 lg:pb-0' // space for bottom nav on mobile
          )}
        >
          <div className="max-w-content mx-auto px-4 py-6 lg:px-8 lg:py-8 page-enter">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <BottomNav />
    </div>
  )
}
