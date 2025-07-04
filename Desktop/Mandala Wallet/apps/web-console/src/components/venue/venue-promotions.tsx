'use client';

import React, { useState } from 'react';
import { cn, formatCurrency } from '@/lib/utils';
import {
  GiftIcon,
  ClockIcon,
  TagIcon,
  UsersIcon,
  CalendarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

interface Promotion {
  id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed_amount' | 'buy_one_get_one' | 'free_item';
  value: number;
  conditions: {
    minSpend?: number;
    maxUses?: number;
    timeRestrictions?: string[];
    userTiers?: string[];
  };
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageCount: number;
  totalSavings: number;
}

const mockPromotions: Promotion[] = [
  {
    id: '1',
    name: 'Happy Hour Weekend',
    description: 'Descuento especial en bebidas durante el fin de semana',
    type: 'percentage',
    value: 30,
    conditions: {
      minSpend: 200,
      maxUses: 100,
      timeRestrictions: ['18:00-22:00'],
      userTiers: ['Bronze', 'Silver', 'Gold', 'Black'],
    },
    startDate: '2024-01-20',
    endDate: '2024-01-22',
    isActive: true,
    usageCount: 67,
    totalSavings: 15420,
  },
  {
    id: '2',
    name: 'VIP Table Special',
    description: 'Botella gratis con reserva de mesa VIP',
    type: 'free_item',
    value: 0,
    conditions: {
      minSpend: 5000,
      maxUses: 20,
      userTiers: ['Gold', 'Black'],
    },
    startDate: '2024-01-15',
    endDate: '2024-01-31',
    isActive: true,
    usageCount: 12,
    totalSavings: 18000,
  },
  {
    id: '3',
    name: 'Beach Club Day Pass',
    description: 'Entrada reducida para acceso completo al beach club',
    type: 'fixed_amount',
    value: 500,
    conditions: {
      maxUses: 50,
      timeRestrictions: ['10:00-18:00'],
    },
    startDate: '2024-01-10',
    endDate: '2024-01-25',
    isActive: false,
    usageCount: 43,
    totalSavings: 21500,
  },
];

export function VenuePromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);

  const [newPromotion, setNewPromotion] = useState({
    name: '',
    description: '',
    type: 'percentage' as const,
    value: 0,
    minSpend: 0,
    maxUses: 100,
    timeRestrictions: '',
    startDate: '',
    endDate: '',
  });

  const getPromotionTypeLabel = (type: Promotion['type']) => {
    switch (type) {
      case 'percentage':
        return 'Descuento %';
      case 'fixed_amount':
        return 'Descuento Fijo';
      case 'buy_one_get_one':
        return 'Compra 1 Lleva 2';
      case 'free_item':
        return 'Artículo Gratis';
      default:
        return type;
    }
  };

  const getPromotionStatusColor = (promotion: Promotion) => {
    const now = new Date();
    const endDate = new Date(promotion.endDate);
    
    if (!promotion.isActive) {
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
    
    if (endDate < now) {
      return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
    }
    
    return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
  };

  const getPromotionStatus = (promotion: Promotion) => {
    const now = new Date();
    const endDate = new Date(promotion.endDate);
    
    if (!promotion.isActive) return 'Inactiva';
    if (endDate < now) return 'Expirada';
    return 'Activa';
  };

  const handleCreatePromotion = () => {
    const promotion: Promotion = {
      id: Date.now().toString(),
      name: newPromotion.name,
      description: newPromotion.description,
      type: newPromotion.type,
      value: newPromotion.value,
      conditions: {
        minSpend: newPromotion.minSpend || undefined,
        maxUses: newPromotion.maxUses,
        timeRestrictions: newPromotion.timeRestrictions ? [newPromotion.timeRestrictions] : undefined,
        userTiers: ['Bronze', 'Silver', 'Gold', 'Black'],
      },
      startDate: newPromotion.startDate,
      endDate: newPromotion.endDate,
      isActive: true,
      usageCount: 0,
      totalSavings: 0,
    };

    setPromotions([...promotions, promotion]);
    setShowCreateForm(false);
    setNewPromotion({
      name: '',
      description: '',
      type: 'percentage',
      value: 0,
      minSpend: 0,
      maxUses: 100,
      timeRestrictions: '',
      startDate: '',
      endDate: '',
    });
  };

  const togglePromotionStatus = (id: string) => {
    setPromotions(promotions.map(promotion => 
      promotion.id === id 
        ? { ...promotion, isActive: !promotion.isActive }
        : promotion
    ));
  };

  const deletePromotion = (id: string) => {
    setPromotions(promotions.filter(promotion => promotion.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestión de Promociones
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Crea y gestiona promociones para tu venue
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-mandala-primary text-white px-4 py-2 rounded-lg hover:bg-mandala-primary/90 transition-colors flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Nueva Promoción</span>
        </button>
      </div>

      {/* Promotion Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Promociones Activas</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {promotions.filter(p => p.isActive).length}
              </p>
            </div>
            <GiftIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Usos Totales</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {promotions.reduce((sum, p) => sum + p.usageCount, 0)}
              </p>
            </div>
            <UsersIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ahorros Generados</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {formatCurrency(promotions.reduce((sum, p) => sum + p.totalSavings, 0))}
              </p>
            </div>
            <TagIcon className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tasa Utilización</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                73%
              </p>
            </div>
            <div className="text-2xl">📊</div>
          </div>
        </div>
      </div>

      {/* Create Promotion Form */}
      {showCreateForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Crear Nueva Promoción
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre de la Promoción
                  </label>
                  <input
                    type="text"
                    value={newPromotion.name}
                    onChange={(e) => setNewPromotion({ ...newPromotion, name: e.target.value })}
                    className="block w-full text-sm border-gray-300 rounded-md focus:ring-mandala-primary focus:border-mandala-primary dark:bg-gray-700 dark:border-gray-600"
                    placeholder="ej. Happy Hour Viernes"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descripción
                  </label>
                  <textarea
                    rows={3}
                    value={newPromotion.description}
                    onChange={(e) => setNewPromotion({ ...newPromotion, description: e.target.value })}
                    className="block w-full text-sm border-gray-300 rounded-md focus:ring-mandala-primary focus:border-mandala-primary dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Describe la promoción..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de Promoción
                  </label>
                  <select
                    value={newPromotion.type}
                    onChange={(e) => setNewPromotion({ ...newPromotion, type: e.target.value as any })}
                    className="block w-full text-sm border-gray-300 rounded-md focus:ring-mandala-primary focus:border-mandala-primary dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="percentage">Descuento Porcentual</option>
                    <option value="fixed_amount">Descuento Fijo</option>
                    <option value="buy_one_get_one">Compra 1 Lleva 2</option>
                    <option value="free_item">Artículo Gratis</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Valor {newPromotion.type === 'percentage' ? '(%)' : '(MXN)'}
                  </label>
                  <input
                    type="number"
                    value={newPromotion.value}
                    onChange={(e) => setNewPromotion({ ...newPromotion, value: parseFloat(e.target.value) })}
                    className="block w-full text-sm border-gray-300 rounded-md focus:ring-mandala-primary focus:border-mandala-primary dark:bg-gray-700 dark:border-gray-600"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gasto Mínimo (MXN)
                  </label>
                  <input
                    type="number"
                    value={newPromotion.minSpend}
                    onChange={(e) => setNewPromotion({ ...newPromotion, minSpend: parseFloat(e.target.value) })}
                    className="block w-full text-sm border-gray-300 rounded-md focus:ring-mandala-primary focus:border-mandala-primary dark:bg-gray-700 dark:border-gray-600"
                    placeholder="0"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fecha Inicio
                    </label>
                    <input
                      type="date"
                      value={newPromotion.startDate}
                      onChange={(e) => setNewPromotion({ ...newPromotion, startDate: e.target.value })}
                      className="block w-full text-sm border-gray-300 rounded-md focus:ring-mandala-primary focus:border-mandala-primary dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fecha Fin
                    </label>
                    <input
                      type="date"
                      value={newPromotion.endDate}
                      onChange={(e) => setNewPromotion({ ...newPromotion, endDate: e.target.value })}
                      className="block w-full text-sm border-gray-300 rounded-md focus:ring-mandala-primary focus:border-mandala-primary dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreatePromotion}
                className="px-4 py-2 bg-mandala-primary text-white rounded-md text-sm font-medium hover:bg-mandala-primary/90"
              >
                Crear Promoción
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Promotions List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Promociones Existentes
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {promotions.map((promotion) => (
            <div key={promotion.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                        {promotion.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {promotion.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={cn(
                        'px-2 py-1 text-xs font-medium rounded-full',
                        getPromotionStatusColor(promotion)
                      )}>
                        {getPromotionStatus(promotion)}
                      </span>
                      
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                        {getPromotionTypeLabel(promotion.type)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Valor</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {promotion.type === 'percentage' ? `${promotion.value}%` : formatCurrency(promotion.value)}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Usos</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {promotion.usageCount} / {promotion.conditions.maxUses || '∞'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Vigencia</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(promotion.startDate).toLocaleDateString('es-MX')} - {new Date(promotion.endDate).toLocaleDateString('es-MX')}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Ahorros</p>
                      <p className="font-medium text-green-600 dark:text-green-400">
                        {formatCurrency(promotion.totalSavings)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => togglePromotionStatus(promotion.id)}
                    className={cn(
                      'px-3 py-1 text-xs font-medium rounded-md transition-colors',
                      promotion.isActive
                        ? 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-800 dark:text-red-100'
                        : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800 dark:text-green-100'
                    )}
                  >
                    {promotion.isActive ? 'Desactivar' : 'Activar'}
                  </button>
                  
                  <button
                    onClick={() => setEditingPromotion(promotion)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => deletePromotion(promotion.id)}
                    className="p-2 text-red-400 hover:text-red-600"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 