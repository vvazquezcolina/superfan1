'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  ClockIcon,
  CogIcon,
  GiftIcon,
  MapPinIcon,
  UsersIcon,
  BellIcon,
  ShieldCheckIcon,
  WifiIcon,
} from '@heroicons/react/24/outline';

interface VenueSettingCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  children: React.ReactNode;
  isActive?: boolean;
}

function VenueSettingCard({ title, description, icon: Icon, children, isActive = true }: VenueSettingCardProps) {
  return (
    <div className={cn(
      'bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700',
      !isActive && 'opacity-50'
    )}>
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-mandala-primary/10 rounded-lg">
            <Icon className="h-5 w-5 text-mandala-primary" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          </div>
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

export function VenueControls() {
  const [operationalHours, setOperationalHours] = useState({
    monday: { open: '10:00', close: '02:00', enabled: true },
    tuesday: { open: '10:00', close: '02:00', enabled: true },
    wednesday: { open: '10:00', close: '02:00', enabled: true },
    thursday: { open: '10:00', close: '04:00', enabled: true },
    friday: { open: '10:00', close: '04:00', enabled: true },
    saturday: { open: '10:00', close: '04:00', enabled: true },
    sunday: { open: '12:00', close: '02:00', enabled: true },
  });

  const [capacitySettings, setCapacitySettings] = useState({
    maxCapacity: 500,
    warningThreshold: 400,
    autoCloseBookings: true,
    enableWaitlist: true,
  });

  const [promotionSettings, setPromotionSettings] = useState({
    autoApprovePromotions: false,
    maxDiscountPercent: 30,
    enableHappyHour: true,
    allowStackedPromotions: false,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    capacityAlerts: true,
    revenueAlerts: true,
    systemAlerts: true,
    dailyReports: true,
    weeklyReports: true,
  });

  const [venueInfo, setVenueInfo] = useState({
    name: 'Mandala Beach Club',
    description: 'Icónico beach club en la Zona Hotelera de Cancún con ambiente exclusivo y vista al mar.',
    phone: '+52-998-123-4567',
    email: 'info@mandalabeachclub.com',
    website: 'https://mandalabeachclub.com',
    socialMedia: {
      instagram: '@mandalabeachclub',
      facebook: 'MandalaBeachClub',
      tiktok: '@mandalabeach',
    },
  });

  const weekDays = [
    { key: 'monday', label: 'Lunes' },
    { key: 'tuesday', label: 'Martes' },
    { key: 'wednesday', label: 'Miércoles' },
    { key: 'thursday', label: 'Jueves' },
    { key: 'friday', label: 'Viernes' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' },
  ];

  const updateOperationalHours = (day: string, field: string, value: string | boolean) => {
    setOperationalHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Panel de Control del Venue
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Configura y gestiona todos los aspectos operativos de tu venue
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
              🟢 Venue Activo
            </span>
            <button className="bg-mandala-primary text-white px-4 py-2 rounded-lg hover:bg-mandala-primary/90 transition-colors">
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Operational Hours */}
        <VenueSettingCard
          title="Horarios de Operación"
          description="Configura los horarios de apertura y cierre para cada día de la semana"
          icon={ClockIcon}
        >
          <div className="space-y-4">
            {weekDays.map((day) => {
              const hours = operationalHours[day.key as keyof typeof operationalHours];
              return (
                <div key={day.key} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={hours.enabled}
                      onChange={(e) => updateOperationalHours(day.key, 'enabled', e.target.checked)}
                      className="h-4 w-4 text-mandala-primary border-gray-300 rounded focus:ring-mandala-primary"
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-20">
                      {day.label}
                    </span>
                  </div>
                  
                  {hours.enabled ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="time"
                        value={hours.open}
                        onChange={(e) => updateOperationalHours(day.key, 'open', e.target.value)}
                        className="block w-20 text-sm border-gray-300 rounded-md focus:ring-mandala-primary focus:border-mandala-primary dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-gray-500">a</span>
                      <input
                        type="time"
                        value={hours.close}
                        onChange={(e) => updateOperationalHours(day.key, 'close', e.target.value)}
                        className="block w-20 text-sm border-gray-300 rounded-md focus:ring-mandala-primary focus:border-mandala-primary dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Cerrado</span>
                  )}
                </div>
              );
            })}
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="text-sm text-mandala-primary hover:text-mandala-primary/80">
                Aplicar horarios especiales para días festivos
              </button>
            </div>
          </div>
        </VenueSettingCard>

        {/* Capacity Management */}
        <VenueSettingCard
          title="Gestión de Capacidad"
          description="Controla la capacidad máxima y configuraciones de reservas"
          icon={UsersIcon}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Capacidad Máxima
              </label>
              <input
                type="number"
                value={capacitySettings.maxCapacity}
                onChange={(e) => setCapacitySettings(prev => ({ ...prev, maxCapacity: parseInt(e.target.value) }))}
                className="block w-full text-sm border-gray-300 rounded-md focus:ring-mandala-primary focus:border-mandala-primary dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Umbral de Advertencia
              </label>
              <input
                type="number"
                value={capacitySettings.warningThreshold}
                onChange={(e) => setCapacitySettings(prev => ({ ...prev, warningThreshold: parseInt(e.target.value) }))}
                className="block w-full text-sm border-gray-300 rounded-md focus:ring-mandala-primary focus:border-mandala-primary dark:bg-gray-700 dark:border-gray-600"
              />
              <p className="text-xs text-gray-500 mt-1">Recibir alertas cuando se alcance este número</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Cerrar reservas automáticamente
                </span>
                <input
                  type="checkbox"
                  checked={capacitySettings.autoCloseBookings}
                  onChange={(e) => setCapacitySettings(prev => ({ ...prev, autoCloseBookings: e.target.checked }))}
                  className="h-4 w-4 text-mandala-primary border-gray-300 rounded focus:ring-mandala-primary"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Habilitar lista de espera
                </span>
                <input
                  type="checkbox"
                  checked={capacitySettings.enableWaitlist}
                  onChange={(e) => setCapacitySettings(prev => ({ ...prev, enableWaitlist: e.target.checked }))}
                  className="h-4 w-4 text-mandala-primary border-gray-300 rounded focus:ring-mandala-primary"
                />
              </div>
            </div>
          </div>
        </VenueSettingCard>

        {/* Promotion Settings */}
        <VenueSettingCard
          title="Configuración de Promociones"
          description="Gestiona cómo se manejan las promociones en tu venue"
          icon={GiftIcon}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descuento Máximo Permitido (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={promotionSettings.maxDiscountPercent}
                onChange={(e) => setPromotionSettings(prev => ({ ...prev, maxDiscountPercent: parseInt(e.target.value) }))}
                className="block w-full text-sm border-gray-300 rounded-md focus:ring-mandala-primary focus:border-mandala-primary dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Auto-aprobar promociones
                </span>
                <input
                  type="checkbox"
                  checked={promotionSettings.autoApprovePromotions}
                  onChange={(e) => setPromotionSettings(prev => ({ ...prev, autoApprovePromotions: e.target.checked }))}
                  className="h-4 w-4 text-mandala-primary border-gray-300 rounded focus:ring-mandala-primary"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Habilitar Happy Hour
                </span>
                <input
                  type="checkbox"
                  checked={promotionSettings.enableHappyHour}
                  onChange={(e) => setPromotionSettings(prev => ({ ...prev, enableHappyHour: e.target.checked }))}
                  className="h-4 w-4 text-mandala-primary border-gray-300 rounded focus:ring-mandala-primary"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Permitir promociones acumulables
                </span>
                <input
                  type="checkbox"
                  checked={promotionSettings.allowStackedPromotions}
                  onChange={(e) => setPromotionSettings(prev => ({ ...prev, allowStackedPromotions: e.target.checked }))}
                  className="h-4 w-4 text-mandala-primary border-gray-300 rounded focus:ring-mandala-primary"
                />
              </div>
            </div>
          </div>
        </VenueSettingCard>

        {/* Notification Settings */}
        <VenueSettingCard
          title="Configuración de Notificaciones"
          description="Personaliza qué notificaciones quieres recibir"
          icon={BellIcon}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Alertas de capacidad
              </span>
              <input
                type="checkbox"
                checked={notificationSettings.capacityAlerts}
                onChange={(e) => setNotificationSettings(prev => ({ ...prev, capacityAlerts: e.target.checked }))}
                className="h-4 w-4 text-mandala-primary border-gray-300 rounded focus:ring-mandala-primary"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Alertas de ingresos
              </span>
              <input
                type="checkbox"
                checked={notificationSettings.revenueAlerts}
                onChange={(e) => setNotificationSettings(prev => ({ ...prev, revenueAlerts: e.target.checked }))}
                className="h-4 w-4 text-mandala-primary border-gray-300 rounded focus:ring-mandala-primary"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Alertas del sistema
              </span>
              <input
                type="checkbox"
                checked={notificationSettings.systemAlerts}
                onChange={(e) => setNotificationSettings(prev => ({ ...prev, systemAlerts: e.target.checked }))}
                className="h-4 w-4 text-mandala-primary border-gray-300 rounded focus:ring-mandala-primary"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Reportes diarios
              </span>
              <input
                type="checkbox"
                checked={notificationSettings.dailyReports}
                onChange={(e) => setNotificationSettings(prev => ({ ...prev, dailyReports: e.target.checked }))}
                className="h-4 w-4 text-mandala-primary border-gray-300 rounded focus:ring-mandala-primary"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Reportes semanales
              </span>
              <input
                type="checkbox"
                checked={notificationSettings.weeklyReports}
                onChange={(e) => setNotificationSettings(prev => ({ ...prev, weeklyReports: e.target.checked }))}
                className="h-4 w-4 text-mandala-primary border-gray-300 rounded focus:ring-mandala-primary"
              />
            </div>
          </div>
        </VenueSettingCard>
      </div>

      {/* Venue Information */}
      <VenueSettingCard
        title="Información del Venue"
        description="Actualiza la información básica y de contacto de tu venue"
        icon={MapPinIcon}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre del Venue
              </label>
              <input
                type="text"
                value={venueInfo.name}
                onChange={(e) => setVenueInfo(prev => ({ ...prev, name: e.target.value }))}
                className="block w-full text-sm border-gray-300 rounded-md focus:ring-mandala-primary focus:border-mandala-primary dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descripción
              </label>
              <textarea
                rows={3}
                value={venueInfo.description}
                onChange={(e) => setVenueInfo(prev => ({ ...prev, description: e.target.value }))}
                className="block w-full text-sm border-gray-300 rounded-md focus:ring-mandala-primary focus:border-mandala-primary dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                value={venueInfo.phone}
                onChange={(e) => setVenueInfo(prev => ({ ...prev, phone: e.target.value }))}
                className="block w-full text-sm border-gray-300 rounded-md focus:ring-mandala-primary focus:border-mandala-primary dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={venueInfo.email}
                onChange={(e) => setVenueInfo(prev => ({ ...prev, email: e.target.value }))}
                className="block w-full text-sm border-gray-300 rounded-md focus:ring-mandala-primary focus:border-mandala-primary dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sitio Web
              </label>
              <input
                type="url"
                value={venueInfo.website}
                onChange={(e) => setVenueInfo(prev => ({ ...prev, website: e.target.value }))}
                className="block w-full text-sm border-gray-300 rounded-md focus:ring-mandala-primary focus:border-mandala-primary dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Instagram
              </label>
              <input
                type="text"
                value={venueInfo.socialMedia.instagram}
                onChange={(e) => setVenueInfo(prev => ({ 
                  ...prev, 
                  socialMedia: { ...prev.socialMedia, instagram: e.target.value }
                }))}
                className="block w-full text-sm border-gray-300 rounded-md focus:ring-mandala-primary focus:border-mandala-primary dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>
        </div>
      </VenueSettingCard>
    </div>
  );
} 