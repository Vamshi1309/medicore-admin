import { create } from 'zustand';

export type ToastType = 'success' | 'error';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastState {
  toast: Toast | null;
  show: (type: ToastType, message: string) => void;
  hide: () => void;
}

let counter = 0;

export const useToastStore = create<ToastState>((set) => ({
  toast: null,
  show: (type, message) => set({ toast: { id: ++counter, type, message } }),
  hide: () => set({ toast: null }),
}));

// Callable from anywhere, including outside React
export const toast = {
  success: (message: string) => useToastStore.getState().show('success', message),
  error: (message: string) => useToastStore.getState().show('error', message),
};