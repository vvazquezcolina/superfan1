'use client';

import React, { useState } from 'react';
import { UserManagement } from '@/components/users/user-management';
import { RoleAssignment } from '@/components/users/role-assignment';
import { useAuth } from '@/providers/auth-provider';
import { UserRole } from '@mandala/shared-types';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function UsersPage() {
  const { hasAnyRole } = useAuth();
  const [showRoleAssignment, setShowRoleAssignment] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedUserRole, setSelectedUserRole] = useState<UserRole>(UserRole.CLIENT);
  const [selectedUserPermissions, setSelectedUserPermissions] = useState<string[]>([]);

  // Only allow admins to access user management
  if (!hasAnyRole([UserRole.ADMIN])) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Acceso Restringido
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Solo los administradores pueden acceder a la gestión de usuarios.
          </p>
        </div>
      </div>
    );
  }

  const openRoleAssignment = (userId: string, currentRole: UserRole, currentPermissions: string[]) => {
    setSelectedUserId(userId);
    setSelectedUserRole(currentRole);
    setSelectedUserPermissions(currentPermissions);
    setShowRoleAssignment(true);
  };

  const handleRoleChange = (userId: string, newRole: UserRole, newPermissions: string[]) => {
    // Mock implementation - in real app, this would call an API
    console.log('Updating user role:', { userId, newRole, newPermissions });
    
    // Simulate API call
    setTimeout(() => {
      setShowRoleAssignment(false);
      // In real app, refresh the users list
      alert(`Rol actualizado exitosamente para el usuario ${userId}.`);
    }, 1000);
  };

  const closeRoleAssignment = () => {
    setShowRoleAssignment(false);
    setSelectedUserId('');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestión de Usuarios
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Administra usuarios, roles y permisos del sistema Mandala Wallet
        </p>
      </div>

      {/* User Management Component */}
      <UserManagement />

      {/* Role Assignment Modal */}
      {showRoleAssignment && (
        <RoleAssignment
          userId={selectedUserId}
          currentRole={selectedUserRole}
          currentPermissions={selectedUserPermissions}
          onRoleChange={handleRoleChange}
          onClose={closeRoleAssignment}
        />
      )}
    </div>
  );
} 