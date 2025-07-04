'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ApprovalWorkflow } from '@/components/approvals/approval-workflow';
import { ApprovalQueue } from '@/components/approvals/approval-queue';
import { DelegationManagement } from '@/components/approvals/delegation-management';
import { EnhancedWorkflowRouter } from '@/components/approvals/enhanced-workflow-router';
import { ApprovalHistory } from '@/components/approvals/approval-history';
import {
  CogIcon,
  ClockIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

export default function ApprovalsPage() {
  const [activeTab, setActiveTab] = useState<'queue' | 'workflow' | 'delegation' | 'router' | 'history'>('queue');

  const tabs = [
    {
      id: 'queue',
      name: 'Cola de Aprobaciones',
      icon: ClockIcon,
      description: 'Transacciones pendientes de aprobación',
    },
    {
      id: 'workflow',
      name: 'Configuración de Flujos',
      icon: CogIcon,
      description: 'Gestión de reglas y umbrales',
    },
    {
      id: 'delegation',
      name: 'Delegaciones',
      icon: UserGroupIcon,
      description: 'Gestión de delegaciones de autoridad',
    },
    {
      id: 'router',
      name: 'Enrutador Avanzado',
      icon: ArrowPathIcon,
      description: 'Reglas inteligentes de enrutamiento',
    },
    {
      id: 'history',
      name: 'Historial',
      icon: ClipboardDocumentCheckIcon,
      description: 'Registro de decisiones de aprobación',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Sistema de Aprobaciones Multi-Nivel
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Gestiona flujos de aprobación avanzados, delegaciones y enrutamiento inteligente
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
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
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'queue' && (
            <div>
              <ApprovalQueue />
            </div>
          )}

          {activeTab === 'workflow' && (
            <div>
              <ApprovalWorkflow />
            </div>
          )}

          {activeTab === 'delegation' && (
            <div>
              <DelegationManagement />
            </div>
          )}

          {activeTab === 'router' && (
            <div>
              <EnhancedWorkflowRouter />
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <ApprovalHistory />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 