import { UserRole } from './user.types';

export interface ApprovalLevel {
  id: string;
  level: number;
  name: string;
  description: string;
  requiredRole: UserRole;
  requiredApprovers: number;
  minimumApprovers: number;
  timeoutHours: number;
  autoApprove?: boolean;
  conditions?: ApprovalCondition[];
  delegationRules?: DelegationRule[];
  backupApprovers?: BackupApprover[];
  escalationRules?: EscalationRule[];
}

export interface ApprovalCondition {
  id: string;
  type: 'amount_range' | 'time_range' | 'venue_type' | 'user_role' | 'payment_method' | 'custom';
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'between' | 'in' | 'not_in';
  value: any;
  secondaryValue?: any; // For 'between' operator
}

export interface DelegationRule {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromRole: UserRole;
  toUserId: string;
  toUserName: string;
  toRole: UserRole;
  startDate: Date;
  endDate: Date;
  maxAmount?: number;
  allowedTransactionTypes?: string[];
  active: boolean;
  reason?: string;
  createdAt: Date;
  createdBy: string;
}

export interface BackupApprover {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  priority: number;
  conditions?: string[];
  active: boolean;
}

export interface EscalationRule {
  id: string;
  triggerCondition: 'timeout' | 'rejection' | 'insufficient_approvers' | 'custom';
  action: 'escalate' | 'auto_approve' | 'auto_reject' | 'request_additional' | 'notify_admin';
  targetLevel?: number;
  targetRole?: UserRole;
  targetUsers?: string[];
  delayMinutes?: number;
  maxEscalations?: number;
  notificationTemplate?: string;
}

export interface ApprovalWorkflow {
  id: string;
  name: string;
  description: string;
  version: string;
  active: boolean;
  priority: number;
  conditions: ApprovalCondition[];
  levels: ApprovalLevel[];
  globalTimeoutHours: number;
  allowParallelApprovals: boolean;
  requireSequentialApprovals: boolean;
  allowSelfApproval: boolean;
  allowDelegation: boolean;
  auditSettings: AuditSettings;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
}

export interface AuditSettings {
  logAllActions: boolean;
  requireComments: boolean;
  recordDecisionTime: boolean;
  notifyOnChanges: boolean;
  retentionDays: number;
}

export interface ApprovalRequest {
  id: string;
  workflowId: string;
  transactionId: string;
  type: 'payment' | 'transfer' | 'refund' | 'withdrawal';
  amount: number;
  currency: string;
  description: string;
  metadata: Record<string, any>;
  requesterId: string;
  requesterName: string;
  requesterRole: UserRole;
  venueId?: string;
  venueName?: string;
  currentLevel: number;
  totalLevels: number;
  status: ApprovalStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  submittedAt: Date;
  deadline: Date;
  globalDeadline: Date;
  approvals: ApprovalAction[];
  escalations: EscalationAction[];
  notifications: NotificationRecord[];
  delegations: DelegationRecord[];
  auditTrail: AuditRecord[];
  tags?: string[];
}

export type ApprovalStatus = 
  | 'pending'
  | 'in_progress'
  | 'approved'
  | 'rejected'
  | 'expired'
  | 'escalated'
  | 'cancelled'
  | 'delegated'
  | 'on_hold';

export interface ApprovalAction {
  id: string;
  level: number;
  approverId: string;
  approverName: string;
  approverRole: UserRole;
  action: 'approve' | 'reject' | 'request_info' | 'delegate' | 'escalate';
  comment?: string;
  attachments?: string[];
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  delegatedFrom?: string;
  escalatedFrom?: number;
  conditions?: string[];
}

export interface EscalationAction {
  id: string;
  fromLevel: number;
  toLevel: number;
  triggerReason: string;
  escalatedBy: string;
  escalatedAt: Date;
  newDeadline: Date;
  notifiedUsers: string[];
  automatedAction: boolean;
}

export interface NotificationRecord {
  id: string;
  type: 'new_request' | 'reminder' | 'timeout_warning' | 'escalation' | 'completion';
  recipientId: string;
  recipientRole: UserRole;
  channel: 'email' | 'sms' | 'push' | 'in_app';
  templateId: string;
  sentAt: Date;
  delivered: boolean;
  read: boolean;
  readAt?: Date;
}

export interface DelegationRecord {
  id: string;
  originalApproverId: string;
  delegateApproverId: string;
  level: number;
  startTime: Date;
  endTime?: Date;
  reason: string;
  status: 'active' | 'completed' | 'revoked';
  createdBy: string;
}

export interface AuditRecord {
  id: string;
  action: string;
  performedBy: string;
  performedAt: Date;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  previousValue?: any;
  newValue?: any;
  changeType: 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'escalate' | 'delegate';
}

export interface ApprovalMetrics {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  expiredRequests: number;
  escalatedRequests: number;
  averageApprovalTime: number;
  averageTimePerLevel: Record<number, number>;
  approvalsByRole: Record<UserRole, number>;
  approvalsByUser: Record<string, number>;
  timeoutRate: number;
  escalationRate: number;
  delegationRate: number;
  mostCommonRejectionReasons: Array<{
    reason: string;
    count: number;
    percentage: number;
  }>;
  peakHours: Array<{
    hour: number;
    count: number;
  }>;
  workflowPerformance: Array<{
    workflowId: string;
    workflowName: string;
    averageTime: number;
    successRate: number;
    timeoutRate: number;
  }>;
}

export interface ApprovalDashboardData {
  summary: {
    pending: number;
    urgent: number;
    escalated: number;
    myQueue: number;
    overdueCount: number;
  };
  recentActions: ApprovalAction[];
  pendingByPriority: Record<string, number>;
  pendingByWorkflow: Record<string, number>;
  pendingByUser: Record<string, number>;
  timeToDeadline: Array<{
    requestId: string;
    hoursRemaining: number;
    priority: string;
  }>;
  delegationStatus: {
    activeDelegations: number;
    receivedDelegations: number;
    expiringSoon: DelegationRule[];
  };
  performanceMetrics: {
    averageResponseTime: number;
    approvalRate: number;
    onTimeRate: number;
    delegationRate: number;
  };
}

export interface ApprovalConfiguration {
  globalSettings: {
    defaultTimeoutHours: number;
    maxEscalationLevels: number;
    allowWeekendApprovals: boolean;
    businessHours: {
      start: string;
      end: string;
      timezone: string;
    };
    holidays: string[];
    autoReminderHours: number[];
    maxDelegationDays: number;
  };
  notificationSettings: {
    immediateNotification: boolean;
    reminderIntervals: number[];
    escalationNotification: boolean;
    completionNotification: boolean;
    channels: ('email' | 'sms' | 'push' | 'in_app')[];
  };
  securitySettings: {
    requireTwoFactorForHighValue: boolean;
    highValueThreshold: number;
    auditAllActions: boolean;
    sessionTimeoutMinutes: number;
    allowMobileApprovals: boolean;
    geoLocationTracking: boolean;
  };
  integrationSettings: {
    webhookUrl?: string;
    apiKeys: Record<string, string>;
    externalValidation: boolean;
    syncWithHR: boolean;
    complianceReporting: boolean;
  };
}

export interface BulkApprovalRequest {
  requestIds: string[];
  action: 'approve' | 'reject' | 'delegate' | 'escalate';
  comment?: string;
  delegateToUserId?: string;
  escalateToLevel?: number;
  conditions?: string[];
}

export interface BulkApprovalResponse {
  totalRequests: number;
  successful: number;
  failed: number;
  errors: Array<{
    requestId: string;
    error: string;
    reason: string;
  }>;
  summary: {
    approved: number;
    rejected: number;
    delegated: number;
    escalated: number;
  };
} 