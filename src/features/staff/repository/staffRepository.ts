import { apiClient } from '@/core/api/apiClient';
import { Endpoints } from '@/core/api/endpoints';
import { ApiResponse } from '@/core/api/types';
import { toList } from '@/core/api/unwrap';
import { StaffDto, toStaff } from '../models/staff.dto';
import { Staff } from '../models/staff.types';

type StaffListResponse = ApiResponse<StaffDto[] | { content: StaffDto[] }>;

const newestFirst = (a: Staff, b: Staff) =>
  (b.createdAt ?? '').localeCompare(a.createdAt ?? '');

export const staffRepository = {
  // Whole list: search and role tabs are handled in the app
  getAll: async (): Promise<Staff[]> => {
    const res = await apiClient.get<StaffListResponse>(Endpoints.adminStaff);
    return toList(res.data.data).map(toStaff).sort(newestFirst);
  },

  // For the Home screen
  getRecent: async (limit = 5): Promise<Staff[]> => {
    const res = await apiClient.get<StaffListResponse>(Endpoints.adminStaff, {
      params: { page: 0, size: limit },
    });
    return toList(res.data.data).map(toStaff).sort(newestFirst).slice(0, limit);
  },

  // Returns the whole response so the caller can show the backend's message
  updateStatus: async (id: string, isActive: boolean) =>
    (await apiClient.patch<ApiResponse<unknown>>(Endpoints.adminStaffStatus(id), { isActive })).data,
};