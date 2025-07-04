'use client';

import React, { useState } from 'react';
import { cn, formatCurrency, formatNumber } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { UserRole } from '@mandala/shared-types';
import {
  BuildingStorefrontIcon,
  MapPinIcon,
  UsersIcon,
  CreditCardIcon,
  ClockIcon,
  CogIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface Venue {
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
  };
  settings: {
    acceptsCrypto: boolean;
    requiresReservation: boolean;
    hasGeofencing: boolean;
    autoApproveTransactions: boolean;
  };
  createdAt: Date;
  lastUpdated: Date;
}

const mockVenues: Venue[] = [
  {
    id: 'mandala-beach-club',
    name: 'Mandala Beach Club',
    type: 'beach_club',
    status: 'active',
    location: {
      address: 'Blvd. Kukulcan Km 9.5, Zona Hotelera',
      city: 'Cancún, Q.R.',
      coordinates: { lat: 21.1387, lng: -86.7709 },
    },
    contact: {
      phone: '+52-998-123-4567',
      email: 'info@mandalabeachclub.com',
      manager: 'Carlos Rodriguez',
    },
    operationalInfo: {
      capacity: 500,
      currentOccupancy: 245,
      isOpen: true,
      hours: { open: '10:00', close: '04:00' },
    },
    analytics: {
      todayTransactions: 287,
      todayRevenue: 87500,
      monthlyRevenue: 2450000,
      avgTicketSize: 561,
      customerSatisfaction: 4.7,
    },
    settings: {
      acceptsCrypto: true,
      requiresReservation: false,
      hasGeofencing: true,
      autoApproveTransactions: false,
    },
    createdAt: new Date('2023-01-15'),
    lastUpdated: new Date('2024-01-20'),
  },
  {
    id: 'coco-bongo',
    name: 'Coco Bongo',
    type: 'nightclub',
    status: 'active',
    location: {
      address: 'Blvd. Kukulcan Km 9.5, Zona Hotelera',
      city: 'Cancún, Q.R.',
      coordinates: { lat: 21.1387, lng: -86.7709 },
    },
    contact: {
      phone: '+52-998-765-4321',
      email: 'info@cocobongo.com',
      manager: 'Maria Gonzalez',
    },
    operationalInfo: {
      capacity: 800,
      currentOccupancy: 456,
      isOpen: true,
      hours: { open: '20:00', close: '04:00' },
    },
    analytics: {
      todayTransactions: 156,
      todayRevenue: 124800,
      monthlyRevenue: 3200000,
      avgTicketSize: 800,
      customerSatisfaction: 4.5,
    },
    settings: {
      acceptsCrypto: false,
      requiresReservation: true,
      hasGeofencing: true,
      autoApproveTransactions: true,
    },
    createdAt: new Date('2023-03-10'),
    lastUpdated: new Date('2024-01-18'),
  },
  {
    id: 'la-vaquita',
    name: 'La Vaquita',
    type: 'bar',
    status: 'maintenance',
    location: {
      address: 'Blvd. Kukulcan Km 9, Zona Hotelera',
      city: 'Cancún, Q.R.',
      coordinates: { lat: 21.1387, lng: -86.7709 },
    },
    contact: {
      phone: '+52-998-555-1234',
      email: 'info@lavaquita.com',
      manager: 'Roberto Martinez',
    },
    operationalInfo: {
      capacity: 300,
      currentOccupancy: 0,
      isOpen: false,
      hours: { open: '18:00', close: '03:00' },
    },
    analytics: {
      todayTransactions: 0,
      todayRevenue: 0,
      monthlyRevenue: 890000,
      avgTicketSize: 420,
      customerSatisfaction: 4.3,
    },
    settings: {
      acceptsCrypto: true,
      requiresReservation: false,
      hasGeofencing: false,
      autoApproveTransactions: true,
    },
    createdAt: new Date('2023-06-20'),
    lastUpdated: new Date('2024-01-15'),
  },
  {
    id: 'senor-frogs',
    name: 'Señor Frogs',
    type: 'restaurant',
    status: 'pending_approval',
    location: {
      address: 'Blvd. Kukulcan Km 9.5, Zona Hotelera',
      city: 'Cancún, Q.R.',
      coordinates: { lat: 21.1387, lng: -86.7709 },
    },
    contact: {
      phone: '+52-998-777-8888',
      email: 'info@senorfrogs.com',
      manager: 'Ana Lopez',
    },
    operationalInfo: {
      capacity: 400,
      currentOccupancy: 0,
      isOpen: false,
      hours: { open: '12:00', close: '02:00' },
    },
    analytics: {
      todayTransactions: 0,
      todayRevenue: 0,
      monthlyRevenue: 0,
      avgTicketSize: 0,
      customerSatisfaction: 0,
    },
    settings: {
      acceptsCrypto: false,
      requiresReservation: false,
      hasGeofencing: false,
      autoApproveTransactions: false,
    },
    createdAt: new Date('2024-01-10'),
    lastUpdated: new Date('2024-01-20'),
  },
];

export function VenueCatalog() {
  const { hasAnyRole } = useAuth();
  const [venues, setVenues] = useState<Venue[]>(mockVenues);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Venue['status']>('all');
  const [filterType, setFilterType] = useState<'all' | Venue['type']>('all');
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Only allow admins to access venue catalog
  if (!hasAnyRole([UserRole.ADMIN])) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          No tienes permisos para acceder a la gestión de venues.
        </p>
      </div>
    );
  }

  const getStatusColor = (status: Venue['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'pending_approval':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100';
    }
  };

  const getStatusLabel = (status: Venue['status']) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'inactive':
        return 'Inactivo';
      case 'maintenance':
        return 'Mantenimiento';
      case 'pending_approval':
        return 'Pendiente Aprobación';
    }
  };

  const getTypeLabel = (type: Venue['type']) => {
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
    }
  };

  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venue.location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venue.contact.manager.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || venue.status === filterStatus;
    const matchesType = filterType === 'all' || venue.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalStats = {
    totalVenues: venues.length,
    activeVenues: venues.filter(v => v.status === 'active').length,
    totalCapacity: venues.reduce((sum, v) => sum + v.operationalInfo.capacity, 0),
    totalRevenue: venues.reduce((sum, v) => sum + v.analytics.monthlyRevenue, 0),
    avgSatisfaction: venues.reduce((sum, v) => sum + v.analytics.customerSatisfaction, 0) / venues.length,
  };

  const updateVenueStatus = (venueId: string, newStatus: Venue['status']) => {
    setVenues(venues.map(venue => 
      venue.id === venueId 
        ? { ...venue, status: newStatus, lastUpdated: new Date() }
        : venue
    ));
  };

  const deleteVenue = (venueId: string) => {
    if (confirm('¿Estás seguro de eliminar este venue? Esta acción no se puede deshacer.')) {
      setVenues(venues.filter(venue => venue.id !== venueId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Catálogo de Venues
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Gestiona todos los venues del sistema Mandala Wallet
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-mandala-primary text-white px-4 py-2 rounded-lg hover:bg-mandala-primary/90 transition-colors flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Nuevo Venue</span>
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Venues</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {totalStats.totalVenues}
              </p>
            </div>
            <BuildingStorefrontIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Activos</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {totalStats.activeVenues}
              </p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Capacidad Total</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {formatNumber(totalStats.totalCapacity)}
              </p>
            </div>
            <UsersIcon className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ingresos Mes</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {formatCurrency(totalStats.totalRevenue)}
              </p>
            </div>
            <CreditCardIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Satisfacción</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {totalStats.avgSatisfaction.toFixed(1)}/5.0
              </p>
            </div>
            <div className="text-2xl">⭐</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar venues, direcciones, managers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-mandala-primary focus:border-mandala-primary sm:text-sm"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <FunnelIcon className="h-5 w-5 text-gray-500" />
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="text-sm border-gray-300 rounded-md focus:ring-mandala-primary focus:border-mandala-primary dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
              <option value="maintenance">Mantenimiento</option>
              <option value="pending_approval">Pendiente Aprobación</option>
            </select>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="text-sm border-gray-300 rounded-md focus:ring-mandala-primary focus:border-mandala-primary dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="all">Todos los tipos</option>
              <option value="beach_club">Beach Club</option>
              <option value="nightclub">Nightclub</option>
              <option value="restaurant">Restaurante</option>
              <option value="bar">Bar</option>
              <option value="event_space">Espacio de Eventos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Venues Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredVenues.map((venue) => (
          <div key={venue.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Venue Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-mandala-primary/10 rounded-lg">
                    <BuildingStorefrontIcon className="h-6 w-6 text-mandala-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {venue.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {getTypeLabel(venue.type)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getStatusColor(venue.status))}>
                    {getStatusLabel(venue.status)}
                  </span>
                  {venue.operationalInfo.isOpen && (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
            </div>

            {/* Venue Stats */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Ocupación</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {venue.operationalInfo.currentOccupancy}/{venue.operationalInfo.capacity}
                  </p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                    <div 
                      className="bg-mandala-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(venue.operationalInfo.currentOccupancy / venue.operationalInfo.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Ingresos Hoy</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(venue.analytics.todayRevenue)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {venue.analytics.todayTransactions} transacciones
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Ticket Promedio</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(venue.analytics.avgTicketSize)}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Satisfacción</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {venue.analytics.customerSatisfaction}/5.0 ⭐
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Ubicación</p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {venue.location.address}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Manager: {venue.contact.manager}
                </p>
              </div>
            </div>

            {/* Venue Actions */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setSelectedVenue(venue)}
                    className="p-2 text-gray-400 hover:text-mandala-primary rounded-md hover:bg-white dark:hover:bg-gray-800 transition-colors"
                    title="Ver detalles"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  
                  <button
                    className="p-2 text-gray-400 hover:text-blue-600 rounded-md hover:bg-white dark:hover:bg-gray-800 transition-colors"
                    title="Editar venue"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  
                  <button
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-white dark:hover:bg-gray-800 transition-colors"
                    title="Configuración"
                  >
                    <CogIcon className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => deleteVenue(venue.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-md hover:bg-white dark:hover:bg-gray-800 transition-colors"
                    title="Eliminar venue"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  {venue.status === 'active' && (
                    <button
                      onClick={() => updateVenueStatus(venue.id, 'inactive')}
                      className="px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-md hover:bg-red-200 dark:bg-red-800 dark:text-red-100"
                    >
                      Desactivar
                    </button>
                  )}
                  
                  {venue.status === 'inactive' && (
                    <button
                      onClick={() => updateVenueStatus(venue.id, 'active')}
                      className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-md hover:bg-green-200 dark:bg-green-800 dark:text-green-100"
                    >
                      Activar
                    </button>
                  )}
                  
                  {venue.status === 'pending_approval' && (
                    <button
                      onClick={() => updateVenueStatus(venue.id, 'active')}
                      className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-100"
                    >
                      Aprobar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredVenues.length === 0 && (
        <div className="text-center py-12">
          <BuildingStorefrontIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No se encontraron venues
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Intenta ajustar los filtros de búsqueda o crear un nuevo venue.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-mandala-primary text-white px-4 py-2 rounded-lg hover:bg-mandala-primary/90 transition-colors"
          >
            Crear Nuevo Venue
          </button>
        </div>
      )}

      {/* Venue Details Modal */}
      {selectedVenue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Detalles del Venue: {selectedVenue.name}
                </h3>
                <button
                  onClick={() => setSelectedVenue(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Información General</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tipo:</span>
                      <span className="text-gray-900 dark:text-white">{getTypeLabel(selectedVenue.type)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Estado:</span>
                      <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getStatusColor(selectedVenue.status))}>
                        {getStatusLabel(selectedVenue.status)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Capacidad:</span>
                      <span className="text-gray-900 dark:text-white">{selectedVenue.operationalInfo.capacity} personas</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Horarios:</span>
                      <span className="text-gray-900 dark:text-white">
                        {selectedVenue.operationalInfo.hours.open} - {selectedVenue.operationalInfo.hours.close}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Contacto</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Manager:</span>
                      <span className="text-gray-900 dark:text-white">{selectedVenue.contact.manager}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Teléfono:</span>
                      <span className="text-gray-900 dark:text-white">{selectedVenue.contact.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email:</span>
                      <span className="text-gray-900 dark:text-white">{selectedVenue.contact.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Dirección:</span>
                      <p className="text-gray-900 dark:text-white text-sm mt-1">
                        {selectedVenue.location.address}, {selectedVenue.location.city}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Analytics del Mes</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-2xl font-bold text-mandala-primary">{formatCurrency(selectedVenue.analytics.monthlyRevenue)}</p>
                    <p className="text-sm text-gray-500">Ingresos</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(selectedVenue.analytics.avgTicketSize)}</p>
                    <p className="text-sm text-gray-500">Ticket Promedio</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{selectedVenue.analytics.customerSatisfaction}</p>
                    <p className="text-sm text-gray-500">Satisfacción</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.round((selectedVenue.operationalInfo.currentOccupancy / selectedVenue.operationalInfo.capacity) * 100)}%
                    </p>
                    <p className="text-sm text-gray-500">Ocupación</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 