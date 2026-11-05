import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/core/api/queryClient';
import { toast } from '@/core/ui/toast';
import { DASHBOARD_KEY } from '@/features/dashboard/hooks/useDashboardStats';
import { staffRepository } from '../repository/staffRepository';
import { Staff } from '../models/staff.types';
import { RECENT_STAFF_KEY } from './useRecentStaff';
import { STAFF_KEY, STAFF_LIST_KEY } from './useStaffList';

interface Vars {
  id: string;
  isActive: boolean;
}

const patch = (id: string, isActive: boolean) => (old: Staff[] | undefined) =>
  old?.map((s) => (s.id === id ? { ...s, isActive } : s));

export function useToggleStaffStatus() {
  return useMutation({
    mutationFn: ({ id, isActive }: Vars) => staffRepository.updateStatus(id, isActive),

    // 1. Before the request: show the new state immediately
    onMutate: async ({ id, isActive }) => {
      await queryClient.cancelQueries({ queryKey: STAFF_KEY });
      const snapshots = queryClient.getQueriesData<Staff[]>({ queryKey: STAFF_KEY });
      queryClient.setQueriesData<Staff[]>({ queryKey: STAFF_LIST_KEY }, patch(id, isActive));
      queryClient.setQueriesData<Staff[]>({ queryKey: RECENT_STAFF_KEY }, patch(id, isActive));
      return { snapshots };
    },

    // 2. On failure: put the old data back (the global handler shows the backend's error message)
    onError: (_error, _vars, context) => {
      context?.snapshots.forEach(([key, data]) => queryClient.setQueryData(key, data));
    },

    // 3. On success: show the backend's own message
    onSuccess: (res) => toast.success(res.message || 'Status updated'),

    // 4. Either way: re-sync with the server (the dashboard counts may change too)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
    },
  });
}