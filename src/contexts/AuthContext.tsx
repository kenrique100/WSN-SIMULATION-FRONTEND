import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { login, register, refreshToken, logout as apiLogout } from '../api/auth';
import { AuthResponse, User } from '../types';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const storedToken = localStorage.getItem('token');
                if (storedToken) {
                    const { user, token } = await refreshToken();
                    setUser(user);
                    setToken(token);
                    localStorage.setItem('token', token);
                }
            } catch (error) {
                localStorage.removeItem('token');
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const handleLogin = async (email: string, password: string) => {
        const { user, token } = await login({ email, password });
        setUser(user);
        setToken(token);
        localStorage.setItem('token', token);
    };

    const handleRegister = async (name: string, email: string, password: string) => {
        const { user, token } = await register({ name, email, password });
        setUser(user);
        setToken(token);
        localStorage.setItem('token', token);
    };

    const handleLogout = async () => {
        await apiLogout();
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    const value = {
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};