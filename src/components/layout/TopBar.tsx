import { Menu, Bell, LogOut, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/useAuth'
import { ROLE_LABELS } from '@/lib/permissions'
import { getInitials } from '@/lib/utils'
import { toast } from 'sonner'

interface TopBarProps {
  onMenuClick: () => void
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login', { replace: true })
    } catch {
      toast.error('حدث خطأ أثناء تسجيل الخروج')
    }
  }

  return (
    <header className="h-[60px] border-b border-border bg-card flex items-center gap-4 px-4 lg:px-6 shrink-0">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon-sm"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="فتح القائمة"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile logo */}
      <div className="flex items-center gap-2 lg:hidden">
        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
          <span className="text-white text-xs font-bold">F</span>
        </div>
        <span className="text-sm font-semibold">FieldSync</span>
      </div>

      <div className="flex-1" />

      {/* Notifications */}
      <Button variant="ghost" size="icon-sm" aria-label="الإشعارات" className="relative">
        <Bell className="h-4 w-4" />
        <span className="absolute top-1.5 end-1.5 w-2 h-2 bg-primary rounded-full" />
      </Button>

      {/* User dropdown */}
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-2 px-2 hover:bg-accent" aria-label="قائمة المستخدم">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary/15 text-primary text-[10px] font-semibold">
                  {getInitials(user.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-xs font-medium leading-none">
                  {user.full_name_ar ?? user.full_name}
                </span>
                <span className="text-[10px] text-muted-foreground leading-none mt-0.5">
                  {ROLE_LABELS[user.role]?.ar}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user.full_name_ar ?? user.full_name}</p>
                <p className="text-xs text-muted-foreground font-latin">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User className="h-4 w-4" />
              الملف الشخصي
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-destructive focus:text-destructive focus:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              تسجيل الخروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  )
}
