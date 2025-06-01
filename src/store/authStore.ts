// authStore.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import {
  login as apiLogin,
  logout as apiLogout,
  getCurrentUser,
  refreshToken as apiRefreshToken
} from '@/api/auth';
import type { UserResponse, Role } from '@/types';

interface AuthState {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  login: (username: string, password: string) => Promise<UserResponse>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  hasRole: (role: Role) => boolean;
  setUser: (user: UserResponse | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  immer((set, get) => ({
    user: null,
    isAuthenticated: !!localStorage.getItem('accessToken'),
    isLoading: false,
    error: null,
    initialized: false,

    setUser: (user) => set({ user }),

    clearAuth: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      set({
        user: null,
        isAuthenticated: false,
        error: null
      });
    },

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
        return user;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Login failed';
        set({ error: errorMessage });
        throw new Error(errorMessage);
      } finally {
        set({ isLoading: false });
      }
    },

    logout: async () => {
      set({ isLoading: true });
      try {
        await apiLogout();
      } catch (err) {
        console.error('Logout error:', err);
      } finally {
        get().clearAuth();
        set({ initialized: true, isLoading: false });
        window.location.reload();
      }
    },

    initializeAuth: async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
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
        get().clearAuth();
      } finally {
        set({ isLoading: false });
      }
    },

    refreshToken: async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return false;

      try {
        // Ensure the refresh token is properly formatted for the backend
        const formattedRefreshToken = refreshToken.startsWith('Bearer ')
          ? refreshToken
          : `Bearer ${refreshToken}`;

        const { accessToken, refreshToken: newRefreshToken } = await apiRefreshToken(formattedRefreshToken);
        localStorage.setItem('accessToken', accessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        const user = await getCurrentUser();
        set({
          user,
          isAuthenticated: true,
          error: null
        });
        return true;
      } catch (err) {
        get().clearAuth();
        set({ error: 'Session expired. Please login again.' });
        return false;
      }
    },

    hasRole: (role) => {
      const user = get().user;
      return user?.role === role;
    },
  }))
);