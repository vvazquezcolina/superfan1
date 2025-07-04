'use client';

import React, { useState } from 'react';
import { formatRelativeTime } from '@/lib/utils';
import {
  BuildingStorefrontIcon,
  UsersIcon,
  CreditCardIcon,
  BanknotesIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  GiftIcon,
} from '@heroicons/react/24/outline';

interface Activity {
  id: string;
  type: 'venue_added' | 'user_registered' | 'transaction' | 'alert' | 'approval' | 'promotion' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  user?: string;
  venue?: string;
  amount?: number;
  status: 'success' | 'warning' | 'error' | 'info';
  metadata?: Record<string, any>;
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'venue_added',
    title: 'Nuevo venue registrado',
    description: 'Coco Bongo Cancún se ha registrado exitosamente en el sistema',
    timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 min ago
    user: 'Admin Principal',
    venue: 'Coco Bongo Cancún',
    status: 'success',
  },
  {
    id: '2',
    type: 'transaction',
    title: 'Transacción de alto valor',
    description: 'Transacción de $15,000 MXN requiere aprobación manual',
    timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 min ago
    user: 'Cliente Premium',
    venue: 'Mandala Beach Club',
    amount: 15000,
    status: 'warning',
  },
  {
    id: '3',
    type: 'user_registered',
    title: 'Milestone de usuarios alcanzado',
    description: 'Se han registrado 15,000 usuarios en el sistema',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    status: 'success',
    metadata: { milestone: 15000 },
  },
  {
    id: '4',
    type: 'alert',
    title: 'Alerta de sistema',
    description: 'Uso elevado de CPU detectado en el servidor de pagos',
    timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago
    status: 'error',
  },
  {
    id: '5',
    type: 'promotion',
    title: 'Nueva promoción activada',
    description: 'Promoción "Happy Hour Weekend" activada para todos los venues',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    user: 'Manager Marketing',
    status: 'info',
  },
  {
    id: '6',
    type: 'system',
    title: 'Backup completado',
    description: 'Respaldo automático de la base de datos realizado exitosamente',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    status: 'success',
  },
  {
    id: '7',
    type: 'approval',
    title: 'Transacciones aprobadas',
    description: '12 transacciones pendientes fueron aprobadas en lote',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    user: 'Admin Financiero',
    status: 'success',
    metadata: { count: 12 },
  },
  {
    id: '8',
    type: 'transaction',
    title: 'Pico de transacciones',
    description: 'Se procesaron 1,200 transacciones en la última hora',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    status: 'info',
    metadata: { transactionCount: 1200 },
  },
];

function getActivityIcon(type: Activity['type']) {
  switch (type) {
    case 'venue_added':
      return BuildingStorefrontIcon;
    case 'user_registered':
      return UsersIcon;
    case 'transaction':
      return CreditCardIcon;
    case 'alert':
      return ExclamationTriangleIcon;
    case 'approval':
      return CheckCircleIcon;
    case 'promotion':
      return GiftIcon;
    case 'system':
      return ClockIcon;
    default:
      return ClockIcon;
  }
}

function getStatusColor(status: Activity['status']) {
  switch (status) {
    case 'success':
      return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900';
    case 'warning':
      return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900';
    case 'error':
      return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900';
    case 'info':
      return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900';
    default:
      return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700';
  }
}

export function RecentActivity() {
  const [filter, setFilter] = useState<'all' | Activity['status']>('all');
  const [showAll, setShowAll] = useState(false);

  const filteredActivities = mockActivities.filter(activity => 
    filter === 'all' || activity.status === filter
  );

  const displayedActivities = showAll 
    ? filteredActivities 
    : filteredActivities.slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Actividad Reciente
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Eventos importantes del sistema en tiempo real
            </p>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filter === 'all'
                  ? 'bg-mandala-primary text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter('success')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filter === 'success'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Éxito
            </button>
            <button
              onClick={() => setFilter('warning')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filter === 'warning'
                  ? 'bg-yellow-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Advertencia
            </button>
            <button
              onClick={() => setFilter('error')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filter === 'error'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Error
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {displayedActivities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            const statusColor = getStatusColor(activity.status);
            
            return (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg ${statusColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.title}
                    </p>
                    <time className="text-xs text-gray-500 dark:text-gray-400">
                      {formatRelativeTime(activity.timestamp)}
                    </time>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {activity.description}
                  </p>
                  
                  {(activity.user || activity.venue || activity.amount) && (
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {activity.user && (
                        <span>Por: {activity.user}</span>
                      )}
                      {activity.venue && (
                        <span>Venue: {activity.venue}</span>
                      )}
                      {activity.amount && (
                        <span>Monto: ${activity.amount.toLocaleString('es-MX')} MXN</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-8">
            <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No hay actividad para el filtro seleccionado
            </p>
          </div>
        )}

        {filteredActivities.length > 5 && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm text-mandala-primary hover:text-mandala-primary/80 font-medium"
            >
              {showAll ? 'Ver menos' : `Ver todas (${filteredActivities.length})`} →
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 