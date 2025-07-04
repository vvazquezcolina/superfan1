'use client';

import React, { useState } from 'react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { UserRole } from '@mandala/shared-types';
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChartBarIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  UserCircleIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  CogIcon,
  FireIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

interface AuditRecord {
  id: string;
  action: string;
  performedBy: string;
  performedAt: Date;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  changeType: 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'escalate' | 'delegate';
  requestId?: string;
  transactionId?: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
}

interface ComplianceIssue {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedRequests: string[];
  detectedAt: Date;
  resolved: boolean;
  recommendedAction: string;
}

const mockAuditRecords: AuditRecord[] = [
  {
    id: 'audit-1',
    action: 'Transacción Aprobada',
    performedBy: 'Carlos Mendoza',
    performedAt: new Date('2024-01-20T18:45:00Z'),
    details: {
      requestId: 'APR-001234',
      transactionId: 'TXN-2024-001234',
      amount: 45000,
      currency: 'MXN',
      level: 2,
      comment: 'Aprobado - Cliente VIP verificado',
      userRole: 'ADMIN'
    },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    changeType: 'approve',
    requestId: 'APR-001234',
    transactionId: 'TXN-2024-001234',
    impact: 'high'
  },
  {
    id: 'audit-2',
    action: 'Delegación Creada',
    performedBy: 'Ana García',
    performedAt: new Date('2024-01-20T16:30:00Z'),
    details: {
      delegationId: 'DEL-001',
      fromUser: 'Ana García',
      toUser: 'Luis Hernández',
      maxAmount: 25000,
      duration: '2 días',
      reason: 'Cobertura de fin de semana'
    },
    ipAddress: '192.168.1.105',
    changeType: 'delegate',
    impact: 'medium'
  },
  {
    id: 'audit-3',
    action: 'Transacción Rechazada',
    performedBy: 'María González',
    performedAt: new Date('2024-01-20T14:15:00Z'),
    details: {
      requestId: 'APR-001235',
      transactionId: 'TXN-2024-001235',
      amount: 8500,
      currency: 'MXN',
      level: 1,
      comment: 'Documentación insuficiente - solicitar información adicional',
      userRole: 'VENUE_MANAGER'
    },
    ipAddress: '192.168.1.102',
    changeType: 'reject',
    requestId: 'APR-001235',
    transactionId: 'TXN-2024-001235',
    impact: 'low'
  },
  {
    id: 'audit-4',
    action: 'Escalación Automática',
    performedBy: 'Sistema',
    performedAt: new Date('2024-01-20T11:20:00Z'),
    details: {
      requestId: 'APR-001237',
      transactionId: 'TXN-2024-001237',
      amount: 75000,
      currency: 'MXN',
      fromLevel: 1,
      toLevel: 2,
      reason: 'Timeout - No respuesta en 1 hora',
      triggerRule: 'Transacciones VIP - Alta Prioridad'
    },
    ipAddress: 'system',
    changeType: 'escalate',
    requestId: 'APR-001237',
    transactionId: 'TXN-2024-001237',
    impact: 'critical'
  },
  {
    id: 'audit-5',
    action: 'Regla de Flujo Modificada',
    performedBy: 'Carlos Mendoza',
    performedAt: new Date('2024-01-19T20:30:00Z'),
    details: {
      ruleId: 'rule-1',
      ruleName: 'Transacciones VIP Automáticas',
      changes: {
        maxAmount: { from: 15000, to: 20000 },
        enabled: { from: false, to: true }
      },
      impact: 'Affects future VIP transactions'
    },
    ipAddress: '192.168.1.100',
    changeType: 'update',
    impact: 'high'
  }
];

const mockComplianceIssues: ComplianceIssue[] = [
  {
    id: 'comp-1',
    type: 'after_hours_approval',
    severity: 'medium',
    description: 'Aprobaciones fuera de horario laboral sin autorización especial',
    affectedRequests: ['APR-001234', 'APR-001238'],
    detectedAt: new Date('2024-01-20T22:15:00Z'),
    resolved: false,
    recommendedAction: 'Implementar controles adicionales para aprobaciones nocturnas'
  },
  {
    id: 'comp-2',
    type: 'rapid_sequential_approvals',
    severity: 'high',
    description: 'Usuario procesó múltiples aprobaciones en menos de 30 segundos',
    affectedRequests: ['APR-001240', 'APR-001241', 'APR-001242'],
    detectedAt: new Date('2024-01-20T15:45:00Z'),
    resolved: true,
    recommendedAction: 'Revisar proceso de aprobación del usuario y considerar entrenamiento'
  }
];

export function ApprovalHistory() {
  const { hasAnyRole } = useAuth();
  const [auditRecords] = useState<AuditRecord[]>(mockAuditRecords);
  const [complianceIssues] = useState<ComplianceIssue[]>(mockComplianceIssues);
  const [selectedRecord, setSelectedRecord] = useState<AuditRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'audit' | 'compliance' | 'analytics' | 'reports'>('audit');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState<'all' | AuditRecord['changeType']>('all');
  const [filterImpact, setFilterImpact] = useState<'all' | AuditRecord['impact']>('all');
  const [dateRange, setDateRange] = useState({
    start: new Date('2024-01-19'),
    end: new Date('2024-01-21')
  });

  // Only allow admins to access full audit history
  if (!hasAnyRole([UserRole.ADMIN])) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          No tienes permisos para acceder al historial completo de aprobaciones.
        </p>
      </div>
    );
  }

  const getActionColor = (changeType: AuditRecord['changeType']) => {
    switch (changeType) {
      case 'approve':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'reject':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      case 'escalate':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100';
      case 'delegate':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100';
      case 'create':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'update':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'delete':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getImpactColor = (impact: AuditRecord['impact']) => {
    switch (impact) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getSeverityColor = (severity: ComplianceIssue['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const filteredRecords = auditRecords.filter(record => {
    const matchesSearch = record.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.details.comment?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = filterAction === 'all' || record.changeType === filterAction;
    const matchesImpact = filterImpact === 'all' || record.impact === filterImpact;
    const matchesDate = record.performedAt >= dateRange.start && record.performedAt <= dateRange.end;
    
    return matchesSearch && matchesAction && matchesImpact && matchesDate;
  });

  const auditStats = {
    totalRecords: auditRecords.length,
    approvals: auditRecords.filter(r => r.changeType === 'approve').length,
    rejections: auditRecords.filter(r => r.changeType === 'reject').length,
    escalations: auditRecords.filter(r => r.changeType === 'escalate').length,
    criticalIssues: complianceIssues.filter(i => i.severity === 'critical' && !i.resolved).length,
  };

  const exportAuditData = (format: 'json' | 'csv' | 'pdf') => {
    // Implementation for exporting audit data
    console.log(`Exporting audit data in ${format} format...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Historial y Auditoría
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Registro completo de actividad y análisis de compliance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => exportAuditData('csv')}
            className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-4 py-2 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors flex items-center space-x-2"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            <span>Exportar CSV</span>
          </button>
          <button className="bg-mandala-primary text-white px-4 py-2 rounded-lg hover:bg-mandala-primary/90 transition-colors flex items-center space-x-2">
            <DocumentTextIcon className="h-5 w-5" />
            <span>Generar Reporte</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Registros</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {auditStats.totalRecords}
              </p>
            </div>
            <DocumentTextIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Aprobaciones</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {auditStats.approvals}
              </p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rechazos</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {auditStats.rejections}
              </p>
            </div>
            <XCircleIcon className="h-8 w-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Escalaciones</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {auditStats.escalations}
              </p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Issues Críticos</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {auditStats.criticalIssues}
              </p>
            </div>
            <FireIcon className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'audit', name: 'Registro de Auditoría', icon: DocumentTextIcon },
              { id: 'compliance', name: 'Compliance', icon: ShieldCheckIcon },
              { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
              { id: 'reports', name: 'Reportes', icon: DocumentTextIcon },
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

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'audit' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
                  <div className="flex-1">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Buscar por acción, usuario o comentario..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-mandala-primary focus:border-mandala-primary sm:text-sm"
                      />
                    </div>
                  </div>
                  
                  <select
                    value={filterAction}
                    onChange={(e) => setFilterAction(e.target.value as any)}
                    className="text-sm border-gray-300 rounded-md focus:ring-mandala-primary focus:border-mandala-primary dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="all">Todas las acciones</option>
                    <option value="approve">Aprobaciones</option>
                    <option value="reject">Rechazos</option>
                    <option value="escalate">Escalaciones</option>
                    <option value="delegate">Delegaciones</option>
                    <option value="create">Creaciones</option>
                    <option value="update">Actualizaciones</option>
                  </select>
                  
                  <select
                    value={filterImpact}
                    onChange={(e) => setFilterImpact(e.target.value as any)}
                    className="text-sm border-gray-300 rounded-md focus:ring-mandala-primary focus:border-mandala-primary dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="all">Todos los impactos</option>
                    <option value="critical">Crítico</option>
                    <option value="high">Alto</option>
                    <option value="medium">Medio</option>
                    <option value="low">Bajo</option>
                  </select>
                </div>
              </div>

              {/* Audit Records */}
              <div className="space-y-4">
                {filteredRecords.map((record) => (
                  <div key={record.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-mandala-primary/10 rounded-lg">
                          <ClockIcon className="h-6 w-6 text-mandala-primary" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {record.action}
                            </h3>
                            <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getActionColor(record.changeType))}>
                              {record.changeType}
                            </span>
                            <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getImpactColor(record.impact))}>
                              {record.impact}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <UserCircleIcon className="h-4 w-4" />
                              <span>{record.performedBy}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                              <CalendarDaysIcon className="h-4 w-4" />
                              <span>{formatDate(record.performedAt)}</span>
                            </div>
                            {record.ipAddress && record.ipAddress !== 'system' && (
                              <>
                                <span>•</span>
                                <span>IP: {record.ipAddress}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setSelectedRecord(record)}
                        className="text-gray-400 hover:text-mandala-primary"
                        title="Ver detalles"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Details Preview */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {record.requestId && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Request ID</p>
                          <p className="text-sm text-gray-900 dark:text-white">{record.requestId}</p>
                        </div>
                      )}
                      
                      {record.details.amount && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Monto</p>
                          <p className="text-sm text-gray-900 dark:text-white">
                            {formatCurrency(record.details.amount)} {record.details.currency}
                          </p>
                        </div>
                      )}
                      
                      {record.details.comment && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Comentario</p>
                          <p className="text-sm text-gray-900 dark:text-white truncate">
                            {record.details.comment}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-6">
              <div className="text-center py-12">
                <ShieldCheckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Análisis de Compliance
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Detección automática de violaciones y anomalías en el proceso de aprobación.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    • Detección de auto-aprobaciones
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    • Análisis de patrones sospechosos
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    • Monitoreo de actividad fuera de horario
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    • Validación de delegaciones
                  </p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Funcionalidad próximamente disponible
                </p>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="text-center py-12">
                <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Analytics Avanzado
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Métricas detalladas y análisis de tendencias del sistema de aprobaciones.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    • Tiempo promedio de aprobación por nivel
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    • Análisis de rendimiento por usuario
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    • Patrones de escalación y delegación
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    • Predicción de carga de trabajo
                  </p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Funcionalidad próximamente disponible
                </p>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="text-center py-12">
                <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Generación de Reportes
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Reportes automatizados para auditoría, compliance y análisis ejecutivo.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    • Reportes diarios/semanales/mensuales
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    • Exportación en múltiples formatos
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    • Distribución automática por email
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    • Templates personalizables
                  </p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Funcionalidad próximamente disponible
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Record Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Detalles del Registro de Auditoría
                </h3>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Información Básica</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">ID:</span>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedRecord.id}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Acción:</span>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedRecord.action}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Realizada por:</span>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedRecord.performedBy}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Fecha y Hora:</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedRecord.performedAt.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Tipo de Cambio:</span>
                      <span className={cn('px-2 py-1 text-xs font-medium rounded-full ml-2', getActionColor(selectedRecord.changeType))}>
                        {selectedRecord.changeType}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Impacto:</span>
                      <span className={cn('px-2 py-1 text-xs font-medium rounded-full ml-2', getImpactColor(selectedRecord.impact))}>
                        {selectedRecord.impact}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Información Técnica</h4>
                  <div className="space-y-3">
                    {selectedRecord.ipAddress && (
                      <div>
                        <span className="text-sm text-gray-500">Dirección IP:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedRecord.ipAddress}</p>
                      </div>
                    )}
                    {selectedRecord.userAgent && (
                      <div>
                        <span className="text-sm text-gray-500">User Agent:</span>
                        <p className="font-medium text-gray-900 dark:text-white text-xs break-all">
                          {selectedRecord.userAgent}
                        </p>
                      </div>
                    )}
                    {selectedRecord.requestId && (
                      <div>
                        <span className="text-sm text-gray-500">Request ID:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedRecord.requestId}</p>
                      </div>
                    )}
                    {selectedRecord.transactionId && (
                      <div>
                        <span className="text-sm text-gray-500">Transaction ID:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedRecord.transactionId}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Detalles Adicionales</h4>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {JSON.stringify(selectedRecord.details, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 