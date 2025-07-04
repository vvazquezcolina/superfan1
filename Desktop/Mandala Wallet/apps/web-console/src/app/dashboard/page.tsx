'use client';

import React from 'react';
import { DashboardOverview } from '@/components/dashboard/dashboard-overview';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { useAuth } from '@/providers/auth-provider';
import { UserRole } from '@mandala/shared-types';

export default function DashboardPage() {
  const { user, hasAnyRole } = useAuth();

  // Show role-specific welcome message
  const getWelcomeMessage = () => {
    if (hasAnyRole([UserRole.ADMIN])) {
      return 'Bienvenido al Panel de Administración';
    } else if (hasAnyRole([UserRole.VENUE_MANAGER])) {
      return 'Bienvenido al Panel de Gestión de Venue';
    }
    return 'Bienvenido al Dashboard';
  };

  const getWelcomeDescription = () => {
    if (hasAnyRole([UserRole.ADMIN])) {
      return 'Monitorea y gestiona todos los venues, usuarios y transacciones del sistema Mandala Wallet';
    } else if (hasAnyRole([UserRole.VENUE_MANAGER])) {
      return 'Supervisa las operaciones de tu venue, transacciones y configuraciones';
    }
    return 'Accede a las funcionalidades del sistema';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-mandala-primary to-mandala-secondary rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {getWelcomeMessage()}
            </h1>
            <p className="text-mandala-primary-light mt-2">
              {getWelcomeDescription()}
            </p>
            <p className="text-mandala-primary-light text-sm mt-1">
              Conectado como: {user?.displayName} • {user?.roles?.join(', ')}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-center">
                <div className="text-3xl font-bold">99.8%</div>
                <div className="text-sm text-mandala-primary-light">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Dashboard Overview - Takes up 2/3 of the space */}
        <div className="lg:col-span-2">
          <DashboardOverview />
        </div>

        {/* Sidebar Content - Takes up 1/3 of the space */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Actions */}
          <QuickActions />

          {/* Recent Activity */}
          <RecentActivity />
        </div>
      </div>

      {/* Admin-Only Advanced Analytics */}
      {hasAnyRole([UserRole.ADMIN]) && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Analytics Avanzados
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Acceso a herramientas avanzadas de análisis y reporting
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => window.open('/metabase', '_blank')}
                className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-mandala-primary">📊</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white mt-2">
                    Metabase
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Dashboard avanzado
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => console.log('Open Grafana')}
                className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-mandala-primary">📈</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white mt-2">
                    Grafana
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Métricas del sistema
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => console.log('Open Logs')}
                className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-mandala-primary">🔍</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white mt-2">
                    Logs
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Monitoreo de eventos
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* System Status Footer */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-800 dark:text-green-200">
              Todos los sistemas operativos
            </span>
          </div>
          <div className="text-xs text-green-600 dark:text-green-400">
            Última actualización: {new Date().toLocaleTimeString('es-MX')}
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Dashboard - Mandala Console',
  description: 'Panel de control principal del sistema Mandala Wallet',
}; 