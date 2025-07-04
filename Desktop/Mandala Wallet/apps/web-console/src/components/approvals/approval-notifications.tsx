'use client';

import React, { useState, useEffect } from 'react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { UserRole } from '@mandala/shared-types';
import {
  BellIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  FireIcon,
  UserCircleIcon,
  ArrowRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface ApprovalNotification {
  id: string;
  type: 'new_approval' | 'approval_timeout' | 'approval_escalated' | 'approval_rejected' | 'approval_approved';
  title: string;
  message: string;
  transactionId: string;
  amount: number;
  currency: 'MXN' | 'USD';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  requesterName?: string;
  venueName?: string;
}

const mockNotifications: ApprovalNotification[] = [
  {
    id: '1',
    type: 'new_approval',
    title: 'Nueva Aprobación Requerida',
    message: 'Transacción VIP requiere tu aprobación inmediata',
    transactionId: 'TXN-2024-001234',
    amount: 45000,
    currency: 'MXN',
    priority: 'urgent',
    timestamp: new Date('2024-01-20T18:35:00Z'),
    read: false,
    actionUrl: '/dashboard/approvals',
    requesterName: 'Ana López',
    venueName: 'Mandala Beach Club',
  },
  {
    id: '2',
    type: 'approval_timeout',
    title: 'Aprobación Próxima a Vencer',
    message: 'Quedan 15 minutos para el vencimiento',
    transactionId: 'TXN-2024-001235',
    amount: 15000,
    currency: 'MXN',
    priority: 'high',
    timestamp: new Date('2024-01-20T17:30:00Z'),
    read: false,
    actionUrl: '/dashboard/approvals',
    requesterName: 'Carlos Rodriguez',
    venueName: 'Mandala Beach Club',
  },
  {
    id: '3',
    type: 'approval_escalated',
    title: 'Aprobación Escalada',
    message: 'Transacción escalada por timeout automático',
    transactionId: 'TXN-2024-001237',
    amount: 75000,
    currency: 'MXN',
    priority: 'urgent',
    timestamp: new Date('2024-01-20T11:15:00Z'),
    read: true,
    actionUrl: '/dashboard/approvals',
    requesterName: 'María González',
    venueName: 'Mandala Beach Club',
  },
  {
    id: '4',
    type: 'approval_approved',
    title: 'Aprobación Completada',
    message: 'Transacción aprobada exitosamente',
    transactionId: 'TXN-2024-001230',
    amount: 12000,
    currency: 'MXN',
    priority: 'medium',
    timestamp: new Date('2024-01-20T16:45:00Z'),
    read: true,
    actionUrl: '/dashboard/transactions/history',
    requesterName: 'Diego Fernández',
    venueName: 'Coco Bongo',
  },
];

export function ApprovalNotifications() {
  const { user, hasAnyRole } = useAuth();
  const [notifications, setNotifications] = useState<ApprovalNotification[]>(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // Filter notifications based on user role
  const filteredNotifications = notifications.filter(notification => {
    // Only show approval notifications to admins and venue managers
    return hasAnyRole([UserRole.ADMIN, UserRole.VENUE_MANAGER]);
  });

  const unreadCount = filteredNotifications.filter(n => !n.read).length;
  const urgentCount = filteredNotifications.filter(n => n.priority === 'urgent' && !n.read).length;

  const displayedNotifications = showAll 
    ? filteredNotifications 
    : filteredNotifications.slice(0, 5);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const getNotificationIcon = (type: ApprovalNotification['type']) => {
    switch (type) {
      case 'new_approval':
        return <BellIcon className="h-5 w-5 text-blue-500" />;
      case 'approval_timeout':
        return <ClockIcon className="h-5 w-5 text-orange-500" />;
      case 'approval_escalated':
        return <FireIcon className="h-5 w-5 text-red-500" />;
      case 'approval_approved':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'approval_rejected':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: ApprovalNotification['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
      case 'high':
        return 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low':
        return 'border-l-green-500 bg-green-50 dark:bg-green-900/20';
      default:
        return 'border-l-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  // Auto-refresh notifications every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real app, this would fetch from an API
      console.log('Refreshing approval notifications...');
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <BellIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
        
        {urgentCount > 0 && (
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Aprobaciones
              </h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-mandala-primary hover:text-mandala-primary/80"
                  >
                    Marcar todas como leídas
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {unreadCount > 0 && (
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {unreadCount} sin leer
                  </span>
                </div>
                
                {urgentCount > 0 && (
                  <div className="flex items-center space-x-1">
                    <FireIcon className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-600 dark:text-red-400">
                      {urgentCount} urgente{urgentCount > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {displayedNotifications.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <BellIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">
                  No hay notificaciones de aprobación
                </p>
              </div>
            ) : (
              <div className="py-2">
                {displayedNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      'px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors border-l-4 cursor-pointer',
                      getPriorityColor(notification.priority),
                      !notification.read && 'bg-blue-50 dark:bg-blue-900/20'
                    )}
                    onClick={() => {
                      markAsRead(notification.id);
                      if (notification.actionUrl) {
                        window.location.href = notification.actionUrl;
                      }
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={cn(
                            'text-sm font-medium',
                            notification.read 
                              ? 'text-gray-700 dark:text-gray-300' 
                              : 'text-gray-900 dark:text-white'
                          )}>
                            {notification.title}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>{notification.transactionId}</span>
                            <span>•</span>
                            <span>{formatCurrency(notification.amount)} {notification.currency}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>{formatDate(notification.timestamp)}</span>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                        
                        {(notification.requesterName || notification.venueName) && (
                          <div className="flex items-center space-x-2 mt-2">
                            <UserCircleIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {notification.requesterName}
                              {notification.venueName && ` - ${notification.venueName}`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {filteredNotifications.length > 5 && (
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="text-sm text-mandala-primary hover:text-mandala-primary/80"
                >
                  {showAll ? 'Mostrar menos' : `Ver todas (${filteredNotifications.length})`}
                </button>
                
                <a
                  href="/dashboard/approvals"
                  className="text-sm text-mandala-primary hover:text-mandala-primary/80 flex items-center space-x-1"
                  onClick={() => setIsOpen(false)}
                >
                  <span>Ir a Aprobaciones</span>
                  <ArrowRightIcon className="h-4 w-4" />
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 