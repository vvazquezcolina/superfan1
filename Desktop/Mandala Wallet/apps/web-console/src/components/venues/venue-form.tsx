'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  XMarkIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  ClockIcon,
  CogIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface VenueFormData {
  name: string;
  type: 'beach_club' | 'nightclub' | 'restaurant' | 'bar' | 'event_space';
  address: string;
  city: string;
  coordinates: { lat: number; lng: number };
  managerName: string;
  managerEmail: string;
  managerPhone: string;
  capacity: number;
  hoursOpen: string;
  hoursClose: string;
  acceptsCrypto: boolean;
  requiresReservation: boolean;
  hasGeofencing: boolean;
  autoApproveTransactions: boolean;
  description?: string;
  websiteUrl?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

interface VenueFormProps {
  venue?: any; // For editing existing venue
  onSubmit: (data: VenueFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const venueTypes = [
  { value: 'beach_club', label: 'Beach Club' },
  { value: 'nightclub', label: 'Nightclub' },
  { value: 'restaurant', label: 'Restaurante' },
  { value: 'bar', label: 'Bar' },
  { value: 'event_space', label: 'Espacio de Eventos' },
];

export function VenueForm({ venue, onSubmit, onCancel, isLoading = false }: VenueFormProps) {
  const [formData, setFormData] = useState<VenueFormData>({
    name: venue?.name || '',
    type: venue?.type || 'beach_club',
    address: venue?.location?.address || '',
    city: venue?.location?.city || 'Cancún, Q.R.',
    coordinates: venue?.location?.coordinates || { lat: 21.1387, lng: -86.7709 },
    managerName: venue?.contact?.manager || '',
    managerEmail: venue?.contact?.email || '',
    managerPhone: venue?.contact?.phone || '',
    capacity: venue?.operationalInfo?.capacity || 100,
    hoursOpen: venue?.operationalInfo?.hours?.open || '10:00',
    hoursClose: venue?.operationalInfo?.hours?.close || '02:00',
    acceptsCrypto: venue?.settings?.acceptsCrypto || false,
    requiresReservation: venue?.settings?.requiresReservation || false,
    hasGeofencing: venue?.settings?.hasGeofencing || true,
    autoApproveTransactions: venue?.settings?.autoApproveTransactions || false,
    description: venue?.description || '',
    websiteUrl: venue?.websiteUrl || '',
    socialMedia: venue?.socialMedia || {},
  });

  const [errors, setErrors] = useState<Partial<Record<keyof VenueFormData, string>>>({});
  const [currentStep, setCurrentStep] = useState(1);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof VenueFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del venue es requerido';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es requerida';
    }

    if (!formData.managerName.trim()) {
      newErrors.managerName = 'El nombre del manager es requerido';
    }

    if (!formData.managerEmail.trim()) {
      newErrors.managerEmail = 'El email del manager es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.managerEmail)) {
      newErrors.managerEmail = 'Email inválido';
    }

    if (!formData.managerPhone.trim()) {
      newErrors.managerPhone = 'El teléfono del manager es requerido';
    }

    if (formData.capacity < 1) {
      newErrors.capacity = 'La capacidad debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const updateFormData = (field: keyof VenueFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const steps = [
    {
      title: 'Información Básica',
      icon: BuildingStorefrontIcon,
      fields: ['name', 'type', 'description']
    },
    {
      title: 'Ubicación',
      icon: MapPinIcon,
      fields: ['address', 'city', 'coordinates']
    },
    {
      title: 'Contacto y Manager',
      icon: CogIcon,
      fields: ['managerName', 'managerEmail', 'managerPhone']
    },
    {
      title: 'Operación',
      icon: ClockIcon,
      fields: ['capacity', 'hoursOpen', 'hoursClose']
    },
    {
      title: 'Configuración',
      icon: CogIcon,
      fields: ['acceptsCrypto', 'requiresReservation', 'hasGeofencing', 'autoApproveTransactions']
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {venue ? 'Editar Venue' : 'Crear Nuevo Venue'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {venue ? 'Actualiza la información del venue' : 'Configura un nuevo venue en el sistema'}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isActive = stepNumber === currentStep;
              const isCompleted = stepNumber < currentStep;
              
              return (
                <div key={stepNumber} className="flex items-center">
                  <div className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors',
                    isActive && 'border-mandala-primary bg-mandala-primary text-white',
                    isCompleted && 'border-green-500 bg-green-500 text-white',
                    !isActive && !isCompleted && 'border-gray-300 dark:border-gray-600'
                  )}>
                    {isCompleted ? (
                      <CheckIcon className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-4 w-4" />
                    )}
                  </div>
                  <div className="ml-2 hidden sm:block">
                    <p className={cn(
                      'text-sm font-medium',
                      isActive && 'text-mandala-primary',
                      isCompleted && 'text-green-600',
                      !isActive && !isCompleted && 'text-gray-500 dark:text-gray-400'
                    )}>
                      {step.title}
                    </p>
                  </div>
                  {stepNumber < steps.length && (
                    <div className={cn(
                      'flex-1 h-0.5 mx-4',
                      isCompleted && 'bg-green-500',
                      !isCompleted && 'bg-gray-300 dark:bg-gray-600'
                    )} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">Información Básica</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nombre del Venue *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    className={cn(
                      'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mandala-primary focus:ring-mandala-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600',
                      errors.name && 'border-red-500 focus:border-red-500'
                    )}
                    placeholder="Ej: Mandala Beach Club"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tipo de Venue *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => updateFormData('type', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mandala-primary focus:ring-mandala-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                  >
                    {venueTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mandala-primary focus:ring-mandala-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Describe el venue, su ambiente, especialidades..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sitio Web
                </label>
                <input
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => updateFormData('websiteUrl', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mandala-primary focus:ring-mandala-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                  placeholder="https://www.venue.com"
                />
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">Ubicación</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Dirección *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                  className={cn(
                    'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mandala-primary focus:ring-mandala-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600',
                    errors.address && 'border-red-500 focus:border-red-500'
                  )}
                  placeholder="Ej: Blvd. Kukulcan Km 9.5, Zona Hotelera"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ciudad *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateFormData('city', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mandala-primary focus:ring-mandala-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Ej: Cancún, Q.R."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Latitud
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.coordinates.lat}
                    onChange={(e) => updateFormData('coordinates', { ...formData.coordinates, lat: parseFloat(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mandala-primary focus:ring-mandala-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                    placeholder="21.1387"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Longitud
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.coordinates.lng}
                    onChange={(e) => updateFormData('coordinates', { ...formData.coordinates, lng: parseFloat(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mandala-primary focus:ring-mandala-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                    placeholder="-86.7709"
                  />
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <MapPinIcon className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <strong>Tip:</strong> Las coordenadas GPS son utilizadas para el sistema de geofencing. 
                      Puedes obtener las coordenadas exactas desde Google Maps haciendo clic derecho en la ubicación.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Contact & Manager */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">Contacto y Manager</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nombre del Manager *
                  </label>
                  <input
                    type="text"
                    value={formData.managerName}
                    onChange={(e) => updateFormData('managerName', e.target.value)}
                    className={cn(
                      'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mandala-primary focus:ring-mandala-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600',
                      errors.managerName && 'border-red-500 focus:border-red-500'
                    )}
                    placeholder="Ej: Carlos Rodriguez"
                  />
                  {errors.managerName && (
                    <p className="mt-1 text-sm text-red-600">{errors.managerName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email del Manager *
                  </label>
                  <input
                    type="email"
                    value={formData.managerEmail}
                    onChange={(e) => updateFormData('managerEmail', e.target.value)}
                    className={cn(
                      'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mandala-primary focus:ring-mandala-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600',
                      errors.managerEmail && 'border-red-500 focus:border-red-500'
                    )}
                    placeholder="carlos@venue.com"
                  />
                  {errors.managerEmail && (
                    <p className="mt-1 text-sm text-red-600">{errors.managerEmail}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Teléfono del Manager *
                </label>
                <input
                  type="tel"
                  value={formData.managerPhone}
                  onChange={(e) => updateFormData('managerPhone', e.target.value)}
                  className={cn(
                    'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mandala-primary focus:ring-mandala-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600',
                    errors.managerPhone && 'border-red-500 focus:border-red-500'
                  )}
                  placeholder="+52-998-123-4567"
                />
                {errors.managerPhone && (
                  <p className="mt-1 text-sm text-red-600">{errors.managerPhone}</p>
                )}
              </div>

              <div className="space-y-4">
                <h5 className="text-md font-medium text-gray-900 dark:text-white">Redes Sociales (Opcional)</h5>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Facebook
                    </label>
                    <input
                      type="url"
                      value={formData.socialMedia?.facebook || ''}
                      onChange={(e) => updateFormData('socialMedia', { ...formData.socialMedia, facebook: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mandala-primary focus:ring-mandala-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                      placeholder="https://facebook.com/venue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Instagram
                    </label>
                    <input
                      type="url"
                      value={formData.socialMedia?.instagram || ''}
                      onChange={(e) => updateFormData('socialMedia', { ...formData.socialMedia, instagram: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mandala-primary focus:ring-mandala-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                      placeholder="https://instagram.com/venue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Twitter
                    </label>
                    <input
                      type="url"
                      value={formData.socialMedia?.twitter || ''}
                      onChange={(e) => updateFormData('socialMedia', { ...formData.socialMedia, twitter: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mandala-primary focus:ring-mandala-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                      placeholder="https://twitter.com/venue"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Operations */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">Información Operacional</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Capacidad Máxima *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => updateFormData('capacity', parseInt(e.target.value))}
                  className={cn(
                    'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mandala-primary focus:ring-mandala-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600',
                    errors.capacity && 'border-red-500 focus:border-red-500'
                  )}
                  placeholder="500"
                />
                {errors.capacity && (
                  <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Hora de Apertura *
                  </label>
                  <input
                    type="time"
                    value={formData.hoursOpen}
                    onChange={(e) => updateFormData('hoursOpen', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mandala-primary focus:ring-mandala-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Hora de Cierre *
                  </label>
                  <input
                    type="time"
                    value={formData.hoursClose}
                    onChange={(e) => updateFormData('hoursClose', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mandala-primary focus:ring-mandala-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ClockIcon className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      <strong>Nota:</strong> Los horarios se utilizan para determinar automáticamente 
                      el estado de "abierto/cerrado" del venue y para las notificaciones de geofencing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Settings */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">Configuración del Sistema</h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                      Acepta Pagos Crypto
                    </h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Permite pagos con criptomonedas en este venue
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.acceptsCrypto}
                    onChange={(e) => updateFormData('acceptsCrypto', e.target.checked)}
                    className="h-4 w-4 text-mandala-primary focus:ring-mandala-primary border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                      Requiere Reservaciones
                    </h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Los usuarios necesitan reservar antes de visitar
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.requiresReservation}
                    onChange={(e) => updateFormData('requiresReservation', e.target.checked)}
                    className="h-4 w-4 text-mandala-primary focus:ring-mandala-primary border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                      Geofencing Habilitado
                    </h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Detecta automáticamente cuando usuarios entran/salen
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.hasGeofencing}
                    onChange={(e) => updateFormData('hasGeofencing', e.target.checked)}
                    className="h-4 w-4 text-mandala-primary focus:ring-mandala-primary border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                      Auto-Aprobar Transacciones
                    </h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Aprueba automáticamente transacciones pequeñas
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.autoApproveTransactions}
                    onChange={(e) => updateFormData('autoApproveTransactions', e.target.checked)}
                    className="h-4 w-4 text-mandala-primary focus:ring-mandala-primary border-gray-300 rounded"
                  />
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckIcon className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      <strong>Listo para crear:</strong> Revisa toda la información antes de crear el venue. 
                      Una vez creado, el venue estará en estado "Pendiente de Aprobación" hasta que sea activado.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mandala-primary dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Anterior
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mandala-primary dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Cancelar
              </button>

              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-4 py-2 text-sm font-medium text-white bg-mandala-primary border border-transparent rounded-md hover:bg-mandala-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mandala-primary"
                >
                  Siguiente
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-mandala-primary border border-transparent rounded-md hover:bg-mandala-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mandala-primary disabled:opacity-50"
                >
                  {isLoading ? 'Guardando...' : venue ? 'Actualizar Venue' : 'Crear Venue'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 