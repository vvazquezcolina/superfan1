'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { UserRole } from '@mandala/shared-types';
import {
  XMarkIcon,
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ShieldCheckIcon,
  BuildingStorefrontIcon,
  StarIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';

interface UserFormData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  role: UserRole;
  venueId?: string; // For venue managers
  sponsorId?: string; // For RPs
  initialPassword?: string;
  sendWelcomeEmail: boolean;
  requirePasswordChange: boolean;
}

interface UserFormProps {
  user?: any; // For editing existing user
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const roles = [
  {
    value: UserRole.ADMIN,
    label: 'Administrador',
    description: 'Acceso completo al sistema',
    color: 'red',
    icon: ShieldCheckIcon,
    dangerous: true
  },
  {
    value: UserRole.VENUE_MANAGER,
    label: 'Manager de Venue',
    description: 'Gestión de venue específico',
    color: 'blue',
    icon: BuildingStorefrontIcon,
    dangerous: false
  },
  {
    value: UserRole.RP,
    label: 'Representante (RP)',
    description: 'Gestión de clientes invitados',
    color: 'purple',
    icon: StarIcon,
    dangerous: false
  },
  {
    value: UserRole.CLIENT,
    label: 'Cliente',
    description: 'Usuario final del sistema',
    color: 'green',
    icon: UserCircleIcon,
    dangerous: false
  }
];

const mockVenues = [
  { id: 'mandala-beach-club', name: 'Mandala Beach Club' },
  { id: 'coco-bongo', name: 'Coco Bongo' },
  { id: 'la-vaquita', name: 'La Vaquita' },
  { id: 'senor-frogs', name: 'Señor Frogs' }
];

const mockSponsors = [
  { id: 'mandala-beach-club', name: 'Mandala Beach Club' },
  { id: 'coco-bongo', name: 'Coco Bongo' }
];

export function UserForm({ user, onSubmit, onCancel, isLoading = false }: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    email: user?.email || '',
    firstName: user?.profile?.firstName || '',
    lastName: user?.profile?.lastName || '',
    phone: user?.profile?.phone || '',
    address: user?.profile?.address || '',
    city: user?.profile?.city || 'Cancún, Q.R.',
    role: user?.role || UserRole.CLIENT,
    venueId: user?.venueId || '',
    sponsorId: user?.sponsorId || '',
    initialPassword: '',
    sendWelcomeEmail: !user, // Only for new users
    requirePasswordChange: !user, // Only for new users
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserFormData, string>> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }

    if (!user && !formData.initialPassword) {
      newErrors.initialPassword = 'La contraseña es requerida para nuevos usuarios';
    } else if (!user && formData.initialPassword && formData.initialPassword.length < 8) {
      newErrors.initialPassword = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (formData.role === UserRole.VENUE_MANAGER && !formData.venueId) {
      newErrors.venueId = 'Debe seleccionar un venue para el manager';
    }

    if (formData.role === UserRole.RP && !formData.sponsorId) {
      newErrors.sponsorId = 'Debe seleccionar un sponsor para el RP';
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

  const updateFormData = (field: keyof UserFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const generatePassword = () => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    updateFormData('initialPassword', password);
  };

  const selectedRole = roles.find(role => role.value === formData.role);

  const steps = [
    {
      title: 'Información Personal',
      fields: ['firstName', 'lastName', 'email', 'phone']
    },
    {
      title: 'Ubicación y Contacto',
      fields: ['address', 'city']
    },
    {
      title: 'Rol y Permisos',
      fields: ['role', 'venueId', 'sponsorId']
    },
    {
      title: 'Configuración de Cuenta',
      fields: ['initialPassword', 'sendWelcomeEmail', 'requirePasswordChange']
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {user ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user ? 'Actualiza la información del usuario' : 'Configura un nuevo usuario en el sistema'}
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
                      <span className="text-sm font-medium">{stepNumber}</span>
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
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">Información Personal</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => updateFormData('firstName', e.target.value)}
                    className={cn(
                      'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mandala-primary focus:ring-mandala-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600',
                      errors.firstName && 'border-red-500 focus:border-red-500'
                    )}
                    placeholder="Juan"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => updateFormData('lastName', e.target.value)}
                    className={cn(
                      'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mandala-primary focus:ring-mandala-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600',
                      errors.lastName && 'border-red-500 focus:border-red-500'
                    )}
                    placeholder="Pérez"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className={cn(
                    'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mandala-primary focus:ring-mandala-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600',
                    errors.email && 'border-red-500 focus:border-red-500'
                  )}
                  placeholder="usuario@mandala.mx"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  className={cn(
                    'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mandala-primary focus:ring-mandala-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600',
                    errors.phone && 'border-red-500 focus:border-red-500'
                  )}
                  placeholder="+52-998-123-4567"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">Ubicación y Contacto</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Dirección
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mandala-primary focus:ring-mandala-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Av. Revolución 123, Col. Centro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ciudad
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateFormData('city', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mandala-primary focus:ring-mandala-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Cancún, Q.R."
                />
              </div>
            </div>
          )}

          {/* Step 3: Role and Permissions */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">Rol y Permisos</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Seleccionar Rol *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    const isSelected = formData.role === role.value;
                    
                    return (
                      <div
                        key={role.value}
                        onClick={() => updateFormData('role', role.value)}
                        className={cn(
                          'relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200',
                          isSelected 
                            ? 'border-mandala-primary bg-mandala-primary/5' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={cn(
                            'p-2 rounded-lg',
                            `bg-${role.color}-100 dark:bg-${role.color}-900/20`
                          )}>
                            <Icon className={cn('h-5 w-5', `text-${role.color}-600`)} />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900 dark:text-white">
                              {role.label}
                              {role.dangerous && (
                                <span className="ml-2 text-red-500" title="Rol con permisos peligrosos">
                                  ⚠️
                                </span>
                              )}
                            </h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {role.description}
                            </p>
                          </div>
                        </div>
                        
                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            <CheckIcon className="h-5 w-5 text-mandala-primary" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Venue Selection for Venue Managers */}
              {formData.role === UserRole.VENUE_MANAGER && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Venue Asignado *
                  </label>
                  <select
                    value={formData.venueId}
                    onChange={(e) => updateFormData('venueId', e.target.value)}
                    className={cn(
                      'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mandala-primary focus:ring-mandala-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600',
                      errors.venueId && 'border-red-500 focus:border-red-500'
                    )}
                  >
                    <option value="">Seleccionar venue...</option>
                    {mockVenues.map(venue => (
                      <option key={venue.id} value={venue.id}>
                        {venue.name}
                      </option>
                    ))}
                  </select>
                  {errors.venueId && (
                    <p className="mt-1 text-sm text-red-600">{errors.venueId}</p>
                  )}
                </div>
              )}

              {/* Sponsor Selection for RPs */}
              {formData.role === UserRole.RP && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sponsor/Venue *
                  </label>
                  <select
                    value={formData.sponsorId}
                    onChange={(e) => updateFormData('sponsorId', e.target.value)}
                    className={cn(
                      'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mandala-primary focus:ring-mandala-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600',
                      errors.sponsorId && 'border-red-500 focus:border-red-500'
                    )}
                  >
                    <option value="">Seleccionar sponsor...</option>
                    {mockSponsors.map(sponsor => (
                      <option key={sponsor.id} value={sponsor.id}>
                        {sponsor.name}
                      </option>
                    ))}
                  </select>
                  {errors.sponsorId && (
                    <p className="mt-1 text-sm text-red-600">{errors.sponsorId}</p>
                  )}
                </div>
              )}

              {selectedRole?.dangerous && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Rol con Permisos Peligrosos
                      </p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                        Este rol otorga acceso a funciones críticas del sistema. Asegúrate de que el usuario sea de confianza.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Account Settings */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">Configuración de Cuenta</h4>
              
              {!user && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Contraseña Inicial *
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.initialPassword}
                      onChange={(e) => updateFormData('initialPassword', e.target.value)}
                      className={cn(
                        'block w-full rounded-md border-gray-300 shadow-sm focus:border-mandala-primary focus:ring-mandala-primary sm:text-sm dark:bg-gray-700 dark:border-gray-600 pr-20',
                        errors.initialPassword && 'border-red-500 focus:border-red-500'
                      )}
                      placeholder="Mínimo 8 caracteres"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={generatePassword}
                        className="text-xs text-mandala-primary hover:text-mandala-primary/80"
                      >
                        Generar
                      </button>
                    </div>
                  </div>
                  {errors.initialPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.initialPassword}</p>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sendWelcomeEmail"
                    checked={formData.sendWelcomeEmail}
                    onChange={(e) => updateFormData('sendWelcomeEmail', e.target.checked)}
                    className="h-4 w-4 text-mandala-primary focus:ring-mandala-primary border-gray-300 rounded"
                  />
                  <label htmlFor="sendWelcomeEmail" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Enviar email de bienvenida
                  </label>
                </div>

                {!user && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="requirePasswordChange"
                      checked={formData.requirePasswordChange}
                      onChange={(e) => updateFormData('requirePasswordChange', e.target.checked)}
                      className="h-4 w-4 text-mandala-primary focus:ring-mandala-primary border-gray-300 rounded"
                    />
                    <label htmlFor="requirePasswordChange" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Requerir cambio de contraseña en primer login
                    </label>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <UserCircleIcon className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <strong>Resumen:</strong> Se creará un usuario con rol de {selectedRole?.label} 
                      {formData.role === UserRole.VENUE_MANAGER && formData.venueId && 
                        ` asignado a ${mockVenues.find(v => v.id === formData.venueId)?.name}`}
                      {formData.role === UserRole.RP && formData.sponsorId && 
                        ` bajo el sponsor ${mockSponsors.find(s => s.id === formData.sponsorId)?.name}`}.
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
                  {isLoading ? 'Guardando...' : user ? 'Actualizar Usuario' : 'Crear Usuario'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 