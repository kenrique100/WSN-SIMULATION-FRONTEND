import { Routes, Route } from 'react-router-dom';
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
import React from 'react';
import ProtectedRoute from '@/routes/ProtectedRoute';
import Login from '@/pages/Login';
import { Role } from '@/types';
import ThresholdCreate from '@/components/thresholds/ThresholdCreate';
import ThresholdEdit from '@/components/thresholds/ThresholdEdit';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

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

        {/* Updated Thresholds Routes */}
        <Route path="/thresholds" element={
          <ProtectedRoute roles={[Role.ADMIN]}>
            <Thresholds />
          </ProtectedRoute>
        } />
        <Route path="/thresholds/new" element={
          <ProtectedRoute roles={[Role.ADMIN]}>
            <ThresholdCreate />
          </ProtectedRoute>
        } />
        <Route path="/thresholds/:thresholdId/edit" element={
          <ProtectedRoute roles={[Role.ADMIN]}>
            <ThresholdEdit />
          </ProtectedRoute>
        } />

        <Route path="/topology" element={
          <ProtectedRoute roles={[Role.ADMIN]}>
            <Topology />
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute roles={[Role.ADMIN]}>
            <UserManagementPage />
          </ProtectedRoute>
        } />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}