import type { UserRole } from './types'

export const ROLE_LABELS: Record<UserRole, { en: string; ar: string }> = {
  admin_relia:              { en: 'System Admin',            ar: 'مدير النظام' },
  presales_rep:             { en: 'Sales Rep',               ar: 'مندوب مبيعات' },
  presales_supervisor:      { en: 'Sales Supervisor',        ar: 'مشرف مبيعات' },
  cashvan_supervisor:       { en: 'Cash Van Supervisor',     ar: 'مشرف كاش فان' },
  regional_manager_roshen:  { en: 'Regional Manager',        ar: 'مدير إقليمي' },
  trade_marketing_manager:  { en: 'Trade Marketing Manager', ar: 'مدير التسويق الميداني' },
  top_management_relia:     { en: 'Top Management (Relia)',  ar: 'الإدارة العليا (ريليا)' },
  top_management_roshen:    { en: 'Top Management (Roshen)', ar: 'الإدارة العليا (روشن)' },
}

export const ROLE_HOME_ROUTES: Record<UserRole, string> = {
  admin_relia:              '/admin/dashboard',
  presales_rep:             '/salesman/dashboard',
  presales_supervisor:      '/supervisor/dashboard',
  cashvan_supervisor:       '/supervisor/dashboard',
  regional_manager_roshen:  '/regional/dashboard',
  trade_marketing_manager:  '/trade-marketing/dashboard',
  top_management_relia:     '/executive/dashboard',
  top_management_roshen:    '/executive/dashboard',
}

export function getHomeRoute(role: UserRole): string {
  return ROLE_HOME_ROUTES[role] ?? '/login'
}

export function canApproveVisits(role: UserRole): boolean {
  return ['presales_supervisor', 'cashvan_supervisor', 'regional_manager_roshen', 'admin_relia'].includes(role)
}

export function canViewAllRegions(role: UserRole): boolean {
  return [
    'admin_relia',
    'top_management_relia',
    'top_management_roshen',
    'regional_manager_roshen',
  ].includes(role)
}

export function canManageUsers(role: UserRole): boolean {
  return role === 'admin_relia'
}

export function canUploadData(role: UserRole): boolean {
  return role === 'admin_relia'
}

export function canApproveNearExpiry(role: UserRole): boolean {
  return [
    'presales_supervisor',
    'cashvan_supervisor',
    'regional_manager_roshen',
    'trade_marketing_manager',
    'admin_relia',
  ].includes(role)
}

export function isSupervisor(role: UserRole): boolean {
  return ['presales_supervisor', 'cashvan_supervisor'].includes(role)
}

export function isManagement(role: UserRole): boolean {
  return [
    'regional_manager_roshen',
    'trade_marketing_manager',
    'top_management_relia',
    'top_management_roshen',
    'admin_relia',
  ].includes(role)
}
