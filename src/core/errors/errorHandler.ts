import { AxiosError } from 'axios';
import { AppError } from './AppError';

const FALLBACKS: Record<number, string> = {
  403: 'You do not have permission to do this.',
  404: 'The requested item was not found.',
  500: 'Server error. Please try again later.',
};

export const toAppError = (e: unknown): AppError => {
  if (e instanceof AppError) return e;

  const err = e as AxiosError<{ message?: string }>;

  if (err?.code === 'ECONNABORTED') {
    return new AppError('Request timed out', undefined, 'TIMEOUT');
  }
  if (!err?.response) {
    return new AppError('No internet connection', undefined, 'NETWORK');
  }

  const status = err.response.status;
  return new AppError(
    err.response.data?.message ?? FALLBACKS[status] ?? 'Something went wrong',
    status,
    'HTTP',
  );
};