import {
    createContext,
    useContext,
    ReactNode,
    useState,
    useEffect
} from 'react';
import {
    login as apiLogin,
    register as apiRegister,
    refreshToken,
    logout as apiLogout
} from '@/api/auth';
import { User } from '@/types'; // Removed unused AuthResponse

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (
      name: string,
      username: string,
      email: string,
      password: string
    ) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const storedToken = localStorage.getItem('accessToken');
                if (storedToken) {
                    const { user, accessToken } = await refreshToken();
                    setUser(user);
                    setToken(accessToken);
                    localStorage.setItem('accessToken', accessToken);
                }
            } catch (error) {
                localStorage.removeItem('accessToken');
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const handleLogin = async (username: string, password: string) => {
        const { user, accessToken } = await apiLogin({ username, password });
        setUser(user);
        setToken(accessToken);
        localStorage.setItem('accessToken', accessToken);
    };

    const handleRegister = async (
      name: string,
      username: string,
      email: string,
      password: string
    ) => {
        const { user, accessToken } = await apiRegister({
            name,
            username,
            email,
            password
        });
        setUser(user);
        setToken(accessToken);
        localStorage.setItem('accessToken', accessToken);
    };

    const handleLogout = async () => {
        await apiLogout();
        setUser(null);
        setToken(null);
        localStorage.removeItem('accessToken');
    };

    return (
      <AuthContext.Provider
        value={{
            user,
            token,
            isAuthenticated: !!user,
            isLoading,
            login: handleLogin,
            register: handleRegister,
            logout: handleLogout
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
