import { create } from 'zustand';
import { authRepository } from '../repository/authRepository';
import { tokenStorage } from '@/core/storage/tokenStorage';
import { setSessionExpiredHandler } from '@/core/api/apiClient';
import { toAppError } from '@/core/errors/errorHandler';
import { queryClient } from '@/core/api/queryClient';

interface AuthState {
  isAuthenticated: boolean;
  isHydrated: boolean;
  isLoading: boolean;
  error: string | null;

  bootstrap: () => Promise<void>;
  login: (phone: string, password: string) => Promise<boolean>;
  register: (name: string, phone: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isHydrated: false,
  isLoading: false,
  error: null,

  // On app start: a saved token means logged in
  bootstrap: async () => {
    try {
      const token = await tokenStorage.getAccess();
      set({ isAuthenticated: !!token });
    } finally {
      set({ isHydrated: true });
    }
  },

  login: async (phone, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authRepository.login({ phoneNumber: phone, password });
      await tokenStorage.save(res.accessToken, res.refreshToken);
      set({ isAuthenticated: true });
      return true;
    } catch (e) {
      set({ error: toAppError(e).message });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (name, phone, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authRepository.register({ name, phoneNumber: phone, password });
      await tokenStorage.save(res.accessToken, res.refreshToken);
      set({ isAuthenticated: true });
      return true;
    } catch (e) {
      set({ error: toAppError(e).message });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await authRepository.logOut();   // tell the backend to end the session
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

setSessionExpiredHandler(() => {
  useAuthStore.setState({ isAuthenticated: false });
  queryClient.clear();
});