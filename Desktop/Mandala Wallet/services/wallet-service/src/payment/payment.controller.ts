import { Controller, Post, Body, Get, Param, UseGuards, Request, Headers, HttpCode, HttpStatus, BadRequestException, UnauthorizedException, HttpException, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { WalletService } from '../wallet/wallet.service';
import {
  PaymentRequest,
  PaymentResponse,
  UserRole,
  User,
  PaymentMethod,
  RefundRequest,
  RefundSummary,
  PartialPaymentTracker,
  TransactionStatus,
  ApiResponse as MandalaApiResponse
} from '@mandala/shared-types';

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly walletService: WalletService
  ) {}

  // Process a new payment
  @Post('process')
  @Roles(UserRole.ADMIN, UserRole.VENUE_MANAGER, UserRole.RP, UserRole.CLIENT)
  async processPayment(
    @CurrentUser() user: User,
    @Body() paymentRequest: PaymentRequest
  ): Promise<MandalaApiResponse<PaymentResponse>> {
    try {
      const payment = await this.paymentService.processPayment(user.id, paymentRequest);
      
      return {
        success: true,
        data: payment,
        message: 'Payment processed successfully',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to process payment',
        timestamp: new Date()
      };
    }
  }

  // Retry a failed payment
  @Post('retry/:transactionId')
  @Roles(UserRole.ADMIN, UserRole.VENUE_MANAGER, UserRole.RP, UserRole.CLIENT)
  async retryPayment(
    @CurrentUser() user: User,
    @Param('transactionId') transactionId: string
  ): Promise<PaymentResponse> {
    try {
      // In a real implementation, we'd verify the user owns this transaction
      const result = await this.paymentService.retryFailedPayment(transactionId);
      
      return result;
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  // Generate payment QR code
  @Post('qr/generate')
  @Roles(UserRole.ADMIN, UserRole.VENUE_MANAGER, UserRole.RP)
  async generatePaymentQR(
    @CurrentUser() user: User,
    @Body() qrRequest: { venueId: string; amount?: number }
  ): Promise<{ qrCode: string }> {
    try {
      const qrCode = await this.paymentService.generatePaymentQR(
        qrRequest.venueId,
        qrRequest.amount
      );
      
      return { qrCode };
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  // Validate payment QR code
  @Get('qr/validate/:qrCodeId')
  @Roles(UserRole.ADMIN, UserRole.VENUE_MANAGER, UserRole.RP, UserRole.CLIENT)
  async validatePaymentQR(
    @Param('qrCodeId') qrCodeId: string
  ): Promise<{ valid: boolean }> {
    try {
      const valid = await this.paymentService.validatePaymentQR(qrCodeId);
      
      return { valid };
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  // Webhook Endpoints (No authentication for external services)

  // Stripe webhook
  @Post('webhooks/stripe')
  @HttpCode(HttpStatus.OK)
  async handleStripeWebhook(
    @Body() event: any
  ): Promise<MandalaApiResponse<any>> {
    try {
      await this.paymentService.handleStripeWebhook(event);
      return {
        success: true,
        message: 'Stripe webhook processed successfully',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to process Stripe webhook',
        timestamp: new Date()
      };
    }
  }

  // OxxoPay webhook
  @Post('webhooks/oxxo')
  @HttpCode(HttpStatus.OK)
  async handleOxxoWebhook(
    @Body() data: any
  ): Promise<MandalaApiResponse<any>> {
    try {
      await this.paymentService.handleOxxoWebhook(data);
      return {
        success: true,
        message: 'OXXO webhook processed successfully',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to process OXXO webhook',
        timestamp: new Date()
      };
    }
  }

  // SPEI webhook
  @Post('webhooks/spei')
  @HttpCode(HttpStatus.OK)
  async handleSPEIWebhook(
    @Body() data: any
  ): Promise<MandalaApiResponse<any>> {
    try {
      await this.paymentService.handleSPEIWebhook(data);
      return {
        success: true,
        message: 'SPEI webhook processed successfully',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to process SPEI webhook',
        timestamp: new Date()
      };
    }
  }

  // Payment Methods Information (for frontend)
  @Get('methods')
  @ApiOperation({ summary: 'Get available payment methods with fees and limits' })
  @ApiResponse({ status: 200, description: 'Payment methods retrieved successfully' })
  async getPaymentMethods(): Promise<MandalaApiResponse<any>> {
    try {
      const methods = [
        {
          id: PaymentMethod.STRIPE,
          name: 'Credit/Debit Card',
          description: 'Visa, Mastercard, American Express',
          fees: { percentage: 3.6, fixed: 3 },
          limits: { min: 20, max: 10000 },
          currency: 'MXN',
          processingTime: '1-3 minutes',
          isActive: true
        },
        {
          id: PaymentMethod.OXXO_PAY,
          name: 'OXXO Pay',
          description: 'Pay in cash at any OXXO store',
          fees: { percentage: 1.85, fixed: 7 },
          limits: { min: 20, max: 10000 },
          currency: 'MXN',
          processingTime: '1-24 hours',
          isActive: true
        },
        {
          id: PaymentMethod.SPEI,
          name: 'Bank Transfer (SPEI)',
          description: 'Direct bank transfer',
          fees: { percentage: 0.7, fixed: 2 },
          limits: { min: 100, max: 50000 },
          currency: 'MXN',
          processingTime: '1-60 minutes',
          isActive: true
        },
        {
          id: PaymentMethod.APPLE_PAY,
          name: 'Apple Pay',
          description: 'Pay with Touch ID or Face ID',
          fees: { percentage: 2.9, fixed: 3 },
          limits: { min: 20, max: 10000 },
          currency: 'MXN',
          processingTime: '1-3 minutes',
          isActive: true
        },
        {
          id: PaymentMethod.QR_CODE,
          name: 'QR Code',
          description: 'Scan QR code to pay',
          fees: { percentage: 0, fixed: 0 },
          limits: { min: 1, max: 10000 },
          currency: 'MXN',
          processingTime: 'Instant',
          isActive: true
        }
      ];

      return {
        success: true,
        data: methods,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to retrieve payment methods',
        timestamp: new Date()
      };
    }
  }

  // Payment Statistics (Admin/Manager only)
  @Get('statistics')
  @Roles(UserRole.ADMIN, UserRole.VENUE_MANAGER)
  async getPaymentStatistics(
    @CurrentUser() user: User
  ): Promise<PaymentStatistics> {
    // Mock statistics for development
    return {
      totalTransactions: 1250,
      totalAmount: 125000,
      successRate: 0.948,
      averageAmount: 100,
      methodBreakdown: {
        [PaymentMethod.STRIPE]: { count: 450, amount: 45000 },
        [PaymentMethod.OXXO_PAY]: { count: 300, amount: 30000 },
        [PaymentMethod.SPEI]: { count: 200, amount: 20000 },
        [PaymentMethod.APPLE_PAY]: { count: 200, amount: 20000 },
        [PaymentMethod.QR_CODE]: { count: 100, amount: 10000 }
      },
      dailyStats: []
    };
  }

  @Post('partial')
  @ApiOperation({ summary: 'Process partial payment' })
  @ApiResponse({ status: 200, description: 'Partial payment processed successfully' })
  async processPartialPayment(
    @CurrentUser() user: User,
    @Body() paymentRequest: PaymentRequest
  ): Promise<MandalaApiResponse<PaymentResponse>> {
    try {
      // Enable partial payment flag
      const partialPaymentRequest = { ...paymentRequest, allowPartialPayment: true };
      
      const payment = await this.walletService.processPayment(user.id, partialPaymentRequest);
      
      return {
        success: true,
        data: payment,
        message: payment.isPartialPayment ? 'Partial payment processed successfully' : 'Full payment processed successfully',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to process partial payment',
        timestamp: new Date()
      };
    }
  }

  @Get('partial/:partialPaymentId')
  @ApiOperation({ summary: 'Get partial payment status' })
  @ApiResponse({ status: 200, description: 'Partial payment status retrieved successfully' })
  async getPartialPaymentStatus(
    @CurrentUser() user: User,
    @Param('partialPaymentId') partialPaymentId: string
  ): Promise<MandalaApiResponse<PartialPaymentTracker>> {
    try {
      const tracker = await this.walletService.getPartialPaymentStatus(partialPaymentId);
      
      if (!tracker) {
        return {
          success: false,
          error: 'Partial payment not found',
          message: 'The specified partial payment ID does not exist',
          timestamp: new Date()
        };
      }

      return {
        success: true,
        data: tracker,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to retrieve partial payment status',
        timestamp: new Date()
      };
    }
  }

  @Post('partial/:partialPaymentId/continue')
  @ApiOperation({ summary: 'Continue partial payment' })
  @ApiResponse({ status: 200, description: 'Partial payment continued successfully' })
  async continuePartialPayment(
    @CurrentUser() user: User,
    @Param('partialPaymentId') partialPaymentId: string
  ): Promise<MandalaApiResponse<PaymentResponse>> {
    try {
      const payment = await this.walletService.continuePartialPayment(user.id, partialPaymentId);
      
      return {
        success: true,
        data: payment,
        message: 'Partial payment continued successfully',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to continue partial payment',
        timestamp: new Date()
      };
    }
  }

  @Get('refund/:transactionId/summary')
  @ApiOperation({ summary: 'Get refund summary for a transaction' })
  @ApiResponse({ status: 200, description: 'Refund summary retrieved successfully' })
  async getRefundSummary(
    @CurrentUser() user: User,
    @Param('transactionId') transactionId: string
  ): Promise<MandalaApiResponse<RefundSummary>> {
    try {
      const summary = await this.walletService.getRefundSummary(transactionId);
      
      return {
        success: true,
        data: summary,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to retrieve refund summary',
        timestamp: new Date()
      };
    }
  }

  @Post('refund/enhanced')
  @ApiOperation({ summary: 'Process enhanced refund with partial refund support' })
  @ApiResponse({ status: 200, description: 'Enhanced refund processed successfully' })
  async processEnhancedRefund(
    @CurrentUser() user: User,
    @Body() refundRequest: RefundRequest
  ): Promise<MandalaApiResponse<any>> {
    try {
      const refund = await this.walletService.processRefund(user.id, refundRequest);
      
      return {
        success: true,
        data: refund,
        message: refundRequest.partialRefund ? 'Partial refund processed successfully' : 'Full refund processed successfully',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to process enhanced refund',
        timestamp: new Date()
      };
    }
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get payment analytics for admin/manager' })
  @ApiResponse({ status: 200, description: 'Payment analytics retrieved successfully' })
  @Roles(UserRole.ADMIN, UserRole.VENUE_MANAGER)
  @UseGuards(RolesGuard)
  async getPaymentAnalytics(
    @CurrentUser() user: User,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('venueId') venueId?: string
  ): Promise<MandalaApiResponse<any>> {
    try {
      // Mock analytics data - would be implemented with actual database queries
      const analytics = {
        totalPayments: 1250,
        totalAmount: 125000,
        successRate: 94.5,
        avgTransactionAmount: 100,
        paymentMethodBreakdown: {
          [PaymentMethod.QR_CODE]: { count: 650, amount: 52000 },
          [PaymentMethod.STRIPE]: { count: 400, amount: 48000 },
          [PaymentMethod.OXXO_PAY]: { count: 150, amount: 18000 },
          [PaymentMethod.SPEI]: { count: 50, amount: 7000 }
        },
        refundStats: {
          totalRefunds: 45,
          refundRate: 3.6,
          avgRefundAmount: 85,
          partialRefunds: 12
        },
        partialPaymentStats: {
          totalPartialPayments: 23,
          partialPaymentRate: 1.8,
          avgPartialAmount: 67,
          completionRate: 78.3
        },
        timeRange: {
          startDate: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: endDate || new Date().toISOString()
        }
      };

      return {
        success: true,
        data: analytics,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to retrieve payment analytics',
        timestamp: new Date()
      };
    }
  }
}

// Supporting interfaces
interface PaymentMethodInfo {
  id: PaymentMethod;
  name: string;
  description: string;
  fee: number;
  fixedFee: number;
  currency: string;
  processingTime: string;
  limits: {
    min: number;
    max: number;
  };
}

interface PaymentStatistics {
  totalTransactions: number;
  totalAmount: number;
  successRate: number;
  averageAmount: number;
  methodBreakdown: Record<PaymentMethod, { count: number; amount: number }>;
  dailyStats: any[];
} 