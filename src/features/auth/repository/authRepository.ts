import { apiClient } from '@/core/api/apiClient';
import { Endpoints } from '@/core/api/endpoints';
import { ApiResponse } from '@/core/api/types';
import { AuthTokens, StaffLoginRequest, User } from '../models/auth.types';

export const authRepository = {
  staffLogin: async (body: StaffLoginRequest) =>
    (await apiClient.post<ApiResponse<AuthTokens>>(Endpoints.staffLogin, body)).data.data,

  getMe: async () =>
    (await apiClient.get<ApiResponse<User>>(Endpoints.me)).data.data,

  // Backend reads only the Authorization header, so no body
  logOut: async () => {
    await apiClient.post(Endpoints.logout, null, { timeout: 5000 });
  },
};