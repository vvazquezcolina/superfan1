// Current User Decorator
// This decorator extracts the authenticated user from the request

import { User } from '@mandala/shared-types';

// Simple user extraction for development
// In production, this would use NestJS's createParamDecorator

// Store the current user context
let currentUserContext: User | null = null;

// Decorator function for extracting current user
export function CurrentUser() {
  return function(target: any, propertyKey: string | symbol | undefined, parameterIndex: number) {
    // In development, just mark the parameter for user injection
    console.log(`CurrentUser decorator applied to parameter ${parameterIndex} of ${target.constructor.name}.${String(propertyKey)}`);
  };
}

// Helper function to set current user (for middleware)
export function setCurrentUser(user: User): void {
  currentUserContext = user;
}

// Helper function to get current user
export function getCurrentUser(): User | null {
  return currentUserContext;
}

// Helper function to clear current user (for cleanup)
export function clearCurrentUser(): void {
  currentUserContext = null;
}

// Middleware function to extract user from request
export function extractUserFromRequest(request: any): User | null {
  if (request.user) {
    setCurrentUser(request.user);
    return request.user;
  }
  return null;
}

// Create middleware for user extraction
export function createUserExtractionMiddleware() {
  return (request: any, response: any, next: any) => {
    extractUserFromRequest(request);
    if (next) {
      next();
    }
  };
}

// User context helpers
export const UserContext = {
  // Get current user ID
  getCurrentUserId: (): string | null => {
    const user = getCurrentUser();
    return user ? user.id : null;
  },

  // Get current user email
  getCurrentUserEmail: (): string | null => {
    const user = getCurrentUser();
    return user ? user.email : null;
  },

  // Get current user roles
  getCurrentUserRoles: (): string[] => {
    const user = getCurrentUser();
    return user ? user.roles : [];
  },

  // Check if current user is authenticated
  isAuthenticated: (): boolean => {
    return getCurrentUser() !== null;
  },

  // Check if current user has role
  hasRole: (role: string): boolean => {
    const user = getCurrentUser();
    return user ? user.roles.includes(role as any) : false;
  },

  // Check if current user is active
  isActive: (): boolean => {
    const user = getCurrentUser();
    return user ? user.isActive : false;
  },

  // Check if current user email is verified
  isEmailVerified: (): boolean => {
    const user = getCurrentUser();
    return user ? user.emailVerified : false;
  },

  // Get user display name
  getDisplayName: (): string | null => {
    const user = getCurrentUser();
    return user ? (user.displayName || user.email) : null;
  }
};

// Request user extraction utilities
export const RequestUserUtils = {
  // Extract user from Authorization header
  extractFromAuthHeader: (request: any): User | null => {
    const authHeader = request.headers?.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // In production, this would decode and validate the JWT token
      // For development, return a mock user if token is present
      return {
        id: 'mock_user_id',
        email: 'user@mandala.local',
        roles: ['client'],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        emailVerified: true
      } as any;
    }
    return null;
  },

  // Extract user from session
  extractFromSession: (request: any): User | null => {
    return request.session?.user || null;
  },

  // Extract user from cookies
  extractFromCookies: (request: any): User | null => {
    const userCookie = request.cookies?.user;
    if (userCookie) {
      try {
        return JSON.parse(userCookie);
      } catch (error) {
        console.error('Error parsing user cookie:', error);
        return null;
      }
    }
    return null;
  },

  // Extract user with fallback methods
  extractWithFallback: (request: any): User | null => {
    // Try multiple extraction methods
    let user = request.user; // Preferred method
    
    if (!user) {
      user = RequestUserUtils.extractFromAuthHeader(request);
    }
    
    if (!user) {
      user = RequestUserUtils.extractFromSession(request);
    }
    
    if (!user) {
      user = RequestUserUtils.extractFromCookies(request);
    }

    return user;
  }
}; 