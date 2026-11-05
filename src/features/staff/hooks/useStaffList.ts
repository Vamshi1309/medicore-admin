import { useQuery } from '@tanstack/react-query';
import { staffRepository } from '../repository/staffRepository';

export const STAFF_KEY = ['staff'] as const;
export const STAFF_LIST_KEY = ['staff', 'list'] as const;

export function useStaffList() {
  return useQuery({
    queryKey: STAFF_LIST_KEY,
    queryFn: () => staffRepository.getAll(),
  });
}