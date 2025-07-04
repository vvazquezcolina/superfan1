'use client';

import React, { useState } from 'react';
import { cn, formatDate } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { UserRole } from '@mandala/shared-types';
import {
  UsersIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  AtSymbolIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarDaysIcon,
  ClockIcon,
  BanknotesIcon,
  StarIcon,
  CogIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/outline';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'suspended' | 'pending_verification';
  profile: {
    firstName: string;
    lastName: string;
    phone?: string;
    address?: string;
    city?: string;
    profileImage?: string;
  };
  venueId?: string; // For venue managers
  sponsorId?: string; // For RPs
  permissions: string[];
  loginHistory: {
    lastLogin: Date;
    loginCount: number;
    lastIpAddress?: string;
  };
  walletInfo?: {
    totalBalance: number;
    transactionCount: number;
    lastTransaction: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@mandala.mx',
    name: 'Super Admin',
    role: UserRole.ADMIN,
    status: 'active',
    profile: {
      firstName: 'Juan',
      lastName: 'Pérez',
      phone: '+52-998-123-4567',
      address: 'Av. Revolución 123',
      city: 'Cancún, Q.R.',
      profileImage: '/avatars/admin.jpg'
    },
    permissions: ['*'],
    loginHistory: {
      lastLogin: new Date('2024-01-20T10:30:00Z'),
      loginCount: 156,
      lastIpAddress: '192.168.1.100'
    },
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    email: 'manager@mandalabeach.com',
    name: 'Carlos Rodriguez',
    role: UserRole.VENUE_MANAGER,
    status: 'active',
    profile: {
      firstName: 'Carlos',
      lastName: 'Rodriguez',
      phone: '+52-998-765-4321',
      address: 'Zona Hotelera Km 9',
      city: 'Cancún, Q.R.'
    },
    venueId: 'mandala-beach-club',
    permissions: ['venue.read', 'venue.update', 'transactions.read', 'users.read'],
    loginHistory: {
      lastLogin: new Date('2024-01-20T14:15:00Z'),
      loginCount: 89,
      lastIpAddress: '10.0.0.45'
    },
    walletInfo: {
      totalBalance: 5000,
      transactionCount: 23,
      lastTransaction: new Date('2024-01-19')
    },
    createdAt: new Date('2023-02-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '3',
    email: 'rp.maria@mandala.mx',
    name: 'María González',
    role: UserRole.RP,
    status: 'active',
    profile: {
      firstName: 'María',
      lastName: 'González',
      phone: '+52-998-555-7890',
      address: 'Col. Centro',
      city: 'Cancún, Q.R.'
    },
    sponsorId: 'mandala-beach-club',
    permissions: ['guests.create', 'guests.read', 'wallet.read', 'qr.generate'],
    loginHistory: {
      lastLogin: new Date('2024-01-20T16:45:00Z'),
      loginCount: 67,
      lastIpAddress: '10.0.0.78'
    },
    walletInfo: {
      totalBalance: 2500,
      transactionCount: 45,
      lastTransaction: new Date('2024-01-20')
    },
    createdAt: new Date('2023-03-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '4',
    email: 'client@gmail.com',
    name: 'Ana López',
    role: UserRole.CLIENT,
    status: 'active',
    profile: {
      firstName: 'Ana',
      lastName: 'López',
      phone: '+52-998-777-1234',
      city: 'Cancún, Q.R.'
    },
    permissions: ['wallet.read', 'wallet.update', 'transactions.read', 'payments.create'],
    loginHistory: {
      lastLogin: new Date('2024-01-20T18:20:00Z'),
      loginCount: 234,
      lastIpAddress: '192.168.1.50'
    },
    walletInfo: {
      totalBalance: 850,
      transactionCount: 78,
      lastTransaction: new Date('2024-01-20')
    },
    createdAt: new Date('2023-06-10'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '5',
    email: 'inactive@example.com',
    name: 'Roberto Martínez',
    role: UserRole.CLIENT,
    status: 'inactive',
    profile: {
      firstName: 'Roberto',
      lastName: 'Martínez',
      phone: '+52-998-888-5678',
      city: 'Playa del Carmen, Q.R.'
    },
    permissions: ['wallet.read', 'transactions.read'],
    loginHistory: {
      lastLogin: new Date('2023-12-15T09:30:00Z'),
      loginCount: 12,
      lastIpAddress: '192.168.1.25'
    },
    walletInfo: {
      totalBalance: 0,
      transactionCount: 5,
      lastTransaction: new Date('2023-12-10')
    },
    createdAt: new Date('2023-11-20'),
    updatedAt: new Date('2023-12-15')
  },
  {
    id: '6',
    email: 'pending@example.com',
    name: 'Sofía Hernández',
    role: UserRole.CLIENT,
    status: 'pending_verification',
    profile: {
      firstName: 'Sofía',
      lastName: 'Hernández',
      phone: '+52-998-333-9999'
    },
    permissions: [],
    loginHistory: {
      lastLogin: new Date('2024-01-18T12:00:00Z'),
      loginCount: 1,
      lastIpAddress: '192.168.1.75'
    },
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  }
];

export function UserManagement() {
  const { hasAnyRole } = useAuth();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | UserRole>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | User['status']>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Only allow admins to access user management
  if (!hasAnyRole([UserRole.ADMIN])) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          No tienes permisos para acceder a la gestión de usuarios.
        </p>
      </div>
    );
  }

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      case UserRole.VENUE_MANAGER:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case UserRole.RP:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100';
      case UserRole.CLIENT:
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'Administrador';
      case UserRole.VENUE_MANAGER:
        return 'Manager de Venue';
      case UserRole.RP:
        return 'Representante';
      case UserRole.CLIENT:
        return 'Cliente';
      default:
        return 'Desconocido';
    }
  };

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      case 'pending_verification':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: User['status']) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'inactive':
        return 'Inactivo';
      case 'suspended':
        return 'Suspendido';
      case 'pending_verification':
        return 'Pendiente Verificación';
      default:
        return 'Desconocido';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.profile.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.profile.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    admins: users.filter(u => u.role === UserRole.ADMIN).length,
    venueManagers: users.filter(u => u.role === UserRole.VENUE_MANAGER).length,
    rps: users.filter(u => u.role === UserRole.RP).length,
    clients: users.filter(u => u.role === UserRole.CLIENT).length,
    pendingVerification: users.filter(u => u.status === 'pending_verification').length,
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    setSelectedUsers(filteredUsers.map(user => user.id));
  };

  const clearSelection = () => {
    setSelectedUsers([]);
  };

  const updateUserStatus = (userId: string, newStatus: User['status']) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: newStatus, updatedAt: new Date() }
        : user
    ));
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, role: newRole, updatedAt: new Date() }
        : user
    ));
  };

  const deleteUser = (userId: string) => {
    if (confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const bulkUpdateStatus = (status: User['status']) => {
    setUsers(users.map(user => 
      selectedUsers.includes(user.id) 
        ? { ...user, status, updatedAt: new Date() }
        : user
    ));
    setSelectedUsers([]);
    setShowBulkActions(false);
  };

  const exportUsers = () => {
    const csvData = filteredUsers.map(user => ({
      ID: user.id,
      Email: user.email,
      Nombre: user.name,
      Rol: getRoleLabel(user.role),
      Estado: getStatusLabel(user.status),
      Teléfono: user.profile.phone || '',
      Ciudad: user.profile.city || '',
      'Último Login': user.loginHistory.lastLogin.toLocaleDateString('es-MX'),
      'Creado': user.createdAt.toLocaleDateString('es-MX')
    }));

    const csvContent = "data:text/csv;charset=utf-8," + 
      Object.keys(csvData[0]).join(",") + "\n" +
      csvData.map(row => Object.values(row).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `usuarios_mandala_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestión de Usuarios
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Administra usuarios, roles y permisos del sistema
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={exportUsers}
            className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            <span>Exportar</span>
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-mandala-primary text-white px-4 py-2 rounded-lg hover:bg-mandala-primary/90 transition-colors flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Nuevo Usuario</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {userStats.total}
              </p>
            </div>
            <UsersIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Activos</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {userStats.active}
              </p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Admins</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {userStats.admins}
              </p>
            </div>
            <ShieldCheckIcon className="h-8 w-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Managers</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {userStats.venueManagers}
              </p>
            </div>
            <UserGroupIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">RPs</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {userStats.rps}
              </p>
            </div>
            <StarIcon className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Clientes</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {userStats.clients}
              </p>
            </div>
            <UserCircleIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pendientes</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {userStats.pendingVerification}
              </p>
            </div>
            <ClockIcon className="h-8 w-8 text-yellow-500" />
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
                placeholder="Buscar usuarios por nombre, email, teléfono..."
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
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="text-sm border-gray-300 rounded-md focus:ring-mandala-primary focus:border-mandala-primary dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="all">Todos los roles</option>
              <option value={UserRole.ADMIN}>Administradores</option>
              <option value={UserRole.VENUE_MANAGER}>Managers</option>
              <option value={UserRole.RP}>RPs</option>
              <option value={UserRole.CLIENT}>Clientes</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="text-sm border-gray-300 rounded-md focus:ring-mandala-primary focus:border-mandala-primary dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
              <option value="suspended">Suspendidos</option>
              <option value="pending_verification">Pendientes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bg-mandala-primary/10 border border-mandala-primary/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <p className="text-sm font-medium text-mandala-primary">
                {selectedUsers.length} usuario{selectedUsers.length > 1 ? 's' : ''} seleccionado{selectedUsers.length > 1 ? 's' : ''}
              </p>
              <button
                onClick={clearSelection}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Limpiar selección
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => bulkUpdateStatus('active')}
                className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-md hover:bg-green-200 dark:bg-green-800 dark:text-green-100"
              >
                Activar
              </button>
              <button
                onClick={() => bulkUpdateStatus('inactive')}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100"
              >
                Desactivar
              </button>
              <button
                onClick={() => bulkUpdateStatus('suspended')}
                className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-md hover:bg-red-200 dark:bg-red-800 dark:text-red-100"
              >
                Suspender
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={selectedUsers.length === filteredUsers.length ? clearSelection : selectAllUsers}
                    className="h-4 w-4 text-mandala-primary focus:ring-mandala-primary border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Último Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Wallet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      className="h-4 w-4 text-mandala-primary focus:ring-mandala-primary border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.profile.profileImage ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={user.profile.profileImage}
                            alt={user.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-mandala-primary/10 flex items-center justify-center">
                            <UserCircleIcon className="h-6 w-6 text-mandala-primary" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                        {user.profile.phone && (
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            {user.profile.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getRoleColor(user.role))}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getStatusColor(user.status))}>
                      {getStatusLabel(user.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div>
                      {formatDate(user.loginHistory.lastLogin)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {user.loginHistory.loginCount} sesiones
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {user.walletInfo ? (
                      <div>
                        <div className="font-medium">
                          ${user.walletInfo.totalBalance.toLocaleString('es-MX')}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {user.walletInfo.transactionCount} transacciones
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">Sin wallet</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-mandala-primary hover:text-mandala-primary/80"
                        title="Ver detalles"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        title="Editar usuario"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      
                      <button
                        className="text-gray-400 hover:text-gray-600"
                        title="Configuración"
                      >
                        <CogIcon className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Eliminar usuario"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* No Results */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No se encontraron usuarios
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Intenta ajustar los filtros de búsqueda o crear un nuevo usuario.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-mandala-primary text-white px-4 py-2 rounded-lg hover:bg-mandala-primary/90 transition-colors"
          >
            Crear Nuevo Usuario
          </button>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Detalles del Usuario: {selectedUser.name}
                </h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Información Personal</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email:</span>
                      <span className="text-gray-900 dark:text-white">{selectedUser.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Rol:</span>
                      <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getRoleColor(selectedUser.role))}>
                        {getRoleLabel(selectedUser.role)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Estado:</span>
                      <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getStatusColor(selectedUser.status))}>
                        {getStatusLabel(selectedUser.status)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Teléfono:</span>
                      <span className="text-gray-900 dark:text-white">{selectedUser.profile.phone || 'No especificado'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ciudad:</span>
                      <span className="text-gray-900 dark:text-white">{selectedUser.profile.city || 'No especificado'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Información de Cuenta</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Último Login:</span>
                      <span className="text-gray-900 dark:text-white">
                        {formatDate(selectedUser.loginHistory.lastLogin)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Logins:</span>
                      <span className="text-gray-900 dark:text-white">{selectedUser.loginHistory.loginCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Última IP:</span>
                      <span className="text-gray-900 dark:text-white">
                        {selectedUser.loginHistory.lastIpAddress || 'No disponible'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Creado:</span>
                      <span className="text-gray-900 dark:text-white">
                        {formatDate(selectedUser.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Actualizado:</span>
                      <span className="text-gray-900 dark:text-white">
                        {formatDate(selectedUser.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedUser.walletInfo && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Información de Wallet</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <p className="text-2xl font-bold text-mandala-primary">
                        ${selectedUser.walletInfo.totalBalance.toLocaleString('es-MX')}
                      </p>
                      <p className="text-sm text-gray-500">Balance Total</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedUser.walletInfo.transactionCount}
                      </p>
                      <p className="text-sm text-gray-500">Transacciones</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <p className="text-sm font-bold text-green-600">
                        {formatDate(selectedUser.walletInfo.lastTransaction)}
                      </p>
                      <p className="text-sm text-gray-500">Última Transacción</p>
                    </div>
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