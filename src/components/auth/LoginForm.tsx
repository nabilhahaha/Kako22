import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signIn } from '@/lib/auth'

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'البريد الإلكتروني مطلوب')
    .email('بريد إلكتروني غير صحيح'),
  password: z
    .string()
    .min(1, 'كلمة المرور مطلوبة'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await signIn(data.email, data.password)
      // Navigation handled by auth state change listener in App.tsx
    } catch (err) {
      const message = err instanceof Error ? err.message : 'خطأ غير متوقع'
      const isCredentials =
        message.toLowerCase().includes('invalid') ||
        message.toLowerCase().includes('credentials')

      toast.error(
        isCredentials
          ? 'بيانات الدخول غير صحيحة. تحقق من البريد الإلكتروني وكلمة المرور'
          : `خطأ في تسجيل الدخول: ${message}`
      )
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-[400px] space-y-8">

        {/* Brand */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary shadow-lg shadow-primary/25">
            <span className="text-white text-2xl font-bold">F</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">FieldSync</h1>
            <p className="text-sm text-muted-foreground mt-1 font-latin">Relia × Roshen — Saudi Arabia</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-foreground">تسجيل الدخول</h2>
            <p className="text-sm text-muted-foreground">أدخل بيانات حسابك للوصول إلى المنصة</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@relia.sa"
                  className={`ps-9 font-latin placeholder:font-latin ${
                    errors.email ? 'border-destructive focus-visible:ring-destructive/30' : ''
                  }`}
                  autoComplete="email"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Lock className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`ps-9 pe-10 ${
                    errors.password ? 'border-destructive focus-visible:ring-destructive/30' : ''
                  }`}
                  autoComplete="current-password"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5"
                  aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-11"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جاري تسجيل الدخول…
                </>
              ) : (
                'دخول'
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          جميع الحقوق محفوظة © {new Date().getFullYear()} Relia
        </p>
      </div>
    </div>
  )
}
