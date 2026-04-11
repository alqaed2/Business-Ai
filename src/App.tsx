/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthProvider';
import { NotificationProvider } from './components/NotificationProvider';
import { Toaster } from './components/ui/sonner';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Agents from './pages/Agents';
import Workflows from './pages/Workflows';
import Clients from './pages/Clients';
import Billing from './pages/Billing';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { RoleGuard } from './components/RoleGuard';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </PrivateRoute>
          } />
          <Route path="/agents" element={
            <PrivateRoute>
              <AppLayout>
                <Agents />
              </AppLayout>
            </PrivateRoute>
          } />
          <Route path="/workflows" element={
            <PrivateRoute>
              <AppLayout>
                <Workflows />
              </AppLayout>
            </PrivateRoute>
          } />
          <Route path="/reports" element={
            <PrivateRoute>
              <AppLayout>
                <Reports />
              </AppLayout>
            </PrivateRoute>
          } />
          <Route path="/clients" element={
            <PrivateRoute>
              <AppLayout>
                <Clients />
              </AppLayout>
            </PrivateRoute>
          } />
          <Route path="/billing" element={
            <PrivateRoute>
              <RoleGuard allowedRoles={['admin']}>
                <AppLayout>
                  <Billing />
                </AppLayout>
              </RoleGuard>
            </PrivateRoute>
          } />
          <Route path="/settings" element={
            <PrivateRoute>
              <RoleGuard allowedRoles={['admin', 'manager']}>
                <AppLayout>
                  <Settings />
                </AppLayout>
              </RoleGuard>
            </PrivateRoute>
          } />
        </Routes>
      </Router>
      </NotificationProvider>
      <Toaster />
    </AuthProvider>
  );
}

