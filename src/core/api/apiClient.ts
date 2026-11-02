import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ENV } from '@/core/config/env';
import { Endpoints } from './endpoints';
import { tokenStorage } from '@/core/storage/tokenStorage';
import { toAppError } from '@/core/errors/errorHandler';
import { logger } from '@/core/utils/logger';

export const apiClient = axios.create({
  baseURL: ENV.BASE_URL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

// The auth store registers this handler, so apiClient never imports the store
// (avoids a circular import).
let onSessionExpired: (() => void) | null = null;
export const setSessionExpiredHandler = (fn: () => void) => {
  onSessionExpired = fn;
};

// Endpoints that must never carry a token (and never trigger a refresh)
const PUBLIC_ENDPOINTS: string[] = [
  Endpoints.login,
  Endpoints.register,
  Endpoints.refresh,
];

const isPublicUrl = (url?: string) => PUBLIC_ENDPOINTS.some((p) => url?.includes(p));

// 1. Attach token (except public endpoints) + log request
apiClient.interceptors.request.use(async (config) => {
  if (!isPublicUrl(config.url)) {
    const token = await tokenStorage.getAccess();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  logger.request(config);
  return config;
});

// 2. Refresh logic: one shared promise, so parallel 401s refresh only once
let refreshPromise: Promise<string> | null = null;

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = await tokenStorage.getRefresh();
  if (!refreshToken) throw new Error('No refresh token');

  try {
    // plain axios: skips our interceptors, so no infinite loop
    const res = await axios.post(`${ENV.BASE_URL}${Endpoints.refresh}`, { refreshToken });
    const { accessToken, refreshToken: newRefresh } = res.data.data;
    await tokenStorage.save(accessToken, newRefresh ?? refreshToken);
    logger.info('Token refreshed');
    return accessToken;
  } catch (e) {
    const err = e as AxiosError;
    logger.info('Token refresh failed:', err.response?.status, err.response?.data ?? err.message);
    throw e;
  }
};

// 3. Log response, retry on 401, convert errors to AppError
apiClient.interceptors.response.use(
  (res) => {
    logger.response(res);
    return res;
  },
  async (error: AxiosError) => {
    logger.error(error);
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !isPublicUrl(original.url)
    ) {
      original._retry = true;
      try {
        refreshPromise = refreshPromise ?? refreshAccessToken();
        const newToken = await refreshPromise;
        original.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(original); // retry the failed call with the new token
      } catch {
        logger.info('Session expired, logging out');
        await tokenStorage.clear();
        onSessionExpired?.();
      } finally {
        refreshPromise = null;
      }
    }

    return Promise.reject(toAppError(error));
  },
);