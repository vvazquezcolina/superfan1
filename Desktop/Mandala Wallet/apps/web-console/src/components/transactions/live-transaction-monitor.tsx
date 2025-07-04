'use client';

import React, { useState, useEffect } from 'react';
import { cn, formatCurrency, formatRelativeTime } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { UserRole } from '@mandala/shared-types';
import {
  CreditCardIcon,
  BanknotesIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  FunnelIcon,
  ArrowPathIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

interface LiveTransaction {
  id: string;
  timestamp: Date;
  amount: number;
  currency: 'MXN';
  status: 'pending' | 'completed' | 'failed' | 'requires_approval';
  paymentMethod: 'credit_card' | 'cash' | 'crypto' | 'wallet_balance';
  venue: {
    id: string;
    name: string;
    location: string;
  };
  customer: {
    id: string;
    name: string;
    tier: 'Bronze' | 'Silver' | 'Gold' | 'Black';
    isVip: boolean;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  balanceUsed: {
    cash: number;
    credit: number;
    rewards: number;
  };
  metadata: {
    source: 'pos' | 'mobile' | 'qr' | 'web';
    location: string;
    staff?: string;
    table?: string;
  };
}

const mockTransactions: LiveTransaction[] = [
  {
    id: 'tx_001',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    amount: 2850,
    currency: 'MXN',
    status: 'completed',
    paymentMethod: 'credit_card',
    venue: { id: 'mandala', name: 'Mandala Beach Club', location: 'Zona Hotelera' },
    customer: { id: 'cust_001', name: 'Carlos Rodriguez', tier: 'Gold', isVip: true },
    items: [
      { name: 'Bottle Service Premium', quantity: 1, price: 2500 },
      { name: 'Service Charge', quantity: 1, price: 350 },
    ],
    balanceUsed: { cash: 0, credit: 2850, rewards: 0 },
    metadata: { source: 'pos', location: 'VIP Section', staff: 'Maria G.', table: 'VIP-12' },
  },
  {
    id: 'tx_002',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    amount: 15000,
    currency: 'MXN',
    status: 'requires_approval',
    paymentMethod: 'cash',
    venue: { id: 'mandala', name: 'Mandala Beach Club', location: 'Zona Hotelera' },
    customer: { id: 'cust_002', name: 'Jennifer Smith', tier: 'Black', isVip: true },
    items: [
      { name: 'Private Event Package', quantity: 1, price: 12000 },
      { name: 'Premium Bar Service', quantity: 1, price: 3000 },
    ],
    balanceUsed: { cash: 15000, credit: 0, rewards: 0 },
    metadata: { source: 'mobile', location: 'Private Area', staff: 'Roberto M.' },
  },
  {
    id: 'tx_003',
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    amount: 650,
    currency: 'MXN',
    status: 'completed',
    paymentMethod: 'wallet_balance',
    venue: { id: 'mandala', name: 'Mandala Beach Club', location: 'Zona Hotelera' },
    customer: { id: 'cust_003', name: 'Ana Martinez', tier: 'Silver', isVip: false },
    items: [
      { name: 'Cocktails x3', quantity: 3, price: 180 },
      { name: 'Appetizers', quantity: 1, price: 110 },
    ],
    balanceUsed: { cash: 200, credit: 350, rewards: 100 },
    metadata: { source: 'qr', location: 'Main Bar' },
  },
  {
    id: 'tx_004',
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    amount: 1200,
    currency: 'MXN',
    status: 'failed',
    paymentMethod: 'credit_card',
    venue: { id: 'coco-bongo', name: 'Coco Bongo', location: 'Centro' },
    customer: { id: 'cust_004', name: 'Michael Johnson', tier: 'Bronze', isVip: false },
    items: [
      { name: 'Show Tickets x2', quantity: 2, price: 600 },
    ],
    balanceUsed: { cash: 0, credit: 0, rewards: 0 },
    metadata: { source: 'web', location: 'Box Office' },
  },
  {
    id: 'tx_005',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    amount: 4200,
    currency: 'MXN',
    status: 'completed',
    paymentMethod: 'crypto',
    venue: { id: 'mandala', name: 'Mandala Beach Club', location: 'Zona Hotelera' },
    customer: { id: 'cust_005', name: 'David Kim', tier: 'Gold', isVip: true },
    items: [
      { name: 'Premium Dinner', quantity: 2, price: 1800 },
      { name: 'Wine Selection', quantity: 1, price: 600 },
    ],
    balanceUsed: { cash: 0, credit: 0, rewards: 0 },
    metadata: { source: 'mobile', location: 'Restaurant', staff: 'Chef Carlos' },
  },
];

export function LiveTransactionMonitor() {
  const { hasAnyRole } = useAuth();
  const [transactions, setTransactions] = useState<LiveTransaction[]>(mockTransactions);
  const [filter, setFilter] = useState({
    status: 'all',
    venue: 'all',
    amount: 'all',
    paymentMethod: 'all',
  });
  const [isLive, setIsLive] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<LiveTransaction | null>(null);

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // Simulate new transactions
      if (Math.random() > 0.7) {
        const newTransaction: LiveTransaction = {
          id: `tx_${Date.now()}`,
          timestamp: new Date(),
          amount: Math.floor(Math.random() * 5000) + 200,
          currency: 'MXN',
          status: Math.random() > 0.1 ? 'completed' : 'pending',
          paymentMethod: ['credit_card', 'cash', 'wallet_balance', 'crypto'][Math.floor(Math.random() * 4)] as any,
          venue: { id: 'mandala', name: 'Mandala Beach Club', location: 'Zona Hotelera' },
          customer: {
            id: `cust_${Date.now()}`,
            name: `Cliente ${Math.floor(Math.random() * 1000)}`,
            tier: ['Bronze', 'Silver', 'Gold', 'Black'][Math.floor(Math.random() * 4)] as any,
            isVip: Math.random() > 0.7,
          },
          items: [{ name: 'New Purchase', quantity: 1, price: Math.floor(Math.random() * 5000) + 200 }],
          balanceUsed: { cash: 0, credit: 0, rewards: 0 },
          metadata: { source: 'pos', location: 'Main Area' },
        };
        
        setTransactions(prev => [newTransaction, ...prev.slice(0, 49)]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive]);

  const getStatusIcon = (status: LiveTransaction['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <ClockIcon className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
      case 'requires_approval':
        return <ExclamationTriangleIcon className="h-4 w-4 text-orange-500" />;
    }
  };

  const getStatusColor = (status: LiveTransaction['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      case 'requires_approval':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100';
    }
  };

  const getPaymentMethodIcon = (method: LiveTransaction['paymentMethod']) => {
    switch (method) {
      case 'credit_card':
        return <CreditCardIcon className="h-4 w-4" />;
      case 'cash':
        return <BanknotesIcon className="h-4 w-4" />;
      case 'crypto':
        return <div className="h-4 w-4 text-center">₿</div>;
      case 'wallet_balance':
        return <div className="h-4 w-4 text-center">💳</div>;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Bronze':
        return 'text-orange-600';
      case 'Silver':
        return 'text-gray-600';
      case 'Gold':
        return 'text-yellow-600';
      case 'Black':
        return 'text-gray-900 dark:text-white';
      default:
        return 'text-gray-500';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter.status !== 'all' && transaction.status !== filter.status) return false;
    if (filter.venue !== 'all' && transaction.venue.id !== filter.venue) return false;
    if (filter.paymentMethod !== 'all' && transaction.paymentMethod !== filter.paymentMethod) return false;
    if (filter.amount !== 'all') {
      if (filter.amount === 'small' && transaction.amount >= 1000) return false;
      if (filter.amount === 'medium' && (transaction.amount < 1000 || transaction.amount >= 5000)) return false;
      if (filter.amount === 'large' && transaction.amount < 5000) return false;
    }
    return true;
  });

  const stats = {
    total: filteredTransactions.length,
    completed: filteredTransactions.filter(t => t.status === 'completed').length,
    pending: filteredTransactions.filter(t => t.status === 'pending').length,
    failed: filteredTransactions.filter(t => t.status === 'failed').length,
    requiresApproval: filteredTransactions.filter(t => t.status === 'requires_approval').length,
    totalAmount: filteredTransactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Monitor de Transacciones en Tiempo Real
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Monitoreo live de todas las transacciones del sistema
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsLive(!isLive)}
            className={cn(
              'flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors',
              isLive
                ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            )}
          >
            <div className={cn('w-2 h-2 rounded-full', isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400')} />
            <span>{isLive ? 'En Vivo' : 'Pausado'}</span>
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center space-x-2 px-4 py-2 bg-mandala-primary text-white rounded-lg hover:bg-mandala-primary/90 transition-colors"
          >
            <ArrowPathIcon className="h-4 w-4" />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Completadas</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Pendientes</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Fallidas</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{stats.requiresApproval}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Aprobación</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-lg font-bold text-mandala-primary">{formatCurrency(stats.totalAmount)}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Volumen</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center space-x-4">
          <FunnelIcon className="h-5 w-5 text-gray-500" />
          
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="text-sm border-gray-300 rounded-md focus:ring-mandala-primary focus:border-mandala-primary dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="all">Todos los estados</option>
            <option value="completed">Completadas</option>
            <option value="pending">Pendientes</option>
            <option value="failed">Fallidas</option>
            <option value="requires_approval">Requiere Aprobación</option>
          </select>
          
          {hasAnyRole([UserRole.ADMIN]) && (
            <select
              value={filter.venue}
              onChange={(e) => setFilter({ ...filter, venue: e.target.value })}
              className="text-sm border-gray-300 rounded-md focus:ring-mandala-primary focus:border-mandala-primary dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="all">Todos los venues</option>
              <option value="mandala">Mandala Beach Club</option>
              <option value="coco-bongo">Coco Bongo</option>
            </select>
          )}
          
          <select
            value={filter.paymentMethod}
            onChange={(e) => setFilter({ ...filter, paymentMethod: e.target.value })}
            className="text-sm border-gray-300 rounded-md focus:ring-mandala-primary focus:border-mandala-primary dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="all">Todos los métodos</option>
            <option value="credit_card">Tarjeta de Crédito</option>
            <option value="cash">Efectivo</option>
            <option value="wallet_balance">Saldo Wallet</option>
            <option value="crypto">Crypto</option>
          </select>
          
          <select
            value={filter.amount}
            onChange={(e) => setFilter({ ...filter, amount: e.target.value })}
            className="text-sm border-gray-300 rounded-md focus:ring-mandala-primary focus:border-mandala-primary dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="all">Todos los montos</option>
            <option value="small">Pequeñas (&lt; $1,000)</option>
            <option value="medium">Medianas ($1,000 - $5,000)</option>
            <option value="large">Grandes (&gt; $5,000)</option>
          </select>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Transacciones Recientes ({filteredTransactions.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(transaction.status)}
                    {getPaymentMethodIcon(transaction.paymentMethod)}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {transaction.customer.name}
                      </p>
                      <span className={cn('text-xs font-medium', getTierColor(transaction.customer.tier))}>
                        {transaction.customer.tier}
                      </span>
                      {transaction.customer.isVip && (
                        <span className="text-xs font-medium text-purple-600">VIP</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {transaction.venue.name} • {transaction.metadata.location}
                      {transaction.metadata.staff && ` • ${transaction.metadata.staff}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatRelativeTime(transaction.timestamp)}
                    </p>
                  </div>
                  
                  <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getStatusColor(transaction.status))}>
                    {transaction.status === 'completed' && 'Completada'}
                    {transaction.status === 'pending' && 'Pendiente'}
                    {transaction.status === 'failed' && 'Fallida'}
                    {transaction.status === 'requires_approval' && 'Requiere Aprobación'}
                  </span>
                  
                  <button
                    onClick={() => setSelectedTransaction(transaction)}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Balance breakdown for wallet payments */}
              {transaction.paymentMethod === 'wallet_balance' && (
                <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                  {transaction.balanceUsed.cash > 0 && (
                    <span>Cash: {formatCurrency(transaction.balanceUsed.cash)}</span>
                  )}
                  {transaction.balanceUsed.credit > 0 && (
                    <span>Credit: {formatCurrency(transaction.balanceUsed.credit)}</span>
                  )}
                  {transaction.balanceUsed.rewards > 0 && (
                    <span>Rewards: {formatCurrency(transaction.balanceUsed.rewards)}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Detalle de Transacción
                </h3>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Información General</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">ID:</span>
                      <span className="text-gray-900 dark:text-white">{selectedTransaction.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Monto:</span>
                      <span className="text-gray-900 dark:text-white">{formatCurrency(selectedTransaction.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Estado:</span>
                      <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getStatusColor(selectedTransaction.status))}>
                        {selectedTransaction.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Método:</span>
                      <span className="text-gray-900 dark:text-white">{selectedTransaction.paymentMethod}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Cliente</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Nombre:</span>
                      <span className="text-gray-900 dark:text-white">{selectedTransaction.customer.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tier:</span>
                      <span className={getTierColor(selectedTransaction.customer.tier)}>{selectedTransaction.customer.tier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">VIP:</span>
                      <span className="text-gray-900 dark:text-white">{selectedTransaction.customer.isVip ? 'Sí' : 'No'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Artículos</h4>
                <div className="space-y-2">
                  {selectedTransaction.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-900 dark:text-white">{item.name} x{item.quantity}</span>
                      <span className="text-gray-900 dark:text-white">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedTransaction.status === 'requires_approval' && hasAnyRole([UserRole.ADMIN]) && (
                <div className="flex space-x-3">
                  <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    Aprobar Transacción
                  </button>
                  <button className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                    Rechazar Transacción
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 