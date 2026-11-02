import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const enabled = __DEV__;
const SENSITIVE = ['password', 'refreshToken', 'accessToken', 'token'];

const mask = (data: any): any => {
  if (!data || typeof data !== 'object') return data;
  const copy: any = Array.isArray(data) ? [...data] : { ...data };
  for (const key of Object.keys(copy)) {
    copy[key] = SENSITIVE.includes(key) ? '***' : mask(copy[key]);
  }
  return copy;
};

export const logger = {
  info: (...args: unknown[]) => enabled && console.log('[INFO]', ...args),

  request: (c: InternalAxiosRequestConfig) => {
    if (!enabled) return;
    console.log(`➡️ ${c.method?.toUpperCase()} ${c.baseURL ?? ''}${c.url}`);
    if (c.data) console.log('   body:', mask(c.data));
  },

  response: (r: AxiosResponse) => {
    if (!enabled) return;
    console.log(`✅ ${r.status} ${r.config.url}`);
    console.log('   data:', mask(r.data));
  },

  error: (e: AxiosError) => {
    if (!enabled) return;
    console.log(`❌ ${e.response?.status ?? 'NO_RESPONSE'} ${e.config?.url}`);
    if (e.response?.data) console.log('   data:', e.response.data);
  },
};