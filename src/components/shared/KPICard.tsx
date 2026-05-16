import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
  trend?: {
    direction: 'up' | 'down' | 'flat'
    label: string
  }
  className?: string
}

export default function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-primary',
  iconBg = 'bg-primary/10',
  trend,
  className,
}: KPICardProps) {
  const TrendIcon =
    trend?.direction === 'up'
      ? TrendingUp
      : trend?.direction === 'down'
      ? TrendingDown
      : Minus

  const trendColor =
    trend?.direction === 'up'
      ? 'text-emerald-600'
      : trend?.direction === 'down'
      ? 'text-red-500'
      : 'text-muted-foreground'

  return (
    <Card className={cn('hover:shadow-sm transition-shadow', className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground truncate">{title}</p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-foreground kpi-number">
              {value}
            </p>
            {subtitle && (
              <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
            )}
            {trend && (
              <div className={cn('flex items-center gap-1 mt-2', trendColor)}>
                <TrendIcon className="h-3 w-3" />
                <span className="text-xs font-medium">{trend.label}</span>
              </div>
            )}
          </div>
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', iconBg)}>
            <Icon className={cn('h-5 w-5', iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
