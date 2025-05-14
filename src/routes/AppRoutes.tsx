import { Routes, Route } from 'react-router-dom';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Nodes from '@/pages/Nodes';
import Alerts from '@/pages/Alerts';
import Readings from '@/pages/Readings';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import Layout from '@/components/layout/Layout';
import Thresholds from '@/pages/Thresholds';
import Topology from '@/pages/Topology';
import UserManagementPage from '@/pages/UserManagementPage';
import React, { ReactNode } from 'react';
import ProdProtectedRoute from '@/routes/ProtectedRoute';

interface ProtectedWrapperProps {
  children: ReactNode;
  roles?: string[];
}

// Dev mode wrapper (no protection)
const DevRoute = ({ children }: { children: ReactNode }) => <>{children}</>;

// Unified wrapper
const ProtectedRoute = ({ children, roles }: ProtectedWrapperProps) => {
  if (import.meta.env.MODE === 'development') {
    return <DevRoute>{children}</DevRoute>;
  }
  return <ProdProtectedRoute roles={roles}>{children}</ProdProtectedRoute>;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/*<Route path="/login" element={<Login />} />*/}

      <Route element={<Layout />}>
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/nodes" element={
          <ProtectedRoute>
            <Nodes />
          </ProtectedRoute>
        } />
        <Route path="/alerts" element={
          <ProtectedRoute>
            <Alerts />
          </ProtectedRoute>
        } />
        <Route path="/readings/:sensorId?" element={
          <ProtectedRoute>
            <Readings />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/thresholds" element={
          <ProtectedRoute roles={['ADMIN']}>
            <Thresholds />
          </ProtectedRoute>
        } />
        <Route path="/topology" element={
          <ProtectedRoute roles={['ADMIN']}>
            <Topology />
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute roles={['ADMIN']}>
            <UserManagementPage />
          </ProtectedRoute>
        } />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
