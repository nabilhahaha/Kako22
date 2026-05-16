import { Construction } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import EmptyState from '@/components/shared/EmptyState'

export default function ComingSoon() {
  const navigate = useNavigate()
  return (
    <EmptyState
      icon={Construction}
      title="قيد التطوير"
      description="هذه الصفحة تحت البناء. تابع التحديثات للحصول على أحدث الميزات."
      action={{ label: 'العودة للخلف', onClick: () => navigate(-1) }}
    />
  )
}
