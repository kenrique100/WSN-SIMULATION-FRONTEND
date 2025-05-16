import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import React, { useEffect } from 'react';
import Loading from '@/components/common/Loading';
import { Role } from '@/types';

interface ProtectedRouteProps {
    children: React.ReactNode;
    roles?: Role[];
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
    const location = useLocation();
    const {
        isAuthenticated,
        initialized,
        user,
        hasRole,
        initializeAuth,
    } = useAuthStore();

    useEffect(() => {
        if (!initialized) {
            initializeAuth().catch(console.error);
        }
    }, [initialized, initializeAuth]);

    if (!initialized) {
        return <Loading fullScreen />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (roles && user && !roles.some(role => hasRole(role))) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}