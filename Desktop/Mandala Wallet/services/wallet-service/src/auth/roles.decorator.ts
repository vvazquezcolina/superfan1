// Roles Decorator
// This decorator defines required roles for controller methods

import { UserRole } from '@mandala/shared-types';

// Simple role storage for development
// In production, this would use NestJS's SetMetadata decorator
const ROLES_METADATA_KEY = 'roles';
const rolesMetadata = new Map<string, UserRole[]>();

// Store roles for a method
export function Roles(...roles: UserRole[]) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const className = target.constructor.name;
    const methodKey = `${className}.${propertyKey}`;
    rolesMetadata.set(methodKey, roles);
    
    // In development, just log the roles assignment
    console.log(`Roles assigned to ${methodKey}:`, roles);
    
    return descriptor;
  };
}

// Get roles for a method
export function getRoles(target: any, methodName: string): UserRole[] {
  const className = target.constructor.name;
  const methodKey = `${className}.${methodName}`;
  return rolesMetadata.get(methodKey) || [];
}

// Check if method has specific role requirement
export function hasRoleRequirement(target: any, methodName: string, role: UserRole): boolean {
  const roles = getRoles(target, methodName);
  return roles.includes(role);
}

// Get all roles metadata (for debugging)
export function getAllRolesMetadata(): Map<string, UserRole[]> {
  return new Map(rolesMetadata);
}

// Clear roles metadata (for testing)
export function clearRolesMetadata(): void {
  rolesMetadata.clear();
}

// Role validation helpers
export const RoleValidation = {
  // Check if user has admin role
  isAdmin: (roles: UserRole[]): boolean => roles.includes(UserRole.ADMIN),
  
  // Check if user has manager role
  isManager: (roles: UserRole[]): boolean => 
    roles.includes(UserRole.ADMIN) || roles.includes(UserRole.VENUE_MANAGER),
  
  // Check if user has RP role
  isRP: (roles: UserRole[]): boolean => 
    roles.includes(UserRole.ADMIN) || 
    roles.includes(UserRole.VENUE_MANAGER) || 
    roles.includes(UserRole.RP),
  
  // Check if user can access resource
  canAccess: (userRoles: UserRole[], requiredRoles: UserRole[]): boolean =>
    requiredRoles.some(role => userRoles.includes(role)),
  
  // Get highest privilege role
  getHighestRole: (roles: UserRole[]): UserRole => {
    if (roles.includes(UserRole.ADMIN)) return UserRole.ADMIN;
    if (roles.includes(UserRole.VENUE_MANAGER)) return UserRole.VENUE_MANAGER;
    if (roles.includes(UserRole.RP)) return UserRole.RP;
    return UserRole.CLIENT;
  }
}; 