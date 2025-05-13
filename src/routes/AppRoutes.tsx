// src/routes/AppRoutes.tsx
import { Routes, Route } from 'react-router-dom';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Nodes from '@/pages/Nodes';
import Alerts from '@/pages/Alerts';
import Readings from '@/pages/Readings';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
// import ProtectedRoute from '@/routes/ProtectedRoute'; // Commented out
import Layout from '@/components/layout/Layout';
import Thresholds from '@/pages/Thresholds';
import Topology from '@/pages/Topology';
import UserManagementPage from '@/pages/UserManagementPage';
import React from 'react';

// Development mode route wrapper
const DevRoute = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

// Production mode protected route
const ProdProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Implement your actual protected route logic here
  return <>{children}</>;
};

const ProtectedRoute = import.meta.env.MODE === 'development'
  ? DevRoute
  : ProdProtectedRoute;

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<Layout />}>
        {/*
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
        */}

        {/* Freely accessible development routes */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/nodes" element={<ProtectedRoute><Nodes /></ProtectedRoute>} />
        <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
        <Route path="/readings" element={<ProtectedRoute><Readings /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/thresholds" element={<ProtectedRoute><Thresholds /></ProtectedRoute>} />
        <Route path="/topology" element={<ProtectedRoute><Topology /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><UserManagementPage /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
