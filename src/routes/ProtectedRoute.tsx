import { Navigate, useLocation } from 'react-router-dom';
import Loading from '@/components/common/Loading';
import { useAuth } from '@/contexts/AuthContext';
import { ReactNode, useEffect, useState } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
    roles?: string[];
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
    const { user, isLoading, error } = useAuth();
    const location = useLocation();
    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        if (!isLoading) {
            setInitialLoad(false);
        }
    }, [isLoading]);

    if (initialLoad) {
        return <Loading fullScreen />;
    }

    if (error) {
        return <Navigate to="/login" state={{ from: location, error }} replace />;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
