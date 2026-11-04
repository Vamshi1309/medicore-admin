import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { AppError } from '@/core/errors/AppError';
import { toast } from '@/core/ui/toast';

// A 401 here means the session ended; the app already logs the user out
const isSessionError = (e: unknown) => e instanceof AppError && e.statusCode === 401;

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      // First-load failures are shown inline by the screen (with Try again).
      // A failed refresh keeps the old data on screen, so tell the user with a snackbar.
      if (query.state.data !== undefined && !isSessionError(error)) {
        toast.error(error.message);
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      if (!isSessionError(error)) toast.error(error.message);
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1, // 401s are already handled by apiClient
    },
  },
});