'use client';

import React from 'react';
import { useAuth } from '@/providers/auth-provider';
import { UserRole } from '@mandala/shared-types';
import {
  BuildingStorefrontIcon,
  UsersIcon,
  CreditCardIcon,
  ChartBarIcon,
  GiftIcon,
  DocumentTextIcon,
  CogIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  onClick: () => void;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  badge?: string;
}

function QuickAction({ title, description, icon: Icon, onClick, color, badge }: QuickActionProps) {
  const colorClasses = {
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900',
    green: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900',
    yellow: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900',
    red: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900',
    purple: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900',
  };

  return (
    <button
      onClick={onClick}
      className="relative w-full p-4 text-left rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {description}
          </p>
        </div>
        {badge && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
            {badge}
          </span>
        )}
      </div>
    </button>
  );
}

export function QuickActions() {
  const { hasAnyRole } = useAuth();

  const adminActions = [
    {
      title: 'Nuevo Venue',
      description: 'Registrar una nueva ubicación',
      icon: BuildingStorefrontIcon,
      color: 'blue' as const,
      onClick: () => console.log('Add venue'),
      requiredRoles: [UserRole.ADMIN],
    },
    {
      title: 'Gestión de Usuarios',
      description: 'Administrar cuentas y roles',
      icon: UsersIcon,
      color: 'green' as const,
      onClick: () => console.log('Manage users'),
      requiredRoles: [UserRole.ADMIN],
    },
    {
      title: 'Aprobar Transacciones',
      description: 'Revisar transacciones pendientes',
      icon: CreditCardIcon,
      color: 'yellow' as const,
      onClick: () => console.log('Approve transactions'),
      badge: '3',
      requiredRoles: [UserRole.ADMIN],
    },
    {
      title: 'Generar Reporte',
      description: 'Crear reporte financiero',
      icon: DocumentTextIcon,
      color: 'purple' as const,
      onClick: () => console.log('Generate report'),
      requiredRoles: [UserRole.ADMIN, UserRole.VENUE_MANAGER],
    },
    {
      title: 'Configurar Promoción',
      description: 'Crear nueva promoción gamificada',
      icon: GiftIcon,
      color: 'green' as const,
      onClick: () => console.log('Create promotion'),
      requiredRoles: [UserRole.ADMIN, UserRole.VENUE_MANAGER],
    },
    {
      title: 'Analytics Avanzados',
      description: 'Abrir dashboard de Metabase',
      icon: ChartBarIcon,
      color: 'blue' as const,
      onClick: () => window.open('/metabase', '_blank'),
      requiredRoles: [UserRole.ADMIN],
    },
  ];

  const venueManagerActions = [
    {
      title: 'Mi Venue',
      description: 'Ver estadísticas de mi venue',
      icon: BuildingStorefrontIcon,
      color: 'blue' as const,
      onClick: () => console.log('My venue'),
      requiredRoles: [UserRole.VENUE_MANAGER],
    },
    {
      title: 'Transacciones Hoy',
      description: 'Monitorear actividad del día',
      icon: CreditCardIcon,
      color: 'green' as const,
      onClick: () => console.log('Today transactions'),
      requiredRoles: [UserRole.VENUE_MANAGER],
    },
    {
      title: 'Configuración',
      description: 'Ajustar configuraciones del venue',
      icon: CogIcon,
      color: 'purple' as const,
      onClick: () => console.log('Venue settings'),
      requiredRoles: [UserRole.VENUE_MANAGER],
    },
  ];

  const filteredActions = [
    ...adminActions.filter(action => hasAnyRole(action.requiredRoles)),
    ...venueManagerActions.filter(action => hasAnyRole(action.requiredRoles)),
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Acciones Rápidas
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Tareas comunes del administrador
            </p>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <PlusIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-3">
          {filteredActions.slice(0, 6).map((action, index) => (
            <QuickAction
              key={index}
              title={action.title}
              description={action.description}
              icon={action.icon}
              onClick={action.onClick}
              color={action.color}
              badge={action.badge}
            />
          ))}
        </div>
        
        {filteredActions.length > 6 && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button className="text-sm text-mandala-primary hover:text-mandala-primary/80 font-medium">
              Ver todas las acciones →
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 