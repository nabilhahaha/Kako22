import { ShieldOff } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { getHomeRoute } from '@/lib/permissions'
import type { UserRole } from '@/lib/types'

interface RoleGuardProps {
  allowedRoles: UserRole[]
  children: React.ReactNode
}

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user } = useAuth()

  if (!user) return null

  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center" dir="rtl">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
          <ShieldOff className="h-8 w-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">403 — غير مصرح</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            ليس لديك صلاحية الوصول إلى هذه الصفحة. تواصل مع مشرفك إذا كنت تعتقد أن هذا خطأ.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to={getHomeRoute(user.role)}>العودة للرئيسية</Link>
        </Button>
      </div>
    )
  }

  return <>{children}</>
}
