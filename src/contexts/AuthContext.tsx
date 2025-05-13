import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, register as apiRegister, refreshToken, logout as apiLogout } from '@/api/auth';
import { User } from '@/types';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (username: string, password: string) => Promise<void>;
    register: (name: string, username: string, email: string, password: string) => Promise<void>;
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

    const authCheck = useCallback(async (controller?: AbortController) => {
        try {
            const storedToken = localStorage.getItem('accessToken');
            if (storedToken) {
                const { user, accessToken } = await refreshToken(controller?.signal);
                setUser(user);
                setToken(accessToken);
                localStorage.setItem('accessToken', accessToken);
            }
        } catch (err) {
            localStorage.removeItem('accessToken');
            setError('Session expired. Please login again.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            if (isLoading) {
                controller.abort();
                setIsLoading(false);
                setError('Connection timeout. Please try again.');
            }
        }, 10000);

        authCheck(controller);

        return () => {
            controller.abort();
            clearTimeout(timeoutId);
        };
    }, [authCheck, isLoading]);

    const handleLogin = async (username: string, password: string) => {
        setIsLoading(true);
        try {
            const { user, accessToken } = await apiLogin({ username, password });
            setUser(user);
            setToken(accessToken);
            localStorage.setItem('accessToken', accessToken);
            setError(null);
        } catch (err) {
            setError('Invalid credentials. Please try again.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (name: string, username: string, email: string, password: string) => {
        setIsLoading(true);
        try {
            const { user, accessToken } = await apiRegister({ name, username, email, password });
            setUser(user);
            setToken(accessToken);
            localStorage.setItem('accessToken', accessToken);
            setError(null);
        } catch (err) {
            setError('Registration failed. Please try again.');
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
            register: handleRegister,
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