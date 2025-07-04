import { DatabaseService } from '../database/database.service';
import { WalletService } from '../wallet/wallet.service';
import { NotificationService } from '../notification/notification.service';
import { PaymentConfirmationService } from './payment-confirmation.service';
import {
  PaymentRequest,
  PaymentResponse,
  PaymentMethod,
  TransactionType,
  TransactionStatus,
  BalanceType,
  Transaction,
  QRCodeData
} from '@mandala/shared-types';

export interface StripePaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}

export interface OxxoPaymentData {
  reference: string;
  amount: number;
  expiresAt: Date;
}

export interface ApplePayValidation {
  merchantId: string;
  displayName: string;
  domainName: string;
}

export interface SPEITransferData {
  clabe: string;
  amount: number;
  concept: string;
  reference: string;
}

export class PaymentService {
  private stripeSecretKey: string;
  private retryAttempts: number = 3;
  private retryDelay: number = 1000; // 1 second
  private notificationService: NotificationService;
  private paymentConfirmationService: PaymentConfirmationService;

  constructor(
    private databaseService: DatabaseService,
    private walletService: WalletService
  ) {
    // In production, this would come from environment variables
    this.stripeSecretKey = 'sk_test_development_key';
    
    // Initialize notification services
    this.notificationService = new NotificationService();
    this.paymentConfirmationService = new PaymentConfirmationService(
      this.notificationService,
      this.databaseService
    );
  }

  // Main payment processing method
  async processPayment(userId: string, paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Validate payment request
      this.validatePaymentRequest(paymentRequest);

      // Route to appropriate payment method
      switch (paymentRequest.paymentMethod) {
        case PaymentMethod.STRIPE:
          return await this.processStripePayment(userId, paymentRequest);
        
        case PaymentMethod.OXXO_PAY:
          return await this.processOxxoPayment(userId, paymentRequest);
        
        case PaymentMethod.APPLE_PAY:
          return await this.processApplePayment(userId, paymentRequest);
        
        case PaymentMethod.SPEI:
          return await this.processSPEIPayment(userId, paymentRequest);
        
        case PaymentMethod.QR_CODE:
          return await this.processQRPayment(userId, paymentRequest);
        
        default:
          throw new Error(`Unsupported payment method: ${paymentRequest.paymentMethod}`);
      }

    } catch (error) {
      console.error('Payment processing error:', error);
      
      // Create failed transaction record
      await this.createFailedTransaction(userId, paymentRequest, (error as Error).message);
      
      throw error;
    }
  }

  // Stripe Credit/Debit Card Processing
  async processStripePayment(userId: string, paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Create Stripe payment intent
      const paymentIntent = await this.createStripePaymentIntent(paymentRequest);
      
      // Create pending transaction
      const transaction = await this.createPendingTransaction(userId, paymentRequest, {
        stripePaymentIntentId: paymentIntent.id
      });

      return {
        transactionId: transaction.id,
        status: TransactionStatus.PENDING,
        amount: paymentRequest.amount,
        remainingBalance: 0, // Will be updated after confirmation
        paymentUrl: `stripe://payment_intent/${paymentIntent.client_secret}`,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
      };

    } catch (error) {
      console.error('Stripe payment error:', error);
      throw new Error(`Stripe payment failed: ${(error as Error).message}`);
    }
  }

  // OxxoPay (Mexican Convenience Store) Processing
  async processOxxoPayment(userId: string, paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Generate OxxoPay reference
      const oxxoData = await this.generateOxxoPayment(paymentRequest);
      
      // Create pending transaction
      const transaction = await this.createPendingTransaction(userId, paymentRequest, {
        oxxoReference: oxxoData.reference,
        oxxoExpiresAt: oxxoData.expiresAt
      });

      return {
        transactionId: transaction.id,
        status: TransactionStatus.PENDING,
        amount: paymentRequest.amount,
        remainingBalance: 0,
        paymentUrl: `oxxo://payment/${oxxoData.reference}`,
        expiresAt: oxxoData.expiresAt
      };

    } catch (error) {
      console.error('OxxoPay error:', error);
      throw new Error(`OxxoPay payment failed: ${(error as Error).message}`);
    }
  }

  // Apple Pay Processing
  async processApplePayment(userId: string, paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Validate Apple Pay merchant
      const validation = await this.validateApplePayMerchant();
      
      // Create pending transaction
      const transaction = await this.createPendingTransaction(userId, paymentRequest, {
        applePayMerchantId: validation.merchantId
      });

      return {
        transactionId: transaction.id,
        status: TransactionStatus.PENDING,
        amount: paymentRequest.amount,
        remainingBalance: 0,
        paymentUrl: `applepay://payment/${transaction.id}`,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
      };

    } catch (error) {
      console.error('Apple Pay error:', error);
      throw new Error(`Apple Pay failed: ${(error as Error).message}`);
    }
  }

  // SPEI Bank Transfer Processing
  async processSPEIPayment(userId: string, paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Generate SPEI transfer data
      const speiData = await this.generateSPEITransfer(paymentRequest);
      
      // Create pending transaction
      const transaction = await this.createPendingTransaction(userId, paymentRequest, {
        speiClabe: speiData.clabe,
        speiReference: speiData.reference,
        speiConcept: speiData.concept
      });

      return {
        transactionId: transaction.id,
        status: TransactionStatus.PENDING,
        amount: paymentRequest.amount,
        remainingBalance: 0,
        paymentUrl: `spei://transfer/${speiData.clabe}/${speiData.reference}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      };

    } catch (error) {
      console.error('SPEI error:', error);
      throw new Error(`SPEI transfer failed: ${(error as Error).message}`);
    }
  }

  // QR Code Payment Processing
  async processQRPayment(userId: string, paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Validate QR code if provided
      if (paymentRequest.qrCode) {
        const isValid = await this.databaseService.validateQRCode(paymentRequest.qrCode);
        if (!isValid) {
          throw new Error('Invalid or expired QR code');
        }
      }

      // Process payment through wallet service (internal balance)
      const paymentResult = await this.walletService.processPayment(userId, paymentRequest);
      
      return paymentResult;

    } catch (error) {
      console.error('QR payment error:', error);
      throw new Error(`QR payment failed: ${(error as Error).message}`);
    }
  }

  // Payment Retry Mechanism
  async retryFailedPayment(transactionId: string): Promise<PaymentResponse> {
    let attempt = 0;
    let lastError: Error;

    while (attempt < this.retryAttempts) {
      try {
        attempt++;
        
        // Get transaction details
        const transaction = await this.getTransactionById(transactionId);
        if (!transaction) {
          throw new Error('Transaction not found');
        }

        // Only retry failed transactions
        if (transaction.status !== TransactionStatus.FAILED) {
          throw new Error('Can only retry failed transactions');
        }

        // Recreate payment request from transaction
        const paymentRequest: PaymentRequest = {
          amount: transaction.amount,
          paymentMethod: transaction.paymentMethod!,
          description: transaction.description,
          balanceType: transaction.balanceType,
          venueId: transaction.venueId,
          metadata: transaction.metadata
        };

        // Retry the payment
        const result = await this.processPayment(transaction.userId, paymentRequest);
        
        // Mark original transaction as cancelled
        await this.databaseService.updateTransactionStatus(
          transactionId,
          TransactionStatus.CANCELLED,
          undefined,
          'Retried with new transaction'
        );

        return result;

      } catch (error) {
        lastError = error as Error;
        console.error(`Payment retry attempt ${attempt} failed:`, error);
        
        // Wait before next attempt
        if (attempt < this.retryAttempts) {
          await this.delay(this.retryDelay * attempt);
        }
      }
    }

    throw new Error(`Payment retry failed after ${this.retryAttempts} attempts: ${lastError!.message}`);
  }

  // Enhanced webhook handlers with confirmation support

  // Stripe webhook handler
  async handleStripeWebhook(event: any): Promise<void> {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handleStripePaymentSuccess(event.data.object);
          break;
        
        case 'payment_intent.payment_failed':
          await this.handleStripePaymentFailure(event.data.object);
          break;
        
        case 'payment_intent.canceled':
          await this.handleStripePaymentCancellation(event.data.object);
          break;
        
        default:
          console.log(`Unhandled Stripe event type: ${event.type}`);
      }
    } catch (error) {
      console.error('Stripe webhook error:', error);
      throw error;
    }
  }

  // OxxoPay webhook handler
  async handleOxxoWebhook(data: any): Promise<void> {
    try {
      if (data.status === 'paid') {
        await this.handleOxxoPaymentSuccess(data);
      } else if (data.status === 'expired') {
        await this.handleOxxoPaymentExpiration(data);
      }
    } catch (error) {
      console.error('OxxoPay webhook error:', error);
      throw error;
    }
  }

  // SPEI webhook handler
  async handleSPEIWebhook(data: any): Promise<void> {
    try {
      if (data.status === 'received') {
        await this.handleSPEIPaymentSuccess(data);
      } else if (data.status === 'rejected') {
        await this.handleSPEIPaymentFailure(data);
      }
    } catch (error) {
      console.error('SPEI webhook error:', error);
      throw error;
    }
  }

  // Enhanced webhook event handlers with confirmations

  private async handleStripePaymentSuccess(paymentIntent: any): Promise<void> {
    console.log('Stripe payment succeeded:', paymentIntent.id);
    
    try {
      // Find transaction by payment intent ID
      const transactionId = await this.findTransactionByPaymentIntentId(paymentIntent.id);
      
      if (transactionId) {
        await this.paymentConfirmationService.handlePaymentStatusUpdate(
          transactionId,
          TransactionStatus.COMPLETED,
          {
            stripePaymentIntentId: paymentIntent.id,
            stripeChargeId: paymentIntent.charges?.data[0]?.id
          }
        );
      }
    } catch (error) {
      console.error('Failed to handle Stripe payment success:', error);
    }
  }

  private async handleStripePaymentFailure(paymentIntent: any): Promise<void> {
    console.log('Stripe payment failed:', paymentIntent.id);
    
    try {
      const transactionId = await this.findTransactionByPaymentIntentId(paymentIntent.id);
      
      if (transactionId) {
        await this.paymentConfirmationService.handlePaymentStatusUpdate(
          transactionId,
          TransactionStatus.FAILED,
          {
            stripePaymentIntentId: paymentIntent.id,
            failureReason: paymentIntent.last_payment_error?.message || 'Payment failed'
          }
        );
      }
    } catch (error) {
      console.error('Failed to handle Stripe payment failure:', error);
    }
  }

  private async handleStripePaymentCancellation(paymentIntent: any): Promise<void> {
    console.log('Stripe payment cancelled:', paymentIntent.id);
    
    try {
      const transactionId = await this.findTransactionByPaymentIntentId(paymentIntent.id);
      
      if (transactionId) {
        await this.paymentConfirmationService.handlePaymentStatusUpdate(
          transactionId,
          TransactionStatus.CANCELLED,
          {
            stripePaymentIntentId: paymentIntent.id,
            failureReason: 'Payment cancelled by user'
          }
        );
      }
    } catch (error) {
      console.error('Failed to handle Stripe payment cancellation:', error);
    }
  }

  private async handleOxxoPaymentSuccess(data: any): Promise<void> {
    console.log('OxxoPay payment succeeded:', data.reference);
    
    try {
      const transactionId = await this.findTransactionByOxxoReference(data.reference);
      
      if (transactionId) {
        await this.paymentConfirmationService.handlePaymentStatusUpdate(
          transactionId,
          TransactionStatus.COMPLETED,
          {
            oxxoReference: data.reference,
            oxxoStoreLocation: data.store_location
          }
        );
      }
    } catch (error) {
      console.error('Failed to handle OxxoPay payment success:', error);
    }
  }

  private async handleOxxoPaymentExpiration(data: any): Promise<void> {
    console.log('OxxoPay payment expired:', data.reference);
    
    try {
      const transactionId = await this.findTransactionByOxxoReference(data.reference);
      
      if (transactionId) {
        await this.paymentConfirmationService.handlePaymentStatusUpdate(
          transactionId,
          TransactionStatus.FAILED,
          {
            oxxoReference: data.reference,
            failureReason: 'Payment expired'
          }
        );
      }
    } catch (error) {
      console.error('Failed to handle OxxoPay payment expiration:', error);
    }
  }

  private async handleSPEIPaymentSuccess(data: any): Promise<void> {
    console.log('SPEI payment succeeded:', data.reference);
    
    try {
      const transactionId = await this.findTransactionBySPEIReference(data.reference);
      
      if (transactionId) {
        await this.paymentConfirmationService.handlePaymentStatusUpdate(
          transactionId,
          TransactionStatus.COMPLETED,
          {
            speiReference: data.reference,
            speiTrackingKey: data.tracking_key
          }
        );
      }
    } catch (error) {
      console.error('Failed to handle SPEI payment success:', error);
    }
  }

  private async handleSPEIPaymentFailure(data: any): Promise<void> {
    console.log('SPEI payment failed:', data.reference);
    
    try {
      const transactionId = await this.findTransactionBySPEIReference(data.reference);
      
      if (transactionId) {
        await this.paymentConfirmationService.handlePaymentStatusUpdate(
          transactionId,
          TransactionStatus.FAILED,
          {
            speiReference: data.reference,
            failureReason: data.rejection_reason || 'Bank transfer rejected'
          }
        );
      }
    } catch (error) {
      console.error('Failed to handle SPEI payment failure:', error);
    }
  }

  // Helper methods to find transactions by external IDs
  private async findTransactionByPaymentIntentId(paymentIntentId: string): Promise<string | null> {
    // In production, would query database for transaction with this payment intent ID
    // For now, mock implementation
    return `tx_${Date.now()}`;
  }

  private async findTransactionByOxxoReference(reference: string): Promise<string | null> {
    // In production, would query database for transaction with this OXXO reference
    return `tx_${Date.now()}`;
  }

  private async findTransactionBySPEIReference(reference: string): Promise<string | null> {
    // In production, would query database for transaction with this SPEI reference
    return `tx_${Date.now()}`;
  }

  // Helper Methods

  private validatePaymentRequest(request: PaymentRequest): void {
    if (!request.amount || request.amount <= 0) {
      throw new Error('Invalid payment amount');
    }

    if (!request.paymentMethod) {
      throw new Error('Payment method is required');
    }

    if (!request.description) {
      throw new Error('Payment description is required');
    }

    // Validate amount limits
    if (request.amount > 10000) {
      throw new Error('Payment amount exceeds maximum limit (10,000 MXN)');
    }

    if (request.amount < 1) {
      throw new Error('Payment amount below minimum limit (1 MXN)');
    }
  }

  private async createPendingTransaction(
    userId: string, 
    paymentRequest: PaymentRequest, 
    metadata: Record<string, any>
  ): Promise<Transaction> {
    const wallet = await this.walletService.getWalletByUserId(userId);
    
    return await this.databaseService.createTransaction({
      walletId: wallet.id,
      userId: userId,
      type: TransactionType.DEPOSIT,
      amount: paymentRequest.amount,
      balanceType: paymentRequest.balanceType || BalanceType.CASH,
      paymentMethod: paymentRequest.paymentMethod,
      description: paymentRequest.description,
      venueId: paymentRequest.venueId,
      metadata: { ...paymentRequest.metadata, ...metadata }
    });
  }

  private async createFailedTransaction(
    userId: string, 
    paymentRequest: PaymentRequest, 
    errorMessage: string
  ): Promise<Transaction> {
    const transaction = await this.createPendingTransaction(userId, paymentRequest, {
      errorMessage,
      failedAt: new Date()
    });

    return await this.databaseService.updateTransactionStatus(
      transaction.id,
      TransactionStatus.FAILED,
      undefined,
      errorMessage
    );
  }

  // Mock implementations for development
  private async createStripePaymentIntent(request: PaymentRequest): Promise<StripePaymentIntent> {
    // Mock Stripe payment intent
    return {
      id: `pi_${Date.now()}`,
      amount: request.amount * 100, // Stripe uses cents
      currency: 'mxn',
      status: 'requires_payment_method',
      client_secret: `pi_${Date.now()}_secret_mock`
    };
  }

  private async generateOxxoPayment(request: PaymentRequest): Promise<OxxoPaymentData> {
    return {
      reference: `OXXO${Date.now().toString().slice(-8)}`,
      amount: request.amount,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    };
  }

  private async validateApplePayMerchant(): Promise<ApplePayValidation> {
    return {
      merchantId: 'merchant.com.mandala.wallet',
      displayName: 'Mandala Wallet',
      domainName: 'mandala-wallet.com'
    };
  }

  private async generateSPEITransfer(request: PaymentRequest): Promise<SPEITransferData> {
    return {
      clabe: '646180157000000004', // Mock CLABE
      amount: request.amount,
      concept: request.description,
      reference: `SPEI${Date.now().toString().slice(-10)}`
    };
  }

  private async getTransactionById(transactionId: string): Promise<Transaction | null> {
    // This would query the database for the transaction
    return null;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // QR Code Management
  async generatePaymentQR(venueId: string, amount?: number): Promise<string> {
    const qrData: QRCodeData = {
      type: 'payment',
      venueId: venueId,
      amount: amount,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      metadata: {
        createdAt: new Date(),
        version: '1.0'
      }
    };

    const qrCode = await this.databaseService.generateQRCode(qrData);
    return qrCode.id;
  }

  async validatePaymentQR(qrCodeId: string): Promise<boolean> {
    return await this.databaseService.validateQRCode(qrCodeId);
  }
} 