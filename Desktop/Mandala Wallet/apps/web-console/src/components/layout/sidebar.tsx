'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { UserRole } from '@mandala/shared-types';
import {
  HomeIcon,
  BuildingStorefrontIcon,
  UsersIcon,
  CreditCardIcon,
  ChartBarIcon,
  CogIcon,
  BanknotesIcon,
  MapPinIcon,
  GiftIcon,
  DocumentTextIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  requiredRoles: UserRole[];
  badge?: string;
  children?: NavigationItem[];
}

const navigation: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    requiredRoles: [UserRole.ADMIN, UserRole.VENUE_MANAGER],
  },
  {
    name: 'Venues',
    href: '/dashboard/venues',
    icon: BuildingStorefrontIcon,
    requiredRoles: [UserRole.ADMIN, UserRole.VENUE_MANAGER],
    children: [
      {
        name: 'Gestión Global',
        href: '/dashboard/venues',
        icon: BuildingStorefrontIcon,
        requiredRoles: [UserRole.ADMIN],
      },
      {
        name: 'Mi Venue',
        href: '/dashboard/venues/my-venue',
        icon: MapPinIcon,
        requiredRoles: [UserRole.VENUE_MANAGER],
      },
      {
        name: 'Configuración',
        href: '/dashboard/venues/settings',
        icon: CogIcon,
        requiredRoles: [UserRole.ADMIN, UserRole.VENUE_MANAGER],
      },
    ],
  },
  {
    name: 'Usuarios',
    href: '/dashboard/users',
    icon: UsersIcon,
    requiredRoles: [UserRole.ADMIN],
    children: [
      {
        name: 'Gestión de Usuarios',
        href: '/dashboard/users',
        icon: UsersIcon,
        requiredRoles: [UserRole.ADMIN],
      },
      {
        name: 'Roles y Permisos',
        href: '/dashboard/users/roles',
        icon: CogIcon,
        requiredRoles: [UserRole.ADMIN],
      },
    ],
  },
  {
    name: 'Transacciones',
    href: '/dashboard/transactions',
    icon: CreditCardIcon,
    requiredRoles: [UserRole.ADMIN, UserRole.VENUE_MANAGER],
    children: [
      {
        name: 'Monitoreo en Vivo',
        href: '/dashboard/transactions/live',
        icon: ClockIcon,
        requiredRoles: [UserRole.ADMIN, UserRole.VENUE_MANAGER],
        badge: 'Live',
      },
      {
        name: 'Historial',
        href: '/dashboard/transactions/history',
        icon: DocumentTextIcon,
        requiredRoles: [UserRole.ADMIN, UserRole.VENUE_MANAGER],
      },
      {
        name: 'Aprobaciones',
        href: '/dashboard/approvals',
        icon: ExclamationTriangleIcon,
        requiredRoles: [UserRole.ADMIN],
        badge: '3',
      },
    ],
  },
  {
    name: 'Pagos',
    href: '/dashboard/payments',
    icon: BanknotesIcon,
    requiredRoles: [UserRole.ADMIN, UserRole.VENUE_MANAGER],
    children: [
      {
        name: 'Procesamiento',
        href: '/dashboard/payments/processing',
        icon: CreditCardIcon,
        requiredRoles: [UserRole.ADMIN, UserRole.VENUE_MANAGER],
      },
      {
        name: 'Reconciliación',
        href: '/dashboard/payments/reconciliation',
        icon: ChartBarIcon,
        requiredRoles: [UserRole.ADMIN],
      },
    ],
  },
  {
    name: 'Gamificación',
    href: '/dashboard/gamification',
    icon: GiftIcon,
    requiredRoles: [UserRole.ADMIN, UserRole.VENUE_MANAGER],
    children: [
      {
        name: 'Puntos y Tiers',
        href: '/dashboard/gamification/points',
        icon: GiftIcon,
        requiredRoles: [UserRole.ADMIN, UserRole.VENUE_MANAGER],
      },
      {
        name: 'Recompensas',
        href: '/dashboard/gamification/rewards',
        icon: GiftIcon,
        requiredRoles: [UserRole.ADMIN, UserRole.VENUE_MANAGER],
      },
      {
        name: 'Pasaportes QR',
        href: '/dashboard/gamification/passports',
        icon: DocumentTextIcon,
        requiredRoles: [UserRole.ADMIN, UserRole.VENUE_MANAGER],
      },
    ],
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: ChartBarIcon,
    requiredRoles: [UserRole.ADMIN, UserRole.VENUE_MANAGER],
    children: [
      {
        name: 'Dashboard Principal',
        href: '/dashboard/analytics',
        icon: ChartBarIcon,
        requiredRoles: [UserRole.ADMIN, UserRole.VENUE_MANAGER],
      },
      {
        name: 'Reportes Avanzados',
        href: '/dashboard/analytics/reports',
        icon: DocumentTextIcon,
        requiredRoles: [UserRole.ADMIN],
      },
    ],
  },
  {
    name: 'Configuración',
    href: '/dashboard/settings',
    icon: CogIcon,
    requiredRoles: [UserRole.ADMIN],
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pathname = usePathname();
  const { user, hasAnyRole } = useAuth();

  const toggleExpanded = (href: string) => {
    setExpandedItems(prev => 
      prev.includes(href) 
        ? prev.filter(item => item !== href)
        : [...prev, href]
    );
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const filteredNavigation = navigation.filter(item => 
    hasAnyRole(item.requiredRoles)
  );

  return (
    <div className={cn(
      'flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300',
      collapsed ? 'w-16' : 'w-64'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-mandala-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Mandala
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Console
              </p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
        >
          {collapsed ? (
            <Bars3Icon className="h-5 w-5" />
          ) : (
            <XMarkIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {filteredNavigation.map((item) => (
          <div key={item.name}>
            {item.children ? (
              <div>
                <button
                  onClick={() => toggleExpanded(item.href)}
                  className={cn(
                    'w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive(item.href)
                      ? 'bg-mandala-primary text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 flex-shrink-0 h-5 w-5',
                      isActive(item.href)
                        ? 'text-white'
                        : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                    )}
                  />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.name}</span>
                      {item.badge && (
                        <span className={cn(
                          'ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                          item.badge === 'Live'
                            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                            : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                        )}>
                          {item.badge}
                        </span>
                      )}
                      <svg
                        className={cn(
                          'ml-2 h-4 w-4 transition-transform',
                          expandedItems.includes(item.href) ? 'rotate-90' : ''
                        )}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
                {!collapsed && expandedItems.includes(item.href) && (
                  <div className="mt-1 space-y-1">
                    {item.children
                      .filter(child => hasAnyRole(child.requiredRoles))
                      .map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={cn(
                            'group flex items-center pl-8 pr-2 py-2 text-sm font-medium rounded-md transition-colors',
                            isActive(child.href)
                              ? 'bg-mandala-primary/10 text-mandala-primary border-r-2 border-mandala-primary'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                          )}
                        >
                          <child.icon
                            className={cn(
                              'mr-3 flex-shrink-0 h-4 w-4',
                              isActive(child.href)
                                ? 'text-mandala-primary'
                                : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                            )}
                          />
                          <span className="flex-1">{child.name}</span>
                          {child.badge && (
                            <span className={cn(
                              'ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                              child.badge === 'Live'
                                ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                            )}>
                              {child.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={item.href}
                className={cn(
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive(item.href)
                    ? 'bg-mandala-primary text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 flex-shrink-0 h-5 w-5',
                    isActive(item.href)
                      ? 'text-white'
                      : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                  )}
                />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <span className={cn(
                        'ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                        item.badge === 'Live'
                          ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                          : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* User Info */}
      {!collapsed && user && (
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-mandala-secondary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.displayName?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user.displayName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user.roles?.join(', ').replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 