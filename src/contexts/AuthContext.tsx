import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
  useMemo
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  login as apiLogin,
  logout as apiLogout,
  getCurrentUser
} from '@/api/auth';
import type { UserResponse, Role } from '@/types';

interface AuthContextValue {
  user: UserResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initialized: boolean;
  hasRole: (role: Role) => boolean;
  setUser: (user: UserResponse | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('accessToken'));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();

  const loadUser = useCallback(async () => {
    if (!token) {
      setInitialized(true);
      return;
    }

    try {
      setIsLoading(true);
      const userData = await getCurrentUser();
      setUser(userData);
      setInitialized(true);
    } catch (err) {
      console.error('Failed to load user', err);
      await logout();
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { accessToken, user } = await apiLogin({ username, password });
      localStorage.setItem('accessToken', accessToken);
      setToken(accessToken);
      setUser(user);
      navigate('/', { replace: true });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid username or password';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const hasRole = useCallback((role: Role) => {
    return user?.role === role;
  }, [user]);

  useEffect(() => {
    if (token && !initialized) {
      loadUser().catch(console.error);
    }
  }, [token, initialized, loadUser]);

  const value = useMemo(() => ({
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    error,
    login,
    logout,
    initialized,
    hasRole,
    setUser,
    setIsAuthenticated: (isAuth: boolean) => {
      if (!isAuth) {
        setToken(null);
      }
    }
  }), [user, token, isLoading, error, login, logout, initialized, hasRole]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};