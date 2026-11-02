import axios from 'axios';
import { toAppError } from '@/core/errors/errorHandler';

// For third-party APIs: no token, no refresh logic
export const publicClient = axios.create({
    baseURL: 'https://picsum.photos',
    timeout: 15000,
});

publicClient.interceptors.response.use(
    (res) => res,
    (error) => Promise.reject(toAppError(error)),
);