// JWT Authentication Guard
// This guard validates JWT tokens and ensures users are authenticated

import { AuthService } from './auth.service';
import { User } from '@mandala/shared-types';

export class JwtAuthGuard {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  // Validate request authentication
  async canActivate(request: any): Promise<boolean> {
    try {
      const token = this.extractTokenFromRequest(request);
      
      if (!token) {
        return false;
      }

      const user = await this.validateToken(token);
      
      if (!user) {
        return false;
      }

      // Attach user to request for later use
      request.user = user;
      return true;

    } catch (error) {
      console.error('JWT Auth Guard error:', error);
      return false;
    }
  }

  // Extract token from request headers
  private extractTokenFromRequest(request: any): string | null {
    // Try Authorization header
    const authHeader = request.headers?.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Try query parameter
    if (request.query?.token) {
      return request.query.token;
    }

    // Try cookies
    if (request.cookies?.auth_token) {
      return request.cookies.auth_token;
    }

    return null;
  }

  // Validate token and return user
  private async validateToken(token: string): Promise<User | null> {
    try {
      // First try Firebase token validation
      let user = await this.authService.validateToken(token);
      
      // Fallback to mock token validation for development
      if (!user) {
        user = this.authService.validateMockToken(token);
      }

      return user;

    } catch (error) {
      console.error('Token validation error:', error);
      return null;
    }
  }

  // Create authenticated context
  createAuthContext(user: User): any {
    return {
      user,
      userId: user.id,
      roles: user.roles,
      permissions: this.authService.getUserPermissions(user),
      isAuthenticated: true
    };
  }

  // Handle authentication failure
  handleAuthFailure(request: any, response: any): void {
    response.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Authentication required',
      timestamp: new Date()
    });
  }

  // Handle expired token
  handleExpiredToken(request: any, response: any): void {
    response.status(401).json({
      success: false,
      error: 'Token Expired',
      message: 'Authentication token has expired',
      timestamp: new Date()
    });
  }

  // Validate request with custom logic
  async validateRequest(request: any, response: any, next?: any): Promise<boolean> {
    const isValid = await this.canActivate(request);
    
    if (!isValid) {
      this.handleAuthFailure(request, response);
      return false;
    }

    // Continue to next middleware if provided
    if (next) {
      next();
    }

    return true;
  }

  // Create middleware function for Express-like frameworks
  createMiddleware() {
    return async (request: any, response: any, next: any) => {
      const isValid = await this.validateRequest(request, response);
      if (isValid && next) {
        next();
      }
    };
  }

  // Check if user is active
  isUserActive(user: User): boolean {
    return user.isActive && user.emailVerified;
  }

  // Refresh token if needed
  async refreshTokenIfNeeded(token: string): Promise<string | null> {
    try {
      const user = await this.validateToken(token);
      if (!user) {
        return null;
      }

      // In production, check if token needs refresh based on expiration
      // For now, just return a new mock token
      return this.authService.generateMockToken(user);

    } catch (error) {
      console.error('Token refresh error:', error);
      return null;
    }
  }
} 