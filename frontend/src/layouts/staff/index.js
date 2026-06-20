import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardShell from 'layouts/dashboard/DashboardShell';
import staffRoutes from 'saas/staffRoutes';

export default function StaffPanelLayout(props) {
  return (
    <Routes basename="/staff">
      <Route
        element={
          <DashboardShell
            routes={staffRoutes}
            layoutPrefix="/staff"
            logoText="Proposal AI · Admin"
            {...props}
          />
        }>
        <Route index element={<Navigate to="users" replace />} />
        {staffRoutes.map((route) => {
          const rel = route.path.startsWith('/') ? route.path.slice(1) : route.path;
          return <Route key={rel} path={rel} element={route.component} />;
        })}
      </Route>
    </Routes>
  );
}
