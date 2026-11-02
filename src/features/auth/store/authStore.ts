import { create } from 'zustand';
import { authRepository } from '../repository/authRepository';
import { ME_KEY } from '../hooks/useMe';
import { tokenStorage } from '@/core/storage/tokenStorage';
import { setSessionExpiredHandler } from '@/core/api/apiClient';
import { toAppError } from '@/core/errors/errorHandler';
import { queryClient } from '@/core/api/queryClient';
import { ADMIN_ROLE } from '@/constants/roles';

interface AuthState {
  isAuthenticated: boolean;
  isHydrated: boolean;
  isLoading: boolean;
  error: string | null;

  bootstrap: () => Promise<void>;
  login: (staffId: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isHydrated: false,
  isLoading: false,
  error: null,

  // On app start: validate the saved session while the splash screen is still showing
  bootstrap: async () => {
    try {
      const token = await tokenStorage.getAccess();
      if (token) {
        const me = await authRepository.getMe(); // refreshes automatically if expired
        if (me.role === ADMIN_ROLE) {
          queryClient.setQueryData(ME_KEY, me);
          set({ isAuthenticated: true });
        } else {
          await tokenStorage.clear();
        }
      }
    } catch {
      // Invalid or unreachable: stay logged out. A failed refresh already cleared the tokens.
    } finally {
      set({ isHydrated: true });
    }
  },

  login: async (staffId, password) => {
    set({ isLoading: true, error: null });
    try {
      const tokens = await authRepository.staffLogin({ staffId, password });
      await tokenStorage.save(tokens.accessToken, tokens.refreshToken);

      const me = await authRepository.getMe();
      if (me.role !== ADMIN_ROLE) {
        await authRepository.logOut().catch(() => { }); // end the session we just opened
        await tokenStorage.clear();
        set({ error: 'This app is for administrators only.' });
        return false;
      }

      queryClient.setQueryData(ME_KEY, me); // Home reads it from the cache, no second call
      set({ isAuthenticated: true });
      return true;
    } catch (e) {
      await tokenStorage.clear();
      set({ error: toAppError(e).message });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await authRepository.logOut(); // tell the backend to end the session
    } catch {
      // ignore: the user must be logged out locally either way
    } finally {
      await tokenStorage.clear();
      set({ isAuthenticated: false });
      queryClient.clear();
    }
  },

  clearError: () => set({ error: null }),
}));

// When token refresh fails, apiClient calls this to log the user out
setSessionExpiredHandler(() => {
  useAuthStore.setState({ isAuthenticated: false });
  queryClient.clear();
});