import { Alert } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/core/api/queryClient';
import { toast } from '@/core/ui/toast';
import { DASHBOARD_KEY } from '@/features/dashboard/hooks/useDashboardStats';
import { staffRepository } from '../repository/staffRepository';
import { CreateStaffRequest } from '../models/createStaff.types';
import { STAFF_KEY } from './useStaffList';

export function useCreateStaff() {
  return useMutation({
    mutationFn: (body: CreateStaffRequest) => staffRepository.create(body),

    onSuccess: (res, vars) => {
      // The backend's own message
      toast.success(res.message || 'Staff account created');

      // Refresh the staff list, the Home "recent" list and the dashboard counts
      queryClient.invalidateQueries({ queryKey: STAFF_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });

      // If the backend generates the staff ID, the admin needs it to hand over the login
      const newStaffId = res.data?.staffId;
      if (newStaffId) {
        Alert.alert(
          'Account created',
          `Staff ID: ${newStaffId}\n\nShare it with ${vars.name} together with the temporary password.`,
        );
      }
    },
    // Failures need no code: the global handler shows the backend's message
  });
}