import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
  HttpStatus,
  HttpException,
  StreamableFile,
  Header,
  Res
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { ReconciliationService } from './reconciliation.service';
import { FinancialReportingService } from '../reporting/financial-reporting.service';
import {
  User,
  UserRole,
  PaymentMethod,
  DailyReconciliation,
  ReconciliationEntry,
  SettlementReport,
  ReportRequest,
  ReportFormat,
  ReportType,
  FinancialReport,
  ExportRequest,
  ExportResult,
  DashboardMetrics,
  ApiResponse as MandalaApiResponse
} from '@mandala/shared-types';
import { Response } from 'express';

@ApiTags('Reconciliation & Reporting')
@Controller('reconciliation')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReconciliationController {
  constructor(
    private readonly reconciliationService: ReconciliationService,
    private readonly reportingService: FinancialReportingService
  ) {}

  // Daily Reconciliation Endpoints
  @Post('daily/:date')
  @ApiOperation({ summary: 'Process daily reconciliation for all providers' })
  @ApiResponse({ status: 200, description: 'Daily reconciliation processed successfully' })
  @Roles(UserRole.ADMIN, UserRole.VENUE_MANAGER)
  async processDailyReconciliation(
    @CurrentUser() user: User,
    @Param('date') date: string
  ): Promise<MandalaApiResponse<DailyReconciliation[]>> {
    try {
      const reconciliationDate = new Date(date);
      if (isNaN(reconciliationDate.getTime())) {
        throw new Error('Invalid date format. Use YYYY-MM-DD');
      }

      const results = await this.reconciliationService.processDailyReconciliation(reconciliationDate);
      
      return {
        success: true,
        data: results,
        message: `Daily reconciliation processed for ${results.length} providers`,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to process daily reconciliation',
        timestamp: new Date()
      };
    }
  }

  @Get('daily/:date')
  @ApiOperation({ summary: 'Get daily reconciliation results' })
  @ApiResponse({ status: 200, description: 'Daily reconciliation results retrieved' })
  @Roles(UserRole.ADMIN, UserRole.VENUE_MANAGER)
  async getDailyReconciliation(
    @CurrentUser() user: User,
    @Param('date') date: string
  ): Promise<MandalaApiResponse<DailyReconciliation[]>> {
    try {
      const reconciliationDate = new Date(date);
      const results = await this.reconciliationService.processDailyReconciliation(reconciliationDate);
      
      return {
        success: true,
        data: results,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to retrieve daily reconciliation',
        timestamp: new Date()
      };
    }
  }

  @Get('provider/:provider/reconciliation')
  @ApiOperation({ summary: 'Get reconciliation for specific provider' })
  @ApiResponse({ status: 200, description: 'Provider reconciliation retrieved' })
  @Roles(UserRole.ADMIN, UserRole.VENUE_MANAGER)
  async getProviderReconciliation(
    @CurrentUser() user: User,
    @Param('provider') provider: PaymentMethod,
    @Query('date') date?: string
  ): Promise<MandalaApiResponse<DailyReconciliation>> {
    try {
      const reconciliationDate = date ? new Date(date) : new Date();
      const result = await this.reconciliationService.reconcileProviderTransactions(
        provider,
        reconciliationDate
      );
      
      return {
        success: true,
        data: result,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to retrieve provider reconciliation',
        timestamp: new Date()
      };
    }
  }

  // Discrepancy Resolution
  @Put('discrepancy/:entryId/resolve')
  @ApiOperation({ summary: 'Resolve reconciliation discrepancy' })
  @ApiResponse({ status: 200, description: 'Discrepancy resolved successfully' })
  @Roles(UserRole.ADMIN)
  async resolveDiscrepancy(
    @CurrentUser() user: User,
    @Param('entryId') entryId: string,
    @Body() resolution: {
      type: 'accept_internal' | 'accept_external' | 'manual_adjustment';
      adjustmentAmount?: number;
      notes?: string;
    }
  ): Promise<MandalaApiResponse<ReconciliationEntry>> {
    try {
      const result = await this.reconciliationService.resolveDiscrepancy(
        entryId,
        resolution.type,
        resolution.adjustmentAmount,
        resolution.notes,
        user.id
      );
      
      return {
        success: true,
        data: result,
        message: 'Discrepancy resolved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to resolve discrepancy',
        timestamp: new Date()
      };
    }
  }

  // Unreconciled Transactions
  @Get('unreconciled')
  @ApiOperation({ summary: 'Get unreconciled transactions' })
  @ApiResponse({ status: 200, description: 'Unreconciled transactions retrieved' })
  @Roles(UserRole.ADMIN, UserRole.VENUE_MANAGER)
  async getUnreconciledTransactions(
    @CurrentUser() user: User,
    @Query('provider') provider?: PaymentMethod,
    @Query('days') days?: number
  ): Promise<MandalaApiResponse<any[]>> {
    try {
      const dayCount = days || 7;
      const transactions = provider 
        ? await this.reconciliationService.getUnreconciledTransactions(provider, dayCount)
        : [];
      
      return {
        success: true,
        data: transactions,
        message: `Found ${transactions.length} unreconciled transactions`,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to retrieve unreconciled transactions',
        timestamp: new Date()
      };
    }
  }

  // Reconciliation Summary
  @Get('summary')
  @ApiOperation({ summary: 'Get reconciliation summary' })
  @ApiResponse({ status: 200, description: 'Reconciliation summary retrieved' })
  @Roles(UserRole.ADMIN, UserRole.VENUE_MANAGER)
  async getReconciliationSummary(
    @CurrentUser() user: User,
    @Query('provider') provider?: PaymentMethod,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ): Promise<MandalaApiResponse<any>> {
    try {
      const dateRange = startDate && endDate ? {
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      } : undefined;
      
      const summary = await this.reconciliationService.getReconciliationSummary(
        provider,
        dateRange
      );
      
      return {
        success: true,
        data: summary,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to retrieve reconciliation summary',
        timestamp: new Date()
      };
    }
  }

  // Financial Reporting Endpoints
  @Post('reports/generate')
  @ApiOperation({ summary: 'Generate financial report' })
  @ApiResponse({ status: 200, description: 'Financial report generated successfully' })
  @Roles(UserRole.ADMIN, UserRole.VENUE_MANAGER)
  async generateFinancialReport(
    @CurrentUser() user: User,
    @Body() request: ReportRequest
  ): Promise<MandalaApiResponse<FinancialReport>> {
    try {
      const report = await this.reportingService.generateReport({
        ...request,
        requestedBy: user.id
      });
      
      return {
        success: true,
        data: report,
        message: 'Financial report generated successfully',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to generate financial report',
        timestamp: new Date()
      };
    }
  }

  @Get('reports/templates')
  @ApiOperation({ summary: 'Get available report templates' })
  @ApiResponse({ status: 200, description: 'Report templates retrieved' })
  @Roles(UserRole.ADMIN, UserRole.VENUE_MANAGER)
  async getReportTemplates(
    @CurrentUser() user: User
  ): Promise<MandalaApiResponse<any[]>> {
    try {
      const templates = [
        {
          type: ReportType.TRANSACTION_SUMMARY,
          name: 'Resumen de Transacciones',
          description: 'Resumen completo de todas las transacciones',
          formats: [ReportFormat.PDF, ReportFormat.CSV, ReportFormat.EXCEL]
        },
        {
          type: ReportType.REVENUE_ANALYSIS,
          name: 'Análisis de Ingresos',
          description: 'Análisis detallado de ingresos por período',
          formats: [ReportFormat.PDF, ReportFormat.EXCEL]
        },
        {
          type: ReportType.PAYMENT_METHOD_BREAKDOWN,
          name: 'Desglose por Método de Pago',
          description: 'Análisis de transacciones por método de pago',
          formats: [ReportFormat.PDF, ReportFormat.CSV]
        },
        {
          type: ReportType.RECONCILIATION_STATUS,
          name: 'Estado de Reconciliación',
          description: 'Estado actual de la reconciliación con proveedores',
          formats: [ReportFormat.PDF, ReportFormat.CSV]
        },
        {
          type: ReportType.VENUE_PERFORMANCE,
          name: 'Rendimiento de Venues',
          description: 'Análisis de rendimiento por venue',
          formats: [ReportFormat.PDF, ReportFormat.EXCEL]
        }
      ];
      
      return {
        success: true,
        data: templates,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to retrieve report templates',
        timestamp: new Date()
      };
    }
  }

  // Dashboard Metrics
  @Get('dashboard/metrics')
  @ApiOperation({ summary: 'Get dashboard metrics' })
  @ApiResponse({ status: 200, description: 'Dashboard metrics retrieved' })
  @Roles(UserRole.ADMIN, UserRole.VENUE_MANAGER)
  async getDashboardMetrics(
    @CurrentUser() user: User
  ): Promise<MandalaApiResponse<DashboardMetrics>> {
    try {
      const metrics = await this.reportingService.getDashboardMetrics(user.id, user.roles[0]);
      
      return {
        success: true,
        data: metrics,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to retrieve dashboard metrics',
        timestamp: new Date()
      };
    }
  }

  // Comprehensive Analytics
  @Get('analytics/comprehensive')
  @ApiOperation({ summary: 'Get comprehensive analytics' })
  @ApiResponse({ status: 200, description: 'Comprehensive analytics retrieved' })
  @Roles(UserRole.ADMIN)
  async getComprehensiveAnalytics(
    @CurrentUser() user: User,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('venueId') venueId?: string
  ): Promise<MandalaApiResponse<any>> {
    try {
      if (!startDate || !endDate) {
        throw new Error('Start date and end date are required');
      }
      
      const dateRange = {
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      };
      
      const analytics = await this.reportingService.getComprehensiveAnalytics(
        dateRange,
        venueId
      );
      
      return {
        success: true,
        data: analytics,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to retrieve comprehensive analytics',
        timestamp: new Date()
      };
    }
  }

  // Data Export
  @Post('export')
  @ApiOperation({ summary: 'Export data for accounting/compliance' })
  @ApiResponse({ status: 200, description: 'Data export initiated' })
  @Roles(UserRole.ADMIN, UserRole.VENUE_MANAGER)
  async exportData(
    @CurrentUser() user: User,
    @Body() request: ExportRequest
  ): Promise<MandalaApiResponse<ExportResult>> {
    try {
      const result = await this.reportingService.exportData({
        ...request,
        requestedBy: user.id
      });
      
      return {
        success: true,
        data: result,
        message: 'Data export initiated successfully',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to initiate data export',
        timestamp: new Date()
      };
    }
  }

  @Get('export/:exportId/download')
  @ApiOperation({ summary: 'Download exported data file' })
  @ApiResponse({ status: 200, description: 'File download initiated' })
  @Header('Content-Type', 'application/octet-stream')
  @Roles(UserRole.ADMIN, UserRole.VENUE_MANAGER)
  async downloadExportedData(
    @CurrentUser() user: User,
    @Param('exportId') exportId: string,
    @Res({ passthrough: true }) response: Response
  ): Promise<StreamableFile> {
    try {
      // Mock file download - in production would validate export ownership and serve actual file
      const mockData = `Export ID: ${exportId}\nGenerated for: ${user.email}\nTimestamp: ${new Date().toISOString()}`;
      const buffer = Buffer.from(mockData, 'utf8');
      
      response.set({
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="export_${exportId}.csv"`
      });
      
      return new StreamableFile(buffer);
    } catch (error) {
      throw new HttpException(
        'Failed to download exported data',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Settlement Management
  @Get('settlements')
  @ApiOperation({ summary: 'Get settlement reports' })
  @ApiResponse({ status: 200, description: 'Settlement reports retrieved' })
  @Roles(UserRole.ADMIN, UserRole.VENUE_MANAGER)
  async getSettlements(
    @CurrentUser() user: User,
    @Query('provider') provider?: PaymentMethod,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ): Promise<MandalaApiResponse<SettlementReport[]>> {
    try {
      // Mock settlement data - in production would query actual settlement records
      const settlements: SettlementReport[] = [
        {
          id: 'settlement_001',
          provider: provider || PaymentMethod.STRIPE,
          settlementDate: new Date(),
          periodStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          periodEnd: new Date(),
          totalTransactions: 125,
          grossAmount: 25000,
          totalFees: 750,
          netAmount: 24250,
          previousBalance: 50000,
          settlementAmount: 24250,
          finalBalance: 74250,
          status: 'completed',
          referenceNumber: 'SET_2024_001',
          processedBy: 'system'
        }
      ];
      
      return {
        success: true,
        data: settlements,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to retrieve settlements',
        timestamp: new Date()
      };
    }
  }

  // Health Check
  @Get('health')
  @ApiOperation({ summary: 'Health check for reconciliation service' })
  @ApiResponse({ status: 200, description: 'Service health status' })
  async healthCheck(): Promise<MandalaApiResponse<any>> {
    try {
      const reconciliationHealth = await this.reconciliationService.healthCheck();
      const reportingHealth = await this.reportingService.healthCheck();
      
      const status = reconciliationHealth && reportingHealth ? 'healthy' : 'unhealthy';
      
      return {
        success: true,
        data: {
          status: status,
          reconciliationService: reconciliationHealth,
          reportingService: reportingHealth,
          timestamp: new Date()
        },
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Health check failed',
        timestamp: new Date()
      };
    }
  }

  // Quick Stats for Dashboard
  @Get('stats/quick')
  @ApiOperation({ summary: 'Get quick stats for dashboard' })
  @ApiResponse({ status: 200, description: 'Quick stats retrieved' })
  @Roles(UserRole.ADMIN, UserRole.VENUE_MANAGER)
  async getQuickStats(
    @CurrentUser() user: User
  ): Promise<MandalaApiResponse<any>> {
    try {
      const stats = {
        todayTransactions: Math.floor(Math.random() * 200) + 50,
        todayRevenue: Math.floor(Math.random() * 50000) + 10000,
        pendingReconciliations: Math.floor(Math.random() * 10) + 1,
        successRate: 94.5 + Math.random() * 5,
        unreconciledAmount: Math.floor(Math.random() * 5000) + 500,
        lastReconciliation: new Date(Date.now() - 24 * 60 * 60 * 1000),
        activeAlerts: Math.floor(Math.random() * 3)
      };
      
      return {
        success: true,
        data: stats,
        message: 'Quick stats retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to retrieve quick stats',
        timestamp: new Date()
      };
    }
  }
} 