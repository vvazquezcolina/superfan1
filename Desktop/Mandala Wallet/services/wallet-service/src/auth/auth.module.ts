// Authentication module for wallet service
// This handles Firebase Auth integration and role-based access control

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';

export class AuthModule {
  private authService: AuthService;
  private jwtAuthGuard: JwtAuthGuard;
  private rolesGuard: RolesGuard;

  constructor() {
    this.authService = new AuthService();
    this.jwtAuthGuard = new JwtAuthGuard();
    this.rolesGuard = new RolesGuard();
  }

  // Get auth service instance
  getAuthService(): AuthService {
    return this.authService;
  }

  // Get JWT auth guard instance
  getJwtAuthGuard(): JwtAuthGuard {
    return this.jwtAuthGuard;
  }

  // Get roles guard instance
  getRolesGuard(): RolesGuard {
    return this.rolesGuard;
  }

  // Initialize module
  async onModuleInit() {
    console.log('Initializing Auth Module...');
    await this.authService.initialize();
    console.log('Auth Module initialized successfully');
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      return !!(this.authService && this.jwtAuthGuard && this.rolesGuard);
    } catch (error) {
      console.error('Auth Module health check failed:', error);
      return false;
    }
  }

  // Export providers for NestJS when dependencies are installed
  static getProviders() {
    return [
      AuthService,
      JwtAuthGuard,
      RolesGuard
    ];
  }
} 