import { apiClient } from '@/core/api/apiClient';
import { Endpoints } from '@/core/api/endpoints';
import { ApiResponse } from '@/core/api/types';
import { toList } from '@/core/api/unwrap';
import { StaffDto, toStaff } from '../models/staff.dto';
import { Staff } from '../models/staff.types';

export const staffRepository = {
  getRecent: async (limit = 5): Promise<Staff[]> => {
    const res = await apiClient.get<ApiResponse<StaffDto[] | { content: StaffDto[] }>>(
      Endpoints.adminStaff,
      { params: { page: 0, size: limit } },
    );

    return toList(res.data.data)
      .map(toStaff)
      .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? '')) // newest first
      .slice(0, limit);
  },
};