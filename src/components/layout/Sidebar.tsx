import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Users, MapPin, CheckSquare, AlertTriangle,
  ClipboardList, BarChart2, Settings, Shield, Upload, Bell,
  TrendingUp, Map, DollarSign, Calendar, ShoppingBag,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import type { UserRole } from '@/lib/types'

interface NavItem {
  label: string
  labelAr: string
  href: string
  icon: React.ElementType
  badge?: number
}

function getNavItems(role: UserRole): NavItem[] {
  switch (role) {
    case 'presales_rep':
      return [
        { label: 'Dashboard',      labelAr: 'لوحة التحكم',       href: '/salesman/dashboard',  icon: LayoutDashboard },
        { label: 'Customers',      labelAr: 'عملائي',              href: '/salesman/customers',  icon: Users },
        { label: 'Visits',         labelAr: 'الزيارات',             href: '/salesman/visits',     icon: MapPin },
        { label: 'Near Expiry',    labelAr: 'قارب على الانتهاء',   href: '/salesman/near-expiry', icon: AlertTriangle },
        { label: 'Notifications',  labelAr: 'الإشعارات',            href: '/salesman/notifications', icon: Bell },
      ]
    case 'presales_supervisor':
    case 'cashvan_supervisor':
      return [
        { label: 'Team Dashboard', labelAr: 'لوحة الفريق',       href: '/supervisor/dashboard', icon: LayoutDashboard },
        { label: 'Live Map',       labelAr: 'الخريطة الحية',       href: '/supervisor/map',       icon: Map },
        { label: 'Approvals',      labelAr: 'اعتمادات الزيارات',  href: '/supervisor/approvals', icon: CheckSquare },
        { label: 'Near Expiry',    labelAr: 'موافقة المنتهية',  href: '/supervisor/near-expiry', icon: AlertTriangle },
        { label: 'Visit Requests', labelAr: 'طلبات زيارة',       href: '/supervisor/requests',  icon: ClipboardList },
        { label: 'Financial Req',  labelAr: 'طلبات مالية',        href: '/supervisor/financial', icon: DollarSign },
        { label: 'Reports',        labelAr: 'التقارير',               href: '/supervisor/reports',   icon: BarChart2 },
      ]
    case 'regional_manager_roshen':
      return [
        { label: 'Regional KPIs',  labelAr: 'مؤشرات المنطقة',    href: '/regional/dashboard',  icon: LayoutDashboard },
        { label: 'Distributor',    labelAr: 'أداء الموزع',      href: '/regional/distributor', icon: TrendingUp },
        { label: 'Coverage Map',   labelAr: 'خريطة التغطية',      href: '/regional/map',         icon: Map },
        { label: 'Approvals',      labelAr: 'طابور الموافقات',    href: '/regional/approvals',   icon: CheckSquare },
        { label: 'Visit Requests', labelAr: 'طلبات زيارة',       href: '/regional/requests',    icon: ClipboardList },
      ]
    case 'trade_marketing_manager':
      return [
        { label: 'Dashboard',      labelAr: 'لوحة التحكم',       href: '/trade-marketing/dashboard',   icon: LayoutDashboard },
        { label: 'Promotions',     labelAr: 'تقويم العروض',      href: '/trade-marketing/promotions',  icon: Calendar },
        { label: 'Visibility',     labelAr: 'تقارير الإدراج',    href: '/trade-marketing/visibility',  icon: ShoppingBag },
        { label: 'Near Expiry',    labelAr: 'تحليلات المنتهية', href: '/trade-marketing/near-expiry', icon: AlertTriangle },
        { label: 'ROI Calculator', labelAr: 'حاسبة العائد',       href: '/trade-marketing/roi',         icon: DollarSign },
      ]
    case 'top_management_relia':
    case 'top_management_roshen':
      return [
        { label: 'Executive',      labelAr: 'لوحة الرئيس التنفيذي',  href: '/executive/dashboard', icon: LayoutDashboard },
        { label: 'KPIs',           labelAr: 'المؤشرات الاستراتيجية', href: '/executive/kpis',      icon: TrendingUp },
        { label: 'Anomaly Alerts', labelAr: 'تنبيهات شاذة',       href: '/executive/alerts',    icon: AlertTriangle },
        { label: 'Reports',        labelAr: 'التقارير',               href: '/executive/reports',   icon: BarChart2 },
      ]
    case 'admin_relia':
      return [
        { label: 'Dashboard',      labelAr: 'لوحة التحكم',       href: '/admin/dashboard',     icon: LayoutDashboard },
        { label: 'Users',          labelAr: 'إدارة المستخدمين',  href: '/admin/users',         icon: Users },
        { label: 'Raw Data',       labelAr: 'رفع البيانات',       href: '/admin/upload',        icon: Upload },
        { label: 'Configuration',  labelAr: 'إعدادات النظام',     href: '/admin/config',        icon: Settings },
        { label: 'Activity Logs',  labelAr: 'سجلات النشاط',      href: '/admin/logs',          icon: Shield },
        { label: 'Map View',       labelAr: 'خريطة شاملة',        href: '/admin/map',           icon: Map },
      ]
    default:
      return []
  }
}

interface SidebarProps {
  className?: string
}

export default function Sidebar({ className }: SidebarProps) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) return null

  const items = getNavItems(user.role)

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col w-[260px] shrink-0 border-e border-border bg-card h-screen sticky top-0',
        className
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 h-[60px] border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <span className="text-white text-sm font-bold">F</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground leading-none">FieldSync</p>
          <p className="text-xs text-muted-foreground mt-0.5 font-latin">Relia × Roshen</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-0.5">
        {items.map((item) => {
          const isActive = location.pathname === item.href ||
            (item.href !== '/' && location.pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group',
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <Icon
                className={cn(
                  'h-4 w-4 shrink-0 transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                )}
              />
              <span className="truncate">{item.labelAr}</span>
              {item.badge != null && item.badge > 0 && (
                <span className="ms-auto inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold font-latin">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User info at bottom */}
      <div className="px-3 py-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <span className="text-primary text-xs font-semibold">
              {user.full_name.charAt(0)}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-foreground truncate">
              {user.full_name_ar ?? user.full_name}
            </p>
            <p className="text-[10px] text-muted-foreground truncate font-latin">{user.email}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
