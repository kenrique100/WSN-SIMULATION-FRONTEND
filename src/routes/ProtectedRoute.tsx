import { Navigate, useLocation } from 'react-router-dom';
import React from 'react';
import Loading from '@/components/common/Loading';
import { Role } from '@/types';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: Role[];
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const location = useLocation();
  const {
    isAuthenticated,
    user,
    hasRole,
  } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && user && !roles.some(role => hasRole(role))) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}