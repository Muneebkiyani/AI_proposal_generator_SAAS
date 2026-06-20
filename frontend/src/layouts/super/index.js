import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardShell from 'layouts/dashboard/DashboardShell';
import superRoutes from 'saas/superRoutes';

export default function SuperAdminPanelLayout(props) {
  return (
    <Routes basename="/super">
      <Route
        element={
          <DashboardShell
            routes={superRoutes}
            layoutPrefix="/super"
            logoText="Proposal AI · Control"
            {...props}
          />
        }>
        <Route index element={<Navigate to="admins" replace />} />
        {superRoutes.map((route) => {
          const rel = route.path.startsWith('/') ? route.path.slice(1) : route.path;
          return <Route key={rel} path={rel} element={route.component} />;
        })}
      </Route>
    </Routes>
  );
}
