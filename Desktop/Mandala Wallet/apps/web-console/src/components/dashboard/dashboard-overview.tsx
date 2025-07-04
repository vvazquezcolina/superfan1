'use client';

import React from 'react';
import { cn, formatCurrency, formatNumber } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { UserRole } from '@mandala/shared-types';
import {
  BuildingStorefrontIcon,
  UsersIcon,
  CreditCardIcon,
  BanknotesIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ChartBarIcon,
  GiftIcon,
} from '@heroicons/react/24/outline';

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ComponentType<any>;
  trend: 'up' | 'down' | 'neutral';
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

function MetricCard({ title, value, change, changeLabel, icon: Icon, trend, color }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  };

  const trendClasses = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
        <div className={cn('p-3 rounded-lg', colorClasses[color])}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        {trend === 'up' ? (
          <TrendingUpIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
        ) : trend === 'down' ? (
          <TrendingDownIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
        ) : (
          <div className="h-4 w-4" />
        )}
        <span className={cn('ml-1 text-sm font-medium', trendClasses[trend])}>
          {change > 0 ? '+' : ''}{change}%
        </span>
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          {changeLabel}
        </span>
      </div>
    </div>
  );
}

export function DashboardOverview() {
  const { hasAnyRole } = useAuth();

  // Mock data - in production, this would come from APIs
  const systemMetrics = {
    totalVenues: 12,
    totalUsers: 15420,
    totalTransactions: 89234,
    totalRevenue: 2850000,
    activeUsers: 8745,
    pendingApprovals: 23,
    avgTransactionValue: 485,
    systemUptime: 99.8,
  };

  const trends = {
    venues: { change: 8.2, period: 'vs mes anterior' },
    users: { change: 12.5, period: 'vs mes anterior' },
    transactions: { change: -2.1, period: 'vs semana anterior' },
    revenue: { change: 15.8, period: 'vs mes anterior' },
  };

  const recentActivity = [
    {
      id: '1',
      type: 'venue_added',
      title: 'Nuevo venue agregado',
      description: 'Coco Bongo Cancún registrado exitosamente',
      time: '10 min',
      icon: BuildingStorefrontIcon,
      color: 'green',
    },
    {
      id: '2',
      type: 'large_transaction',
      title: 'Transacción de alto valor',
      description: '$15,000 MXN - Requiere revisión',
      time: '25 min',
      icon: BanknotesIcon,
      color: 'yellow',
    },
    {
      id: '3',
      type: 'user_milestone',
      title: 'Hito de usuarios alcanzado',
      description: '15,000 usuarios registrados',
      time: '1 h',
      icon: UsersIcon,
      color: 'blue',
    },
    {
      id: '4',
      type: 'system_alert',
      title: 'Mantenimiento programado',
      description: 'Actualización del sistema el domingo 3 AM',
      time: '2 h',
      icon: ChartBarIcon,
      color: 'purple',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Venues"
          value={formatNumber(systemMetrics.totalVenues)}
          change={trends.venues.change}
          changeLabel={trends.venues.period}
          icon={BuildingStorefrontIcon}
          trend="up"
          color="blue"
        />
        
        <MetricCard
          title="Usuarios Activos"
          value={formatNumber(systemMetrics.totalUsers)}
          change={trends.users.change}
          changeLabel={trends.users.period}
          icon={UsersIcon}
          trend="up"
          color="green"
        />
        
        <MetricCard
          title="Transacciones"
          value={formatNumber(systemMetrics.totalTransactions)}
          change={trends.transactions.change}
          changeLabel={trends.transactions.period}
          icon={CreditCardIcon}
          trend="down"
          color="yellow"
        />
        
        <MetricCard
          title="Ingresos Totales"
          value={formatCurrency(systemMetrics.totalRevenue)}
          change={trends.revenue.change}
          changeLabel={trends.revenue.period}
          icon={BanknotesIcon}
          trend="up"
          color="purple"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Usuarios Activos Hoy
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {formatNumber(systemMetrics.activeUsers)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-500">
              <UsersIcon className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {((systemMetrics.activeUsers / systemMetrics.totalUsers) * 100).toFixed(1)}% del total
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Valor Promedio
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {formatCurrency(systemMetrics.avgTransactionValue)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500">
              <CreditCardIcon className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Por transacción
          </p>
        </div>

        {hasAnyRole([UserRole.ADMIN]) && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Aprobaciones Pendientes
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {formatNumber(systemMetrics.pendingApprovals)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-500">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              Requieren atención
            </p>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Actividad Reciente
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Eventos importantes del sistema en las últimas horas
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className={cn(
                  'p-2 rounded-lg',
                  activity.color === 'green' && 'bg-green-100 dark:bg-green-900',
                  activity.color === 'yellow' && 'bg-yellow-100 dark:bg-yellow-900',
                  activity.color === 'blue' && 'bg-blue-100 dark:bg-blue-900',
                  activity.color === 'purple' && 'bg-purple-100 dark:bg-purple-900'
                )}>
                  <activity.icon className={cn(
                    'h-5 w-5',
                    activity.color === 'green' && 'text-green-600 dark:text-green-400',
                    activity.color === 'yellow' && 'text-yellow-600 dark:text-yellow-400',
                    activity.color === 'blue' && 'text-blue-600 dark:text-blue-400',
                    activity.color === 'purple' && 'text-purple-600 dark:text-purple-400'
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {activity.description}
                  </p>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button className="text-sm text-mandala-primary hover:text-mandala-primary/80 font-medium">
              Ver toda la actividad →
            </button>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Estado del Sistema
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Tiempo de Actividad
              </span>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                {systemMetrics.systemUptime}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Servicios Activos
              </span>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                8/8
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Último Backup
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Hace 2 horas
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Acciones Rápidas
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center">
                <BuildingStorefrontIcon className="h-5 w-5 text-mandala-primary mr-3" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Agregar Nuevo Venue
                </span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center">
                <ChartBarIcon className="h-5 w-5 text-mandala-primary mr-3" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Generar Reporte
                </span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center">
                <GiftIcon className="h-5 w-5 text-mandala-primary mr-3" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Configurar Promoción
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 