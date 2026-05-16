import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Customer, Customer360 } from '@/lib/types'

export function useCustomers() {
  return useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('is_active', true)
        .order('name')
      if (error) throw error
      return data as Customer[]
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useCustomer360(customerId: string) {
  return useQuery<Customer360>({
    queryKey: ['customer-360', customerId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_customer_360', {
        p_customer_id: customerId,
      })
      if (error) throw error
      return data as Customer360
    },
    enabled: !!customerId,
    staleTime: 2 * 60 * 1000,
  })
}
