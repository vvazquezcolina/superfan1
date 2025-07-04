'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { UserRole } from '@mandala/shared-types';
import {
  ShieldCheckIcon,
  UserGroupIcon,
  StarIcon,
  UserCircleIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  BuildingStorefrontIcon,
  CogIcon,
  EyeIcon,
  PencilIcon,
  LockClosedIcon,
  LockOpenIcon,
  ClockIcon,
  BanknotesIcon,
  QrCodeIcon,
  UsersIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'system' | 'venue' | 'wallet' | 'user' | 'analytics' | 'special';
  level: 'read' | 'write' | 'admin';
  dangerous?: boolean;
}

interface RoleTemplate {
  role: UserRole;
  name: string;
  description: string;
  color: string;
  icon: React.ComponentType<any>;
  defaultPermissions: string[];
  restrictions?: string[];
}

const permissions: Permission[] = [
  // System Permissions
  { id: 'system.admin', name: 'Administrador del Sistema', description: 'Acceso completo a todas las funciones', category: 'system', level: 'admin', dangerous: true },
  { id: 'system.settings', name: 'Configuración del Sistema', description: 'Modificar configuraciones globales', category: 'system', level: 'write', dangerous: true },
  { id: 'system.logs', name: 'Ver Logs del Sistema', description: 'Acceso a logs y auditoría', category: 'system', level: 'read' },
  
  // Venue Permissions
  { id: 'venue.create', name: 'Crear Venues', description: 'Crear nuevos venues en el sistema', category: 'venue', level: 'write' },
  { id: 'venue.read', name: 'Ver Venues', description: 'Ver información de venues', category: 'venue', level: 'read' },
  { id: 'venue.update', name: 'Editar Venues', description: 'Modificar información de venues', category: 'venue', level: 'write' },
  { id: 'venue.delete', name: 'Eliminar Venues', description: 'Eliminar venues del sistema', category: 'venue', level: 'admin', dangerous: true },
  { id: 'venue.manage', name: 'Gestionar Venue Asignado', description: 'Gestión completa del venue asignado', category: 'venue', level: 'admin' },
  
  // Wallet Permissions
  { id: 'wallet.read', name: 'Ver Wallet', description: 'Ver información de wallet y balances', category: 'wallet', level: 'read' },
  { id: 'wallet.update', name: 'Actualizar Wallet', description: 'Realizar transacciones en wallet', category: 'wallet', level: 'write' },
  { id: 'wallet.transfer', name: 'Transferir Fondos', description: 'Transferir fondos entre wallets', category: 'wallet', level: 'write' },
  { id: 'wallet.admin', name: 'Administrar Wallets', description: 'Administración completa de wallets', category: 'wallet', level: 'admin' },
  
  // User Permissions
  { id: 'users.read', name: 'Ver Usuarios', description: 'Ver información de usuarios', category: 'user', level: 'read' },
  { id: 'users.create', name: 'Crear Usuarios', description: 'Crear nuevos usuarios', category: 'user', level: 'write' },
  { id: 'users.update', name: 'Editar Usuarios', description: 'Modificar información de usuarios', category: 'user', level: 'write' },
  { id: 'users.delete', name: 'Eliminar Usuarios', description: 'Eliminar usuarios del sistema', category: 'user', level: 'admin', dangerous: true },
  { id: 'users.roles', name: 'Gestionar Roles', description: 'Asignar y modificar roles de usuario', category: 'user', level: 'admin', dangerous: true },
  
  // Analytics Permissions
  { id: 'analytics.view', name: 'Ver Analytics', description: 'Ver reportes y analytics básicos', category: 'analytics', level: 'read' },
  { id: 'analytics.advanced', name: 'Analytics Avanzados', description: 'Acceso a analytics detallados', category: 'analytics', level: 'write' },
  { id: 'analytics.export', name: 'Exportar Datos', description: 'Exportar datos y reportes', category: 'analytics', level: 'write' },
  
  // Special Permissions
  { id: 'guests.create', name: 'Crear Invitados', description: 'Invitar clientes como RP', category: 'special', level: 'write' },
  { id: 'qr.generate', name: 'Generar Códigos QR', description: 'Generar códigos QR para invitaciones', category: 'special', level: 'write' },
  { id: 'payments.create', name: 'Realizar Pagos', description: 'Procesar pagos y transacciones', category: 'special', level: 'write' },
  { id: 'payments.approve', name: 'Aprobar Pagos', description: 'Aprobar transacciones grandes', category: 'special', level: 'admin' },
];

const roleTemplates: RoleTemplate[] = [
  {
    role: UserRole.ADMIN,
    name: 'Administrador',
    description: 'Acceso completo al sistema',
    color: 'red',
    icon: ShieldCheckIcon,
    defaultPermissions: ['system.admin', 'system.settings', 'system.logs', 'venue.create', 'venue.read', 'venue.update', 'venue.delete', 'wallet.admin', 'users.read', 'users.create', 'users.update', 'users.delete', 'users.roles', 'analytics.view', 'analytics.advanced', 'analytics.export', 'payments.approve'],
    restrictions: []
  },
  {
    role: UserRole.VENUE_MANAGER,
    name: 'Manager de Venue',
    description: 'Gestión de venue específico',
    color: 'blue',
    icon: BuildingStorefrontIcon,
    defaultPermissions: ['venue.read', 'venue.manage', 'wallet.read', 'users.read', 'analytics.view', 'payments.approve'],
    restrictions: ['Solo puede gestionar su venue asignado', 'No puede crear otros managers', 'Límites en transferencias de fondos']
  },
  {
    role: UserRole.RP,
    name: 'Representante',
    description: 'Gestión de clientes invitados',
    color: 'purple',
    icon: StarIcon,
    defaultPermissions: ['guests.create', 'qr.generate', 'wallet.read', 'wallet.update', 'analytics.view'],
    restrictions: ['Solo puede ver sus propios invitados', 'Límite mensual de invitaciones', 'No puede transferir a otros RPs']
  },
  {
    role: UserRole.CLIENT,
    name: 'Cliente',
    description: 'Usuario final del sistema',
    color: 'green',
    icon: UserCircleIcon,
    defaultPermissions: ['wallet.read', 'wallet.update', 'payments.create'],
    restrictions: ['Solo puede ver su propia información', 'Límites en transferencias', 'No puede invitar otros usuarios']
  }
];

interface RoleAssignmentProps {
  userId: string;
  currentRole: UserRole;
  currentPermissions: string[];
  onRoleChange: (userId: string, newRole: UserRole, newPermissions: string[]) => void;
  onClose: () => void;
}

export function RoleAssignment({ userId, currentRole, currentPermissions, onRoleChange, onClose }: RoleAssignmentProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(currentPermissions);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const getRoleTemplate = (role: UserRole) => {
    return roleTemplates.find(template => template.role === role);
  };

  const getPermissionsByCategory = (category: Permission['category']) => {
    return permissions.filter(permission => permission.category === category);
  };

  const getCategoryIcon = (category: Permission['category']) => {
    switch (category) {
      case 'system':
        return CogIcon;
      case 'venue':
        return BuildingStorefrontIcon;
      case 'wallet':
        return BanknotesIcon;
      case 'user':
        return UsersIcon;
      case 'analytics':
        return ChartBarIcon;
      case 'special':
        return QrCodeIcon;
      default:
        return EyeIcon;
    }
  };

  const getCategoryLabel = (category: Permission['category']) => {
    switch (category) {
      case 'system':
        return 'Sistema';
      case 'venue':
        return 'Venues';
      case 'wallet':
        return 'Wallet';
      case 'user':
        return 'Usuarios';
      case 'analytics':
        return 'Analytics';
      case 'special':
        return 'Especiales';
      default:
        return 'Otros';
    }
  };

  const handleRoleChange = (newRole: UserRole) => {
    setSelectedRole(newRole);
    const template = getRoleTemplate(newRole);
    if (template) {
      setSelectedPermissions(template.defaultPermissions);
    }
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSave = () => {
    onRoleChange(userId, selectedRole, selectedPermissions);
    onClose();
  };

  const hasChanges = selectedRole !== currentRole || 
                    JSON.stringify(selectedPermissions.sort()) !== JSON.stringify(currentPermissions.sort());

  const dangerouspermissions = selectedPermissions.filter(permId => 
    permissions.find(p => p.id === permId)?.dangerous
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Asignación de Rol y Permisos
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Gestiona el rol y permisos específicos para este usuario
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Role Selection */}
          <div>
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
              Seleccionar Rol
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {roleTemplates.map((template) => {
                const Icon = template.icon;
                const isSelected = selectedRole === template.role;
                
                return (
                  <div
                    key={template.role}
                    onClick={() => handleRoleChange(template.role)}
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
                        `bg-${template.color}-100 dark:bg-${template.color}-900/20`
                      )}>
                        <Icon className={cn('h-6 w-6', `text-${template.color}-600`)} />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 dark:text-white">
                          {template.name}
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {template.description}
                        </p>
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <CheckIcon className="h-5 w-5 text-mandala-primary" />
                      </div>
                    )}

                    {template.restrictions && template.restrictions.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          <span className="font-medium">Restricciones:</span>
                        </p>
                        <ul className="text-xs text-gray-500 dark:text-gray-400 mt-1 space-y-1">
                          {template.restrictions.slice(0, 2).map((restriction, index) => (
                            <li key={index}>• {restriction}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Permission Summary */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-medium text-gray-900 dark:text-white">
                Resumen de Permisos ({selectedPermissions.length})
              </h5>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-sm text-mandala-primary hover:text-mandala-primary/80"
              >
                {showAdvanced ? 'Vista Simple' : 'Vista Avanzada'}
              </button>
            </div>
            
            {dangerouspermissions.length > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-3">
                <div className="flex items-start space-x-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Permisos Peligrosos Seleccionados
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      Este usuario tendrá acceso a funciones críticas del sistema que pueden afectar la seguridad y estabilidad.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {selectedPermissions.map(permissionId => {
                const permission = permissions.find(p => p.id === permissionId);
                if (!permission) return null;
                
                return (
                  <span
                    key={permissionId}
                    className={cn(
                      'px-2 py-1 text-xs font-medium rounded-full',
                      permission.dangerous 
                        ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                    )}
                  >
                    {permission.name}
                    {permission.dangerous && ' ⚠️'}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Advanced Permissions */}
          {showAdvanced && (
            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                Configuración Avanzada de Permisos
              </h4>
              
              <div className="space-y-6">
                {(['system', 'venue', 'wallet', 'user', 'analytics', 'special'] as const).map(category => {
                  const categoryPermissions = getPermissionsByCategory(category);
                  const Icon = getCategoryIcon(category);
                  
                  if (categoryPermissions.length === 0) return null;
                  
                  return (
                    <div key={category} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                          <h5 className="font-medium text-gray-900 dark:text-white">
                            {getCategoryLabel(category)}
                          </h5>
                        </div>
                      </div>
                      
                      <div className="p-4 space-y-3">
                        {categoryPermissions.map(permission => {
                          const isSelected = selectedPermissions.includes(permission.id);
                          
                          return (
                            <div
                              key={permission.id}
                              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => togglePermission(permission.id)}
                                className="h-4 w-4 text-mandala-primary focus:ring-mandala-primary border-gray-300 rounded mt-1"
                              />
                              
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {permission.name}
                                  </span>
                                  {permission.dangerous && (
                                    <span className="text-red-500" title="Permiso peligroso">
                                      ⚠️
                                    </span>
                                  )}
                                  <span className={cn(
                                    'px-2 py-0.5 text-xs font-medium rounded-full',
                                    permission.level === 'read' && 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
                                    permission.level === 'write' && 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
                                    permission.level === 'admin' && 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                                  )}>
                                    {permission.level === 'read' && 'Lectura'}
                                    {permission.level === 'write' && 'Escritura'}
                                    {permission.level === 'admin' && 'Admin'}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {permission.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {hasChanges ? (
                <span className="flex items-center space-x-1">
                  <ClockIcon className="h-4 w-4" />
                  <span>Cambios pendientes</span>
                </span>
              ) : (
                <span>Sin cambios</span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mandala-primary dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Cancelar
              </button>
              
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className="px-4 py-2 text-sm font-medium text-white bg-mandala-primary border border-transparent rounded-md hover:bg-mandala-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mandala-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 