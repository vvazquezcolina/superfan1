import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  HttpStatus,
  HttpException,
  Query
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { WalletService } from './wallet.service';
import {
  User,
  UserRole,
  Wallet,
  WalletSummary,
  Transaction,
  PaymentRequest,
  PaymentResponse,
  RefundRequest,
  TransferRequest,
  ApiResponse as MandalaApiResponse
} from '@mandala/shared-types';

@ApiTags('Wallet')
@Controller('wallet')
@UseGuards(ThrottlerGuard, JwtAuthGuard)
@ApiBearerAuth()
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  @ApiOperation({ summary: 'Get user wallet' })
  @ApiResponse({ status: 200, description: 'Wallet retrieved successfully' })
  async getWallet(@CurrentUser() user: User): Promise<MandalaApiResponse<Wallet>> {
    try {
      const wallet = await this.walletService.getWalletByUserId(user.id);
      return {
        success: true,
        data: wallet,
        timestamp: new Date()
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: (error as Error).message,
          message: 'Failed to retrieve wallet',
          timestamp: new Date()
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get wallet summary with balance breakdown' })
  @ApiResponse({ status: 200, description: 'Wallet summary retrieved successfully' })
  async getWalletSummary(@CurrentUser() user: User): Promise<MandalaApiResponse<WalletSummary>> {
    try {
      const summary = await this.walletService.getWalletSummary(user.id);
      return {
        success: true,
        data: summary,
        timestamp: new Date()
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message,
          message: 'Failed to retrieve wallet summary',
          timestamp: new Date()
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('create')
  @ApiOperation({ summary: 'Create wallet for user' })
  @ApiResponse({ status: 201, description: 'Wallet created successfully' })
  async createWallet(@CurrentUser() user: User): Promise<MandalaApiResponse<Wallet>> {
    try {
      const wallet = await this.walletService.createWallet(user.id);
      return {
        success: true,
        data: wallet,
        message: 'Wallet created successfully',
        timestamp: new Date()
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message,
          message: 'Failed to create wallet',
          timestamp: new Date()
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('payment')
  @ApiOperation({ summary: 'Process payment' })
  @ApiResponse({ status: 200, description: 'Payment processed successfully' })
  async processPayment(
    @CurrentUser() user: User,
    @Body() paymentRequest: PaymentRequest
  ): Promise<MandalaApiResponse<PaymentResponse>> {
    try {
      const payment = await this.walletService.processPayment(user.id, paymentRequest);
      return {
        success: true,
        data: payment,
        message: 'Payment processed successfully',
        timestamp: new Date()
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message,
          message: 'Failed to process payment',
          timestamp: new Date()
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('refund')
  @ApiOperation({ summary: 'Process refund' })
  @ApiResponse({ status: 200, description: 'Refund processed successfully' })
  async processRefund(
    @CurrentUser() user: User,
    @Body() refundRequest: RefundRequest
  ): Promise<MandalaApiResponse<Transaction>> {
    try {
      const refund = await this.walletService.processRefund(user.id, refundRequest);
      return {
        success: true,
        data: refund,
        message: 'Refund processed successfully',
        timestamp: new Date()
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message,
          message: 'Failed to process refund',
          timestamp: new Date()
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('transfer')
  @ApiOperation({ summary: 'Transfer balance between wallets' })
  @ApiResponse({ status: 200, description: 'Transfer processed successfully' })
  @Roles(UserRole.ADMIN, UserRole.VENUE_MANAGER)
  @UseGuards(RolesGuard)
  async transferBalance(
    @CurrentUser() user: User,
    @Body() transferRequest: TransferRequest
  ): Promise<MandalaApiResponse<Transaction>> {
    try {
      const transfer = await this.walletService.transferBalance(transferRequest);
      return {
        success: true,
        data: transfer,
        message: 'Transfer processed successfully',
        timestamp: new Date()
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message,
          message: 'Failed to process transfer',
          timestamp: new Date()
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get wallet transactions' })
  @ApiResponse({ status: 200, description: 'Transactions retrieved successfully' })
  async getTransactions(
    @CurrentUser() user: User,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20
  ): Promise<MandalaApiResponse<Transaction[]>> {
    try {
      const transactions = await this.walletService.getTransactions(user.id, page, limit);
      return {
        success: true,
        data: transactions,
        timestamp: new Date()
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message,
          message: 'Failed to retrieve transactions',
          timestamp: new Date()
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Put('activate')
  @ApiOperation({ summary: 'Activate wallet' })
  @ApiResponse({ status: 200, description: 'Wallet activated successfully' })
  @Roles(UserRole.ADMIN, UserRole.VENUE_MANAGER)
  @UseGuards(RolesGuard)
  async activateWallet(
    @Param('userId') userId: string
  ): Promise<MandalaApiResponse<Wallet>> {
    try {
      const wallet = await this.walletService.activateWallet(userId);
      return {
        success: true,
        data: wallet,
        message: 'Wallet activated successfully',
        timestamp: new Date()
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message,
          message: 'Failed to activate wallet',
          timestamp: new Date()
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Put('deactivate')
  @ApiOperation({ summary: 'Deactivate wallet' })
  @ApiResponse({ status: 200, description: 'Wallet deactivated successfully' })
  @Roles(UserRole.ADMIN, UserRole.VENUE_MANAGER)
  @UseGuards(RolesGuard)
  async deactivateWallet(
    @Param('userId') userId: string
  ): Promise<MandalaApiResponse<Wallet>> {
    try {
      const wallet = await this.walletService.deactivateWallet(userId);
      return {
        success: true,
        data: wallet,
        message: 'Wallet deactivated successfully',
        timestamp: new Date()
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message,
          message: 'Failed to deactivate wallet',
          timestamp: new Date()
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }
} 