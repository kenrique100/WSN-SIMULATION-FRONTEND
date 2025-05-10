import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Nodes from '../pages/Nodes';
import Alerts from '../pages/Alerts';
import Readings from '../pages/Readings';
import Settings from '../pages/Settings';
import NotFound from '../pages/NotFound';
import ProtectedRoute from './ProtectedRoute';
import Layout from '../components/layout/Layout';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

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
                <Route path="/readings" element={
                    <ProtectedRoute>
                        <Readings />
                    </ProtectedRoute>
                } />
                <Route path="/settings" element={
                    <ProtectedRoute roles={['admin']}>
                        <Settings />
                    </ProtectedRoute>
                } />
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}