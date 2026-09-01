import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserRole } from '../types/api';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  fallbackPath = '/login',
}) => {
  const { isAuthenticated, userRole, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#005B48] border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!allowedRoles || allowedRoles.length === 0) {
    // Just require authentication
    if (!isAuthenticated) {
      return <Navigate to={fallbackPath} state={{ from: location }} replace />;
    }
    return <>{children}</>;
  }

  // Check if user has required role
  const hasAccess = allowedRoles.some(role => {
    if (role === 'guest') return true;
    if (role === 'user') return ['user', 'admin'].includes('user'); // user or admin
    if (role === 'admin') return ['admin'].includes('admin'); // only admin
    return false;
  });

  // Actually check based on user's role
  const userHasRequiredRole = (allowedRoles: string[], userRole: string | null) => {
    if (!userRole) return false;
    
    // Admin has access to everything
    if (userRole === 'admin') return true;
    
    // User has access to user and guest routes
    if (userRole === 'user') {
      return allowedRoles.some(r => r === 'user' || r === 'guest');
    }
    
    // Guest only has access to guest routes
    return allowedRoles.includes('guest');
  };

  const hasAccessToRoute = userHasRequiredRole(allowedRoles, 'user');

  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  if (!hasAccessToRoute) {
    // Redirect based on role
    if (allowedRoles.includes('admin') && !allowedRoles.includes('user')) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Admin-only route
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, userRole, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#005B48] border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (userRole !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Guest-only route (for login/signup pages)
export const GuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#005B48] border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Public route (accessible to everyone)
export const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};