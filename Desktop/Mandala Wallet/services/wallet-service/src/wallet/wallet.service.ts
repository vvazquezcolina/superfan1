import { DatabaseService } from '../database/database.service';
import { NotificationService } from '../notification/notification.service';
import { PaymentConfirmationService } from '../payment/payment-confirmation.service';
import { 
  Wallet, 
  WalletSummary, 
  Transaction, 
  PaymentRequest, 
  PaymentResponse, 
  RefundRequest,
  TransferRequest,
  TransactionType,
  TransactionStatus,
  BalanceType,
  PaymentMethod,
  PartialPaymentTracker,
  RefundSummary
} from '@mandala/shared-types';

export class WalletService {
  private notificationService: NotificationService;
  private paymentConfirmationService: PaymentConfirmationService;

  constructor(private databaseService: DatabaseService) {
    // Initialize notification services
    this.notificationService = new NotificationService();
    this.paymentConfirmationService = new PaymentConfirmationService(
      this.notificationService,
      this.databaseService
    );
  }

  // Core Wallet Operations
  async getWalletByUserId(userId: string): Promise<Wallet> {
    return await this.databaseService.getOrCreateWallet(userId);
  }

  async createWallet(userId: string): Promise<Wallet> {
    return await this.databaseService.getOrCreateWallet(userId);
  }

  async getWalletSummary(userId: string): Promise<WalletSummary> {
    const wallet = await this.getWalletByUserId(userId);
    const transactions = await this.databaseService.getTransactionHistory(wallet.id, 1, 10);
    const expiringBalances = await this.databaseService.getExpiringBalances(userId);

    return {
      totalBalance: wallet.totalBalance,
      balanceBreakdown: {
        cash: wallet.balances[BalanceType.CASH],
        credit: wallet.balances[BalanceType.CREDIT],
        rewards: wallet.balances[BalanceType.REWARDS]
      },
      expiringCredit: expiringBalances.expiringCredit,
      expiringRewards: expiringBalances.expiringRewards,
      recentTransactions: transactions
    };
  }

  // Payment Processing
  async processPayment(userId: string, paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    const wallet = await this.getWalletByUserId(userId);
    
    // Validate payment amount
    if (paymentRequest.amount <= 0) {
      throw new Error('Payment amount must be positive');
    }

    // Check if partial payments are allowed
    if (paymentRequest.allowPartialPayment) {
      return await this.processPartialPayment(userId, paymentRequest);
    }

    // Determine balance type for payment
    const balanceType = paymentRequest.balanceType || BalanceType.CASH;
    const availableBalance = wallet.balances[balanceType];

    if (availableBalance < paymentRequest.amount) {
      // If partial payments are not allowed, suggest them
      const availableBalanceByType = await this.databaseService.getAvailableBalancesByType(wallet.id);
      const totalAvailable = Object.values(availableBalanceByType).reduce((sum, amount) => sum + amount, 0);
      
      if (totalAvailable >= paymentRequest.amount) {
        throw new Error(`Insufficient ${balanceType} balance. Consider using mixed balance types or enabling partial payments.`);
      } else {
        throw new Error(`Insufficient balance. Available: ${totalAvailable} MXN, Required: ${paymentRequest.amount} MXN. Consider enabling partial payments.`);
      }
    }

    // Create transaction
    const transaction = await this.databaseService.createTransaction({
      walletId: wallet.id,
      userId: userId,
      type: TransactionType.PAYMENT,
      amount: paymentRequest.amount,
      balanceType: balanceType,
      paymentMethod: paymentRequest.paymentMethod,
      description: paymentRequest.description,
      venueId: paymentRequest.venueId,
      metadata: paymentRequest.metadata
    });

    try {
      // Update wallet balance
      const newBalance = availableBalance - paymentRequest.amount;
      await this.databaseService.updateWalletBalances(wallet.id, {
        [balanceType]: newBalance
      });

      // Mark transaction as completed
      await this.databaseService.updateTransactionStatus(
        transaction.id,
        TransactionStatus.COMPLETED
      );

      // Send payment confirmation notification
      const user = await this.databaseService.getUserById(userId);
      if (user) {
        const completedTransaction = { ...transaction, status: TransactionStatus.COMPLETED, completedAt: new Date() };
        await this.paymentConfirmationService.confirmPayment(completedTransaction, user);
      }

      // Generate QR code for receipt if needed
      let qrCodeData: string | undefined;
      if (paymentRequest.venueId) {
        const qrCode = await this.databaseService.generateQRCode({
          type: 'receipt',
          venueId: paymentRequest.venueId,
          transactionId: transaction.id,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        });
        qrCodeData = qrCode.id;
      }

      return {
        transactionId: transaction.id,
        status: TransactionStatus.COMPLETED,
        amount: paymentRequest.amount,
        remainingBalance: wallet.totalBalance - paymentRequest.amount,
        qrCodeData: qrCodeData,
        isPartialPayment: false,
        requestedAmount: paymentRequest.amount,
        remainingAmount: 0
      };

    } catch (error) {
      // Mark transaction as failed
      await this.databaseService.updateTransactionStatus(
        transaction.id,
        TransactionStatus.FAILED,
        undefined,
        (error as Error).message
      );

      throw error;
    }
  }

  // New Partial Payment Processing
  async processPartialPayment(userId: string, paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    const wallet = await this.getWalletByUserId(userId);
    
    // Calculate optimal payment split
    const paymentSplit = await this.databaseService.calculateOptimalPaymentSplit(
      wallet.id,
      paymentRequest.amount,
      paymentRequest.balanceType
    );

    // If we can pay the full amount, do so
    if (paymentSplit.canPayFull) {
      return await this.processFullPaymentWithSplit(userId, paymentRequest, paymentSplit);
    }

    // Check minimum amount requirements
    const minimumAmount = paymentRequest.minimumAmount || paymentRequest.amount * 0.1; // 10% minimum
    if (paymentSplit.maxPayable < minimumAmount) {
      throw new Error(`Insufficient balance for partial payment. Available: ${paymentSplit.maxPayable} MXN, Minimum required: ${minimumAmount} MXN`);
    }

    // Create partial payment tracker
    const partialTracker = await this.databaseService.createPartialPaymentTracker({
      originalTransactionId: `temp_${Date.now()}`, // Will be updated after creating the transaction
      originalAmount: paymentRequest.amount,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });

    // Create the partial payment transaction
    const transaction = await this.databaseService.createTransaction({
      walletId: wallet.id,
      userId: userId,
      type: TransactionType.PAYMENT,
      amount: paymentSplit.maxPayable,
      balanceType: BalanceType.CASH, // Mixed payment uses cash balance tracking
      paymentMethod: paymentRequest.paymentMethod,
      description: `Partial payment: ${paymentRequest.description}`,
      venueId: paymentRequest.venueId,
      metadata: {
        ...paymentRequest.metadata,
        isPartialPayment: true,
        originalAmount: paymentRequest.amount,
        partialPaymentTrackerId: partialTracker.id,
        balanceSplit: paymentSplit.suggestedSplit
      }
    });

    try {
      // Update wallet balances according to the split
      const balanceUpdates: { [key: string]: number } = {};
      
      for (const [balanceType, amount] of Object.entries(paymentSplit.suggestedSplit)) {
        if (amount > 0) {
          const currentBalance = wallet.balances[balanceType as BalanceType];
          balanceUpdates[balanceType] = currentBalance - amount;
        }
      }

      await this.databaseService.updateWalletBalances(wallet.id, balanceUpdates);

      // Update partial payment tracker
      await this.databaseService.updatePartialPaymentTracker(partialTracker.id, {
        paidAmount: paymentSplit.maxPayable,
        remainingAmount: paymentRequest.amount - paymentSplit.maxPayable
      });

      // Add payment attempt to tracker
      await this.databaseService.addPartialPaymentAttempt(partialTracker.id, {
        transactionId: transaction.id,
        amount: paymentSplit.maxPayable,
        balanceType: BalanceType.CASH,
        status: TransactionStatus.COMPLETED
      });

      // Mark transaction as completed
      await this.databaseService.updateTransactionStatus(
        transaction.id,
        TransactionStatus.COMPLETED
      );

      // Send partial payment confirmation notification
      const user = await this.databaseService.getUserById(userId);
      if (user) {
        const remainingAmount = paymentRequest.amount - paymentSplit.maxPayable;
        await this.paymentConfirmationService.confirmPartialPayment(
          { ...transaction, status: TransactionStatus.COMPLETED },
          user,
          partialTracker.id,
          remainingAmount
        );
      }

      const remainingAmount = paymentRequest.amount - paymentSplit.maxPayable;
      const canRetry = remainingAmount > 0 && (paymentRequest.maxRetries || 3) > 0;

      return {
        transactionId: transaction.id,
        status: TransactionStatus.COMPLETED,
        amount: paymentSplit.maxPayable,
        remainingBalance: wallet.totalBalance - paymentSplit.maxPayable,
        isPartialPayment: true,
        requestedAmount: paymentRequest.amount,
        remainingAmount: remainingAmount,
        partialPaymentId: partialTracker.id,
        canRetry: canRetry,
        availableBalanceByType: await this.databaseService.getAvailableBalancesByType(wallet.id)
      };

    } catch (error) {
      // Mark transaction as failed
      await this.databaseService.updateTransactionStatus(
        transaction.id,
        TransactionStatus.FAILED,
        undefined,
        (error as Error).message
      );

      throw error;
    }
  }

  // Full payment with optimal balance split
  async processFullPaymentWithSplit(
    userId: string, 
    paymentRequest: PaymentRequest, 
    paymentSplit: any
  ): Promise<PaymentResponse> {
    const wallet = await this.getWalletByUserId(userId);
    
    // Create transaction
    const transaction = await this.databaseService.createTransaction({
      walletId: wallet.id,
      userId: userId,
      type: TransactionType.PAYMENT,
      amount: paymentRequest.amount,
      balanceType: BalanceType.CASH, // Mixed payment uses cash balance tracking
      paymentMethod: paymentRequest.paymentMethod,
      description: paymentRequest.description,
      venueId: paymentRequest.venueId,
      metadata: {
        ...paymentRequest.metadata,
        balanceSplit: paymentSplit.suggestedSplit
      }
    });

    try {
      // Update wallet balances according to the split
      const balanceUpdates: { [key: string]: number } = {};
      
      for (const [balanceType, amount] of Object.entries(paymentSplit.suggestedSplit)) {
        if (amount > 0) {
          const currentBalance = wallet.balances[balanceType as BalanceType];
          balanceUpdates[balanceType] = currentBalance - (amount as number);
        }
      }

      await this.databaseService.updateWalletBalances(wallet.id, balanceUpdates);

      // Mark transaction as completed
      await this.databaseService.updateTransactionStatus(
        transaction.id,
        TransactionStatus.COMPLETED
      );

      // Generate QR code for receipt if needed
      let qrCodeData: string | undefined;
      if (paymentRequest.venueId) {
        const qrCode = await this.databaseService.generateQRCode({
          type: 'receipt',
          venueId: paymentRequest.venueId,
          transactionId: transaction.id,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        });
        qrCodeData = qrCode.id;
      }

      return {
        transactionId: transaction.id,
        status: TransactionStatus.COMPLETED,
        amount: paymentRequest.amount,
        remainingBalance: wallet.totalBalance - paymentRequest.amount,
        qrCodeData: qrCodeData,
        isPartialPayment: false,
        requestedAmount: paymentRequest.amount,
        remainingAmount: 0
      };

    } catch (error) {
      // Mark transaction as failed
      await this.databaseService.updateTransactionStatus(
        transaction.id,
        TransactionStatus.FAILED,
        undefined,
        (error as Error).message
      );

      throw error;
    }
  }

  // Enhanced Refund Processing
  async processRefund(userId: string, refundRequest: RefundRequest): Promise<Transaction> {
    const wallet = await this.getWalletByUserId(userId);

    // Validate refund request
    const validation = await this.databaseService.validateRefundRequest(
      refundRequest.transactionId,
      refundRequest.amount || 0
    );

    if (!validation.isValid) {
      throw new Error(`Refund validation failed: ${validation.reason}`);
    }

    // Get refund summary to understand current state
    const refundSummary = await this.databaseService.getRefundSummary(refundRequest.transactionId);
    const refundAmount = refundRequest.amount || refundSummary.remainingRefundable;

    // Determine refund balance type
    let refundBalanceType = BalanceType.CASH; // Default to cash
    
    if (refundRequest.refundToOriginalBalance) {
      // Try to refund to original balance type if specified
      const originalTransaction = await this.databaseService.findTransactionById(refundRequest.transactionId);
      if (originalTransaction) {
        refundBalanceType = originalTransaction.balanceType;
      }
    }

    // Handle custom refund breakdown
    let refundBreakdown: { [key in BalanceType]?: number } = {};
    if (refundRequest.refundBreakdown) {
      refundBreakdown = refundRequest.refundBreakdown;
    } else {
      refundBreakdown[refundBalanceType] = refundAmount;
    }

    // Create refund transaction
    const refundTransaction = await this.databaseService.createTransaction({
      walletId: wallet.id,
      userId: userId,
      type: TransactionType.REFUND,
      amount: refundAmount,
      balanceType: refundBalanceType,
      description: `Refund: ${refundRequest.reason}`,
      metadata: { 
        originalTransactionId: refundRequest.transactionId,
        refundBreakdown: refundBreakdown,
        isPartialRefund: refundRequest.partialRefund || false
      }
    });

    try {
      // Update wallet balances according to refund breakdown
      const balanceUpdates: { [key: string]: number } = {};
      
      for (const balanceType of Object.values(BalanceType)) {
        const amount = refundBreakdown[balanceType];
        if (typeof amount === 'number' && amount > 0) {
          const currentBalance = wallet.balances[balanceType];
          balanceUpdates[balanceType] = currentBalance + amount;
        }
      }

      await this.databaseService.updateWalletBalances(wallet.id, balanceUpdates);

      // Mark refund as completed
      await this.databaseService.updateTransactionStatus(
        refundTransaction.id,
        TransactionStatus.COMPLETED
      );

      // Send refund confirmation notification
      const user = await this.databaseService.getUserById(userId);
      if (user) {
        await this.paymentConfirmationService.confirmRefund(
          refundRequest.transactionId,
          { ...refundTransaction, status: TransactionStatus.COMPLETED },
          user
        );
      }

      return refundTransaction;

    } catch (error) {
      await this.databaseService.updateTransactionStatus(
        refundTransaction.id,
        TransactionStatus.FAILED,
        undefined,
        (error as Error).message
      );

      throw error;
    }
  }

  // New helper methods
  async getPartialPaymentStatus(partialPaymentId: string): Promise<PartialPaymentTracker | null> {
    return await this.databaseService.getPartialPaymentTracker(partialPaymentId);
  }

  async getRefundSummary(transactionId: string): Promise<RefundSummary> {
    return await this.databaseService.getRefundSummary(transactionId);
  }

  async continuePartialPayment(userId: string, partialPaymentId: string): Promise<PaymentResponse> {
    const tracker = await this.databaseService.getPartialPaymentTracker(partialPaymentId);
    
    if (!tracker) {
      throw new Error('Partial payment tracker not found');
    }

    if (tracker.status !== 'active') {
      throw new Error(`Partial payment is ${tracker.status} and cannot be continued`);
    }

    if (tracker.expiresAt < new Date()) {
      throw new Error('Partial payment has expired');
    }

    // Create a new payment request for the remaining amount
    const remainingPaymentRequest: PaymentRequest = {
      amount: tracker.remainingAmount,
      paymentMethod: PaymentMethod.QR_CODE,
      description: `Continuing partial payment`,
      allowPartialPayment: true,
      metadata: {
        partialPaymentTrackerId: partialPaymentId,
        isPartialPaymentContinuation: true
      }
    };

    return await this.processPartialPayment(userId, remainingPaymentRequest);
  }

  // Balance Transfer
  async transferBalance(transferRequest: TransferRequest): Promise<Transaction> {
    // Get both wallets
    const fromWallet = await this.databaseService.getOrCreateWallet(transferRequest.fromWalletId);
    const toWallet = await this.databaseService.getOrCreateWallet(transferRequest.toWalletId);

    // Validate transfer
    const availableBalance = fromWallet.balances[transferRequest.balanceType];
    if (availableBalance < transferRequest.amount) {
      throw new Error(`Insufficient ${transferRequest.balanceType} balance for transfer`);
    }

    // Create transfer transaction
    const transferTransaction = await this.databaseService.createTransaction({
      walletId: fromWallet.id,
      userId: transferRequest.fromWalletId, // Using wallet ID as user ID for admin transfers
      type: TransactionType.TRANSFER,
      amount: transferRequest.amount,
      balanceType: transferRequest.balanceType,
      description: transferRequest.description,
      metadata: { 
        toWalletId: transferRequest.toWalletId,
        transferType: 'outgoing'
      }
    });

    try {
      // Update from wallet (decrease balance)
      const newFromBalance = availableBalance - transferRequest.amount;
      await this.databaseService.updateWalletBalances(fromWallet.id, {
        [transferRequest.balanceType]: newFromBalance
      });

      // Update to wallet (increase balance)
      const currentToBalance = toWallet.balances[transferRequest.balanceType];
      await this.databaseService.updateWalletBalances(toWallet.id, {
        [transferRequest.balanceType]: currentToBalance + transferRequest.amount
      });

      // Create incoming transaction record for receiving wallet
      await this.databaseService.createTransaction({
        walletId: toWallet.id,
        userId: transferRequest.toWalletId,
        type: TransactionType.TRANSFER,
        amount: transferRequest.amount,
        balanceType: transferRequest.balanceType,
        description: `Received: ${transferRequest.description}`,
        metadata: { 
          fromWalletId: transferRequest.fromWalletId,
          transferType: 'incoming'
        }
      });

      // Mark transfer as completed
      await this.databaseService.updateTransactionStatus(
        transferTransaction.id,
        TransactionStatus.COMPLETED
      );

      return transferTransaction;

    } catch (error) {
      await this.databaseService.updateTransactionStatus(
        transferTransaction.id,
        TransactionStatus.FAILED,
        undefined,
        (error as Error).message
      );

      throw error;
    }
  }

  // Transaction History
  async getTransactions(userId: string, page: number = 1, limit: number = 20): Promise<Transaction[]> {
    const wallet = await this.getWalletByUserId(userId);
    return await this.databaseService.getTransactionHistory(wallet.id, page, limit);
  }

  // Wallet Management
  async activateWallet(userId: string): Promise<Wallet> {
    const wallet = await this.getWalletByUserId(userId);
    // Implementation would update wallet status
    return wallet;
  }

  async deactivateWallet(userId: string): Promise<Wallet> {
    const wallet = await this.getWalletByUserId(userId);
    // Implementation would update wallet status
    return wallet;
  }

  // Balance Top-up (for RP monthly allocation)
  async allocateMonthlyCredit(userId: string, amount: number): Promise<Transaction> {
    const wallet = await this.getWalletByUserId(userId);
    
    // Create allocation transaction
    const allocation = await this.databaseService.createTransaction({
      walletId: wallet.id,
      userId: userId,
      type: TransactionType.ALLOCATION,
      amount: amount,
      balanceType: BalanceType.CREDIT,
      description: 'Monthly RP credit allocation',
      metadata: { 
        allocationType: 'monthly_rp_credit',
        month: new Date().toISOString().substring(0, 7) // YYYY-MM format
      }
    });

    try {
      // Update credit balance
      const currentCreditBalance = wallet.balances[BalanceType.CREDIT];
      await this.databaseService.updateWalletBalances(wallet.id, {
        credit: currentCreditBalance + amount
      });

      await this.databaseService.updateTransactionStatus(
        allocation.id,
        TransactionStatus.COMPLETED
      );

      return allocation;

    } catch (error) {
      await this.databaseService.updateTransactionStatus(
        allocation.id,
        TransactionStatus.FAILED,
        undefined,
        (error as Error).message
      );

      throw error;
    }
  }

  // Reward Processing
  async addReward(userId: string, amount: number, description: string, venueId?: string): Promise<Transaction> {
    const wallet = await this.getWalletByUserId(userId);
    
    // Create reward transaction
    const reward = await this.databaseService.createTransaction({
      walletId: wallet.id,
      userId: userId,
      type: TransactionType.BONUS,
      amount: amount,
      balanceType: BalanceType.REWARDS,
      description: description,
      venueId: venueId,
      metadata: { 
        rewardType: 'earned',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
      }
    });

    try {
      // Update rewards balance
      const currentRewardsBalance = wallet.balances[BalanceType.REWARDS];
      await this.databaseService.updateWalletBalances(wallet.id, {
        rewards: currentRewardsBalance + amount
      });

      await this.databaseService.updateTransactionStatus(
        reward.id,
        TransactionStatus.COMPLETED
      );

      return reward;

    } catch (error) {
      await this.databaseService.updateTransactionStatus(
        reward.id,
        TransactionStatus.FAILED,
        undefined,
        (error as Error).message
      );

      throw error;
    }
  }

  // QR Code Generation for RP invitations
  async generateGuestQRCode(rpUserId: string, amount: number, venueId: string): Promise<any> {
    const wallet = await this.getWalletByUserId(rpUserId);
    
    // Validate RP has sufficient credit balance
    if (wallet.balances[BalanceType.CREDIT] < amount) {
      throw new Error('Insufficient credit balance to generate guest QR code');
    }

    // Generate QR code for guest consumption
    const qrCode = await this.databaseService.generateQRCode({
      type: 'payment',
      venueId: venueId,
      amount: amount,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      metadata: {
        rpUserId: rpUserId,
        guestInvitation: true
      }
    });

    return qrCode;
  }
} 