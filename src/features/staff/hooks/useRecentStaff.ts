import { useQuery } from '@tanstack/react-query';
import { staffRepository } from '../repository/staffRepository';

export const RECENT_STAFF_KEY = ['staff', 'recent'] as const;

export function useRecentStaff(limit = 5) {
  return useQuery({
    queryKey: [...RECENT_STAFF_KEY, limit],
    queryFn: () => staffRepository.getRecent(limit),
  });
}