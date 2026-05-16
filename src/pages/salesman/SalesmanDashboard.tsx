import { useQuery } from '@tanstack/react-query'
import { Target, ShoppingBag, MapPin, TrendingUp, Users, Clock } from 'lucide-react'
import KPICard from '@/components/shared/KPICard'
import { DashboardSkeleton } from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { formatCurrency, formatPercent, getPerformanceLabel, getPerformanceColor } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { SalesmanDashboard as DashboardData } from '@/lib/types'
import { cn } from '@/lib/utils'

export default function SalesmanDashboard() {
  const { user } = useAuth()

  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['salesman-dashboard', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_salesman_dashboard', {
        p_salesman_id: user!.id,
        p_period_days: 30,
      })
      if (error) throw error
      return data as DashboardData
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })

  if (isLoading) return <DashboardSkeleton />

  if (error) {
    return (
      <EmptyState
        icon={TrendingUp}
        title="تعذر تحميل البيانات"
        description="حدث خطأ أثناء جلب بيانات لوحة التحكم. حاول مرة أخرى."
        action={{ label: 'إعادة المحاولة', onClick: () => window.location.reload() }}
      />
    )
  }

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'صباح الخير'
    if (h < 17) return 'مساء الخير'
    return 'مساء الخير'
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{greeting()}،</p>
          <h1 className="text-2xl font-bold text-foreground mt-0.5">
            {user?.full_name_ar ?? user?.full_name}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">أداء آخر 30 يوم</p>
        </div>
        {data && (
          <Badge
            variant={data.performance_status === 'excellent' || data.performance_status === 'good' ? 'success' : 'warning'}
            className="shrink-0"
          >
            {getPerformanceLabel(data.performance_status)}
          </Badge>
        )}
      </div>

      {/* KPI Cards */}
      {data ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="معدل التحول"
            value={formatPercent(data.strike_rate)}
            subtitle={`${data.total_orders} طلب من ${data.total_visits} زيارة`}
            icon={Target}
            iconColor="text-primary"
            iconBg="bg-primary/10"
            trend={{
              direction: data.strike_rate >= 60 ? 'up' : data.strike_rate >= 40 ? 'flat' : 'down',
              label: data.strike_rate >= 60 ? 'أعلى من الهدف' : 'دون الهدف',
            }}
          />
          <KPICard
            title="متوسط الطلب"
            value={formatCurrency(data.drop_size)}
            subtitle="لكل فاتورة"
            icon={ShoppingBag}
            iconColor="text-blue-600"
            iconBg="bg-blue-50"
          />
          <KPICard
            title="التغطية"
            value={formatPercent(data.coverage_percent)}
            subtitle={`${data.visited_customers} من ${data.target_customers} عميل`}
            icon={MapPin}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-50"
            trend={{
              direction: data.coverage_percent >= 70 ? 'up' : 'down',
              label: `${data.visited_customers} زيارة`,
            }}
          />
          <KPICard
            title="إجمالي الزيارات"
            value={data.total_visits}
            subtitle="خلال 30 يوم"
            icon={Clock}
            iconColor="text-purple-600"
            iconBg="bg-purple-50"
          />
        </div>
      ) : (
        // No data state
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard title="معدل التحول" value="—" icon={Target} />
          <KPICard title="متوسط الطلب" value="—" icon={ShoppingBag} />
          <KPICard title="التغطية" value="—" icon={MapPin} />
          <KPICard title="إجمالي الزيارات" value="—" icon={Clock} />
        </div>
      )}

      {/* Quick links section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              إجراءات سريعة
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {[
              { label: 'تسجيل زيارة جديدة', href: '/salesman/visits/new', icon: MapPin, color: 'text-primary bg-primary/10' },
              { label: 'عرض العملاء', href: '/salesman/customers', icon: Users, color: 'text-blue-600 bg-blue-50' },
              { label: 'تسجيل منتهية', href: '/salesman/near-expiry', icon: TrendingUp, color: 'text-amber-600 bg-amber-50' },
              { label: 'سجل الزيارات', href: '/salesman/visits', icon: Clock, color: 'text-purple-600 bg-purple-50' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-background hover:bg-accent transition-colors text-center group"
              >
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', item.color)}>
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-foreground">{item.label}</span>
              </a>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              ملخص الأداء
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data ? (
              <div className="space-y-3">
                {[
                  { label: 'معدل التحول', value: formatPercent(data.strike_rate), target: '60%', ok: data.strike_rate >= 60 },
                  { label: 'نسبة التغطية', value: formatPercent(data.coverage_percent), target: '80%', ok: data.coverage_percent >= 80 },
                  { label: 'متوسط الطلب', value: formatCurrency(data.drop_size), target: '—', ok: true },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm text-muted-foreground">{row.label}</span>
                    <div className="flex items-center gap-2">
                      <span className={cn('text-sm font-semibold kpi-number', row.ok ? 'text-emerald-600' : 'text-red-500')}>
                        {row.value}
                      </span>
                      {row.target !== '—' && (
                        <span className="text-xs text-muted-foreground">/ {row.target}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">لا توجد بيانات للفترة المحددة</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
