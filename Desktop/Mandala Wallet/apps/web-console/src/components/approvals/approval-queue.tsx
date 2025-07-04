'use client';

import React, { useState } from 'react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { UserRole } from '@mandala/shared-types';
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  BanknotesIcon,
  UserCircleIcon,
  BuildingStorefrontIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ChatBubbleLeftIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  FireIcon,
  ShieldCheckIcon,
  BellIcon,
} from '@heroicons/react/24/outline';

interface PendingApproval {
  id: string;
  transactionId: string;
  type: 'payment' | 'transfer' | 'refund' | 'withdrawal';
  amount: number;
  currency: 'MXN' | 'USD';
  description: string;
  requester: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    profileImage?: string;
  };
  venue?: {
    id: string;
    name: string;
    type: string;
  };
  currentLevel: number;
  totalLevels: number;
  requiredRole: UserRole;
  requiredApprovers: number;
  currentApprovers: string[];
  status: 'pending' | 'approved' | 'rejected' | 'expired' | 'escalated';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  submittedAt: Date;
  deadline: Date;
  lastAction?: {
    userId: string;
    userName: string;
    action: 'approved' | 'rejected' | 'requested_info' | 'escalated';
    comment?: string;
    timestamp: Date;
  };
  ruleId: string;
  ruleName: string;
  metadata?: Record<string, any>;
}

const mockPendingApprovals: PendingApproval[] = [
  {
    id: '1',
    transactionId: 'TXN-2024-001234',
    type: 'payment',
    amount: 45000,
    currency: 'MXN',
    description: 'Pago VIP - Mesa Premium para 8 personas',
    requester: {
      id: 'u1',
      name: 'Ana López',
      email: 'ana.lopez@gmail.com',
      role: UserRole.CLIENT,
    },
    venue: {
      id: 'mandala-beach-club',
      name: 'Mandala Beach Club',
      type: 'beach_club',
    },
    currentLevel: 1,
    totalLevels: 2,
    requiredRole: UserRole.ADMIN,
    requiredApprovers: 2,
    currentApprovers: ['admin1'],
    status: 'pending',
    priority: 'high',
    submittedAt: new Date('2024-01-20T18:30:00Z'),
    deadline: new Date('2024-01-20T19:30:00Z'),
    ruleId: '2',
    ruleName: 'Transacciones VIP - Alta Prioridad',
    metadata: {
      tableNumber: '12',
      guestCount: 8,
      specialRequests: 'Champagne service',
    }
  },
  {
    id: '2',
    transactionId: 'TXN-2024-001235',
    type: 'transfer',
    amount: 15000,
    currency: 'MXN',
    description: 'Transferencia entre wallets - Reembolso cliente',
    requester: {
      id: 'u2',
      name: 'Carlos Rodriguez',
      email: 'carlos@mandalabeach.com',
      role: UserRole.VENUE_MANAGER,
    },
    venue: {
      id: 'mandala-beach-club',
      name: 'Mandala Beach Club',
      type: 'beach_club',
    },
    currentLevel: 1,
    totalLevels: 1,
    requiredRole: UserRole.VENUE_MANAGER,
    requiredApprovers: 1,
    currentApprovers: [],
    status: 'pending',
    priority: 'medium',
    submittedAt: new Date('2024-01-20T16:45:00Z'),
    deadline: new Date('2024-01-20T18:45:00Z'),
    lastAction: {
      userId: 'u3',
      userName: 'María González',
      action: 'requested_info',
      comment: 'Necesito más detalles sobre el motivo del reembolso',
      timestamp: new Date('2024-01-20T17:00:00Z'),
    },
    ruleId: '1',
    ruleName: 'Transacciones Grandes - Clientes',
  },
  {
    id: '3',
    transactionId: 'TXN-2024-001236',
    type: 'refund',
    amount: 8500,
    currency: 'MXN',
    description: 'Reembolso por cancelación de evento',
    requester: {
      id: 'u4',
      name: 'Roberto Martínez',
      email: 'roberto@example.com',
      role: UserRole.CLIENT,
    },
    venue: {
      id: 'coco-bongo',
      name: 'Coco Bongo',
      type: 'nightclub',
    },
    currentLevel: 1,
    totalLevels: 1,
    requiredRole: UserRole.VENUE_MANAGER,
    requiredApprovers: 1,
    currentApprovers: [],
    status: 'pending',
    priority: 'low',
    submittedAt: new Date('2024-01-20T14:20:00Z'),
    deadline: new Date('2024-01-20T18:20:00Z'),
    ruleId: '1',
    ruleName: 'Transacciones Grandes - Clientes',
  },
  {
    id: '4',
    transactionId: 'TXN-2024-001237',
    type: 'payment',
    amount: 75000,
    currency: 'MXN',
    description: 'Evento corporativo - Pago anticipado',
    requester: {
      id: 'u5',
      name: 'María González',
      email: 'maria@mandala.mx',
      role: UserRole.RP,
    },
    venue: {
      id: 'mandala-beach-club',
      name: 'Mandala Beach Club',
      type: 'beach_club',
    },
    currentLevel: 1,
    totalLevels: 2,
    requiredRole: UserRole.ADMIN,
    requiredApprovers: 2,
    currentApprovers: [],
    status: 'escalated',
    priority: 'urgent',
    submittedAt: new Date('2024-01-20T10:15:00Z'),
    deadline: new Date('2024-01-20T11:15:00Z'),
    ruleId: '2',
    ruleName: 'Transacciones VIP - Alta Prioridad',
    metadata: {
      corporateClient: 'Empresa ABC S.A.',
      eventDate: '2024-01-25',
      attendees: 150,
    }
  },
  {
    id: '5',
    transactionId: 'TXN-2024-001238',
    type: 'withdrawal',
    amount: 25000,
    currency: 'MXN',
    description: 'Retiro de fondos - Cierre de turno',
    requester: {
      id: 'u6',
      name: 'Luis Hernández',
      email: 'luis@lavaquita.com',
      role: UserRole.VENUE_MANAGER,
    },
    venue: {
      id: 'la-vaquita',
      name: 'La Vaquita',
      type: 'bar',
    },
    currentLevel: 2,
    totalLevels: 2,
    requiredRole: UserRole.ADMIN,
    requiredApprovers: 2,
    currentApprovers: ['admin1'],
    status: 'pending',
    priority: 'medium',
    submittedAt: new Date('2024-01-20T20:00:00Z'),
    deadline: new Date('2024-01-21T20:00:00Z'),
    ruleId: '4',
    ruleName: 'Retiros Grandes',
  }
];

export function ApprovalQueue() {
  const { user, hasAnyRole } = useAuth();
  const [approvals, setApprovals] = useState<PendingApproval[]>(mockPendingApprovals);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | PendingApproval['type']>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | PendingApproval['priority']>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | PendingApproval['status']>('all');
  const [selectedApproval, setSelectedApproval] = useState<PendingApproval | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalComment, setApprovalComment] = useState('');

  // Filter approvals based on user role
  const userCanApprove = (approval: PendingApproval): boolean => {
    if (!user) return false;
    
    // Check if user has the required role
    const hasRequiredRole = hasAnyRole([approval.requiredRole]) || 
                          (approval.requiredRole === UserRole.VENUE_MANAGER && hasAnyRole([UserRole.ADMIN]));
    
    // Check if user hasn't already approved
    const hasAlreadyApproved = approval.currentApprovers.includes(user.id);
    
    return hasRequiredRole && !hasAlreadyApproved && approval.status === 'pending';
  };

  const getTypeColor = (type: PendingApproval['type']) => {
    switch (type) {
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

  const getTypeLabel = (type: PendingApproval['type']) => {
    switch (type) {
      case 'payment':
        return 'Pago';
      case 'transfer':
        return 'Transferencia';
      case 'refund':
        return 'Reembolso';
      case 'withdrawal':
        return 'Retiro';
      default:
        return 'Desconocido';
    }
  };

  const getPriorityColor = (priority: PendingApproval['priority']) => {
    switch (priority) {
      case 'urgent':
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

  const getPriorityLabel = (priority: PendingApproval['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'Urgente';
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Media';
      case 'low':
        return 'Baja';
      default:
        return 'Desconocido';
    }
  };

  const getStatusColor = (status: PendingApproval['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      case 'expired':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'escalated':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: PendingApproval['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'approved':
        return 'Aprobado';
      case 'rejected':
        return 'Rechazado';
      case 'expired':
        return 'Expirado';
      case 'escalated':
        return 'Escalado';
      default:
        return 'Desconocido';
    }
  };

  const getTimeRemaining = (deadline: Date): { text: string; isUrgent: boolean } => {
    const now = new Date();
    const timeLeft = deadline.getTime() - now.getTime();
    
    if (timeLeft <= 0) {
      return { text: 'Expirado', isUrgent: true };
    }
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    const isUrgent = timeLeft <= 30 * 60 * 1000; // Less than 30 minutes
    
    if (hours > 0) {
      return { text: `${hours}h ${minutes}m`, isUrgent };
    } else {
      return { text: `${minutes}m`, isUrgent };
    }
  };

  const filteredApprovals = approvals.filter(approval => {
    const matchesSearch = approval.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         approval.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         approval.requester.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         approval.ruleName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || approval.type === filterType;
    const matchesPriority = filterPriority === 'all' || approval.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || approval.status === filterStatus;
    
    return matchesSearch && matchesType && matchesPriority && matchesStatus;
  });

  const handleApproval = (approvalId: string, action: 'approve' | 'reject', comment: string = '') => {
    setApprovals(approvals.map(approval => 
      approval.id === approvalId 
        ? { 
            ...approval, 
            status: action === 'approve' ? 'approved' : 'rejected',
            currentApprovers: action === 'approve' 
              ? [...approval.currentApprovers, user?.id || '']
              : approval.currentApprovers,
            lastAction: {
              userId: user?.id || '',
              userName: user?.name || '',
              action: action === 'approve' ? 'approved' : 'rejected',
              comment: comment || undefined,
              timestamp: new Date(),
            }
          }
        : approval
    ));
    
    setShowApprovalModal(false);
    setSelectedApproval(null);
    setApprovalComment('');
  };

  const queueStats = {
    total: approvals.length,
    pending: approvals.filter(a => a.status === 'pending').length,
    urgent: approvals.filter(a => a.priority === 'urgent' && a.status === 'pending').length,
    escalated: approvals.filter(a => a.status === 'escalated').length,
    myQueue: approvals.filter(a => userCanApprove(a)).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Cola de Aprobaciones
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Transacciones pendientes de aprobación
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {queueStats.urgent > 0 && (
            <div className="flex items-center space-x-1 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium dark:bg-red-800 dark:text-red-100">
              <FireIcon className="h-4 w-4" />
              <span>{queueStats.urgent} urgente{queueStats.urgent > 1 ? 's' : ''}</span>
            </div>
          )}
          <button className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2">
            <BellIcon className="h-5 w-5" />
            <span>Notificaciones</span>
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
                {queueStats.total}
              </p>
            </div>
            <ClockIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pendientes</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {queueStats.pending}
              </p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Urgentes</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {queueStats.urgent}
              </p>
            </div>
            <FireIcon className="h-8 w-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Escalados</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {queueStats.escalated}
              </p>
            </div>
            <ArrowRightIcon className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Mi Cola</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {queueStats.myQueue}
              </p>
            </div>
            <UserCircleIcon className="h-8 w-8 text-green-500" />
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
                placeholder="Buscar por ID, descripción, usuario..."
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
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="text-sm border-gray-300 rounded-md focus:ring-mandala-primary focus:border-mandala-primary dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="all">Todos los tipos</option>
              <option value="payment">Pagos</option>
              <option value="transfer">Transferencias</option>
              <option value="refund">Reembolsos</option>
              <option value="withdrawal">Retiros</option>
            </select>
            
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as any)}
              className="text-sm border-gray-300 rounded-md focus:ring-mandala-primary focus:border-mandala-primary dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="all">Todas las prioridades</option>
              <option value="urgent">Urgente</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="text-sm border-gray-300 rounded-md focus:ring-mandala-primary focus:border-mandala-primary dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="escalated">Escalados</option>
              <option value="approved">Aprobados</option>
              <option value="rejected">Rechazados</option>
              <option value="expired">Expirados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Approval Queue */}
      <div className="space-y-4">
        {filteredApprovals.map((approval) => {
          const timeRemaining = getTimeRemaining(approval.deadline);
          const canApprove = userCanApprove(approval);
          
          return (
            <div key={approval.id} className={cn(
              'bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow',
              approval.priority === 'urgent' && 'border-l-4 border-l-red-500',
              approval.status === 'escalated' && 'border-l-4 border-l-orange-500'
            )}>
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-mandala-primary/10 rounded-lg">
                    <BanknotesIcon className="h-6 w-6 text-mandala-primary" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {approval.description}
                      </h3>
                      <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getTypeColor(approval.type))}>
                        {getTypeLabel(approval.type)}
                      </span>
                      <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getPriorityColor(approval.priority))}>
                        {getPriorityLabel(approval.priority)}
                      </span>
                      {approval.priority === 'urgent' && (
                        <FireIcon className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>ID: {approval.transactionId}</span>
                      <span>•</span>
                      <span>{formatCurrency(approval.amount)} {approval.currency}</span>
                      <span>•</span>
                      <span>Regla: {approval.ruleName}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
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
                  
                  <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getStatusColor(approval.status))}>
                    {getStatusLabel(approval.status)}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Solicitante</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                      <UserCircleIcon className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{approval.requester.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{approval.requester.email}</p>
                    </div>
                  </div>
                </div>
                
                {approval.venue && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Venue</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <BuildingStorefrontIcon className="h-4 w-4 text-gray-500" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{approval.venue.name}</p>
                    </div>
                  </div>
                )}
                
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Nivel de Aprobación</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {approval.currentLevel} de {approval.totalLevels}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      ({approval.currentApprovers.length}/{approval.requiredApprovers} aprobadores)
                    </div>
                  </div>
                </div>
              </div>

              {/* Last Action */}
              {approval.lastAction && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <ChatBubbleLeftIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">{approval.lastAction.userName}</span>
                        {' '}
                        {approval.lastAction.action === 'approved' && 'aprobó'}
                        {approval.lastAction.action === 'rejected' && 'rechazó'}
                        {approval.lastAction.action === 'requested_info' && 'solicitó información'}
                        {approval.lastAction.action === 'escalated' && 'escaló'}
                        {' - '}
                        <span className="text-gray-500 dark:text-gray-400">
                          {formatDate(approval.lastAction.timestamp)}
                        </span>
                      </p>
                      {approval.lastAction.comment && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          "{approval.lastAction.comment}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedApproval(approval)}
                    className="text-gray-400 hover:text-mandala-primary"
                    title="Ver detalles"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                </div>
                
                {canApprove && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedApproval(approval);
                        setShowApprovalModal(true);
                      }}
                      className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-md hover:bg-green-200 dark:bg-green-800 dark:text-green-100"
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => {
                        setSelectedApproval(approval);
                        setShowApprovalModal(true);
                      }}
                      className="px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-md hover:bg-red-200 dark:bg-red-800 dark:text-red-100"
                    >
                      Rechazar
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredApprovals.length === 0 && (
        <div className="text-center py-12">
          <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No hay aprobaciones pendientes
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Todas las transacciones están procesadas o no hay transacciones que coincidan con los filtros.
          </p>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedApproval && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Procesar Aprobación
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Transacción:</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedApproval.description}</p>
                  <p className="text-sm text-gray-500">{selectedApproval.transactionId}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Monto:</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(selectedApproval.amount)} {selectedApproval.currency}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Comentario (opcional)
                  </label>
                  <textarea
                    value={approvalComment}
                    onChange={(e) => setApprovalComment(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mandala-primary focus:ring-mandala-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Agregar comentario sobre la decisión..."
                  />
                </div>
              </div>
              
              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={() => {
                    setShowApprovalModal(false);
                    setSelectedApproval(null);
                    setApprovalComment('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mandala-primary dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Cancelar
                </button>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleApproval(selectedApproval.id, 'reject', approvalComment)}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Rechazar
                  </button>
                  
                  <button
                    onClick={() => handleApproval(selectedApproval.id, 'approve', approvalComment)}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Aprobar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approval Details Modal */}
      {selectedApproval && !showApprovalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Detalles de Aprobación: {selectedApproval.transactionId}
                </h3>
                <button
                  onClick={() => setSelectedApproval(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Información de Transacción</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">ID:</span>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedApproval.transactionId}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Tipo:</span>
                      <span className={cn('px-2 py-1 text-xs font-medium rounded-full ml-2', getTypeColor(selectedApproval.type))}>
                        {getTypeLabel(selectedApproval.type)}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Monto:</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(selectedApproval.amount)} {selectedApproval.currency}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Descripción:</span>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedApproval.description}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Estado de Aprobación</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">Estado:</span>
                      <span className={cn('px-2 py-1 text-xs font-medium rounded-full ml-2', getStatusColor(selectedApproval.status))}>
                        {getStatusLabel(selectedApproval.status)}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Prioridad:</span>
                      <span className={cn('px-2 py-1 text-xs font-medium rounded-full ml-2', getPriorityColor(selectedApproval.priority))}>
                        {getPriorityLabel(selectedApproval.priority)}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Progreso:</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Nivel {selectedApproval.currentLevel} de {selectedApproval.totalLevels}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Tiempo restante:</span>
                      <p className={cn(
                        'font-medium',
                        getTimeRemaining(selectedApproval.deadline).isUrgent ? 'text-red-600' : 'text-gray-900 dark:text-white'
                      )}>
                        {getTimeRemaining(selectedApproval.deadline).text}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedApproval.metadata && Object.keys(selectedApproval.metadata).length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Información Adicional</h4>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    {Object.entries(selectedApproval.metadata).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm py-1">
                        <span className="text-gray-600 dark:text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="text-gray-900 dark:text-white">{String(value)}</span>
                      </div>
                    ))}
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