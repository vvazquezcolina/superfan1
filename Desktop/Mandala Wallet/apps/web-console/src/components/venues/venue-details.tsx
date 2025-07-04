'use client';

import React from 'react';
import { cn, formatCurrency, formatNumber } from '@/lib/utils';
import {
  BuildingStorefrontIcon,
  MapPinIcon,
  UsersIcon,
  CreditCardIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  CogIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  StarIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';

interface VenueDetailsProps {
  venue: {
    id: string;
    name: string;
    type: 'beach_club' | 'nightclub' | 'restaurant' | 'bar' | 'event_space';
    status: 'active' | 'inactive' | 'maintenance' | 'pending_approval';
    location: {
      address: string;
      city: string;
      coordinates: { lat: number; lng: number };
    };
    contact: {
      phone: string;
      email: string;
      manager: string;
    };
    operationalInfo: {
      capacity: number;
      currentOccupancy: number;
      isOpen: boolean;
      hours: {
        open: string;
        close: string;
      };
    };
    analytics: {
      todayTransactions: number;
      todayRevenue: number;
      monthlyRevenue: number;
      avgTicketSize: number;
      customerSatisfaction: number;
      totalCustomers: number;
      repeatCustomers: number;
      peakHour: string;
      busyDays: string[];
    };
    settings: {
      acceptsCrypto: boolean;
      requiresReservation: boolean;
      hasGeofencing: boolean;
      autoApproveTransactions: boolean;
    };
    description?: string;
    websiteUrl?: string;
    socialMedia?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
    };
    createdAt: Date;
    lastUpdated: Date;
  };
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
    case 'inactive':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    case 'maintenance':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
    case 'pending_approval':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'active':
      return 'Activo';
    case 'inactive':
      return 'Inactivo';
    case 'maintenance':
      return 'Mantenimiento';
    case 'pending_approval':
      return 'Pendiente Aprobación';
    default:
      return 'Desconocido';
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'beach_club':
      return 'Beach Club';
    case 'nightclub':
      return 'Nightclub';
    case 'restaurant':
      return 'Restaurante';
    case 'bar':
      return 'Bar';
    case 'event_space':
      return 'Espacio de Eventos';
    default:
      return 'Desconocido';
  }
};

export function VenueDetails({ venue, onEdit, onDelete, onClose }: VenueDetailsProps) {
  const occupancyPercentage = Math.round((venue.operationalInfo.currentOccupancy / venue.operationalInfo.capacity) * 100);
  const repeatCustomerRate = Math.round((venue.analytics.repeatCustomers / venue.analytics.totalCustomers) * 100);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-mandala-primary/10 rounded-lg">
                <BuildingStorefrontIcon className="h-8 w-8 text-mandala-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {venue.name}
                </h2>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {getTypeLabel(venue.type)}
                  </span>
                  <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getStatusColor(venue.status))}>
                    {getStatusLabel(venue.status)}
                  </span>
                  {venue.operationalInfo.isOpen && (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600 dark:text-green-400">Abierto</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={onEdit}
                className="p-2 text-gray-400 hover:text-blue-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Editar venue"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              
              <button
                onClick={onDelete}
                className="p-2 text-gray-400 hover:text-red-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Eliminar venue"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
              
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Cerrar"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Key Metrics */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Métricas Clave
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Ocupación Actual</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {occupancyPercentage}%
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {venue.operationalInfo.currentOccupancy}/{venue.operationalInfo.capacity}
                    </p>
                  </div>
                  <UsersIcon className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">Ingresos Hoy</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                      {formatCurrency(venue.analytics.todayRevenue)}
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {venue.analytics.todayTransactions} transacciones
                    </p>
                  </div>
                  <CreditCardIcon className="h-8 w-8 text-green-500" />
                </div>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Satisfacción</p>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                      {venue.analytics.customerSatisfaction}/5.0
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon 
                          key={star}
                          className={cn(
                            'h-4 w-4',
                            star <= venue.analytics.customerSatisfaction 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <StarIcon className="h-8 w-8 text-purple-500" />
                </div>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Clientes Recurrentes</p>
                    <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                      {repeatCustomerRate}%
                    </p>
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                      {venue.analytics.repeatCustomers} de {venue.analytics.totalCustomers}
                    </p>
                  </div>
                  <UserGroupIcon className="h-8 w-8 text-orange-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* General Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Información General
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">ID del Venue:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{venue.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Tipo:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{getTypeLabel(venue.type)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Capacidad:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{formatNumber(venue.operationalInfo.capacity)} personas</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Horarios:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {venue.operationalInfo.hours.open} - {venue.operationalInfo.hours.close}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Creado:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {venue.createdAt.toLocaleDateString('es-MX')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Información de Contacto
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <UserGroupIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Manager</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{venue.contact.manager}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Teléfono</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{venue.contact.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{venue.contact.email}</p>
                    </div>
                  </div>
                  {venue.websiteUrl && (
                    <div className="flex items-center space-x-3">
                      <GlobeAltIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Sitio Web</p>
                        <a 
                          href={venue.websiteUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-mandala-primary hover:text-mandala-primary/80"
                        >
                          {venue.websiteUrl}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Ubicación
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Dirección</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{venue.location.address}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{venue.location.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-5 w-5"></div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Coordenadas</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {venue.location.coordinates.lat}, {venue.location.coordinates.lng}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics and Settings */}
            <div className="space-y-6">
              {/* Monthly Analytics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Analytics del Mes
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Ingresos Totales</p>
                      <p className="text-lg font-bold text-mandala-primary">{formatCurrency(venue.analytics.monthlyRevenue)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Ticket Promedio</p>
                      <p className="text-lg font-bold text-blue-600">{formatCurrency(venue.analytics.avgTicketSize)}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Hora Pico</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{venue.analytics.peakHour}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Días Concurridos</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {venue.analytics.busyDays.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Settings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Configuración del Sistema
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Acepta Crypto</span>
                    {venue.settings.acceptsCrypto ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircleIcon className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Requiere Reservaciones</span>
                    {venue.settings.requiresReservation ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircleIcon className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Geofencing Activo</span>
                    {venue.settings.hasGeofencing ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircleIcon className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Auto-Aprobar Transacciones</span>
                    {venue.settings.autoApproveTransactions ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircleIcon className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </div>
              </div>

              {/* Social Media */}
              {venue.socialMedia && Object.keys(venue.socialMedia).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Redes Sociales
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-3">
                    {venue.socialMedia.facebook && (
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Facebook</p>
                        <a 
                          href={venue.socialMedia.facebook} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-mandala-primary hover:text-mandala-primary/80"
                        >
                          {venue.socialMedia.facebook}
                        </a>
                      </div>
                    )}
                    {venue.socialMedia.instagram && (
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Instagram</p>
                        <a 
                          href={venue.socialMedia.instagram} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-mandala-primary hover:text-mandala-primary/80"
                        >
                          {venue.socialMedia.instagram}
                        </a>
                      </div>
                    )}
                    {venue.socialMedia.twitter && (
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Twitter</p>
                        <a 
                          href={venue.socialMedia.twitter} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-mandala-primary hover:text-mandala-primary/80"
                        >
                          {venue.socialMedia.twitter}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {venue.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Descripción
              </h3>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {venue.description}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 