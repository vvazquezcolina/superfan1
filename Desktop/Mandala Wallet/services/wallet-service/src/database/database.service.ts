import { PrismaService } from './prisma.service';
import { 
  Wallet, 
  Transaction, 
  TransactionType, 
  TransactionStatus, 
  BalanceType, 
  PaymentMethod,
  PartialPaymentTracker,
  PartialPaymentAttempt,
  RefundSummary
} from '@mandala/shared-types';

export class DatabaseService {
  constructor(private prisma: PrismaService) {}

  // Wallet Management
  async getOrCreateWallet(userId: string): Promise<Wallet> {
    let wallet = await this.prisma.findWalletByUserId(userId);
    
    if (!wallet) {
      wallet = await this.prisma.createWallet({
        userId,
        cashBalance: 0,
        creditBalance: 0,
        rewardsBalance: 0,
        currency: 'MXN',
        isActive: true
      });
    }
    
    return this.mapToWallet(wallet);
  }

  async updateWalletBalances(walletId: string, balances: {
    cash?: number;
    credit?: number;
    rewards?: number;
  }): Promise<Wallet> {
    const totalBalance = (balances.cash || 0) + (balances.credit || 0) + (balances.rewards || 0);
    
    // Validate balance limits
    if (totalBalance < 0) {
      throw new Error('Balance cannot be negative');
    }
    
    if (totalBalance > 10000) {
      throw new Error('Balance cannot exceed 10,000 MXN');
    }
    
    if (totalBalance > 0 && totalBalance < 100) {
      throw new Error('Minimum balance is 100 MXN');
    }

    const updatedWallet = await this.prisma.updateWalletBalance(walletId, {
      cashBalance: balances.cash,
      creditBalance: balances.credit,
      rewardsBalance: balances.rewards
    });

    return this.mapToWallet(updatedWallet);
  }

  // Transaction Management
  async createTransaction(transactionData: {
    walletId: string;
    userId: string;
    type: TransactionType;
    amount: number;
    balanceType: BalanceType;
    paymentMethod?: PaymentMethod;
    description: string;
    venueId?: string;
    metadata?: Record<string, any>;
  }): Promise<Transaction> {
    const transaction = await this.prisma.createTransaction({
      ...transactionData,
      status: TransactionStatus.PENDING
    });

    return this.mapToTransaction(transaction);
  }

  async updateTransactionStatus(
    transactionId: string, 
    status: TransactionStatus,
    completedAt?: Date,
    failureReason?: string
  ): Promise<Transaction> {
    const updateData: any = { status };
    
    if (status === TransactionStatus.COMPLETED) {
      updateData.completedAt = completedAt || new Date();
    } else if (status === TransactionStatus.FAILED) {
      updateData.failedAt = new Date();
      updateData.failureReason = failureReason;
    }

    const transaction = await this.prisma.updateTransactionStatus(transactionId, status);
    return this.mapToTransaction(transaction);
  }

  async getTransactionHistory(
    walletId: string, 
    page: number = 1, 
    limit: number = 20
  ): Promise<Transaction[]> {
    const transactions = await this.prisma.findTransactionsByWalletId(walletId, page, limit);
    return transactions.map(tx => this.mapToTransaction(tx));
  }

  // Balance Expiration Management
  async expireBalances(): Promise<void> {
    console.log('Running balance expiration job...');
    
    // This would run the expire_balances() function from the database
    // For now, just log the operation
    console.log('Expired balances processed');
  }

  async getExpiringBalances(userId: string): Promise<{
    expiringCredit?: { amount: number; expiresAt: Date };
    expiringRewards?: { amount: number; expiresAt: Date };
  }> {
    // Implementation would query balance_details table for expiring balances
    return {};
  }

  // QR Code Management
  async generateQRCode(data: {
    type: 'payment' | 'receipt';
    venueId?: string;
    amount?: number;
    transactionId?: string;
    expiresAt: Date;
    metadata?: Record<string, any>;
  }) {
    return await this.prisma.createQRCode({
      ...data,
      data: JSON.stringify(data),
      isActive: true
    });
  }

  async validateQRCode(qrCodeId: string): Promise<boolean> {
    const qrCode = await this.prisma.findQRCodeById(qrCodeId);
    
    if (!qrCode || !qrCode.isActive) {
      return false;
    }

    if (qrCode.expiresAt < new Date()) {
      return false;
    }

    return true;
  }

  // Helper methods for mapping database objects to types
  private mapToWallet(dbWallet: any): Wallet {
    return {
      id: dbWallet.id,
      userId: dbWallet.userId,
      balances: {
        [BalanceType.CASH]: dbWallet.cashBalance || 0,
        [BalanceType.CREDIT]: dbWallet.creditBalance || 0,
        [BalanceType.REWARDS]: dbWallet.rewardsBalance || 0
      },
      totalBalance: (dbWallet.cashBalance || 0) + (dbWallet.creditBalance || 0) + (dbWallet.rewardsBalance || 0),
      currency: dbWallet.currency || 'MXN',
      isActive: dbWallet.isActive,
      createdAt: dbWallet.createdAt,
      updatedAt: dbWallet.updatedAt,
      lastTransactionAt: dbWallet.lastTransactionAt
    };
  }

  private mapToTransaction(dbTransaction: any): Transaction {
    return {
      id: dbTransaction.id,
      walletId: dbTransaction.walletId,
      userId: dbTransaction.userId,
      type: dbTransaction.type,
      status: dbTransaction.status,
      amount: dbTransaction.amount,
      balanceType: dbTransaction.balanceType,
      paymentMethod: dbTransaction.paymentMethod,
      description: dbTransaction.description,
      metadata: dbTransaction.metadata,
      venueId: dbTransaction.venueId,
      merchantTransactionId: dbTransaction.merchantTransactionId,
      externalTransactionId: dbTransaction.externalTransactionId,
      createdAt: dbTransaction.createdAt,
      updatedAt: dbTransaction.updatedAt,
      completedAt: dbTransaction.completedAt,
      failedAt: dbTransaction.failedAt,
      failureReason: dbTransaction.failureReason
    };
  }

  // Venue operations
  async getVenueById(venueId: string) {
    return await this.prisma.findVenueById(venueId);
  }

  async getVenuesByManager(managerId: string) {
    return await this.prisma.findVenuesByManager(managerId);
  }

  // User operations
  async getUserById(userId: string) {
    return await this.prisma.findUserById(userId);
  }

  async getUserByEmail(email: string) {
    return await this.prisma.findUserByEmail(email);
  }

  // Transaction operations
  async findTransactionById(transactionId: string): Promise<Transaction | null> {
    const transaction = await this.prisma.findTransactionById(transactionId);
    return transaction ? this.mapToTransaction(transaction) : null;
  }

  // Partial Payment Management
  async createPartialPaymentTracker(data: {
    originalTransactionId: string;
    originalAmount: number;
    expiresAt: Date;
  }): Promise<PartialPaymentTracker> {
    const tracker = await this.prisma.createPartialPaymentTracker({
      ...data,
      paidAmount: 0,
      remainingAmount: data.originalAmount,
      status: 'active'
    });

    return this.mapToPartialPaymentTracker(tracker);
  }

  async updatePartialPaymentTracker(
    trackerId: string, 
    data: {
      paidAmount: number;
      remainingAmount: number;
      status?: 'active' | 'completed' | 'expired';
    }
  ): Promise<PartialPaymentTracker> {
    const tracker = await this.prisma.updatePartialPaymentTracker(trackerId, data);
    return this.mapToPartialPaymentTracker(tracker);
  }

  async addPartialPaymentAttempt(
    trackerId: string, 
    attempt: {
      transactionId: string;
      amount: number;
      balanceType: BalanceType;
      status: TransactionStatus;
      failureReason?: string;
    }
  ): Promise<PartialPaymentAttempt> {
    const attemptData = await this.prisma.createPartialPaymentAttempt({
      ...attempt,
      partialPaymentTrackerId: trackerId
    });

    return this.mapToPartialPaymentAttempt(attemptData);
  }

  async getPartialPaymentTracker(trackerId: string): Promise<PartialPaymentTracker | null> {
    const tracker = await this.prisma.findPartialPaymentTracker(trackerId);
    return tracker ? this.mapToPartialPaymentTracker(tracker) : null;
  }

  async getPartialPaymentTrackerByTransactionId(transactionId: string): Promise<PartialPaymentTracker | null> {
    const tracker = await this.prisma.findPartialPaymentTrackerByTransactionId(transactionId);
    return tracker ? this.mapToPartialPaymentTracker(tracker) : null;
  }

  // Enhanced Refund Management
  async getRefundSummary(originalTransactionId: string): Promise<RefundSummary> {
    const refundTransactions = await this.prisma.findRefundTransactionsByOriginalId(originalTransactionId);
    const originalTransaction = await this.prisma.findTransactionById(originalTransactionId);

    if (!originalTransaction) {
      throw new Error('Original transaction not found');
    }

    const totalRefunded = refundTransactions.reduce((sum: number, tx: any) => sum + tx.amount, 0);
    const remainingRefundable = Math.max(0, originalTransaction.amount - totalRefunded);

    // Calculate refund breakdown by balance type
    const refundBreakdown: RefundSummary['refundBreakdown'] = {
      [BalanceType.CASH]: 0,
      [BalanceType.CREDIT]: 0,
      [BalanceType.REWARDS]: 0
    };

    refundTransactions.forEach((tx: any) => {
      refundBreakdown[tx.balanceType as BalanceType] += tx.amount;
    });

    return {
      originalTransactionId,
      originalAmount: originalTransaction.amount,
      totalRefunded,
      remainingRefundable,
      refundTransactions: refundTransactions.map((tx: any) => this.mapToTransaction(tx)),
      refundBreakdown
    };
  }

  async validateRefundRequest(
    originalTransactionId: string, 
    refundAmount: number
  ): Promise<{
    isValid: boolean;
    reason?: string;
    maxRefundable?: number;
  }> {
    const originalTransaction = await this.prisma.findTransactionById(originalTransactionId);
    
    if (!originalTransaction) {
      return { isValid: false, reason: 'Original transaction not found' };
    }

    if (originalTransaction.type !== TransactionType.PAYMENT) {
      return { isValid: false, reason: 'Can only refund payment transactions' };
    }

    if (originalTransaction.status !== TransactionStatus.COMPLETED) {
      return { isValid: false, reason: 'Can only refund completed transactions' };
    }

    const refundSummary = await this.getRefundSummary(originalTransactionId);
    
    if (refundAmount > refundSummary.remainingRefundable) {
      return { 
        isValid: false, 
        reason: 'Refund amount exceeds remaining refundable amount',
        maxRefundable: refundSummary.remainingRefundable 
      };
    }

    return { isValid: true };
  }

  // Balance calculations for partial payments
  async getAvailableBalancesByType(walletId: string): Promise<{
    [BalanceType.CASH]: number;
    [BalanceType.CREDIT]: number;
    [BalanceType.REWARDS]: number;
  }> {
    const wallet = await this.prisma.findWalletById(walletId);
    
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    return {
      [BalanceType.CASH]: wallet.cashBalance || 0,
      [BalanceType.CREDIT]: wallet.creditBalance || 0,
      [BalanceType.REWARDS]: wallet.rewardsBalance || 0
    };
  }

  async calculateOptimalPaymentSplit(
    walletId: string, 
    requestedAmount: number, 
    preferredBalanceType?: BalanceType
  ): Promise<{
    canPayFull: boolean;
    maxPayable: number;
    suggestedSplit: {
      [BalanceType.CASH]: number;
      [BalanceType.CREDIT]: number;
      [BalanceType.REWARDS]: number;
    };
  }> {
    const balances = await this.getAvailableBalancesByType(walletId);
    const totalAvailable = Object.values(balances).reduce((sum, amount) => sum + amount, 0);

    if (totalAvailable >= requestedAmount) {
      // Can pay full amount
      const split = {
        [BalanceType.CASH]: 0,
        [BalanceType.CREDIT]: 0,
        [BalanceType.REWARDS]: 0
      };

      // Priority: preferred type first, then credit, then cash, then rewards
      const priority = preferredBalanceType 
        ? [preferredBalanceType, BalanceType.CREDIT, BalanceType.CASH, BalanceType.REWARDS]
        : [BalanceType.CREDIT, BalanceType.CASH, BalanceType.REWARDS];

      let remaining = requestedAmount;
      
      for (const balanceType of priority) {
        const available = balances[balanceType];
        const use = Math.min(remaining, available);
        split[balanceType] = use;
        remaining -= use;
        
        if (remaining <= 0) break;
      }

      return {
        canPayFull: true,
        maxPayable: requestedAmount,
        suggestedSplit: split
      };
    } else {
      // Can only pay partial amount
      const split = {
        [BalanceType.CASH]: balances[BalanceType.CASH],
        [BalanceType.CREDIT]: balances[BalanceType.CREDIT],
        [BalanceType.REWARDS]: balances[BalanceType.REWARDS]
      };

      return {
        canPayFull: false,
        maxPayable: totalAvailable,
        suggestedSplit: split
      };
    }
  }

  // Helper methods for new types
  private mapToPartialPaymentTracker(dbTracker: any): PartialPaymentTracker {
    return {
      id: dbTracker.id,
      originalTransactionId: dbTracker.originalTransactionId,
      originalAmount: dbTracker.originalAmount,
      paidAmount: dbTracker.paidAmount,
      remainingAmount: dbTracker.remainingAmount,
      status: dbTracker.status,
      paymentAttempts: dbTracker.paymentAttempts?.map((attempt: any) => 
        this.mapToPartialPaymentAttempt(attempt)
      ) || [],
      expiresAt: dbTracker.expiresAt,
      createdAt: dbTracker.createdAt,
      updatedAt: dbTracker.updatedAt
    };
  }

  private mapToPartialPaymentAttempt(dbAttempt: any): PartialPaymentAttempt {
    return {
      id: dbAttempt.id,
      transactionId: dbAttempt.transactionId,
      amount: dbAttempt.amount,
      balanceType: dbAttempt.balanceType,
      status: dbAttempt.status,
      createdAt: dbAttempt.createdAt,
      failureReason: dbAttempt.failureReason
    };
  }
} 