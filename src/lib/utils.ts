import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns'
import { ar } from 'date-fns/locale'
import type { CustomerGrade, PerformanceStatus } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Currency & Numbers ───────────────────────────────────────────────────────

export function formatCurrency(amount: number, currency = 'SAR'): string {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n)
}

export function formatPercent(n: number, decimals = 1): string {
  return `${n.toFixed(decimals)}%`
}

// ─── Dates ────────────────────────────────────────────────────────────────────

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'dd/MM/yyyy')
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'dd/MM/yyyy HH:mm')
}

export function formatRelative(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (isToday(d)) return format(d, 'HH:mm')
  if (isYesterday(d)) return 'أمس'
  return formatDistanceToNow(d, { addSuffix: true, locale: ar })
}

// ─── UI Helpers ───────────────────────────────────────────────────────────────

export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export function getGradeVariant(grade: CustomerGrade | null):
  'default' | 'success' | 'info' | 'warning' | 'destructive' | 'secondary' {
  switch (grade) {
    case 'A': return 'success'
    case 'B': return 'info'
    case 'C': return 'warning'
    case 'D': return 'destructive'
    default:  return 'secondary'
  }
}

export function getGradeColors(grade: CustomerGrade | null): string {
  switch (grade) {
    case 'A': return 'text-emerald-700 bg-emerald-50 border-emerald-200'
    case 'B': return 'text-blue-700 bg-blue-50 border-blue-200'
    case 'C': return 'text-amber-700 bg-amber-50 border-amber-200'
    case 'D': return 'text-red-700 bg-red-50 border-red-200'
    default:  return 'text-gray-500 bg-gray-50 border-gray-200'
  }
}

export function getHealthScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-600'
  if (score >= 60) return 'text-blue-600'
  if (score >= 40) return 'text-amber-500'
  return 'text-red-500'
}

export function getHealthScoreBg(score: number): string {
  if (score >= 80) return 'bg-emerald-500'
  if (score >= 60) return 'bg-blue-500'
  if (score >= 40) return 'bg-amber-400'
  return 'bg-red-500'
}

export function getPerformanceLabel(status: PerformanceStatus): string {
  const labels: Record<PerformanceStatus, string> = {
    excellent: 'ممتاز',
    good:      'جيد',
    average:   'متوسط',
    poor:      'ضعيف',
  }
  return labels[status]
}

export function getPerformanceColor(status: PerformanceStatus): string {
  const colors: Record<PerformanceStatus, string> = {
    excellent: 'text-emerald-600',
    good:      'text-blue-600',
    average:   'text-amber-500',
    poor:      'text-red-500',
  }
  return colors[status]
}

export function truncate(str: string, maxLen: number): string {
  return str.length > maxLen ? `${str.slice(0, maxLen)}...` : str
}
