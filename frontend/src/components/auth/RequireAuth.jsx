import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, Spinner } from '@chakra-ui/react';
import { useAuth } from 'contexts/AuthContext';

export function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const loc = useLocation();

  if (loading) {
    return (
      <Box minH="40vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="lg" />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/auth/sign-in" replace state={{ from: loc.pathname }} />;
  }

  return children;
}

export function RequireRole({ allow, children }) {
  const { user, loading } = useAuth();
  const loc = useLocation();

  if (loading) {
    return (
      <Box minH="40vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="lg" />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/auth/sign-in" replace state={{ from: loc.pathname }} />;
  }

  if (!allow.includes(user.role)) {
    const target =
      user.role === 'super_admin'
        ? '/super/admins'
        : user.role === 'admin'
          ? '/staff/users'
          : '/app/proposals';
    return <Navigate to={target} replace />;
  }

  return children;
}
