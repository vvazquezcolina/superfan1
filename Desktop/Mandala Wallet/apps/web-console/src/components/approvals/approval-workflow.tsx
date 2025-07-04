'use client';

import React, { useState } from 'react';
import { cn, formatCurrency } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { UserRole } from '@mandala/shared-types';
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  CogIcon,
  BanknotesIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  CalendarDaysIcon,
  ArrowRightIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  BellIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

interface ApprovalRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  priority: number;
  conditions: {
    amountMin: number;
    amountMax: number;
    userRoles: UserRole[];
    venueTypes: string[];
    timeRestrictions?: {
      startHour: number;
      endHour: number;
      daysOfWeek: number[];
    };
  };
  approvalLevels: {
    level: number;
    requiredRole: UserRole;
    requiredApprovers: number;
    timeoutHours: number;
    autoApprove?: boolean;
  }[];
  escalation: {
    timeoutAction: 'auto_approve' | 'auto_reject' | 'escalate';
    escalateToRole?: UserRole;
    notifyRoles: UserRole[];
  };
  createdAt: Date;
  updatedAt: Date;
}

interface ApprovalThreshold {
  id: string;
  name: string;
  category: 'payment' | 'transfer' | 'refund' | 'withdrawal';
  amount: number;
  currency: 'MXN' | 'USD';
  requiredApprovers: number;
  requiredRole: UserRole;
  timeoutHours: number;
  autoEscalate: boolean;
  active: boolean;
}

const mockApprovalRules: ApprovalRule[] = [
  {
    id: '1',
    name: 'Transacciones Grandes - Clientes',
    description: 'Transacciones de clientes superiores a $10,000 MXN',
    enabled: true,
    priority: 1,
    conditions: {
      amountMin: 10000,
      amountMax: 50000,
      userRoles: [UserRole.CLIENT],
      venueTypes: ['beach_club', 'nightclub'],
    },
    approvalLevels: [
      {
        level: 1,
        requiredRole: UserRole.VENUE_MANAGER,
        requiredApprovers: 1,
        timeoutHours: 2,
      },
      {
        level: 2,
        requiredRole: UserRole.ADMIN,
        requiredApprovers: 1,
        timeoutHours: 24,
      }
    ],
    escalation: {
      timeoutAction: 'escalate',
      escalateToRole: UserRole.ADMIN,
      notifyRoles: [UserRole.ADMIN, UserRole.VENUE_MANAGER],
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Transacciones VIP - Alta Prioridad',
    description: 'Transacciones superiores a $50,000 MXN - Requiere aprobación administrativa',
    enabled: true,
    priority: 0,
    conditions: {
      amountMin: 50000,
      amountMax: 1000000,
      userRoles: [UserRole.CLIENT, UserRole.RP],
      venueTypes: ['beach_club', 'nightclub', 'restaurant', 'bar'],
    },
    approvalLevels: [
      {
        level: 1,
        requiredRole: UserRole.ADMIN,
        requiredApprovers: 2,
        timeoutHours: 1,
      }
    ],
    escalation: {
      timeoutAction: 'auto_reject',
      notifyRoles: [UserRole.ADMIN],
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    name: 'Reembolsos Automaticos',
    description: 'Reembolsos menores a $1,000 MXN se aprueban automáticamente',
    enabled: true,
    priority: 2,
    conditions: {
      amountMin: 0,
      amountMax: 1000,
      userRoles: [UserRole.CLIENT, UserRole.RP],
      venueTypes: ['beach_club', 'nightclub', 'restaurant', 'bar'],
    },
    approvalLevels: [
      {
        level: 1,
        requiredRole: UserRole.VENUE_MANAGER,
        requiredApprovers: 1,
        timeoutHours: 0.5,
        autoApprove: true,
      }
    ],
    escalation: {
      timeoutAction: 'auto_approve',
      notifyRoles: [UserRole.VENUE_MANAGER],
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-05'),
  },
  {
    id: '4',
    name: 'Horario Nocturno - Supervisión Extra',
    description: 'Transacciones entre 2:00 AM - 6:00 AM requieren aprobación adicional',
    enabled: true,
    priority: 1,
    conditions: {
      amountMin: 5000,
      amountMax: 100000,
      userRoles: [UserRole.CLIENT, UserRole.RP],
      venueTypes: ['nightclub', 'bar'],
      timeRestrictions: {
        startHour: 2,
        endHour: 6,
        daysOfWeek: [5, 6, 0], // Friday, Saturday, Sunday
      }
    },
    approvalLevels: [
      {
        level: 1,
        requiredRole: UserRole.VENUE_MANAGER,
        requiredApprovers: 1,
        timeoutHours: 1,
      },
      {
        level: 2,
        requiredRole: UserRole.ADMIN,
        requiredApprovers: 1,
        timeoutHours: 4,
      }
    ],
    escalation: {
      timeoutAction: 'escalate',
      escalateToRole: UserRole.ADMIN,
      notifyRoles: [UserRole.ADMIN],
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-12'),
  }
];

const mockThresholds: ApprovalThreshold[] = [
  {
    id: '1',
    name: 'Pagos Grandes',
    category: 'payment',
    amount: 10000,
    currency: 'MXN',
    requiredApprovers: 1,
    requiredRole: UserRole.VENUE_MANAGER,
    timeoutHours: 2,
    autoEscalate: true,
    active: true,
  },
  {
    id: '2',
    name: 'Transferencias VIP',
    category: 'transfer',
    amount: 25000,
    currency: 'MXN',
    requiredApprovers: 2,
    requiredRole: UserRole.ADMIN,
    timeoutHours: 1,
    autoEscalate: true,
    active: true,
  },
  {
    id: '3',
    name: 'Reembolsos Mayores',
    category: 'refund',
    amount: 5000,
    currency: 'MXN',
    requiredApprovers: 1,
    requiredRole: UserRole.VENUE_MANAGER,
    timeoutHours: 4,
    autoEscalate: false,
    active: true,
  },
  {
    id: '4',
    name: 'Retiros Grandes',
    category: 'withdrawal',
    amount: 15000,
    currency: 'MXN',
    requiredApprovers: 2,
    requiredRole: UserRole.ADMIN,
    timeoutHours: 24,
    autoEscalate: true,
    active: true,
  }
];

export function ApprovalWorkflow() {
  const { hasAnyRole } = useAuth();
  const [rules, setRules] = useState<ApprovalRule[]>(mockApprovalRules);
  const [thresholds, setThresholds] = useState<ApprovalThreshold[]>(mockThresholds);
  const [selectedRule, setSelectedRule] = useState<ApprovalRule | null>(null);
  const [showCreateRule, setShowCreateRule] = useState(false);
  const [activeTab, setActiveTab] = useState<'rules' | 'thresholds' | 'analytics'>('rules');

  // Only allow admins to access approval workflow management
  if (!hasAnyRole([UserRole.ADMIN])) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          No tienes permisos para acceder a la gestión de flujos de aprobación.
        </p>
      </div>
    );
  }

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

  const getCategoryColor = (category: ApprovalThreshold['category']) => {
    switch (category) {
      case 'payment':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'transfer':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'refund':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100';
      case 'withdrawal':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getCategoryLabel = (category: ApprovalThreshold['category']) => {
    switch (category) {
      case 'payment':
        return 'Pagos';
      case 'transfer':
        return 'Transferencias';
      case 'refund':
        return 'Reembolsos';
      case 'withdrawal':
        return 'Retiros';
      default:
        return 'Desconocido';
    }
  };

  const toggleRuleStatus = (ruleId: string) => {
    setRules(rules.map(rule => 
      rule.id === ruleId 
        ? { ...rule, enabled: !rule.enabled, updatedAt: new Date() }
        : rule
    ));
  };

  const toggleThresholdStatus = (thresholdId: string) => {
    setThresholds(thresholds.map(threshold => 
      threshold.id === thresholdId 
        ? { ...threshold, active: !threshold.active }
        : threshold
    ));
  };

  const deleteRule = (ruleId: string) => {
    if (confirm('¿Estás seguro de eliminar esta regla? Esta acción no se puede deshacer.')) {
      setRules(rules.filter(rule => rule.id !== ruleId));
    }
  };

  const workflowStats = {
    totalRules: rules.length,
    activeRules: rules.filter(r => r.enabled).length,
    totalThresholds: thresholds.length,
    activeThresholds: thresholds.filter(t => t.active).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Flujos de Aprobación
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Configura reglas y umbrales para aprobación de transacciones
          </p>
        </div>
        <button
          onClick={() => setShowCreateRule(true)}
          className="bg-mandala-primary text-white px-4 py-2 rounded-lg hover:bg-mandala-primary/90 transition-colors flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Nueva Regla</span>
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Reglas Totales</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {workflowStats.totalRules}
              </p>
            </div>
            <CogIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Reglas Activas</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {workflowStats.activeRules}
              </p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Umbrales</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {workflowStats.totalThresholds}
              </p>
            </div>
            <BanknotesIcon className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Umbrales Activos</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {workflowStats.activeThresholds}
              </p>
            </div>
            <ShieldCheckIcon className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'rules', name: 'Reglas de Aprobación', icon: CogIcon },
              { id: 'thresholds', name: 'Umbrales Rápidos', icon: BanknotesIcon },
              { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm',
                    activeTab === tab.id
                      ? 'border-mandala-primary text-mandala-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Rules Tab */}
        {activeTab === 'rules' && (
          <div className="p-6">
            <div className="space-y-4">
              {rules.map((rule) => (
                <div key={rule.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                  {/* Rule Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={cn(
                        'p-2 rounded-lg',
                        rule.enabled ? 'bg-green-100 dark:bg-green-900/20' : 'bg-gray-100 dark:bg-gray-900/20'
                      )}>
                        {rule.enabled ? (
                          <CheckCircleIcon className="h-6 w-6 text-green-600" />
                        ) : (
                          <XCircleIcon className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {rule.name}
                          </h3>
                          <span className={cn(
                            'px-2 py-1 text-xs font-medium rounded-full',
                            rule.enabled 
                              ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          )}>
                            {rule.enabled ? 'Activa' : 'Inactiva'}
                          </span>
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full dark:bg-blue-800 dark:text-blue-100">
                            Prioridad {rule.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {rule.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedRule(rule)}
                        className="text-gray-400 hover:text-mandala-primary"
                        title="Ver detalles"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      
                      <button
                        className="text-gray-400 hover:text-blue-600"
                        title="Editar regla"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      
                      <button
                        onClick={() => toggleRuleStatus(rule.id)}
                        className={cn(
                          'text-gray-400 hover:text-yellow-600',
                          rule.enabled ? 'hover:text-red-600' : 'hover:text-green-600'
                        )}
                        title={rule.enabled ? 'Desactivar' : 'Activar'}
                      >
                        {rule.enabled ? <XCircleIcon className="h-5 w-5" /> : <CheckCircleIcon className="h-5 w-5" />}
                      </button>
                      
                      <button
                        onClick={() => deleteRule(rule.id)}
                        className="text-gray-400 hover:text-red-600"
                        title="Eliminar regla"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Rule Conditions */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Rango de Monto</p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {formatCurrency(rule.conditions.amountMin)} - {formatCurrency(rule.conditions.amountMax)}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Roles Aplicables</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {rule.conditions.userRoles.map(role => (
                          <span key={role} className={cn('px-2 py-1 text-xs font-medium rounded-full', getRoleColor(role))}>
                            {getRoleLabel(role)}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Niveles de Aprobación</p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {rule.approvalLevels.length} nivel{rule.approvalLevels.length > 1 ? 'es' : ''}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Escalación</p>
                      <p className="text-sm text-gray-900 dark:text-white capitalize">
                        {rule.escalation.timeoutAction.replace('_', ' ')}
                      </p>
                    </div>
                  </div>

                  {/* Approval Levels Flow */}
                  <div className="mt-4">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">Flujo de Aprobación</p>
                    <div className="flex items-center space-x-2 overflow-x-auto">
                      {rule.approvalLevels.map((level, index) => (
                        <React.Fragment key={level.level}>
                          <div className="flex-shrink-0 bg-gray-50 dark:bg-gray-900 rounded-lg p-3 min-w-0">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-mandala-primary text-white rounded-full flex items-center justify-center text-xs font-medium">
                                {level.level}
                              </div>
                              <div>
                                <p className={cn('text-xs font-medium px-2 py-1 rounded-full', getRoleColor(level.requiredRole))}>
                                  {getRoleLabel(level.requiredRole)}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {level.requiredApprovers} aprobador{level.requiredApprovers > 1 ? 'es' : ''}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {level.timeoutHours}h timeout
                                </p>
                                {level.autoApprove && (
                                  <p className="text-xs text-green-600 font-medium">Auto-aprueba</p>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {index < rule.approvalLevels.length - 1 && (
                            <ArrowRightIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Thresholds Tab */}
        {activeTab === 'thresholds' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {thresholds.map((threshold) => (
                <div key={threshold.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-md font-medium text-gray-900 dark:text-white">
                          {threshold.name}
                        </h3>
                        <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getCategoryColor(threshold.category))}>
                          {getCategoryLabel(threshold.category)}
                        </span>
                      </div>
                      
                      <div className="mt-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Umbral:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formatCurrency(threshold.amount)} {threshold.currency}
                          </span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Aprobadores:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {threshold.requiredApprovers}
                          </span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Rol Requerido:</span>
                          <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getRoleColor(threshold.requiredRole))}>
                            {getRoleLabel(threshold.requiredRole)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Timeout:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {threshold.timeoutHours}h
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <span className={cn(
                        'px-2 py-1 text-xs font-medium rounded-full',
                        threshold.active 
                          ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      )}>
                        {threshold.active ? 'Activo' : 'Inactivo'}
                      </span>
                      
                      <div className="flex items-center space-x-1">
                        <button
                          className="text-gray-400 hover:text-blue-600"
                          title="Editar umbral"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => toggleThresholdStatus(threshold.id)}
                          className={cn(
                            'text-gray-400',
                            threshold.active ? 'hover:text-red-600' : 'hover:text-green-600'
                          )}
                          title={threshold.active ? 'Desactivar' : 'Activar'}
                        >
                          {threshold.active ? <XCircleIcon className="h-4 w-4" /> : <CheckCircleIcon className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="p-6">
            <div className="text-center py-12">
              <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Analytics de Aprobaciones
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Métricas detalladas sobre flujos de aprobación, tiempos de respuesta y patrones de uso.
              </p>
              <button className="bg-mandala-primary text-white px-4 py-2 rounded-lg hover:bg-mandala-primary/90 transition-colors">
                Próximamente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Rule Details Modal */}
      {selectedRule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Detalles de Regla: {selectedRule.name}
                </h3>
                <button
                  onClick={() => setSelectedRule(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Condiciones</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">Rango de Monto:</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(selectedRule.conditions.amountMin)} - {formatCurrency(selectedRule.conditions.amountMax)}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Roles Aplicables:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedRule.conditions.userRoles.map(role => (
                          <span key={role} className={cn('px-2 py-1 text-xs font-medium rounded-full', getRoleColor(role))}>
                            {getRoleLabel(role)}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Tipos de Venue:</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedRule.conditions.venueTypes.join(', ')}
                      </p>
                    </div>
                    {selectedRule.conditions.timeRestrictions && (
                      <div>
                        <span className="text-sm text-gray-500">Restricciones de Horario:</span>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {selectedRule.conditions.timeRestrictions.startHour}:00 - {selectedRule.conditions.timeRestrictions.endHour}:00
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Escalación</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">Acción de Timeout:</span>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">
                        {selectedRule.escalation.timeoutAction.replace('_', ' ')}
                      </p>
                    </div>
                    {selectedRule.escalation.escalateToRole && (
                      <div>
                        <span className="text-sm text-gray-500">Escalar a:</span>
                        <span className={cn('px-2 py-1 text-xs font-medium rounded-full ml-2', getRoleColor(selectedRule.escalation.escalateToRole))}>
                          {getRoleLabel(selectedRule.escalation.escalateToRole)}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="text-sm text-gray-500">Notificar a:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedRule.escalation.notifyRoles.map(role => (
                          <span key={role} className={cn('px-2 py-1 text-xs font-medium rounded-full', getRoleColor(role))}>
                            {getRoleLabel(role)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Niveles de Aprobación</h4>
                <div className="space-y-3">
                  {selectedRule.approvalLevels.map((level) => (
                    <div key={level.level} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <span className="text-sm text-gray-500">Nivel:</span>
                          <p className="font-medium text-gray-900 dark:text-white">{level.level}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Rol Requerido:</span>
                          <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getRoleColor(level.requiredRole))}>
                            {getRoleLabel(level.requiredRole)}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Aprobadores:</span>
                          <p className="font-medium text-gray-900 dark:text-white">{level.requiredApprovers}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Timeout:</span>
                          <p className="font-medium text-gray-900 dark:text-white">{level.timeoutHours}h</p>
                        </div>
                      </div>
                      {level.autoApprove && (
                        <div className="mt-2">
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full dark:bg-green-800 dark:text-green-100">
                            Auto-aprobación habilitada
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 