// Wallet module for organizing wallet-related services and controllers
// This will be enhanced with proper NestJS decorators once dependencies are installed

import { WalletController } from './wallet.controller.basic';
import { WalletService } from './wallet.service';
import { DatabaseService } from '../database/database.service';
import { PrismaService } from '../database/prisma.service';

export class WalletModule {
  private walletController: WalletController;
  private walletService: WalletService;
  private databaseService: DatabaseService;
  private prismaService: PrismaService;

  constructor() {
    // Initialize services
    this.prismaService = new PrismaService();
    this.databaseService = new DatabaseService(this.prismaService);
    this.walletService = new WalletService(this.databaseService);
    this.walletController = new WalletController();
  }

  // Get wallet service instance
  getWalletService(): WalletService {
    return this.walletService;
  }

  // Get wallet controller instance
  getWalletController(): WalletController {
    return this.walletController;
  }

  // Initialize module
  async onModuleInit() {
    console.log('Initializing Wallet Module...');
    await this.prismaService.onModuleInit();
    console.log('Wallet Module initialized successfully');
  }

  // Cleanup module
  async onModuleDestroy() {
    console.log('Cleaning up Wallet Module...');
    await this.prismaService.onModuleDestroy();
    console.log('Wallet Module cleanup completed');
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      // Basic health check - could be enhanced with actual database ping
      return !!(this.prismaService && this.walletService && this.databaseService);
    } catch (error) {
      console.error('Wallet Module health check failed:', error);
      return false;
    }
  }

  // Export providers for NestJS when dependencies are installed
  static getProviders() {
    return [
      PrismaService,
      DatabaseService,
      WalletService
    ];
  }

  // Export controllers for NestJS when dependencies are installed
  static getControllers() {
    return [
      WalletController
    ];
  }
} 