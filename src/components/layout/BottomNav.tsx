import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, MapPin, AlertTriangle, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import type { UserRole } from '@/lib/types'

interface BottomNavItem {
  labelAr: string
  href: string
  icon: React.ElementType
}

function getBottomItems(role: UserRole): BottomNavItem[] {
  switch (role) {
    case 'presales_rep':
      return [
        { labelAr: 'لوحة', href: '/salesman/dashboard',   icon: LayoutDashboard },
        { labelAr: 'عملاء', href: '/salesman/customers',  icon: Users },
        { labelAr: 'زيارات', href: '/salesman/visits',     icon: MapPin },
        { labelAr: 'منتهية', href: '/salesman/near-expiry', icon: AlertTriangle },
        { labelAr: 'إشعارات', href: '/salesman/notifications', icon: Bell },
      ]
    case 'presales_supervisor':
    case 'cashvan_supervisor':
      return [
        { labelAr: 'الفريق', href: '/supervisor/dashboard', icon: LayoutDashboard },
        { labelAr: 'اعتماد', href: '/supervisor/approvals', icon: MapPin },
        { labelAr: 'طلبات', href: '/supervisor/requests',  icon: AlertTriangle },
        { labelAr: 'إشعارات', href: '/supervisor/notifications', icon: Bell },
      ]
    default:
      return [
        { labelAr: 'لوحة', href: '/executive/dashboard', icon: LayoutDashboard },
        { labelAr: 'إشعارات', href: '/notifications', icon: Bell },
      ]
  }
}

export default function BottomNav() {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) return null

  const items = getBottomItems(user.role)

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {items.map((item) => {
          const isActive =
            location.pathname === item.href ||
            (item.href !== '/' && location.pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex flex-col items-center gap-1 min-w-[56px] py-1 px-2 rounded-lg transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.labelAr}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
