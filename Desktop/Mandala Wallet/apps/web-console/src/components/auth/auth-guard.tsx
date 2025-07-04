'use client';

import React from 'react';
import { useAuth } from '@/providers/auth-provider';
import { UserRole } from '@mandala/shared-types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  fallback?: React.ReactNode;
}

export function AuthGuard({ 
  children, 
  requiredRoles = [], 
  fallback 
}: AuthGuardProps) {
  const { user, loading, isAuthenticated, hasAnyRole } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              Acceso Requerido
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Debe iniciar sesión para acceder al panel de administración
            </p>
          </div>
          <div className="mt-8 space-y-4">
            <button 
              onClick={() => window.location.href = '/login'}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-mandala-primary hover:bg-mandala-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mandala-primary"
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check role permissions
  if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                Acceso Denegado
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                No tiene permisos suficientes para acceder a esta página
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                Usuario: {user?.displayName} ({user?.roles?.join(', ')})
              </p>
            </div>
            <div className="mt-8 space-y-4">
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mandala-primary"
              >
                Volver al Dashboard
              </button>
            </div>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
} 