export enum BalanceType {
  CASH = 'cash',        // Paid money - never expires
  CREDIT = 'credit',    // RP monthly allocation - expires monthly
  REWARDS = 'rewards'   // Earned rewards - expires yearly
}

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  PAYMENT = 'payment',
  REFUND = 'refund',
  TRANSFER = 'transfer',
  BONUS = 'bonus',
  ALLOCATION = 'allocation',
  EXPIRY = 'expiry'
}

export enum TransactionStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export enum PaymentMethod {
  STRIPE = 'stripe',
  OXXO_PAY = 'oxxo_pay',
  APPLE_PAY = 'apple_pay',
  SPEI = 'spei',
  QR_CODE = 'qr_code',
  CASH = 'cash'
}

export interface Wallet {
  id: string;
  userId: string;
  balances: {
    [BalanceType.CASH]: number;
    [BalanceType.CREDIT]: number;
    [BalanceType.REWARDS]: number;
  };
  totalBalance: number;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastTransactionAt?: Date;
}

export interface Transaction {
  id: string;
  walletId: string;
  userId: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  balanceType: BalanceType;
  paymentMethod?: PaymentMethod;
  description: string;
  metadata?: Record<string, any>;
  venueId?: string;
  merchantTransactionId?: string;
  externalTransactionId?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  failedAt?: Date;
  failureReason?: string;
}

export interface Balance {
  id: string;
  walletId: string;
  balanceType: BalanceType;
  amount: number;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  isExpired: boolean;
}

export interface PaymentRequest {
  amount: number;
  balanceType?: BalanceType;
  paymentMethod: PaymentMethod;
  description: string;
  venueId?: string;
  qrCode?: string;
  metadata?: Record<string, any>;
  allowPartialPayment?: boolean;
  minimumAmount?: number;
  maxRetries?: number;
}

export interface PaymentResponse {
  transactionId: string;
  status: TransactionStatus;
  amount: number;
  remainingBalance: number;
  paymentUrl?: string;
  qrCodeData?: string;
  expiresAt?: Date;
  isPartialPayment?: boolean;
  requestedAmount?: number;
  remainingAmount?: number;
  partialPaymentId?: string;
  canRetry?: boolean;
  availableBalanceByType?: {
    [BalanceType.CASH]: number;
    [BalanceType.CREDIT]: number;
    [BalanceType.REWARDS]: number;
  };
}

export interface RefundRequest {
  transactionId: string;
  amount?: number;
  reason: string;
  refundToOriginalBalance?: boolean;
  partialRefund?: boolean;
  refundBreakdown?: {
    [BalanceType.CASH]?: number;
    [BalanceType.CREDIT]?: number;
    [BalanceType.REWARDS]?: number;
  };
}

export interface TransferRequest {
  fromWalletId: string;
  toWalletId: string;
  amount: number;
  balanceType: BalanceType;
  description: string;
}

export interface WalletSummary {
  totalBalance: number;
  balanceBreakdown: {
    cash: number;
    credit: number;
    rewards: number;
  };
  expiringCredit?: {
    amount: number;
    expiresAt: Date;
  };
  expiringRewards?: {
    amount: number;
    expiresAt: Date;
  };
  recentTransactions: Transaction[];
}

export interface QRCodeData {
  type: 'payment' | 'receipt';
  venueId: string;
  amount?: number;
  transactionId?: string;
  expiresAt: Date;
  metadata?: Record<string, any>;
}

export interface PartialPaymentTracker {
  id: string;
  originalTransactionId: string;
  originalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: 'active' | 'completed' | 'expired';
  paymentAttempts: PartialPaymentAttempt[];
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PartialPaymentAttempt {
  id: string;
  transactionId: string;
  amount: number;
  balanceType: BalanceType;
  status: TransactionStatus;
  createdAt: Date;
  failureReason?: string;
}

export interface RefundSummary {
  originalTransactionId: string;
  originalAmount: number;
  totalRefunded: number;
  remainingRefundable: number;
  refundTransactions: Transaction[];
  refundBreakdown: {
    [BalanceType.CASH]: number;
    [BalanceType.CREDIT]: number;
    [BalanceType.REWARDS]: number;
  };
}

// Notification types for payment events
export enum NotificationType {
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILED = 'payment_failed',
  PAYMENT_PENDING = 'payment_pending',
  PARTIAL_PAYMENT_CREATED = 'partial_payment_created',
  PARTIAL_PAYMENT_COMPLETED = 'partial_payment_completed',
  REFUND_PROCESSED = 'refund_processed',
  BALANCE_LOW = 'balance_low',
  BALANCE_TOPPED_UP = 'balance_topped_up',
  RP_ALLOCATION_RECEIVED = 'rp_allocation_received',
  BALANCE_EXPIRING = 'balance_expiring',
  TRANSACTION_APPROVED = 'transaction_approved',
  TRANSACTION_REQUIRES_APPROVAL = 'transaction_requires_approval'
}

export enum NotificationChannel {
  PUSH = 'push',
  EMAIL = 'email',
  SMS = 'sms',
  IN_APP = 'in_app'
}

export enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface NotificationTemplate {
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  body: string;
  actionUrl?: string;
  actionLabel?: string;
  variables?: string[]; // Variables that can be replaced in template
}

export interface NotificationRequest {
  userId: string;
  type: NotificationType;
  channels: NotificationChannel[];
  priority: NotificationPriority;
  title: string;
  body: string;
  data?: Record<string, any>;
  actionUrl?: string;
  actionLabel?: string;
  scheduledFor?: Date;
  expiresAt?: Date;
}

export interface NotificationResponse {
  id: string;
  status: 'sent' | 'failed' | 'scheduled' | 'expired';
  channels: {
    [key in NotificationChannel]?: {
      status: 'sent' | 'failed' | 'pending';
      messageId?: string;
      error?: string;
      sentAt?: Date;
    };
  };
  createdAt: Date;
  sentAt?: Date;
  failedAt?: Date;
}

export interface PaymentConfirmation {
  transactionId: string;
  userId: string;
  status: TransactionStatus;
  amount: number;
  balanceType: BalanceType;
  paymentMethod: PaymentMethod;
  venueId?: string;
  confirmationCode: string;
  receiptUrl?: string;
  estimatedArrival?: Date;
  retryable?: boolean;
  supportContact?: {
    phone: string;
    email: string;
    hours: string;
  };
}

// Financial Reconciliation Types
export interface ReconciliationEntry {
  id: string;
  transactionId: string;
  externalTransactionId: string;
  paymentProvider: PaymentMethod;
  internalAmount: number;
  externalAmount: number;
  fees: number;
  netAmount: number;
  status: 'matched' | 'unmatched' | 'disputed' | 'resolved';
  discrepancy?: number;
  reconciliationDate: Date;
  settlementDate?: Date;
  notes?: string;
}

export interface DailyReconciliation {
  date: string; // YYYY-MM-DD
  provider: PaymentMethod;
  transactionCount: number;
  totalAmount: number;
  totalFees: number;
  netAmount: number;
  matchedTransactions: number;
  unmatchedTransactions: number;
  discrepancyAmount: number;
  status: 'pending' | 'in_progress' | 'completed' | 'disputed';
  startTime: Date;
  completedTime?: Date;
  reconcilationEntries: ReconciliationEntry[];
}

export interface SettlementReport {
  id: string;
  provider: PaymentMethod;
  settlementDate: Date;
  periodStart: Date;
  periodEnd: Date;
  totalTransactions: number;
  grossAmount: number;
  totalFees: number;
  netAmount: number;
  previousBalance: number;
  settlementAmount: number;
  finalBalance: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  bankAccount?: string;
  referenceNumber?: string;
  processedBy?: string;
}

// Financial Reporting Types
export enum ReportType {
  TRANSACTION_SUMMARY = 'transaction_summary',
  REVENUE_ANALYSIS = 'revenue_analysis',
  PAYMENT_METHOD_BREAKDOWN = 'payment_method_breakdown',
  REFUND_ANALYSIS = 'refund_analysis',
  BALANCE_UTILIZATION = 'balance_utilization',
  USER_ACTIVITY = 'user_activity',
  VENUE_PERFORMANCE = 'venue_performance',
  RECONCILIATION_STATUS = 'reconciliation_status',
  SETTLEMENT_SUMMARY = 'settlement_summary',
  COMPLIANCE_AUDIT = 'compliance_audit'
}

export enum ReportFormat {
  JSON = 'json',
  CSV = 'csv',
  PDF = 'pdf',
  EXCEL = 'excel'
}

export interface ReportRequest {
  type: ReportType;
  format: ReportFormat;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  filters?: {
    venueId?: string;
    userId?: string;
    paymentMethod?: PaymentMethod;
    balanceType?: BalanceType;
    transactionType?: TransactionType;
    amountRange?: {
      min: number;
      max: number;
    };
  };
  groupBy?: 'day' | 'week' | 'month' | 'venue' | 'user' | 'payment_method';
  includeDetails?: boolean;
  requestedBy: string;
}

export interface FinancialReport {
  id: string;
  type: ReportType;
  title: string;
  generatedAt: Date;
  reportPeriod: {
    startDate: Date;
    endDate: Date;
  };
  summary: ReportSummary;
  data: ReportData[];
  metadata: {
    totalRecords: number;
    filters: Record<string, any>;
    generatedBy: string;
    version: string;
  };
}

export interface ReportSummary {
  totalTransactions: number;
  totalAmount: number;
  totalFees: number;
  netRevenue: number;
  averageTransactionAmount: number;
  successRate: number;
  refundRate: number;
  partialPaymentRate?: number;
  topPaymentMethod: PaymentMethod;
  topVenue?: string;
  growthRate?: number;
}

export interface ReportData {
  period: string;
  transactions: number;
  amount: number;
  fees: number;
  refunds: number;
  netAmount: number;
  breakdown?: Record<string, number>;
  details?: Transaction[];
}

// Audit Trail Types
export interface AuditEntry {
  id: string;
  transactionId?: string;
  userId: string;
  action: AuditAction;
  entityType: 'transaction' | 'wallet' | 'user' | 'venue' | 'reconciliation';
  entityId: string;
  previousState?: Record<string, any>;
  newState?: Record<string, any>;
  changes: AuditChange[];
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  reason?: string;
  approvedBy?: string;
}

export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  APPROVE = 'approve',
  REJECT = 'reject',
  RECONCILE = 'reconcile',
  SETTLE = 'settle',
  REFUND = 'refund',
  TRANSFER = 'transfer',
  LOGIN = 'login',
  LOGOUT = 'logout',
  EXPORT = 'export'
}

export interface AuditChange {
  field: string;
  oldValue: any;
  newValue: any;
  changeType: 'added' | 'modified' | 'removed';
}

// Dashboard Analytics Types
export interface DashboardMetrics {
  realTime: RealTimeMetrics;
  daily: DailyMetrics;
  monthly: MonthlyMetrics;
  trends: TrendAnalysis;
  alerts: SystemAlert[];
  lastUpdated: Date;
}

export interface RealTimeMetrics {
  activeUsers: number;
  transactionsToday: number;
  revenueToday: number;
  averageTransactionAmount: number;
  successRate: number;
  pendingTransactions: number;
  failedTransactions: number;
  systemStatus: 'healthy' | 'warning' | 'critical';
}

export interface DailyMetrics {
  date: string;
  transactions: {
    total: number;
    successful: number;
    failed: number;
    pending: number;
  };
  revenue: {
    gross: number;
    fees: number;
    net: number;
  };
  users: {
    active: number;
    new: number;
    returning: number;
  };
  paymentMethods: Record<PaymentMethod, { count: number; amount: number }>;
  venues: Array<{ venueId: string; transactions: number; revenue: number }>;
}

export interface MonthlyMetrics {
  month: string; // YYYY-MM
  totalRevenue: number;
  totalTransactions: number;
  averageTransactionAmount: number;
  userGrowth: number;
  revenueGrowth: number;
  topVenues: Array<{ venueId: string; revenue: number; transactions: number }>;
  paymentMethodTrends: Record<PaymentMethod, { growth: number; share: number }>;
}

export interface TrendAnalysis {
  revenueGrowth: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  userGrowth: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  transactionVolume: {
    trend: 'increasing' | 'decreasing' | 'stable';
    changePercent: number;
  };
  seasonalPatterns: Array<{
    period: string;
    pattern: 'peak' | 'normal' | 'low';
    confidence: number;
  }>;
}

export interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  resolved?: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
  actionRequired?: boolean;
  actionUrl?: string;
}

// Export/Import Types
export interface ExportRequest {
  type: 'transactions' | 'users' | 'reconciliation' | 'settlements' | 'reports';
  format: ReportFormat;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  filters?: Record<string, any>;
  includePersonalData?: boolean;
  encryptionRequired?: boolean;
  requestedBy: string;
  purpose: string;
}

export interface ExportResult {
  id: string;
  requestId: string;
  fileName: string;
  fileSize: number;
  downloadUrl: string;
  expiresAt: Date;
  generatedAt: Date;
  status: 'generating' | 'ready' | 'expired' | 'error';
  recordCount: number;
  checksum?: string;
} 