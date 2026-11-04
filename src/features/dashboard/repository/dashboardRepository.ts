import { apiClient } from '@/core/api/apiClient';
import { Endpoints } from '@/core/api/endpoints';
import { ApiResponse } from '@/core/api/types';
import { DashboardStats } from '../models/dashboard.types';

export const dashboardRepository = {
  getStats: async () =>
    (await apiClient.get<ApiResponse<DashboardStats>>(Endpoints.adminStats)).data.data,
};