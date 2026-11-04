import { useQuery } from '@tanstack/react-query';
import { dashboardRepository } from '../repository/dashboardRepository';

export const DASHBOARD_KEY = ['dashboard', 'stats'] as const;

export function useDashboardStats() {
  return useQuery({
    queryKey: DASHBOARD_KEY,
    queryFn: dashboardRepository.getStats,
  });
}