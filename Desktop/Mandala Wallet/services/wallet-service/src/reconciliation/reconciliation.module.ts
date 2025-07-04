import { PrismaService } from '../database/prisma.service';
import { ReconciliationService } from './reconciliation.service';
import { FinancialReportingService } from '../reporting/financial-reporting.service';

// Reconciliation Module for organizing reconciliation and reporting services
export class ReconciliationModule {
  private reconciliationService: ReconciliationService;
  private reportingService: FinancialReportingService;
  private databaseService: PrismaService;

  constructor() {
    this.databaseService = new PrismaService();
    this.reconciliationService = new ReconciliationService(this.databaseService);
    this.reportingService = new FinancialReportingService(
      this.databaseService,
      this.reconciliationService
    );
  }

  // Service getters
  getReconciliationService(): ReconciliationService {
    return this.reconciliationService;
  }

  getReportingService(): FinancialReportingService {
    return this.reportingService;
  }

  getDatabaseService(): PrismaService {
    return this.databaseService;
  }

  // Initialize all services
  async init(): Promise<void> {
    try {
      await this.databaseService.onModuleInit();
      console.log('Reconciliation module initialized successfully');
    } catch (error) {
      console.error('Failed to initialize reconciliation module:', error);
      throw error;
    }
  }

  // Cleanup all services
  async cleanup(): Promise<void> {
    try {
      await this.databaseService.onModuleDestroy();
      console.log('Reconciliation module cleaned up successfully');
    } catch (error) {
      console.error('Failed to cleanup reconciliation module:', error);
    }
  }

  // Health check for all services
  async healthCheck(): Promise<{
    reconciliation: boolean;
    reporting: boolean;
    database: boolean;
    overall: boolean;
  }> {
    try {
      const reconciliationHealth = await this.reconciliationService.healthCheck();
      const reportingHealth = await this.reportingService.healthCheck();
      const databaseHealth = !!(this.databaseService);
      
      const overall = reconciliationHealth && reportingHealth && databaseHealth;
      
      return {
        reconciliation: reconciliationHealth,
        reporting: reportingHealth,
        database: databaseHealth,
        overall
      };
    } catch (error) {
      console.error('Health check failed:', error);
      return {
        reconciliation: false,
        reporting: false,
        database: false,
        overall: false
      };
    }
  }
} 