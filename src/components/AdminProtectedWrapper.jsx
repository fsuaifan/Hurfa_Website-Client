import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * AdminProtectedWrapper ensures that access to /admin requires
 * login authentication once per browser session.
 */
function AdminProtectedWrapper({ children }) {
  const location = useLocation();
  const isAuthenticated = sessionStorage.getItem('hurfa_admin_authenticated') === 'true';

  if (!isAuthenticated) {
    // Redirect to login with the attempted path as redirect target
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  return children;
}

export default AdminProtectedWrapper;
