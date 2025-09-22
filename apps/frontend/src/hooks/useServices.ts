import { useQuery } from '@tanstack/react-query'
import { getServices, getService, type Service } from '@/lib/api/services'

// Query Keys
export const serviceQueryKeys = {
  all: ['services'] as const,
  lists: () => [...serviceQueryKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...serviceQueryKeys.lists(), filters] as const,
  details: () => [...serviceQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...serviceQueryKeys.details(), id] as const,
} as const

// Get all services
export function useServices(category?: 'electrical' | 'plumbing') {
  return useQuery({
    queryKey: serviceQueryKeys.list({ category }),
    queryFn: () => getServices(category),
    staleTime: 300000, // 5 minutes (services don't change often)
    retry: 3,
  })
}

// Get service by ID
export function useService(id: number) {
  return useQuery({
    queryKey: serviceQueryKeys.detail(id),
    queryFn: () => getService(id),
    enabled: !!id,
    staleTime: 300000, // 5 minutes
    retry: 3,
  })
}