// src/contexts/AuthContext.tsx
import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, createUser as apiCreateUser, logout as apiLogout } from '@/api/auth';
import { User, UserCreateRequest } from '@/types';
import { IS_DEV, DEV_USER } from '@/config';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (username: string, password: string) => Promise<void>;
    createUser: (userData: UserCreateRequest) => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const clearError = () => setError(null);

    const authCheck = useCallback(async () => {
        try {
            if (IS_DEV) {
                // In development, automatically set a dev user
                setUser(DEV_USER);
                setToken('dev-token');
                localStorage.setItem('accessToken', 'dev-token');
            } else {
                const storedToken = localStorage.getItem('accessToken');
                if (storedToken) {
                    setToken(storedToken);
                    // You may want to fetch user info here in production
                }
            }
        } catch (err) {
            localStorage.removeItem('accessToken');
            setError('Session expired. Please login again.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        authCheck();
    }, [authCheck]);

    const handleLogin = async (username: string, password: string) => {
        setIsLoading(true);
        try {
            if (IS_DEV) {
                setUser(DEV_USER);
                setToken('dev-token');
                localStorage.setItem('accessToken', 'dev-token');
                setError(null);
            } else {
                const { user, accessToken } = await apiLogin({ username, password });
                setUser(user);
                setToken(accessToken);
                localStorage.setItem('accessToken', accessToken);
                setError(null);
            }
        } catch (err) {
            setError('Invalid credentials. Please try again.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateUser = async (userData: UserCreateRequest) => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('Not authenticated');
            }
            await apiCreateUser(userData, token);
            setError(null);
        } catch (err) {
            setError('User creation failed. Please try again.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await apiLogout();
        } finally {
            setUser(null);
            setToken(null);
            localStorage.removeItem('accessToken');
        }
    };

    return (
      <AuthContext.Provider
        value={{
            user,
            token,
            isAuthenticated: !!user,
            isLoading,
            error,
            login: handleLogin,
            createUser: handleCreateUser,
            logout: handleLogout,
            clearError
        }}
      >
          {children}
      </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};