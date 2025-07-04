'use client';

import React, { useState } from 'react';
import { cn, formatCurrency } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { UserRole } from '@mandala/shared-types';
import {
  CogIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  UserGroupIcon,
  DocumentTextIcon,
  BoltIcon,
  ChartBarIcon,
  AdjustmentsHorizontalIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

interface WorkflowCondition {
  id: string;
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'between' | 'in' | 'contains';
  value: any;
  secondaryValue?: any;
  description: string;
}

interface WorkflowAction {
  id: string;
  type: 'route_to_level' | 'auto_approve' | 'auto_reject' | 'request_additional_info' | 'escalate' | 'notify';
  targetLevel?: number;
  targetRole?: UserRole;
  targetUsers?: string[];
  parameters?: Record<string, any>;
  description: string;
}

interface WorkflowRule {
  id: string;
  name: string;
  description: string;
  priority: number;
  enabled: boolean;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  matchType: 'all' | 'any'; // All conditions must match or any condition matches
  createdAt: Date;
  updatedAt: Date;
  usage: {
    totalMatches: number;
    successRate: number;
    averageProcessingTime: number;
    lastUsed?: Date;
  };
}

interface RoutingDecision {
  ruleId: string;
  ruleName: string;
  matched: boolean;
  conditions: Array<{
    conditionId: string;
    matched: boolean;
    reason: string;
  }>;
  actions: WorkflowAction[];
  confidence: number;
  processingTime: number;
}

const mockWorkflowRules: WorkflowRule[] = [
  {
    id: 'rule-1',
    name: 'Transacciones VIP Automáticas',
    description: 'Auto-aprueba transacciones VIP menores a $20,000 de clientes Gold/Black',
    priority: 1,
    enabled: true,
    matchType: 'all',
    conditions: [
      {
        id: 'cond-1',
        field: 'amount',
        operator: 'less_than',
        value: 20000,
        description: 'Monto menor a $20,000 MXN'
      },
      {
        id: 'cond-2',
        field: 'userTier',
        operator: 'in',
        value: ['gold', 'black'],
        description: 'Cliente Gold o Black tier'
      },
      {
        id: 'cond-3',
        field: 'venueType',
        operator: 'equals',
        value: 'beach_club',
        description: 'Venue tipo Beach Club'
      }
    ],
    actions: [
      {
        id: 'action-1',
        type: 'auto_approve',
        description: 'Aprobación automática para clientes VIP'
      }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    usage: {
      totalMatches: 245,
      successRate: 98.8,
      averageProcessingTime: 0.5,
      lastUsed: new Date('2024-01-20T16:30:00Z')
    }
  },
  {
    id: 'rule-2',
    name: 'Escalación Nocturna',
    description: 'Escala transacciones nocturnas (2AM-6AM) superiores a $5,000 directamente a Admin',
    priority: 2,
    enabled: true,
    matchType: 'all',
    conditions: [
      {
        id: 'cond-4',
        field: 'amount',
        operator: 'greater_than',
        value: 5000,
        description: 'Monto mayor a $5,000 MXN'
      },
      {
        id: 'cond-5',
        field: 'timeOfDay',
        operator: 'between',
        value: 2,
        secondaryValue: 6,
        description: 'Horario nocturno (2AM - 6AM)'
      }
    ],
    actions: [
      {
        id: 'action-2',
        type: 'escalate',
        targetLevel: 2,
        targetRole: UserRole.ADMIN,
        description: 'Escalar directamente a Admin'
      },
      {
        id: 'action-3',
        type: 'notify',
        targetUsers: ['admin1', 'admin2'],
        description: 'Notificar a administradores de guardia'
      }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-10'),
    usage: {
      totalMatches: 67,
      successRate: 95.5,
      averageProcessingTime: 1.2,
      lastUsed: new Date('2024-01-19T03:45:00Z')
    }
  },
  {
    id: 'rule-3',
    name: 'Validación Adicional Corporativa',
    description: 'Solicita información adicional para eventos corporativos superiores a $50,000',
    priority: 3,
    enabled: true,
    matchType: 'all',
    conditions: [
      {
        id: 'cond-6',
        field: 'amount',
        operator: 'greater_than',
        value: 50000,
        description: 'Monto mayor a $50,000 MXN'
      },
      {
        id: 'cond-7',
        field: 'eventType',
        operator: 'equals',
        value: 'corporate',
        description: 'Evento corporativo'
      }
    ],
    actions: [
      {
        id: 'action-4',
        type: 'request_additional_info',
        parameters: {
          requiredFields: ['corporateId', 'eventDetails', 'attendeeCount', 'contactPerson'],
          timeoutHours: 24
        },
        description: 'Solicitar información corporativa adicional'
      }
    ],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-12'),
    usage: {
      totalMatches: 15,
      successRate: 86.7,
      averageProcessingTime: 18.5,
      lastUsed: new Date('2024-01-18T11:20:00Z')
    }
  },
  {
    id: 'rule-4',
    name: 'Rechazo Automático Sospechoso',
    description: 'Auto-rechaza transacciones de usuarios con múltiples rechazos recientes',
    priority: 0, // Highest priority
    enabled: false, // Disabled for safety
    matchType: 'any',
    conditions: [
      {
        id: 'cond-8',
        field: 'userRejectionCount7d',
        operator: 'greater_than',
        value: 3,
        description: 'Más de 3 rechazos en 7 días'
      },
      {
        id: 'cond-9',
        field: 'suspiciousActivity',
        operator: 'equals',
        value: true,
        description: 'Actividad marcada como sospechosa'
      }
    ],
    actions: [
      {
        id: 'action-5',
        type: 'auto_reject',
        description: 'Rechazo automático por actividad sospechosa'
      },
      {
        id: 'action-6',
        type: 'notify',
        targetRole: UserRole.ADMIN,
        description: 'Notificar a seguridad'
      }
    ],
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-18'),
    usage: {
      totalMatches: 3,
      successRate: 100,
      averageProcessingTime: 0.1,
      lastUsed: new Date('2024-01-17T22:15:00Z')
    }
  }
];

export function EnhancedWorkflowRouter() {
  const { hasAnyRole } = useAuth();
  const [rules, setRules] = useState<WorkflowRule[]>(mockWorkflowRules);
  const [selectedRule, setSelectedRule] = useState<WorkflowRule | null>(null);
  const [testData, setTestData] = useState({
    amount: 15000,
    userTier: 'gold',
    venueType: 'beach_club',
    eventType: 'regular',
    timeOfDay: 14,
    userRejectionCount7d: 0,
    suspiciousActivity: false
  });
  const [testResults, setTestResults] = useState<RoutingDecision[]>([]);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showRuleEditor, setShowRuleEditor] = useState(false);

  // Only allow admins to access workflow routing
  if (!hasAnyRole([UserRole.ADMIN])) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          No tienes permisos para acceder al enrutador de flujos de trabajo.
        </p>
      </div>
    );
  }

  const toggleRule = (ruleId: string) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const deleteRule = (ruleId: string) => {
    if (confirm('¿Estás seguro de eliminar esta regla? Esta acción no se puede deshacer.')) {
      setRules(rules.filter(rule => rule.id !== ruleId));
    }
  };

  const testWorkflowRouting = () => {
    const decisions: RoutingDecision[] = [];
    const startTime = performance.now();

    // Sort rules by priority (highest first)
    const sortedRules = [...rules]
      .filter(rule => rule.enabled)
      .sort((a, b) => a.priority - b.priority);

    for (const rule of sortedRules) {
      const ruleStartTime = performance.now();
      const conditionResults = rule.conditions.map(condition => ({
        conditionId: condition.id,
        matched: evaluateCondition(condition, testData),
        reason: `${condition.description}: ${evaluateCondition(condition, testData) ? 'Cumple' : 'No cumple'}`
      }));

      const matched = rule.matchType === 'all' 
        ? conditionResults.every(c => c.matched)
        : conditionResults.some(c => c.matched);

      const processingTime = performance.now() - ruleStartTime;
      const confidence = matched ? calculateConfidence(rule, testData) : 0;

      decisions.push({
        ruleId: rule.id,
        ruleName: rule.name,
        matched,
        conditions: conditionResults,
        actions: matched ? rule.actions : [],
        confidence,
        processingTime
      });

      // If a rule matches and has high confidence, stop processing (first match wins)
      if (matched && confidence > 0.8) {
        break;
      }
    }

    setTestResults(decisions);
  };

  const evaluateCondition = (condition: WorkflowCondition, data: any): boolean => {
    const fieldValue = data[condition.field];
    const { operator, value, secondaryValue } = condition;

    switch (operator) {
      case 'equals':
        return fieldValue === value;
      case 'not_equals':
        return fieldValue !== value;
      case 'greater_than':
        return fieldValue > value;
      case 'less_than':
        return fieldValue < value;
      case 'between':
        return fieldValue >= value && fieldValue <= secondaryValue;
      case 'in':
        return Array.isArray(value) && value.includes(fieldValue);
      case 'contains':
        return String(fieldValue).toLowerCase().includes(String(value).toLowerCase());
      default:
        return false;
    }
  };

  const calculateConfidence = (rule: WorkflowRule, data: any): number => {
    // Simple confidence calculation based on rule usage and condition specificity
    const baseConfidence = rule.usage.successRate / 100;
    const usageBonus = Math.min(rule.usage.totalMatches / 100, 0.2);
    const specificityBonus = rule.conditions.length * 0.1;
    
    return Math.min(baseConfidence + usageBonus + specificityBonus, 1.0);
  };

  const getActionColor = (actionType: WorkflowAction['type']) => {
    switch (actionType) {
      case 'auto_approve':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'auto_reject':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      case 'escalate':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100';
      case 'route_to_level':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'request_additional_info':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'notify':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getActionLabel = (actionType: WorkflowAction['type']) => {
    switch (actionType) {
      case 'auto_approve':
        return 'Auto-Aprobar';
      case 'auto_reject':
        return 'Auto-Rechazar';
      case 'escalate':
        return 'Escalar';
      case 'route_to_level':
        return 'Enrutar';
      case 'request_additional_info':
        return 'Solicitar Info';
      case 'notify':
        return 'Notificar';
      default:
        return 'Desconocido';
    }
  };

  const routerStats = {
    totalRules: rules.length,
    activeRules: rules.filter(r => r.enabled).length,
    totalMatches: rules.reduce((sum, rule) => sum + rule.usage.totalMatches, 0),
    averageSuccessRate: rules.reduce((sum, rule) => sum + rule.usage.successRate, 0) / rules.length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Enrutador de Flujos Avanzado
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Configura reglas inteligentes de enrutamiento y automatización
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowTestModal(true)}
            className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors flex items-center space-x-2"
          >
            <BoltIcon className="h-5 w-5" />
            <span>Probar Reglas</span>
          </button>
          <button
            onClick={() => setShowRuleEditor(true)}
            className="bg-mandala-primary text-white px-4 py-2 rounded-lg hover:bg-mandala-primary/90 transition-colors flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Nueva Regla</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Reglas Totales</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {routerStats.totalRules}
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
                {routerStats.activeRules}
              </p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Coincidencias</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {routerStats.totalMatches.toLocaleString()}
              </p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tasa de Éxito</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {routerStats.averageSuccessRate.toFixed(1)}%
              </p>
            </div>
            <ArrowPathIcon className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Rules List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Reglas de Enrutamiento
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Procesadas en orden de prioridad (menor número = mayor prioridad)
          </p>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {rules
              .sort((a, b) => a.priority - b.priority)
              .map((rule) => (
                <div key={rule.id} className={cn(
                  'border border-gray-200 dark:border-gray-700 rounded-lg p-6 transition-colors',
                  rule.enabled 
                    ? 'hover:bg-gray-50 dark:hover:bg-gray-900' 
                    : 'opacity-60 bg-gray-50 dark:bg-gray-900/50'
                )}>
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
                          <PauseIcon className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {rule.name}
                          </h3>
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full dark:bg-blue-800 dark:text-blue-100">
                            Prioridad {rule.priority}
                          </span>
                          <span className={cn(
                            'px-2 py-1 text-xs font-medium rounded-full',
                            rule.enabled 
                              ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          )}>
                            {rule.enabled ? 'Activa' : 'Pausada'}
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
                        onClick={() => toggleRule(rule.id)}
                        className={cn(
                          'text-gray-400',
                          rule.enabled ? 'hover:text-orange-600' : 'hover:text-green-600'
                        )}
                        title={rule.enabled ? 'Pausar' : 'Activar'}
                      >
                        {rule.enabled ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
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

                  {/* Conditions Summary */}
                  <div className="mt-4">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                      Condiciones ({rule.matchType === 'all' ? 'TODAS' : 'CUALQUIERA'})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {rule.conditions.map((condition) => (
                        <span key={condition.id} className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded dark:bg-blue-900/20 dark:text-blue-300">
                          {condition.description}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Summary */}
                  <div className="mt-4">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">Acciones</p>
                    <div className="flex flex-wrap gap-2">
                      {rule.actions.map((action) => (
                        <span key={action.id} className={cn('px-2 py-1 text-xs font-medium rounded', getActionColor(action.type))}>
                          {getActionLabel(action.type)}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Usage Stats */}
                  <div className="mt-4 grid grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Coincidencias</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {rule.usage.totalMatches.toLocaleString()}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Tasa de Éxito</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {rule.usage.successRate.toFixed(1)}%
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Tiempo Promedio</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {rule.usage.averageProcessingTime.toFixed(1)}s
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Último Uso</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {rule.usage.lastUsed ? rule.usage.lastUsed.toLocaleDateString() : 'Nunca'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Test Modal */}
      {showTestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Probar Enrutamiento de Flujos
                </h3>
                <button
                  onClick={() => setShowTestModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Test Data Input */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Datos de Prueba</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Monto (MXN)
                    </label>
                    <input
                      type="number"
                      value={testData.amount}
                      onChange={(e) => setTestData({...testData, amount: parseInt(e.target.value)})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mandala-primary focus:ring-mandala-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tier de Usuario
                    </label>
                    <select
                      value={testData.userTier}
                      onChange={(e) => setTestData({...testData, userTier: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mandala-primary focus:ring-mandala-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                    >
                      <option value="bronze">Bronze</option>
                      <option value="silver">Silver</option>
                      <option value="gold">Gold</option>
                      <option value="black">Black</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tipo de Venue
                    </label>
                    <select
                      value={testData.venueType}
                      onChange={(e) => setTestData({...testData, venueType: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mandala-primary focus:ring-mandala-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                    >
                      <option value="beach_club">Beach Club</option>
                      <option value="nightclub">Nightclub</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="bar">Bar</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Hora del Día (0-23)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={testData.timeOfDay}
                      onChange={(e) => setTestData({...testData, timeOfDay: parseInt(e.target.value)})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mandala-primary focus:ring-mandala-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={testWorkflowRouting}
                    className="bg-mandala-primary text-white px-4 py-2 rounded-lg hover:bg-mandala-primary/90 transition-colors flex items-center space-x-2"
                  >
                    <BoltIcon className="h-5 w-5" />
                    <span>Ejecutar Prueba</span>
                  </button>
                </div>
              </div>

              {/* Test Results */}
              {testResults.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Resultados del Enrutamiento</h4>
                  <div className="space-y-4">
                    {testResults.map((result, index) => (
                      <div key={result.ruleId} className={cn(
                        'border rounded-lg p-4',
                        result.matched 
                          ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                          : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50'
                      )}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={cn(
                              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                              result.matched 
                                ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                            )}>
                              {index + 1}
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 dark:text-white">
                                {result.ruleName}
                              </h5>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Confianza: {(result.confidence * 100).toFixed(1)}% | 
                                Tiempo: {result.processingTime.toFixed(2)}ms
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {result.matched ? (
                              <CheckCircleIcon className="h-6 w-6 text-green-600" />
                            ) : (
                              <XCircleIcon className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                        </div>
                        
                        {result.matched && result.actions.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {result.actions.map((action, actionIndex) => (
                              <span key={actionIndex} className={cn('px-2 py-1 text-xs font-medium rounded', getActionColor(action.type))}>
                                {getActionLabel(action.type)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
                    {selectedRule.conditions.map((condition) => (
                      <div key={condition.id} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {condition.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {condition.field} {condition.operator} {condition.value}
                          {condition.secondaryValue && ` - ${condition.secondaryValue}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Acciones</h4>
                  <div className="space-y-3">
                    {selectedRule.actions.map((action) => (
                      <div key={action.id} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <span className={cn('px-2 py-1 text-xs font-medium rounded', getActionColor(action.type))}>
                            {getActionLabel(action.type)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {action.description}
                        </p>
                        {action.parameters && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Parámetros: {JSON.stringify(action.parameters)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Estadísticas de Uso</h4>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-mandala-primary">
                        {selectedRule.usage.totalMatches}
                      </p>
                      <p className="text-sm text-gray-500">Coincidencias</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-mandala-primary">
                        {selectedRule.usage.successRate.toFixed(1)}%
                      </p>
                      <p className="text-sm text-gray-500">Tasa de Éxito</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-mandala-primary">
                        {selectedRule.usage.averageProcessingTime.toFixed(1)}s
                      </p>
                      <p className="text-sm text-gray-500">Tiempo Promedio</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedRule.usage.lastUsed ? selectedRule.usage.lastUsed.toLocaleDateString() : 'Nunca'}
                      </p>
                      <p className="text-sm text-gray-500">Último Uso</p>
                    </div>
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