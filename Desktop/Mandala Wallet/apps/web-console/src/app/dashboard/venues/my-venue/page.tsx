'use client';

import React, { useState } from 'react';
import { VenueOverview } from '@/components/venue/venue-overview';
import { useAuth } from '@/providers/auth-provider';
import { UserRole } from '@mandala/shared-types';
import { formatCurrency, formatNumber } from '@/lib/utils';
import {
  ClockIcon,
  UsersIcon,
  CreditCardIcon,
  GiftIcon,
  ChartBarIcon,
  CogIcon,
  MapPinIcon,
  BellIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

export default function MyVenuePage() {
  const { user, hasAnyRole } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock venue data specific to this venue manager
  const venueData = {
    name: 'Mandala Beach Club',
    id: 'mandala-beach-club',
    location: 'Zona Hotelera, Cancún',
    status: 'active',
    manager: user?.displayName || 'Manager',
    todayStats: {
      visitors: 287,
      transactions: 156,
      revenue: 87500,
      avgSpend: 561,
      occupancy: 49,
      satisfaction: 4.7,
    },
    operationalStatus: {
      isOpen: true,
      openTime: '10:00',
      closeTime: '04:00',
      currentCapacity: 245,
      maxCapacity: 500,
      staffOnDuty: 23,
    },
    recentTransactions: [
      { id: '1', time: '2 min', amount: 1250, customer: 'Cliente VIP', type: 'Bottle Service' },
      { id: '2', time: '5 min', amount: 850, customer: 'Mesa 12', type: 'Food & Drinks' },
      { id: '3', time: '8 min', amount: 2100, customer: 'Evento Privado', type: 'Event Package' },
      { id: '4', time: '12 min', amount: 650, customer: 'Bar Principal', type: 'Drinks' },
    ],
    activePromotions: [
      { id: '1', name: 'Happy Hour Weekend', type: '30% off drinks', active: true, ends: '22:00' },
      { id: '2', name: 'VIP Table Special', type: 'Free bottle', active: true, ends: '23:59' },
      { id: '3', name: 'Beach Club Day Pass', type: '50% off entry', active: false, ends: '18:00' },
    ],
  };

  const tabs = [
    { id: 'overview', label: 'Vista General', icon: ChartBarIcon },
    { id: 'transactions', label: 'Transacciones', icon: CreditCardIcon },
    { id: 'promotions', label: 'Promociones', icon: GiftIcon },
    { id: 'settings', label: 'Configuración', icon: CogIcon },
  ];

  // Show different content based on user role
  if (!hasAnyRole([UserRole.VENUE_MANAGER, UserRole.ADMIN])) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          No tienes permisos para acceder a esta página.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Venue Manager Header */}
      <div className="bg-gradient-to-r from-mandala-primary to-mandala-secondary rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <MapPinIcon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                Mi Venue: {venueData.name}
              </h1>
              <p className="text-mandala-primary-light">
                {venueData.location} • Gerente: {venueData.manager}
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  🟢 {venueData.operationalStatus.isOpen ? 'Abierto' : 'Cerrado'}
                </span>
                <span className="text-mandala-primary-light text-sm">
                  {venueData.operationalStatus.openTime} - {venueData.operationalStatus.closeTime}
                </span>
                <span className="text-mandala-primary-light text-sm">
                  {venueData.operationalStatus.staffOnDuty} staff activo
                </span>
              </div>
            </div>
          </div>
          
          {/* Real-time Status */}
          <div className="hidden md:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                <div className="text-2xl font-bold">{venueData.todayStats.occupancy}%</div>
                <div className="text-xs text-mandala-primary-light">Ocupación</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                <div className="text-2xl font-bold">{formatCurrency(venueData.todayStats.revenue)}</div>
                <div className="text-xs text-mandala-primary-light">Ingresos Hoy</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Visitantes Hoy</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {formatNumber(venueData.todayStats.visitors)}
              </p>
            </div>
            <UsersIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Transacciones</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {formatNumber(venueData.todayStats.transactions)}
              </p>
            </div>
            <CreditCardIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Gasto Promedio</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {formatCurrency(venueData.todayStats.avgSpend)}
              </p>
            </div>
            <StarIcon className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Satisfacción</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {venueData.todayStats.satisfaction}/5.0
              </p>
            </div>
            <div className="text-2xl">⭐</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-mandala-primary text-mandala-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Recent Transactions */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Transacciones Recientes
                </h3>
                <div className="space-y-3">
                  {venueData.recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {transaction.customer}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {transaction.type} • hace {transaction.time}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(transaction.amount)}
                      </span>
                    </div>
                  ))}
                </div>
                <button className="mt-4 text-sm text-mandala-primary hover:text-mandala-primary/80">
                  Ver todas las transacciones →
                </button>
              </div>
            </div>
          )}

          {activeTab === 'promotions' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Promociones Activas
                </h3>
                <button className="bg-mandala-primary text-white px-4 py-2 rounded-lg hover:bg-mandala-primary/90 transition-colors">
                  Nueva Promoción
                </button>
              </div>
              
              <div className="space-y-3">
                {venueData.activePromotions.map((promotion) => (
                  <div key={promotion.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${promotion.active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {promotion.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {promotion.type} • Termina a las {promotion.ends}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        promotion.active 
                          ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {promotion.active ? 'Activa' : 'Inactiva'}
                      </span>
                      <button className="text-sm text-mandala-primary hover:text-mandala-primary/80">
                        Editar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Monitoreo de Transacciones en Tiempo Real
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
                <CreditCardIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Vista detallada de transacciones en desarrollo...
                </p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Configuración del Venue
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Horario de Apertura
                    </label>
                    <input
                      type="time"
                      defaultValue="10:00"
                      className="block w-full text-sm border-gray-300 rounded-md focus:ring-mandala-primary focus:border-mandala-primary dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Horario de Cierre
                    </label>
                    <input
                      type="time"
                      defaultValue="04:00"
                      className="block w-full text-sm border-gray-300 rounded-md focus:ring-mandala-primary focus:border-mandala-primary dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Capacidad Máxima
                    </label>
                    <input
                      type="number"
                      defaultValue="500"
                      className="block w-full text-sm border-gray-300 rounded-md focus:ring-mandala-primary focus:border-mandala-primary dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Notificaciones automáticas
                    </span>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-mandala-primary border-gray-300 rounded focus:ring-mandala-primary"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <button className="bg-mandala-primary text-white px-6 py-2 rounded-lg hover:bg-mandala-primary/90 transition-colors">
                  Guardar Configuración
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 