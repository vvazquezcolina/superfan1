'use client';

import React, { useState } from 'react';
import { cn, formatDate } from '@/lib/utils';
import { UserRole } from '@mandala/shared-types';
import {
  ClockIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ShieldCheckIcon,
  BanknotesIcon,
  CogIcon,
  UserCircleIcon,
  GlobeAltIcon,
  ArrowDownTrayIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';

interface ActivityEvent {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userRole: UserRole;
  action: string;
  category: 'authentication' | 'transaction' | 'permission' | 'system' | 'security';
  description: string;
  ipAddress: string;
  userAgent: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  location?: string;
  success: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  timestamp: Date;
  metadata?: Record<string, any>;
}

const mockActivityEvents: ActivityEvent[] = [
  {
    id: '1',
    userId: '1',
    userEmail: 'admin@mandala.mx',
    userName: 'Super Admin',
    userRole: UserRole.ADMIN,
    action: 'login',
    category: 'authentication',
    description: 'Inicio de sesión exitoso',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    deviceType: 'desktop',
    location: 'Cancún, Q.R., México',
    success: true,
    riskLevel: 'low',
    timestamp: new Date('2024-01-20T10:30:00Z'),
    metadata: { sessionDuration: '2h 45m' }
  },
  {
    id: '2',
    userId: '3',
    userEmail: 'rp.maria@mandala.mx',
    userName: 'María González',
    userRole: UserRole.RP,
    action: 'transaction_create',
    category: 'transaction',
    description: 'Transacción de $500 MXN procesada',
    ipAddress: '10.0.0.78',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)',
    deviceType: 'mobile',
    location: 'Cancún, Q.R., México',
    success: true,
    riskLevel: 'low',
    timestamp: new Date('2024-01-20T16:45:00Z'),
    metadata: { amount: 500, currency: 'MXN', venue: 'Mandala Beach Club' }
  },
  {
    id: '3',
    userId: '5',
    userEmail: 'inactive@example.com',
    userName: 'Roberto Martínez',
    userRole: UserRole.CLIENT,
    action: 'login_failed',
    category: 'security',
    description: 'Intento de inicio de sesión fallido - contraseña incorrecta',
    ipAddress: '192.168.1.25',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    deviceType: 'desktop',
    location: 'Playa del Carmen, Q.R., México',
    success: false,
    riskLevel: 'medium',
    timestamp: new Date('2024-01-20T09:15:00Z'),
    metadata: { attempts: 3, reason: 'invalid_password' }
  },
  {
    id: '4',
    userId: '2',
    userEmail: 'manager@mandalabeach.com',
    userName: 'Carlos Rodriguez',
    userRole: UserRole.VENUE_MANAGER,
    action: 'venue_settings_update',
    category: 'system',
    description: 'Configuración de venue actualizada',
    ipAddress: '10.0.0.45',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    deviceType: 'desktop',
    location: 'Cancún, Q.R., México',
    success: true,
    riskLevel: 'low',
    timestamp: new Date('2024-01-20T14:20:00Z'),
    metadata: { venueId: 'mandala-beach-club', changes: ['capacity', 'hours'] }
  },
  {
    id: '5',
    userId: '1',
    userEmail: 'admin@mandala.mx',
    userName: 'Super Admin',
    userRole: UserRole.ADMIN,
    action: 'user_role_change',
    category: 'permission',
    description: 'Rol de usuario cambiado de CLIENT a RP',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    deviceType: 'desktop',
    location: 'Cancún, Q.R., México',
    success: true,
    riskLevel: 'high',
    timestamp: new Date('2024-01-20T11:00:00Z'),
    metadata: { targetUserId: '6', fromRole: 'CLIENT', toRole: 'RP' }
  },
  {
    id: '6',
    userId: '4',
    userEmail: 'client@gmail.com',
    userName: 'Ana López',
    userRole: UserRole.CLIENT,
    action: 'suspicious_activity',
    category: 'security',
    description: 'Actividad sospechosa detectada - múltiples IPs',
    ipAddress: '203.0.113.45',
    userAgent: 'Mozilla/5.0 (Linux; Android 13)',
    deviceType: 'mobile',
    location: 'Ciudad de México, CDMX, México',
    success: false,
    riskLevel: 'high',
    timestamp: new Date('2024-01-20T20:30:00Z'),
    metadata: { suspiciousIps: ['203.0.113.45', '198.51.100.23'], reason: 'location_change' }
  }
];

export function UserActivityMonitor() {
  const [events, setEvents] = useState<ActivityEvent[]>(mockActivityEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | ActivityEvent['category']>('all');
  const [filterRiskLevel, setFilterRiskLevel] = useState<'all' | ActivityEvent['riskLevel']>('all');
  const [filterSuccess, setFilterSuccess] = useState<'all' | 'success' | 'failed'>('all');
  const [selectedEvent, setSelectedEvent] = useState<ActivityEvent | null>(null);
  const [dateRange, setDateRange] = useState('today');

  const getCategoryIcon = (category: ActivityEvent['category']) => {
    switch (category) {
      case 'authentication':
        return UserCircleIcon;
      case 'transaction':
        return BanknotesIcon;
      case 'permission':
        return ShieldCheckIcon;
      case 'system':
        return CogIcon;
      case 'security':
        return ExclamationTriangleIcon;
      default:
        return ClockIcon;
    }
  };

  const getCategoryColor = (category: ActivityEvent['category']) => {
    switch (category) {
      case 'authentication':
        return 'text-blue-600';
      case 'transaction':
        return 'text-green-600';
      case 'permission':
        return 'text-red-600';
      case 'system':
        return 'text-gray-600';
      case 'security':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const getCategoryLabel = (category: ActivityEvent['category']) => {
    switch (category) {
      case 'authentication':
        return 'Autenticación';
      case 'transaction':
        return 'Transacciones';
      case 'permission':
        return 'Permisos';
      case 'system':
        return 'Sistema';
      case 'security':
        return 'Seguridad';
      default:
        return 'Otros';
    }
  };

  const getRiskLevelColor = (riskLevel: ActivityEvent['riskLevel']) => {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getRiskLevelLabel = (riskLevel: ActivityEvent['riskLevel']) => {
    switch (riskLevel) {
      case 'low':
        return 'Bajo';
      case 'medium':
        return 'Medio';
      case 'high':
        return 'Alto';
      default:
        return 'Desconocido';
    }
  };

  const getDeviceIcon = (deviceType: ActivityEvent['deviceType']) => {
    switch (deviceType) {
      case 'desktop':
        return ComputerDesktopIcon;
      case 'mobile':
        return DevicePhoneMobileIcon;
      case 'tablet':
        return DevicePhoneMobileIcon;
      default:
        return ComputerDesktopIcon;
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
    const matchesRiskLevel = filterRiskLevel === 'all' || event.riskLevel === filterRiskLevel;
    const matchesSuccess = filterSuccess === 'all' || 
                          (filterSuccess === 'success' && event.success) ||
                          (filterSuccess === 'failed' && !event.success);
    
    return matchesSearch && matchesCategory && matchesRiskLevel && matchesSuccess;
  });

  const activityStats = {
    total: events.length,
    successful: events.filter(e => e.success).length,
    failed: events.filter(e => !e.success).length,
    highRisk: events.filter(e => e.riskLevel === 'high').length,
    securityEvents: events.filter(e => e.category === 'security').length,
  };

  const exportActivity = () => {
    const csvData = filteredEvents.map(event => ({
      Timestamp: event.timestamp.toISOString(),
      Usuario: event.userName,
      Email: event.userEmail,
      Acción: event.action,
      Categoría: getCategoryLabel(event.category),
      Descripción: event.description,
      IP: event.ipAddress,
      Dispositivo: event.deviceType,
      Ubicación: event.location || '',
      Éxito: event.success ? 'Sí' : 'No',
      'Nivel de Riesgo': getRiskLevelLabel(event.riskLevel)
    }));

    const csvContent = "data:text/csv;charset=utf-8," + 
      Object.keys(csvData[0]).join(",") + "\n" +
      csvData.map(row => Object.values(row).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `actividad_usuarios_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Monitor de Actividad de Usuarios
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Seguimiento de acciones, logins y eventos de seguridad
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={exportActivity}
            className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Eventos</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {activityStats.total}
              </p>
            </div>
            <ClockIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Exitosos</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {activityStats.successful}
              </p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Fallidos</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {activityStats.failed}
              </p>
            </div>
            <XCircleIcon className="h-8 w-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Alto Riesgo</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {activityStats.highRisk}
              </p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Seguridad</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {activityStats.securityEvents}
              </p>
            </div>
            <ShieldCheckIcon className="h-8 w-8 text-red-500" />
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
                placeholder="Buscar por usuario, email, acción..."
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
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as any)}
              className="text-sm border-gray-300 rounded-md focus:ring-mandala-primary focus:border-mandala-primary dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="all">Todas las categorías</option>
              <option value="authentication">Autenticación</option>
              <option value="transaction">Transacciones</option>
              <option value="permission">Permisos</option>
              <option value="system">Sistema</option>
              <option value="security">Seguridad</option>
            </select>
            
            <select
              value={filterRiskLevel}
              onChange={(e) => setFilterRiskLevel(e.target.value as any)}
              className="text-sm border-gray-300 rounded-md focus:ring-mandala-primary focus:border-mandala-primary dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="all">Todos los riesgos</option>
              <option value="low">Bajo</option>
              <option value="medium">Medio</option>
              <option value="high">Alto</option>
            </select>
            
            <select
              value={filterSuccess}
              onChange={(e) => setFilterSuccess(e.target.value as any)}
              className="text-sm border-gray-300 rounded-md focus:ring-mandala-primary focus:border-mandala-primary dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="all">Todos los resultados</option>
              <option value="success">Exitosos</option>
              <option value="failed">Fallidos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Actividad Reciente ({filteredEvents.length} eventos)
          </h3>
          
          <div className="space-y-4">
            {filteredEvents.map((event) => {
              const CategoryIcon = getCategoryIcon(event.category);
              const DeviceIcon = getDeviceIcon(event.deviceType);
              
              return (
                <div key={event.id} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                  <div className={cn('p-2 rounded-lg', event.success ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20')}>
                    <CategoryIcon className={cn('h-5 w-5', getCategoryColor(event.category))} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {event.userName}
                        </p>
                        <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getRiskLevelColor(event.riskLevel))}>
                          {getRiskLevelLabel(event.riskLevel)}
                        </span>
                        {!event.success && (
                          <XCircleIcon className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <DeviceIcon className="h-4 w-4" />
                        <span>{formatDate(event.timestamp)}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {event.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center space-x-1">
                        <GlobeAltIcon className="h-3 w-3" />
                        <span>{event.ipAddress}</span>
                      </span>
                      {event.location && (
                        <span>{event.location}</span>
                      )}
                      <span className="capitalize">{getCategoryLabel(event.category)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="text-gray-400 hover:text-mandala-primary"
                    title="Ver detalles"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Detalles del Evento
                </h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Información del Usuario</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Nombre:</span>
                      <span className="text-gray-900 dark:text-white">{selectedEvent.userName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email:</span>
                      <span className="text-gray-900 dark:text-white">{selectedEvent.userEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Rol:</span>
                      <span className="text-gray-900 dark:text-white">{selectedEvent.userRole}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Información Técnica</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">IP:</span>
                      <span className="text-gray-900 dark:text-white">{selectedEvent.ipAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Dispositivo:</span>
                      <span className="text-gray-900 dark:text-white capitalize">{selectedEvent.deviceType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ubicación:</span>
                      <span className="text-gray-900 dark:text-white">{selectedEvent.location || 'No disponible'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Timestamp:</span>
                      <span className="text-gray-900 dark:text-white">{formatDate(selectedEvent.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Detalles del Evento</h4>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-500">Acción:</span>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedEvent.action}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Categoría:</span>
                      <p className="font-medium text-gray-900 dark:text-white">{getCategoryLabel(selectedEvent.category)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Resultado:</span>
                      <p className={cn('font-medium', selectedEvent.success ? 'text-green-600' : 'text-red-600')}>
                        {selectedEvent.success ? 'Exitoso' : 'Fallido'}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Nivel de Riesgo:</span>
                      <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getRiskLevelColor(selectedEvent.riskLevel))}>
                        {getRiskLevelLabel(selectedEvent.riskLevel)}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-500">Descripción:</span>
                    <p className="text-gray-900 dark:text-white mt-1">{selectedEvent.description}</p>
                  </div>
                  
                  {selectedEvent.metadata && Object.keys(selectedEvent.metadata).length > 0 && (
                    <div className="mt-4">
                      <span className="text-sm text-gray-500">Metadatos:</span>
                      <div className="mt-2 space-y-2">
                        {Object.entries(selectedEvent.metadata).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400 capitalize">{key.replace('_', ' ')}:</span>
                            <span className="text-gray-900 dark:text-white">{JSON.stringify(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">User Agent</h4>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300 break-all">
                    {selectedEvent.userAgent}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 