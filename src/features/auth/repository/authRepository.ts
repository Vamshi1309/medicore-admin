import { apiClient } from '@/core/api/apiClient';
import { Endpoints } from '@/core/api/endpoints';
import { ApiResponse } from '@/core/api/types';
import { AuthTokens, LoginRequest, RegisterRequest, User } from '../models/auth.types';

export const authRepository = {
  login: async (body: LoginRequest) =>
    (await apiClient.post<ApiResponse<AuthTokens>>(Endpoints.login, body)).data.data,

  register: async (body: RegisterRequest) =>
    (await apiClient.post<ApiResponse<AuthTokens>>(Endpoints.register, body)).data.data,

  getMe: async () =>
    (await apiClient.get<ApiResponse<User>>(Endpoints.me)).data.data,

  logOut: async () => {
    await apiClient.post<void>(Endpoints.logout, null, { timeout: 5000 });
  }
};