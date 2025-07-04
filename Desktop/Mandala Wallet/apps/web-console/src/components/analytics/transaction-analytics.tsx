'use client';

import React, { useState } from 'react';
import { cn, formatCurrency, formatNumber } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { UserRole } from '@mandala/shared-types';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  DocumentArrowDownIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

interface AnalyticsPeriod {
  id: string;
  label: string;
  days: number;
}

interface TransactionMetrics {
  totalTransactions: number;
  totalVolume: number;
  avgTransactionSize: number;
  successRate: number;
  topPaymentMethod: string;
  peakHour: string;
  trends: {
    transactions: number;
    volume: number;
    avgSize: number;
    successRate: number;
  };
}

interface ChartData {
  hourly: Array<{ hour: string; transactions: number; volume: number }>;
  daily: Array<{ date: string; transactions: number; volume: number; avg: number }>;
  paymentMethods: Array<{ method: string; count: number; volume: number; percentage: number }>;
  venues: Array<{ name: string; transactions: number; volume: number; percentage: number }>;
  customerTiers: Array<{ tier: string; count: number; volume: number; avgSpend: number }>;
}

const analyticsPeriods: AnalyticsPeriod[] = [
  { id: 'today', label: 'Hoy', days: 1 },
  { id: 'week', label: 'Esta Semana', days: 7 },
  { id: 'month', label: 'Este Mes', days: 30 },
  { id: 'quarter', label: 'Este Trimestre', days: 90 },
];

const mockMetrics: Record<string, TransactionMetrics> = {
  today: {
    totalTransactions: 1247,
    totalVolume: 2847520,
    avgTransactionSize: 2284,
    successRate: 96.8,
    topPaymentMethod: 'Tarjeta de Crédito',
    peakHour: '21:00-22:00',
    trends: {
      transactions: 12.5,
      volume: 18.7,
      avgSize: 5.8,
      successRate: -0.3,
    },
  },
  week: {
    totalTransactions: 8945,
    totalVolume: 19875420,
    avgTransactionSize: 2221,
    successRate: 97.2,
    topPaymentMethod: 'Wallet Balance',
    peakHour: '20:00-22:00',
    trends: {
      transactions: 8.3,
      volume: 15.2,
      avgSize: 6.3,
      successRate: 0.8,
    },
  },
  month: {
    totalTransactions: 34782,
    totalVolume: 78456210,
    avgTransactionSize: 2256,
    successRate: 96.9,
    topPaymentMethod: 'Tarjeta de Crédito',
    peakHour: '21:00-22:00',
    trends: {
      transactions: 22.1,
      volume: 28.9,
      avgSize: 5.5,
      successRate: 1.2,
    },
  },
};

const mockChartData: Record<string, ChartData> = {
  today: {
    hourly: [
      { hour: '10:00', transactions: 45, volume: 89500 },
      { hour: '11:00', transactions: 67, volume: 134200 },
      { hour: '12:00', transactions: 89, volume: 178900 },
      { hour: '13:00', transactions: 112, volume: 224800 },
      { hour: '14:00', transactions: 98, volume: 196700 },
      { hour: '15:00', transactions: 87, volume: 174300 },
      { hour: '16:00', transactions: 95, volume: 190500 },
      { hour: '17:00', transactions: 101, volume: 202100 },
      { hour: '18:00', transactions: 124, volume: 248600 },
      { hour: '19:00', transactions: 145, volume: 290500 },
      { hour: '20:00', transactions: 167, volume: 334700 },
      { hour: '21:00', transactions: 189, volume: 378900 },
      { hour: '22:00', transactions: 156, volume: 312700 },
      { hour: '23:00', transactions: 134, volume: 268500 },
    ],
    daily: [],
    paymentMethods: [
      { method: 'Tarjeta de Crédito', count: 542, volume: 1236800, percentage: 43.5 },
      { method: 'Wallet Balance', count: 389, volume: 889420, percentage: 31.2 },
      { method: 'Efectivo', count: 234, volume: 534680, percentage: 18.8 },
      { method: 'Crypto', count: 82, volume: 186620, percentage: 6.5 },
    ],
    venues: [
      { name: 'Mandala Beach Club', transactions: 856, volume: 1958740, percentage: 68.7 },
      { name: 'Coco Bongo', transactions: 234, volume: 534820, percentage: 18.8 },
      { name: 'La Vaquita', transactions: 157, volume: 353960, percentage: 12.5 },
    ],
    customerTiers: [
      { tier: 'Black', count: 89, volume: 567890, avgSpend: 6381 },
      { tier: 'Gold', count: 234, volume: 678940, avgSpend: 2902 },
      { tier: 'Silver', count: 456, volume: 892340, avgSpend: 1957 },
      { tier: 'Bronze', count: 468, volume: 708350, avgSpend: 1514 },
    ],
  },
};

export function TransactionAnalytics() {
  const { hasAnyRole } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<string>('today');
  const [selectedChart, setSelectedChart] = useState<'hourly' | 'payment' | 'venues' | 'tiers'>('hourly');

  const currentMetrics = mockMetrics[selectedPeriod];
  const currentChartData = mockChartData[selectedPeriod] || mockChartData.today;

  const getTrendIcon = (trend: number) => {
    if (trend > 0) {
      return <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />;
    } else if (trend < 0) {
      return <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />;
    }
    return <div className="h-4 w-4" />;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-600 dark:text-green-400';
    if (trend < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const exportData = () => {
    const data = {
      period: selectedPeriod,
      metrics: currentMetrics,
      chartData: currentChartData,
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transaction-analytics-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analytics de Transacciones
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Análisis detallado de transacciones y tendencias del sistema
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportData}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <DocumentArrowDownIcon className="h-4 w-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex space-x-2">
        {analyticsPeriods.map((period) => (
          <button
            key={period.id}
            onClick={() => setSelectedPeriod(period.id)}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
              selectedPeriod === period.id
                ? 'bg-mandala-primary text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            )}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Transacciones
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {formatNumber(currentMetrics.totalTransactions)}
              </p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-4 flex items-center">
            {getTrendIcon(currentMetrics.trends.transactions)}
            <span className={cn('ml-1 text-sm font-medium', getTrendColor(currentMetrics.trends.transactions))}>
              {currentMetrics.trends.transactions > 0 ? '+' : ''}{currentMetrics.trends.transactions}%
            </span>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              vs período anterior
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Volumen Total
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {formatCurrency(currentMetrics.totalVolume)}
              </p>
            </div>
            <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-4 flex items-center">
            {getTrendIcon(currentMetrics.trends.volume)}
            <span className={cn('ml-1 text-sm font-medium', getTrendColor(currentMetrics.trends.volume))}>
              {currentMetrics.trends.volume > 0 ? '+' : ''}{currentMetrics.trends.volume}%
            </span>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              vs período anterior
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Ticket Promedio
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {formatCurrency(currentMetrics.avgTransactionSize)}
              </p>
            </div>
            <UsersIcon className="h-8 w-8 text-purple-500" />
          </div>
          <div className="mt-4 flex items-center">
            {getTrendIcon(currentMetrics.trends.avgSize)}
            <span className={cn('ml-1 text-sm font-medium', getTrendColor(currentMetrics.trends.avgSize))}>
              {currentMetrics.trends.avgSize > 0 ? '+' : ''}{currentMetrics.trends.avgSize}%
            </span>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              vs período anterior
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Tasa de Éxito
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {currentMetrics.successRate}%
              </p>
            </div>
            <div className="text-2xl">✅</div>
          </div>
          <div className="mt-4 flex items-center">
            {getTrendIcon(currentMetrics.trends.successRate)}
            <span className={cn('ml-1 text-sm font-medium', getTrendColor(currentMetrics.trends.successRate))}>
              {currentMetrics.trends.successRate > 0 ? '+' : ''}{currentMetrics.trends.successRate}%
            </span>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              vs período anterior
            </span>
          </div>
        </div>
      </div>

      {/* Chart Selection */}
      <div className="flex space-x-2">
        <button
          onClick={() => setSelectedChart('hourly')}
          className={cn(
            'px-3 py-2 text-sm font-medium rounded-md transition-colors',
            selectedChart === 'hourly'
              ? 'bg-mandala-primary text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          )}
        >
          Por Hora
        </button>
        <button
          onClick={() => setSelectedChart('payment')}
          className={cn(
            'px-3 py-2 text-sm font-medium rounded-md transition-colors',
            selectedChart === 'payment'
              ? 'bg-mandala-primary text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          )}
        >
          Métodos de Pago
        </button>
        <button
          onClick={() => setSelectedChart('venues')}
          className={cn(
            'px-3 py-2 text-sm font-medium rounded-md transition-colors',
            selectedChart === 'venues'
              ? 'bg-mandala-primary text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          )}
        >
          Por Venue
        </button>
        <button
          onClick={() => setSelectedChart('tiers')}
          className={cn(
            'px-3 py-2 text-sm font-medium rounded-md transition-colors',
            selectedChart === 'tiers'
              ? 'bg-mandala-primary text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          )}
        >
          Por Tier
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Chart */}
        {selectedChart === 'hourly' && (
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Transacciones por Hora
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {currentChartData.hourly.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-16">
                      {data.hour}
                    </span>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-mandala-primary h-3 rounded-full transition-all duration-300"
                          style={{ width: `${(data.transactions / 200) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {data.transactions}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatCurrency(data.volume)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Payment Methods Chart */}
        {selectedChart === 'payment' && (
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Distribución por Método de Pago
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {currentChartData.paymentMethods.map((method, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        'w-4 h-4 rounded-full',
                        index === 0 && 'bg-blue-500',
                        index === 1 && 'bg-green-500',
                        index === 2 && 'bg-yellow-500',
                        index === 3 && 'bg-purple-500'
                      )}></div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {method.method}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {method.count} ({method.percentage}%)
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {formatCurrency(method.volume)}
                        </div>
                      </div>
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={cn(
                            'h-2 rounded-full transition-all duration-300',
                            index === 0 && 'bg-blue-500',
                            index === 1 && 'bg-green-500',
                            index === 2 && 'bg-yellow-500',
                            index === 3 && 'bg-purple-500'
                          )}
                          style={{ width: `${method.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Venues Chart */}
        {selectedChart === 'venues' && hasAnyRole([UserRole.ADMIN]) && (
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Distribución por Venue
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {currentChartData.venues.map((venue, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {venue.name}
                    </span>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {venue.transactions} ({venue.percentage}%)
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {formatCurrency(venue.volume)}
                        </div>
                      </div>
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-mandala-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${venue.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Customer Tiers Chart */}
        {selectedChart === 'tiers' && (
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Análisis por Tier de Cliente
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {currentChartData.customerTiers.map((tier, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        'w-4 h-4 rounded-full',
                        tier.tier === 'Black' && 'bg-gray-900',
                        tier.tier === 'Gold' && 'bg-yellow-500',
                        tier.tier === 'Silver' && 'bg-gray-500',
                        tier.tier === 'Bronze' && 'bg-orange-500'
                      )}></div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {tier.tier}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {tier.count} clientes • {formatCurrency(tier.avgSpend)} avg
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Volumen: {formatCurrency(tier.volume)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Insights Clave
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">Método de Pago Preferido</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentMetrics.topPaymentMethod} es el método más utilizado este período
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">Hora Pico</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentMetrics.peakHour} registra la mayor actividad transaccional
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">Tendencia General</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentMetrics.trends.volume > 0 ? 'Crecimiento' : 'Decrecimiento'} del {Math.abs(currentMetrics.trends.volume)}% en volumen vs período anterior
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 