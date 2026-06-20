import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardShell from 'layouts/dashboard/DashboardShell';
import userRoutes from 'saas/userRoutes';

export default function UserPanelLayout(props) {
  return (
    <Routes basename="/app">
      <Route
        element={
          <DashboardShell
            routes={userRoutes}
            layoutPrefix="/app"
            logoText="Proposal AI"
            {...props}
          />
        }>
        <Route index element={<Navigate to="proposals" replace />} />
        {userRoutes.map((route) => {
          const rel = route.path.startsWith('/') ? route.path.slice(1) : route.path;
          return <Route key={rel} path={rel} element={route.component} />;
        })}
      </Route>
    </Routes>
  );
}
