import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn, getRole } from '../utils/auth';

const ProtectedRoute = ({ children, requiredRoles }) => {
  if (!isLoggedIn()) return <Navigate to="/login" />;
  if (requiredRoles && !requiredRoles.includes(getRole())) {
    // Redirect to role-appropriate panel if not allowed here
    if (getRole() === "admin") return <Navigate to="/dashboard" />;
    if (getRole() === "agent") return <Navigate to="/agent" />;
    if (getRole() === "subagent") return <Navigate to="/subagent" />;
  }
  return children;
};

export default ProtectedRoute;