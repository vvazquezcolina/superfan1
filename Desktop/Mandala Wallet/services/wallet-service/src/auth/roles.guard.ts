// Roles Guard
// This guard ensures users have the required roles to access protected resources

import { AuthService } from './auth.service';
import { User, UserRole } from '@mandala/shared-types';

export class RolesGuard {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  // Check if user has required roles
  canActivate(request: any, requiredRoles: UserRole[]): boolean {
    try {
      const user: User = request.user;
      
      if (!user) {
        return false;
      }

      // Check if user has any of the required roles
      return this.authService.hasAnyRole(user, requiredRoles);

    } catch (error) {
      console.error('Roles Guard error:', error);
      return false;
    }
  }

  // Check if user has specific role
  hasRole(request: any, role: UserRole): boolean {
    try {
      const user: User = request.user;
      
      if (!user) {
        return false;
      }

      return this.authService.hasRole(user, role);

    } catch (error) {
      console.error('Role check error:', error);
      return false;
    }
  }

  // Check if user has all required roles
  hasAllRoles(request: any, roles: UserRole[]): boolean {
    try {
      const user: User = request.user;
      
      if (!user) {
        return false;
      }

      return roles.every(role => this.authService.hasRole(user, role));

    } catch (error) {
      console.error('All roles check error:', error);
      return false;
    }
  }

  // Check if user has permission
  hasPermission(request: any, permission: string): boolean {
    try {
      const user: User = request.user;
      
      if (!user) {
        return false;
      }

      const permissions = this.authService.getUserPermissions(user);
      return permissions.includes(permission);

    } catch (error) {
      console.error('Permission check error:', error);
      return false;
    }
  }

  // Check if user owns resource
  isResourceOwner(request: any, resourceUserId: string): boolean {
    try {
      const user: User = request.user;
      
      if (!user) {
        return false;
      }

      return user.id === resourceUserId;

    } catch (error) {
      console.error('Resource ownership check error:', error);
      return false;
    }
  }

  // Check if user can access venue
  canAccessVenue(request: any, venueId: string): boolean {
    try {
      const user: User = request.user;
      
      if (!user) {
        return false;
      }

      // Admin can access all venues
      if (this.authService.hasRole(user, UserRole.ADMIN)) {
        return true;
      }

      // Venue manager can access their venues (would need venue lookup)
      if (this.authService.hasRole(user, UserRole.VENUE_MANAGER)) {
        // In production, this would check if user manages this venue
        return true;
      }

      // RP and clients can access venues they have transactions at
      if (this.authService.hasRole(user, UserRole.RP) || 
          this.authService.hasRole(user, UserRole.CLIENT)) {
        // In production, this would check transaction history
        return true;
      }

      return false;

    } catch (error) {
      console.error('Venue access check error:', error);
      return false;
    }
  }

  // Validate admin access
  isAdmin(request: any): boolean {
    return this.hasRole(request, UserRole.ADMIN);
  }

  // Validate venue manager access
  isVenueManager(request: any): boolean {
    const user: User = request.user;
    return user && (
      this.authService.hasRole(user, UserRole.ADMIN) ||
      this.authService.hasRole(user, UserRole.VENUE_MANAGER)
    );
  }

  // Validate RP access
  isRP(request: any): boolean {
    const user: User = request.user;
    return user && (
      this.authService.hasRole(user, UserRole.ADMIN) ||
      this.authService.hasRole(user, UserRole.VENUE_MANAGER) ||
      this.authService.hasRole(user, UserRole.RP)
    );
  }

  // Handle authorization failure
  handleAuthorizationFailure(request: any, response: any, requiredRoles: UserRole[]): void {
    response.status(403).json({
      success: false,
      error: 'Forbidden',
      message: `Access denied. Required roles: ${requiredRoles.join(', ')}`,
      timestamp: new Date()
    });
  }

  // Handle insufficient permissions
  handleInsufficientPermissions(request: any, response: any, permission: string): void {
    response.status(403).json({
      success: false,
      error: 'Insufficient Permissions',
      message: `Permission '${permission}' required`,
      timestamp: new Date()
    });
  }

  // Create middleware for role checking
  createRoleMiddleware(requiredRoles: UserRole[]) {
    return (request: any, response: any, next: any) => {
      const hasAccess = this.canActivate(request, requiredRoles);
      
      if (!hasAccess) {
        this.handleAuthorizationFailure(request, response, requiredRoles);
        return;
      }

      if (next) {
        next();
      }
    };
  }

  // Create middleware for permission checking
  createPermissionMiddleware(permission: string) {
    return (request: any, response: any, next: any) => {
      const hasPermission = this.hasPermission(request, permission);
      
      if (!hasPermission) {
        this.handleInsufficientPermissions(request, response, permission);
        return;
      }

      if (next) {
        next();
      }
    };
  }

  // Create middleware for resource ownership checking
  createOwnershipMiddleware(getResourceUserId: (request: any) => string) {
    return (request: any, response: any, next: any) => {
      const resourceUserId = getResourceUserId(request);
      const isOwner = this.isResourceOwner(request, resourceUserId);
      const isAdmin = this.isAdmin(request);
      
      if (!isOwner && !isAdmin) {
        response.status(403).json({
          success: false,
          error: 'Forbidden',
          message: 'Access denied. You can only access your own resources',
          timestamp: new Date()
        });
        return;
      }

      if (next) {
        next();
      }
    };
  }
} 