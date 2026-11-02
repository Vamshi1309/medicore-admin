import { useQuery } from '@tanstack/react-query';
import { authRepository } from '../repository/authRepository';

export const ME_KEY = ['me'] as const;

export function useMe() {
    return useQuery({
        queryKey: ME_KEY,               // the cache key for this data
        queryFn: authRepository.getMe,
    });
}