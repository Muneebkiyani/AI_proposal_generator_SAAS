import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import UserPanelLayout from './layouts/user';
import StaffPanelLayout from './layouts/staff';
import SuperAdminPanelLayout from './layouts/super';
import LandingPage from './views/landing';
import {
  ChakraProvider,
} from '@chakra-ui/react';
import initialTheme from './theme/theme';
import { useState } from 'react';
import { AuthProvider, useAuth } from 'contexts/AuthContext';
import { RequireRole } from 'components/auth/RequireAuth';
import { Box, Spinner } from '@chakra-ui/react';

function roleHome(role) {
  if (role === 'super_admin') return '/super/admins';
  if (role === 'admin') return '/staff/users';
  return '/app/proposals';
}

function HomeRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="lg" />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  return <Navigate to={roleHome(user.role)} replace />;
}

function AppRoutes({ currentTheme, setCurrentTheme }) {
  return (
    <Routes>
      <Route path="/auth/*" element={<AuthLayout />} />
      <Route
        path="/app/*"
        element={
          <RequireRole allow={['user']}>
            <UserPanelLayout theme={currentTheme} setTheme={setCurrentTheme} />
          </RequireRole>
        }
      />
      <Route
        path="/staff/*"
        element={
          <RequireRole allow={['admin']}>
            <StaffPanelLayout theme={currentTheme} setTheme={setCurrentTheme} />
          </RequireRole>
        }
      />
      <Route
        path="/super/*"
        element={
          <RequireRole allow={['super_admin']}>
            <SuperAdminPanelLayout theme={currentTheme} setTheme={setCurrentTheme} />
          </RequireRole>
        }
      />
      <Route path="/" element={<LandingPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);

  return (
    <AuthProvider>
      <ChakraProvider theme={currentTheme}>
        <AppRoutes currentTheme={currentTheme} setCurrentTheme={setCurrentTheme} />
      </ChakraProvider>
    </AuthProvider>
  );
}
