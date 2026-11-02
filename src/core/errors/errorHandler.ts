import { AppError } from "./AppError";
import { AxiosError } from 'axios';

export const toAppError = (e: unknown): AppError => {
    if (e instanceof AppError) return e;

    const err = e as AxiosError<{ message?: string }>;

    if (err?.code == 'ECONNABORTED') {
        return new AppError('Request timed out', undefined, 'TIMEOUT');
    }

    if (!err?.response) {
        return new AppError('No internet connection', undefined, 'NETWORK');
    }

    return new AppError(
        err.response.data?.message ?? 'Something went wrong',
        err.response.status,
        'HTTP',
    );
}