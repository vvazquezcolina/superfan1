'use client';

import React, { useState } from 'react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { UserRole } from '@mandala/shared-types';
import {
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  DocumentTextIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowRightIcon,
  UserCircleIcon,
  CogIcon,
  BellIcon,
} from '@heroicons/react/24/outline';

interface DelegationRule {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromRole: UserRole;
  toUserId: string;
  toUserName: string;
  toRole: UserRole;
  startDate: Date;
  endDate: Date;
  maxAmount?: number;
  allowedTransactionTypes?: string[];
  active: boolean;
  reason?: string;
  createdAt: Date;
  createdBy: string;
  usage?: {
    totalDelegated: number;
    totalAmount: number;
    lastUsed?: Date;
  };
}

interface DelegationTemplate {
  id: string;
  name: string;
  description: string;
  defaultDurationDays: number;
  maxAmount?: number;
  allowedRoles: UserRole[];
  allowedTransactionTypes: string[];
  autoApprovalRules?: string[];
}

const mockDelegations: DelegationRule[] = [
  {
    id: '1',
    fromUserId: 'admin1',
    fromUserName: 'Carlos Mendoza',
    fromRole: UserRole.ADMIN,
    toUserId: 'mgr1',
    toUserName: 'Ana García',
    toRole: UserRole.VENUE_MANAGER,
    startDate: new Date('2024-01-20T00:00:00Z'),
    endDate: new Date('2024-01-27T23:59:59Z'),
    maxAmount: 50000,
    allowedTransactionTypes: ['payment', 'refund'],
    active: true,
    reason: 'Vacaciones programadas - cobertura de aprobaciones',
    createdAt: new Date('2024-01-19T15:30:00Z'),
    createdBy: 'admin1',
    usage: {
      totalDelegated: 12,
      totalAmount: 180000,
      lastUsed: new Date('2024-01-20T14:30:00Z'),
    }
  },
  {
    id: '2',
    fromUserId: 'mgr1',
    fromUserName: 'Ana García',
    fromRole: UserRole.VENUE_MANAGER,
    toUserId: 'mgr2',
    toUserName: 'Luis Hernández',
    toRole: UserRole.VENUE_MANAGER,
    startDate: new Date('2024-01-22T00:00:00Z'),
    endDate: new Date('2024-01-24T23:59:59Z'),
    maxAmount: 25000,
    allowedTransactionTypes: ['payment', 'transfer'],
    active: true,
    reason: 'Cobertura de fin de semana',
    createdAt: new Date('2024-01-21T10:00:00Z'),
    createdBy: 'mgr1',
    usage: {
      totalDelegated: 5,
      totalAmount: 75000,
      lastUsed: new Date('2024-01-22T16:45:00Z'),
    }
  },
  {
    id: '3',
    fromUserId: 'admin2',
    fromUserName: 'María González',
    fromRole: UserRole.ADMIN,
    toUserId: 'admin1',
    toUserName: 'Carlos Mendoza',
    toRole: UserRole.ADMIN,
    startDate: new Date('2024-01-15T00:00:00Z'),
    endDate: new Date('2024-01-19T23:59:59Z'),
    maxAmount: 100000,
    allowedTransactionTypes: ['payment', 'transfer', 'refund', 'withdrawal'],
    active: false,
    reason: 'Viaje de negocios - delegación completa',
    createdAt: new Date('2024-01-14T12:00:00Z'),
    createdBy: 'admin2',
    usage: {
      totalDelegated: 8,
      totalAmount: 420000,
      lastUsed: new Date('2024-01-19T18:20:00Z'),
    }
  },
  {
    id: '4',
    fromUserId: 'mgr3',
    fromUserName: 'Roberto Martínez',
    fromRole: UserRole.VENUE_MANAGER,
    toUserId: 'mgr1',
    toUserName: 'Ana García',
    toRole: UserRole.VENUE_MANAGER,
    startDate: new Date('2024-01-25T00:00:00Z'),
    endDate: new Date('2024-01-26T23:59:59Z'),
    maxAmount: 15000,
    allowedTransactionTypes: ['refund'],
    active: true,
    reason: 'Urgencia médica - delegación temporal',
    createdAt: new Date('2024-01-24T20:30:00Z'),
    createdBy: 'mgr3',
    usage: {
      totalDelegated: 0,
      totalAmount: 0,
    }
  }
];

const mockTemplates: DelegationTemplate[] = [
  {
    id: 'template1',
    name: 'Vacaciones - Admin',
    description: 'Delegación completa para períodos vacacionales de administradores',
    defaultDurationDays: 7,
    maxAmount: 100000,
    allowedRoles: [UserRole.ADMIN, UserRole.VENUE_MANAGER],
    allowedTransactionTypes: ['payment', 'transfer', 'refund', 'withdrawal'],
    autoApprovalRules: ['routine_payments', 'standard_refunds']
  },
  {
    id: 'template2',
    name: 'Fin de Semana - Manager',
    description: 'Cobertura de fin de semana para venue managers',
    defaultDurationDays: 2,
    maxAmount: 25000,
    allowedRoles: [UserRole.VENUE_MANAGER],
    allowedTransactionTypes: ['payment', 'refund'],
    autoApprovalRules: ['weekend_operations']
  },
  {
    id: 'template3',
    name: 'Emergencia - Temporal',
    description: 'Delegación de emergencia con límites restringidos',
    defaultDurationDays: 1,
    maxAmount: 10000,
    allowedRoles: [UserRole.VENUE_MANAGER, UserRole.RP],
    allowedTransactionTypes: ['refund'],
    autoApprovalRules: ['emergency_only']
  }
];

export function DelegationManagement() {
  const { user, hasAnyRole } = useAuth();
  const [delegations, setDelegations] = useState<DelegationRule[]>(mockDelegations);
  const [templates] = useState<DelegationTemplate[]>(mockTemplates);
  const [selectedDelegation, setSelectedDelegation] = useState<DelegationRule | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'history' | 'templates' | 'received'>('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired' | 'upcoming'>('all');

  // Filter delegations based on user role and view
  const getFilteredDelegations = () => {
    let filtered = delegations;

    // Filter by tab
    switch (activeTab) {
      case 'active':
        filtered = delegations.filter(d => d.active && new Date() <= d.endDate);
        break;
      case 'history':
        filtered = delegations.filter(d => !d.active || new Date() > d.endDate);
        break;
      case 'received':
        filtered = delegations.filter(d => d.toUserId === user?.id);
        break;
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(d => 
        d.fromUserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.toUserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.reason?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      const now = new Date();
      filtered = filtered.filter(d => {
        switch (filterStatus) {
          case 'active':
            return d.active && now >= d.startDate && now <= d.endDate;
          case 'expired':
            return now > d.endDate;
          case 'upcoming':
            return now < d.startDate;
          default:
            return true;
        }
      });
    }

    return filtered;
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      case UserRole.VENUE_MANAGER:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case UserRole.RP:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100';
      case UserRole.CLIENT:
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'Admin';
      case UserRole.VENUE_MANAGER:
        return 'Manager';
      case UserRole.RP:
        return 'RP';
      case UserRole.CLIENT:
        return 'Cliente';
      default:
        return 'Desconocido';
    }
  };

  const getStatusColor = (delegation: DelegationRule) => {
    const now = new Date();
    
    if (!delegation.active) {
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
    
    if (now > delegation.endDate) {
      return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
    }
    
    if (now < delegation.startDate) {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
    }
    
    return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
  };

  const getStatusLabel = (delegation: DelegationRule) => {
    const now = new Date();
    
    if (!delegation.active) {
      return 'Inactiva';
    }
    
    if (now > delegation.endDate) {
      return 'Expirada';
    }
    
    if (now < delegation.startDate) {
      return 'Programada';
    }
    
    return 'Activa';
  };

  const getTimeRemaining = (endDate: Date): { text: string; isUrgent: boolean } => {
    const now = new Date();
    const timeLeft = endDate.getTime() - now.getTime();
    
    if (timeLeft <= 0) {
      return { text: 'Expirada', isUrgent: true };
    }
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    const isUrgent = timeLeft <= 24 * 60 * 60 * 1000; // Less than 24 hours
    
    if (days > 0) {
      return { text: `${days}d ${hours}h`, isUrgent };
    } else {
      return { text: `${hours}h`, isUrgent };
    }
  };

  const revokeDelegation = (delegationId: string) => {
    if (confirm('¿Estás seguro de revocar esta delegación? Esta acción no se puede deshacer.')) {
      setDelegations(delegations.map(d => 
        d.id === delegationId ? { ...d, active: false } : d
      ));
    }
  };

  const extendDelegation = (delegationId: string, additionalDays: number) => {
    setDelegations(delegations.map(d => 
      d.id === delegationId 
        ? { ...d, endDate: new Date(d.endDate.getTime() + additionalDays * 24 * 60 * 60 * 1000) }
        : d
    ));
  };

  const delegationStats = {
    total: delegations.length,
    active: delegations.filter(d => d.active && new Date() <= d.endDate).length,
    expired: delegations.filter(d => new Date() > d.endDate).length,
    received: delegations.filter(d => d.toUserId === user?.id).length,
    upcoming: delegations.filter(d => new Date() < d.startDate).length,
  };

  const filteredDelegations = getFilteredDelegations();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestión de Delegaciones
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Administra delegaciones de autoridad de aprobación
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowTemplateModal(true)}
            className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <DocumentTextIcon className="h-5 w-5" />
            <span>Plantillas</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-mandala-primary text-white px-4 py-2 rounded-lg hover:bg-mandala-primary/90 transition-colors flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Nueva Delegación</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {delegationStats.total}
              </p>
            </div>
            <UserGroupIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Activas</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {delegationStats.active}
              </p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Expiradas</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {delegationStats.expired}
              </p>
            </div>
            <ClockIcon className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Recibidas</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {delegationStats.received}
              </p>
            </div>
            <ArrowRightIcon className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Próximas</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {delegationStats.upcoming}
              </p>
            </div>
            <CalendarDaysIcon className="h-8 w-8 text-yellow-500" />
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
                <UserCircleIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por usuario o motivo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-mandala-primary focus:border-mandala-primary sm:text-sm"
              />
            </div>
          </div>

          {/* Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="text-sm border-gray-300 rounded-md focus:ring-mandala-primary focus:border-mandala-primary dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activas</option>
            <option value="expired">Expiradas</option>
            <option value="upcoming">Próximas</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'active', name: 'Activas', count: delegationStats.active },
              { id: 'history', name: 'Historial', count: delegationStats.expired },
              { id: 'received', name: 'Recibidas', count: delegationStats.received },
              { id: 'templates', name: 'Plantillas', count: templates.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap',
                  activeTab === tab.id
                    ? 'border-mandala-primary text-mandala-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                )}
              >
                <span>{tab.name}</span>
                <span className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                  activeTab === tab.id
                    ? 'bg-mandala-primary text-white'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                )}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'templates' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div key={template.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-md font-medium text-gray-900 dark:text-white">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {template.description}
                      </p>
                      
                      <div className="mt-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Duración:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {template.defaultDurationDays} días
                          </span>
                        </div>
                        
                        {template.maxAmount && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Límite:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {formatCurrency(template.maxAmount)}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Tipos:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {template.allowedTransactionTypes.length}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      className="text-mandala-primary hover:text-mandala-primary/80"
                      title="Usar plantilla"
                    >
                      <PlusIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDelegations.map((delegation) => {
                const timeRemaining = getTimeRemaining(delegation.endDate);
                
                return (
                  <div key={delegation.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-mandala-primary/10 rounded-lg">
                          <UserGroupIcon className="h-6 w-6 text-mandala-primary" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {delegation.fromUserName} → {delegation.toUserName}
                            </h3>
                            <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getStatusColor(delegation))}>
                              {getStatusLabel(delegation)}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getRoleColor(delegation.fromRole))}>
                                {getRoleLabel(delegation.fromRole)}
                              </span>
                              <ArrowRightIcon className="h-3 w-3" />
                              <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getRoleColor(delegation.toRole))}>
                                {getRoleLabel(delegation.toRole)}
                              </span>
                            </div>
                            <span>•</span>
                            <span>Creada: {formatDate(delegation.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <div className={cn(
                            'text-sm font-medium',
                            timeRemaining.isUrgent ? 'text-red-600' : 'text-gray-900 dark:text-white'
                          )}>
                            {timeRemaining.text}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            restante
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => setSelectedDelegation(delegation)}
                            className="text-gray-400 hover:text-mandala-primary"
                            title="Ver detalles"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          
                          {delegation.active && delegation.fromUserId === user?.id && (
                            <>
                              <button
                                onClick={() => extendDelegation(delegation.id, 1)}
                                className="text-gray-400 hover:text-blue-600"
                                title="Extender por 1 día"
                              >
                                <ClockIcon className="h-5 w-5" />
                              </button>
                              
                              <button
                                onClick={() => revokeDelegation(delegation.id)}
                                className="text-gray-400 hover:text-red-600"
                                title="Revocar delegación"
                              >
                                <XCircleIcon className="h-5 w-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Período</p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {formatDate(delegation.startDate)} - {formatDate(delegation.endDate)}
                        </p>
                      </div>
                      
                      {delegation.maxAmount && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Límite de Monto</p>
                          <p className="text-sm text-gray-900 dark:text-white">
                            {formatCurrency(delegation.maxAmount)}
                          </p>
                        </div>
                      )}
                      
                      <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Tipos Permitidos</p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {delegation.allowedTransactionTypes?.join(', ') || 'Todos'}
                        </p>
                      </div>
                    </div>

                    {/* Usage Stats */}
                    {delegation.usage && (
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Usos:</span>
                            <span className="ml-2 font-medium text-gray-900 dark:text-white">
                              {delegation.usage.totalDelegated}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Monto Total:</span>
                            <span className="ml-2 font-medium text-gray-900 dark:text-white">
                              {formatCurrency(delegation.usage.totalAmount)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Último Uso:</span>
                            <span className="ml-2 font-medium text-gray-900 dark:text-white">
                              {delegation.usage.lastUsed ? formatDate(delegation.usage.lastUsed) : 'Nunca'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Reason */}
                    {delegation.reason && (
                      <div className="mt-4">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Motivo</p>
                        <p className="text-sm text-gray-900 dark:text-white italic">
                          "{delegation.reason}"
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* No Results */}
          {filteredDelegations.length === 0 && activeTab !== 'templates' && (
            <div className="text-center py-12">
              <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No hay delegaciones
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No se encontraron delegaciones que coincidan con los filtros seleccionados.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delegation Details Modal */}
      {selectedDelegation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Detalles de Delegación
                </h3>
                <button
                  onClick={() => setSelectedDelegation(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Información de Delegación</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">De:</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedDelegation.fromUserName}
                        <span className={cn('ml-2 px-2 py-1 text-xs font-medium rounded-full', getRoleColor(selectedDelegation.fromRole))}>
                          {getRoleLabel(selectedDelegation.fromRole)}
                        </span>
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Para:</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedDelegation.toUserName}
                        <span className={cn('ml-2 px-2 py-1 text-xs font-medium rounded-full', getRoleColor(selectedDelegation.toRole))}>
                          {getRoleLabel(selectedDelegation.toRole)}
                        </span>
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Estado:</span>
                      <span className={cn('ml-2 px-2 py-1 text-xs font-medium rounded-full', getStatusColor(selectedDelegation))}>
                        {getStatusLabel(selectedDelegation)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Restricciones</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">Período:</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatDate(selectedDelegation.startDate)} - {formatDate(selectedDelegation.endDate)}
                      </p>
                    </div>
                    {selectedDelegation.maxAmount && (
                      <div>
                        <span className="text-sm text-gray-500">Límite de Monto:</span>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(selectedDelegation.maxAmount)}
                        </p>
                      </div>
                    )}
                    <div>
                      <span className="text-sm text-gray-500">Tipos de Transacción:</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedDelegation.allowedTransactionTypes?.join(', ') || 'Todos'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedDelegation.reason && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Motivo</h4>
                  <p className="text-gray-600 dark:text-gray-400 italic">
                    "{selectedDelegation.reason}"
                  </p>
                </div>
              )}
              
              {selectedDelegation.usage && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Estadísticas de Uso</h4>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-semibold text-mandala-primary">
                          {selectedDelegation.usage.totalDelegated}
                        </p>
                        <p className="text-sm text-gray-500">Aprobaciones</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-semibold text-mandala-primary">
                          {formatCurrency(selectedDelegation.usage.totalAmount)}
                        </p>
                        <p className="text-sm text-gray-500">Monto Total</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {selectedDelegation.usage.lastUsed ? formatDate(selectedDelegation.usage.lastUsed) : 'Nunca'}
                        </p>
                        <p className="text-sm text-gray-500">Último Uso</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 