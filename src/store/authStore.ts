import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { login as apiLogin, logout as apiLogout, getCurrentUser, refreshToken } from '@/api/auth';
import type { UserResponse, Role } from '@/types';

interface AuthState {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  hasRole: (role: Role) => boolean;
}

export const useAuthStore = create<AuthState>()(
  immer((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    initialized: false,

    login: async (username, password) => {
      set({ isLoading: true, error: null });
      try {
        const { accessToken, refreshToken, user } = await apiLogin({ username, password });
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        set({
          user,
          isAuthenticated: true,
          initialized: true,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Login failed';
        set({ error: errorMessage });
        throw new Error(errorMessage);
      } finally {
        set({ isLoading: false });
      }
    },

    logout: async () => {
      try {
        await apiLogout();
      } finally {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({
          user: null,
          isAuthenticated: false,
          initialized: true,
          error: null,
          isLoading: false
        });
      }
    },

    initializeAuth: async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        set({ initialized: true });
        return;
      }

      set({ isLoading: true });
      try {
        const user = await getCurrentUser();
        set({
          user,
          isAuthenticated: true,
          initialized: true,
        });
      } catch (err) {
        if (await get().refreshToken()) {
          return;
        }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({
          user: null,
          isAuthenticated: false,
          initialized: true,
        });
      } finally {
        set({ isLoading: false });
      }
    },

    refreshToken: async () => {
      const refreshTokenValue = localStorage.getItem('refreshToken');
      if (!refreshTokenValue) return false;

      try {
        const { accessToken, refreshToken: newRefreshToken } = await refreshToken(refreshTokenValue);
        localStorage.setItem('accessToken', accessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        const user = await getCurrentUser();
        set({
          user,
          isAuthenticated: true,
          initialized: true,
          error: null
        });
        return true;
      } catch (err) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({
          user: null,
          isAuthenticated: false,
          initialized: true,
          error: 'Session expired. Please login again.'
        });
        return false;
      }
    },

    hasRole: (role) => {
      const user = get().user;
      return user?.role === role;
    },
  }))
);