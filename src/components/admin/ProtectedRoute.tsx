import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2Icon } from 'lucide-react';
import type { ModuleKey } from '../../types/models';
import { useAuth } from '../../contexts/AuthContext';
import { canAccess } from '../../utils/permissions';
import { AccessDenied } from './AccessDenied';

interface ProtectedRouteProps {
  module?: ModuleKey;
  children: React.ReactNode;
}

export function ProtectedRoute({ module, children }: ProtectedRouteProps) {
  const { user, ready } = useAuth();
  const location = useLocation();

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-night">
        <Loader2Icon className="h-6 w-6 animate-spin text-gold" aria-label="Loading" />
      </div>);

  }
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (module && !canAccess(user.role, module)) return <AccessDenied />;
  return <>{children}</>;
}