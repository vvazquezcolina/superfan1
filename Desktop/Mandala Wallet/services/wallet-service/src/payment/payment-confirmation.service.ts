import { NotificationService } from '../notification/notification.service';
import { DatabaseService } from '../database/database.service';
import {
  PaymentConfirmation,
  Transaction,
  TransactionStatus,
  BalanceType,
  PaymentMethod,
  User,
  NotificationResponse
} from '@mandala/shared-types';

export interface ReceiptData {
  transactionId: string;
  confirmationCode: string;
  amount: number;
  balanceType: BalanceType;
  paymentMethod: PaymentMethod;
  venueInfo?: {
    name: string;
    address: string;
    phone: string;
  };
  timestamp: Date;
  qrCodeUrl?: string;
  supportInfo: {
    phone: string;
    email: string;
    hours: string;
  };
}

export class PaymentConfirmationService {
  constructor(
    private notificationService: NotificationService,
    private databaseService: DatabaseService
  ) {}

  // Generate payment confirmation and send notifications
  async confirmPayment(transaction: Transaction, user: User): Promise<PaymentConfirmation> {
    try {
      // Generate confirmation code
      const confirmationCode = this.generateConfirmationCode(transaction);
      
      // Generate receipt URL
      const receiptUrl = await this.generateReceiptUrl(transaction, confirmationCode);
      
      // Create payment confirmation object
      const confirmation: PaymentConfirmation = {
        transactionId: transaction.id,
        userId: transaction.userId,
        status: transaction.status,
        amount: transaction.amount,
        balanceType: transaction.balanceType,
        paymentMethod: transaction.paymentMethod!,
        venueId: transaction.venueId,
        confirmationCode: confirmationCode,
        receiptUrl: receiptUrl,
        estimatedArrival: this.calculateEstimatedArrival(transaction.paymentMethod!),
        retryable: this.isRetryable(transaction),
        supportContact: {
          phone: '+52-998-123-4567',
          email: 'soporte@mandala.mx',
          hours: '9:00 AM - 11:00 PM'
        }
      };

      // Send notification
      const notificationResponse = await this.notificationService.sendPaymentConfirmation(confirmation, user);
      
      // Log confirmation for audit
      await this.logPaymentConfirmation(confirmation, notificationResponse);

      return confirmation;

    } catch (error) {
      console.error('Payment confirmation failed:', error);
      throw new Error(`Failed to confirm payment: ${(error as Error).message}`);
    }
  }

  // Generate digital receipt
  async generateReceipt(transaction: Transaction, confirmationCode: string): Promise<ReceiptData> {
    const venueInfo = transaction.venueId ? await this.getVenueInfo(transaction.venueId) : undefined;
    
    return {
      transactionId: transaction.id,
      confirmationCode: confirmationCode,
      amount: transaction.amount,
      balanceType: transaction.balanceType,
      paymentMethod: transaction.paymentMethod!,
      venueInfo: venueInfo,
      timestamp: transaction.completedAt || new Date(),
      qrCodeUrl: await this.generateReceiptQRCode(transaction.id, confirmationCode),
      supportInfo: {
        phone: '+52-998-123-4567',
        email: 'soporte@mandala.mx',
        hours: 'Lun-Dom: 9:00 AM - 11:00 PM'
      }
    };
  }

  // Handle payment status updates from webhooks
  async handlePaymentStatusUpdate(
    transactionId: string, 
    newStatus: TransactionStatus,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      // Get transaction and user
      const transaction = await this.databaseService.findTransactionById(transactionId);
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      const user = await this.databaseService.getUserById(transaction.userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Update transaction status
      await this.databaseService.updateTransactionStatus(
        transactionId,
        newStatus,
        newStatus === TransactionStatus.COMPLETED ? new Date() : undefined,
        metadata?.failureReason
      );

      // Send appropriate notification based on status
      switch (newStatus) {
        case TransactionStatus.COMPLETED:
          const updatedTransaction = { ...transaction, status: newStatus, completedAt: new Date() };
          await this.confirmPayment(updatedTransaction, user);
          break;

        case TransactionStatus.FAILED:
          await this.handlePaymentFailure(transaction, user, metadata?.failureReason);
          break;

        case TransactionStatus.PENDING:
          await this.handlePaymentPending(transaction, user);
          break;
      }

    } catch (error) {
      console.error('Failed to handle payment status update:', error);
      throw error;
    }
  }

  // Handle partial payment confirmations
  async confirmPartialPayment(
    transaction: Transaction,
    user: User,
    partialPaymentId: string,
    remainingAmount: number
  ): Promise<NotificationResponse> {
    try {
      // Send partial payment notification
      const notificationResponse = await this.notificationService.sendPartialPaymentNotification(
        user.id,
        transaction.amount,
        remainingAmount,
        partialPaymentId,
        user
      );

      // Log partial payment confirmation
      console.log('Partial payment confirmed:', {
        transactionId: transaction.id,
        partialPaymentId: partialPaymentId,
        paidAmount: transaction.amount,
        remainingAmount: remainingAmount,
        notificationSent: notificationResponse.status === 'sent'
      });

      return notificationResponse;

    } catch (error) {
      console.error('Partial payment confirmation failed:', error);
      throw error;
    }
  }

  // Handle refund confirmations
  async confirmRefund(
    originalTransactionId: string,
    refundTransaction: Transaction,
    user: User
  ): Promise<NotificationResponse> {
    try {
      // Send refund notification
      const notificationResponse = await this.notificationService.sendRefundNotification(
        user.id,
        refundTransaction.amount,
        refundTransaction.balanceType,
        user
      );

      // Log refund confirmation
      console.log('Refund confirmed:', {
        originalTransactionId: originalTransactionId,
        refundTransactionId: refundTransaction.id,
        refundAmount: refundTransaction.amount,
        balanceType: refundTransaction.balanceType,
        notificationSent: notificationResponse.status === 'sent'
      });

      return notificationResponse;

    } catch (error) {
      console.error('Refund confirmation failed:', error);
      throw error;
    }
  }

  // Generate payment retry link for failed payments
  async generateRetryLink(transactionId: string): Promise<string> {
    // In production, this would generate a secure link with expiration
    return `/wallet/retry-payment/${transactionId}?expires=${Date.now() + 24 * 60 * 60 * 1000}`;
  }

  // Private helper methods

  private generateConfirmationCode(transaction: Transaction): string {
    // Generate a unique confirmation code
    const timestamp = Date.now().toString();
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    const prefix = this.getPaymentMethodPrefix(transaction.paymentMethod!);
    
    return `${prefix}${timestamp.slice(-6)}${randomPart}`;
  }

  private getPaymentMethodPrefix(paymentMethod: PaymentMethod): string {
    switch (paymentMethod) {
      case PaymentMethod.STRIPE:
        return 'CC';
      case PaymentMethod.OXXO_PAY:
        return 'OX';
      case PaymentMethod.APPLE_PAY:
        return 'AP';
      case PaymentMethod.SPEI:
        return 'SP';
      case PaymentMethod.QR_CODE:
        return 'QR';
      default:
        return 'TX';
    }
  }

  private async generateReceiptUrl(transaction: Transaction, confirmationCode: string): Promise<string> {
    // In production, this would generate a secure receipt URL
    return `/receipts/${transaction.id}?code=${confirmationCode}`;
  }

  private calculateEstimatedArrival(paymentMethod: PaymentMethod): Date | undefined {
    const now = new Date();
    
    switch (paymentMethod) {
      case PaymentMethod.STRIPE:
      case PaymentMethod.APPLE_PAY:
      case PaymentMethod.QR_CODE:
        return new Date(now.getTime() + 3 * 60 * 1000); // 3 minutes
      
      case PaymentMethod.SPEI:
        return new Date(now.getTime() + 60 * 60 * 1000); // 1 hour
      
      case PaymentMethod.OXXO_PAY:
        return new Date(now.getTime() + 4 * 60 * 60 * 1000); // 4 hours
      
      default:
        return undefined;
    }
  }

  private isRetryable(transaction: Transaction): boolean {
    // Determine if a failed payment can be retried
    return transaction.status === TransactionStatus.FAILED && 
           transaction.paymentMethod !== PaymentMethod.QR_CODE;
  }

  private async getVenueInfo(venueId: string): Promise<{ name: string; address: string; phone: string }> {
    // Mock venue info - in production, would fetch from venue service
    return {
      name: 'Mandala Beach Club',
      address: 'Blvd. Kukulcan Km 9.5, Zona Hotelera, Cancún',
      phone: '+52-998-848-8380'
    };
  }

  private async generateReceiptQRCode(transactionId: string, confirmationCode: string): Promise<string> {
    // Mock QR code URL - in production, would generate actual QR code
    return `/api/qr/receipt/${transactionId}?code=${confirmationCode}`;
  }

  private async handlePaymentFailure(
    transaction: Transaction, 
    user: User, 
    failureReason?: string
  ): Promise<void> {
    const confirmation: PaymentConfirmation = {
      transactionId: transaction.id,
      userId: transaction.userId,
      status: TransactionStatus.FAILED,
      amount: transaction.amount,
      balanceType: transaction.balanceType,
      paymentMethod: transaction.paymentMethod!,
      venueId: transaction.venueId,
      confirmationCode: this.generateConfirmationCode(transaction),
      retryable: true,
      supportContact: {
        phone: '+52-998-123-4567',
        email: 'soporte@mandala.mx',
        hours: '9:00 AM - 11:00 PM'
      }
    };

    await this.notificationService.sendPaymentConfirmation(confirmation, user);
  }

  private async handlePaymentPending(transaction: Transaction, user: User): Promise<void> {
    const confirmation: PaymentConfirmation = {
      transactionId: transaction.id,
      userId: transaction.userId,
      status: TransactionStatus.PENDING,
      amount: transaction.amount,
      balanceType: transaction.balanceType,
      paymentMethod: transaction.paymentMethod!,
      venueId: transaction.venueId,
      confirmationCode: this.generateConfirmationCode(transaction),
      estimatedArrival: this.calculateEstimatedArrival(transaction.paymentMethod!),
      supportContact: {
        phone: '+52-998-123-4567',
        email: 'soporte@mandala.mx',
        hours: '9:00 AM - 11:00 PM'
      }
    };

    await this.notificationService.sendPaymentConfirmation(confirmation, user);
  }

  private async logPaymentConfirmation(
    confirmation: PaymentConfirmation,
    notificationResponse: NotificationResponse
  ): Promise<void> {
    // In production, this would log to database for audit trail
    console.log('Payment confirmation logged:', {
      transactionId: confirmation.transactionId,
      confirmationCode: confirmation.confirmationCode,
      status: confirmation.status,
      notificationStatus: notificationResponse.status,
      channels: Object.keys(notificationResponse.channels),
      timestamp: new Date()
    });
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      return !!(this.notificationService && this.databaseService);
    } catch (error) {
      console.error('Payment confirmation service health check failed:', error);
      return false;
    }
  }
} 