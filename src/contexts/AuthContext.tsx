import { createContext, useContext, ReactNode } from 'react';
import { DEV_USER } from '@/config';

interface AuthContextType {
    user: any;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (username: string, password: string) => Promise<void>;
    createUser: (userData: any) => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    return (
      <AuthContext.Provider
        value={{
            user: DEV_USER,
            token: 'dev-token',
            isAuthenticated: true,
            isLoading: false,
            error: null,
            login: async () => {},
            createUser: async () => {},
            logout: async () => {},
            clearError: () => {}
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