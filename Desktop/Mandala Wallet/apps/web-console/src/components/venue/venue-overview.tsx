'use client';

import React from 'react';
import { cn, formatCurrency, formatNumber } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import {
  UsersIcon,
  CreditCardIcon,
  BanknotesIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ClockIcon,
  GiftIcon,
  MapPinIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

interface VenueMetricCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ComponentType<any>;
  trend: 'up' | 'down' | 'neutral';
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  onClick?: () => void;
}

function VenueMetricCard({ title, value, change, changeLabel, icon: Icon, trend, color, onClick }: VenueMetricCardProps) {
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

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      className={cn(
        'bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6 border border-gray-200 dark:border-gray-700',
        onClick && 'hover:shadow-md transition-shadow cursor-pointer'
      )}
    >
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
    </Component>
  );
}

export function VenueOverview() {
  const { user } = useAuth();

  // Mock venue data - in production, this would come from venue-specific APIs
  const venueData = {
    venueName: 'Mandala Beach Club',
    venueId: 'mandala-beach-club',
    location: 'Zona Hotelera, Cancún',
    status: 'active',
    todayMetrics: {
      visitors: 287,
      transactions: 156,
      revenue: 87500,
      avgSpend: 561,
      activePromotions: 3,
      satisfactionScore: 4.7,
    },
    trends: {
      visitors: { change: 18.5, period: 'vs ayer' },
      transactions: { change: 12.3, period: 'vs ayer' },
      revenue: { change: 25.7, period: 'vs ayer' },
      avgSpend: { change: 8.1, period: 'vs ayer' },
    },
    operationalHours: {
      open: '10:00',
      close: '04:00',
      isOpen: true,
    },
    currentOccupancy: {
      current: 245,
      capacity: 500,
      percentage: 49,
    },
  };

  const peakHours = [
    { time: '14:00-16:00', label: 'Lunch Peak', visitors: 89 },
    { time: '20:00-22:00', label: 'Dinner Peak', visitors: 156 },
    { time: '00:00-02:00', label: 'Party Peak', visitors: 198 },
  ];

  return (
    <div className="space-y-6">
      {/* Venue Header */}
      <div className="bg-gradient-to-r from-mandala-primary to-mandala-secondary rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <MapPinIcon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {venueData.venueName}
              </h1>
              <p className="text-mandala-primary-light">
                {venueData.location}
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <span className={cn(
                  'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                  venueData.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                )}>
                  {venueData.status === 'active' ? '🟢 Activo' : '🔴 Inactivo'}
                </span>
                <span className="text-mandala-primary-light text-sm">
                  {venueData.operationalHours.isOpen ? 'Abierto' : 'Cerrado'} • 
                  {venueData.operationalHours.open} - {venueData.operationalHours.close}
                </span>
              </div>
            </div>
          </div>
          
          {/* Current Occupancy */}
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">
                {venueData.currentOccupancy.percentage}%
              </div>
              <div className="text-sm text-mandala-primary-light">
                Ocupación Actual
              </div>
              <div className="text-xs text-mandala-primary-light mt-1">
                {venueData.currentOccupancy.current}/{venueData.currentOccupancy.capacity} personas
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <VenueMetricCard
          title="Visitantes Hoy"
          value={formatNumber(venueData.todayMetrics.visitors)}
          change={venueData.trends.visitors.change}
          changeLabel={venueData.trends.visitors.period}
          icon={UsersIcon}
          trend="up"
          color="blue"
          onClick={() => console.log('View visitors')}
        />
        
        <VenueMetricCard
          title="Transacciones Hoy"
          value={formatNumber(venueData.todayMetrics.transactions)}
          change={venueData.trends.transactions.change}
          changeLabel={venueData.trends.transactions.period}
          icon={CreditCardIcon}
          trend="up"
          color="green"
          onClick={() => console.log('View transactions')}
        />
        
        <VenueMetricCard
          title="Ingresos Hoy"
          value={formatCurrency(venueData.todayMetrics.revenue)}
          change={venueData.trends.revenue.change}
          changeLabel={venueData.trends.revenue.period}
          icon={BanknotesIcon}
          trend="up"
          color="purple"
          onClick={() => console.log('View revenue')}
        />
        
        <VenueMetricCard
          title="Gasto Promedio"
          value={formatCurrency(venueData.todayMetrics.avgSpend)}
          change={venueData.trends.avgSpend.change}
          changeLabel={venueData.trends.avgSpend.period}
          icon={StarIcon}
          trend="up"
          color="yellow"
        />
      </div>

      {/* Secondary Metrics & Peak Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Hours */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Horas Pico de Hoy
          </h3>
          <div className="space-y-4">
            {peakHours.map((peak, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {peak.time}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {peak.label}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-mandala-primary h-2 rounded-full" 
                      style={{ width: `${(peak.visitors / 200) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {peak.visitors}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Venue Status & Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Estado y Controles del Venue
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Promociones Activas
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {venueData.todayMetrics.activePromotions}
                </span>
                <button className="text-xs text-mandala-primary hover:text-mandala-primary/80">
                  Gestionar
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Satisfacción Promedio
              </span>
              <div className="flex items-center space-x-1">
                <StarIcon className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {venueData.todayMetrics.satisfactionScore}/5.0
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Horarios de Operación
              </span>
              <button className="text-xs text-mandala-primary hover:text-mandala-primary/80">
                Configurar
              </button>
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="w-full bg-mandala-primary text-white px-4 py-2 rounded-lg hover:bg-mandala-primary/90 transition-colors">
                Abrir Panel de Control del Venue
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions for Venue Manager */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Acciones Rápidas
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Tareas comunes para la gestión de tu venue
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => console.log('Create promotion')}
              className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="text-center">
                <GiftIcon className="h-8 w-8 text-mandala-primary mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Nueva Promoción
                </div>
              </div>
            </button>
            
            <button
              onClick={() => console.log('View transactions')}
              className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="text-center">
                <CreditCardIcon className="h-8 w-8 text-mandala-primary mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Ver Transacciones
                </div>
              </div>
            </button>
            
            <button
              onClick={() => console.log('Manage hours')}
              className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="text-center">
                <ClockIcon className="h-8 w-8 text-mandala-primary mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Horarios
                </div>
              </div>
            </button>
            
            <button
              onClick={() => console.log('View analytics')}
              className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">📊</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Analytics
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 