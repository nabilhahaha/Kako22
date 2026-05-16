import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import type { Visit } from '@/lib/types'

export function useVisits(repId?: string) {
  return useQuery<Visit[]>({
    queryKey: ['visits', repId],
    queryFn: async () => {
      let q = supabase
        .from('visits')
        .select('*, customer:customers(id, name, name_ar, code, channel, grade)')
        .order('visit_date', { ascending: false })
        .limit(50)

      if (repId) q = q.eq('rep_id', repId)

      const { data, error } = await q
      if (error) throw error
      return data as Visit[]
    },
    enabled: !!repId,
    staleTime: 2 * 60 * 1000,
  })
}

export function useCreateVisit() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (visit: Partial<Visit>) => {
      const { data, error } = await supabase
        .from('visits')
        .insert(visit)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['visits'] })
      toast.success('تم تسجيل الزيارة بنجاح')
    },
    onError: (err: Error) => {
      toast.error(`خطأ في تسجيل الزيارة: ${err.message}`)
    },
  })
}
