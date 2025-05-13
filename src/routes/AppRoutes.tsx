import { Routes, Route } from 'react-router-dom';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Nodes from '@/pages/Nodes';
import Alerts from '@/pages/Alerts';
import Readings from '@/pages/Readings';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/routes/ProtectedRoute';
import Layout from '@/components/layout/Layout';
import Thresholds from '@/pages/Thresholds';
import Topology from '@/pages/Topology';
import RegisterForm from '@/components/auth/RegisterForm';

export default function AppRoutes() {
    return (
      <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterForm />} />

          <Route element={<Layout />}>
              {/*<Route path="/" element={
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
                    <ProtectedRoute roles={['admin']}>
                        <Thresholds />
                    </ProtectedRoute>
                } />
                <Route path="/topology" element={
                    <ProtectedRoute roles={['admin']}>
                        <Topology />
                    </ProtectedRoute>
                } />*/}
              <Route path="/" element={<Dashboard />} />
              <Route path="/nodes" element={<Nodes />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/readings/:sensorId?" element={<Readings />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/thresholds" element={<Thresholds />} />
              <Route path="/topology" element={<Topology />} />

          </Route>

          <Route path="*" element={<NotFound />} />
      </Routes>
    );
}