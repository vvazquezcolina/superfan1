import { Injectable, Logger } from '@nestjs/common';
import { 
  ApprovalRequest, 
  ApprovalAction, 
  ApprovalWorkflow, 
  ApprovalLevel,
  DelegationRule,
  EscalationRule,
  ApprovalStatus,
  UserRole,
  BulkApprovalRequest,
  BulkApprovalResponse
} from '@mandala/shared-types';
import { DatabaseService } from '../database/database.service';
import { NotificationService } from '../notification/notification.service';

interface ApprovalContext {
  requestId: string;
  currentUserId: string;
  userRole: UserRole;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

interface WorkflowEvaluation {
  isValid: boolean;
  matchedWorkflow?: ApprovalWorkflow;
  requiredLevels: number;
  estimatedTime: number;
  risks: string[];
  recommendations: string[];
}

@Injectable()
export class MultiLevelApprovalService {
  private readonly logger = new Logger(MultiLevelApprovalService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly notificationService: NotificationService
  ) {}

  /**
   * Evaluate which approval workflow applies to a transaction
   */
  async evaluateWorkflow(
    transactionData: any,
    requesterRole: UserRole
  ): Promise<WorkflowEvaluation> {
    try {
      const workflows = await this.databaseService.getActiveApprovalWorkflows();
      
      // Sort by priority (higher priority first)
      const sortedWorkflows = workflows.sort((a, b) => b.priority - a.priority);
      
      for (const workflow of sortedWorkflows) {
        const matches = await this.evaluateWorkflowConditions(workflow, transactionData, requesterRole);
        
        if (matches) {
          const evaluation = await this.assessWorkflowComplexity(workflow, transactionData);
          return {
            isValid: true,
            matchedWorkflow: workflow,
            requiredLevels: workflow.levels.length,
            estimatedTime: evaluation.estimatedTime,
            risks: evaluation.risks,
            recommendations: evaluation.recommendations
          };
        }
      }

      return {
        isValid: false,
        requiredLevels: 0,
        estimatedTime: 0,
        risks: ['No matching approval workflow found'],
        recommendations: ['Contact administrator to configure appropriate workflow']
      };
    } catch (error) {
      this.logger.error('Error evaluating approval workflow:', error);
      throw error;
    }
  }

  /**
   * Create a new approval request with multi-level processing
   */
  async createApprovalRequest(
    transactionData: any,
    requesterId: string,
    requesterRole: UserRole
  ): Promise<ApprovalRequest> {
    try {
      const evaluation = await this.evaluateWorkflow(transactionData, requesterRole);
      
      if (!evaluation.isValid || !evaluation.matchedWorkflow) {
        throw new Error('No valid approval workflow found for this transaction');
      }

      const workflow = evaluation.matchedWorkflow;
      const requestId = `APR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const approvalRequest: ApprovalRequest = {
        id: requestId,
        workflowId: workflow.id,
        transactionId: transactionData.transactionId || `TXN-${Date.now()}`,
        type: transactionData.type,
        amount: transactionData.amount,
        currency: transactionData.currency || 'MXN',
        description: transactionData.description,
        metadata: transactionData.metadata || {},
        requesterId,
        requesterName: transactionData.requesterName,
        requesterRole,
        venueId: transactionData.venueId,
        venueName: transactionData.venueName,
        currentLevel: 1,
        totalLevels: workflow.levels.length,
        status: 'pending',
        priority: this.calculatePriority(transactionData, workflow),
        submittedAt: new Date(),
        deadline: this.calculateLevelDeadline(workflow.levels[0]),
        globalDeadline: this.calculateGlobalDeadline(workflow),
        approvals: [],
        escalations: [],
        notifications: [],
        delegations: [],
        auditTrail: [{
          id: `audit-${Date.now()}`,
          action: 'Request Created',
          performedBy: requesterId,
          performedAt: new Date(),
          details: { workflowId: workflow.id, priority: this.calculatePriority(transactionData, workflow) },
          changeType: 'create'
        }],
        tags: this.generateTags(transactionData, workflow)
      };

      // Save to database
      await this.databaseService.createApprovalRequest(approvalRequest);
      
      // Send initial notifications
      await this.sendLevelNotifications(approvalRequest, 1);
      
      // Log creation
      this.logger.log(`Created approval request ${requestId} for transaction ${transactionData.transactionId}`);
      
      return approvalRequest;
    } catch (error) {
      this.logger.error('Error creating approval request:', error);
      throw error;
    }
  }

  /**
   * Process an approval action with role-based authorization
   */
  async processApprovalAction(
    requestId: string,
    action: 'approve' | 'reject' | 'request_info' | 'delegate' | 'escalate',
    context: ApprovalContext,
    comment?: string,
    delegateToUserId?: string,
    escalateToLevel?: number
  ): Promise<ApprovalRequest> {
    try {
      const request = await this.databaseService.getApprovalRequest(requestId);
      if (!request) {
        throw new Error('Approval request not found');
      }

      // Validate authorization
      const authResult = await this.validateApprovalAuthorization(request, context);
      if (!authResult.authorized) {
        throw new Error(`Unauthorized: ${authResult.reason}`);
      }

      const currentLevel = request.levels?.find(l => l.level === request.currentLevel);
      if (!currentLevel) {
        throw new Error('Invalid approval level');
      }

      // Process the action
      const approvalAction: ApprovalAction = {
        id: `action-${Date.now()}`,
        level: request.currentLevel,
        approverId: context.currentUserId,
        approverName: authResult.approverName || 'Unknown',
        approverRole: context.userRole,
        action,
        comment,
        timestamp: context.timestamp,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        delegatedFrom: authResult.delegatedFrom,
        escalatedFrom: authResult.escalatedFrom
      };

      request.approvals.push(approvalAction);

      // Handle specific actions
      switch (action) {
        case 'approve':
          await this.handleApprovalAction(request, approvalAction, currentLevel);
          break;
        case 'reject':
          await this.handleRejectionAction(request, approvalAction);
          break;
        case 'delegate':
          if (!delegateToUserId) throw new Error('Delegate user ID required');
          await this.handleDelegationAction(request, approvalAction, delegateToUserId);
          break;
        case 'escalate':
          await this.handleEscalationAction(request, approvalAction, escalateToLevel);
          break;
        case 'request_info':
          await this.handleInfoRequestAction(request, approvalAction);
          break;
      }

      // Add audit trail
      request.auditTrail.push({
        id: `audit-${Date.now()}`,
        action: `${action.charAt(0).toUpperCase() + action.slice(1)} Action`,
        performedBy: context.currentUserId,
        performedAt: context.timestamp,
        details: { 
          level: request.currentLevel, 
          comment, 
          delegatedTo: delegateToUserId,
          escalatedTo: escalateToLevel 
        },
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        changeType: action
      });

      // Update database
      await this.databaseService.updateApprovalRequest(request);
      
      // Send notifications
      await this.sendActionNotifications(request, approvalAction);
      
      this.logger.log(`Processed ${action} action for request ${requestId} by user ${context.currentUserId}`);
      
      return request;
    } catch (error) {
      this.logger.error('Error processing approval action:', error);
      throw error;
    }
  }

  /**
   * Handle delegation of approval authority
   */
  async delegateApproval(
    fromUserId: string,
    toUserId: string,
    delegationRule: Partial<DelegationRule>
  ): Promise<DelegationRule> {
    try {
      const fromUser = await this.databaseService.getUser(fromUserId);
      const toUser = await this.databaseService.getUser(toUserId);
      
      if (!fromUser || !toUser) {
        throw new Error('Invalid user IDs for delegation');
      }

      // Validate delegation permissions
      await this.validateDelegationPermissions(fromUser.role, toUser.role, delegationRule);

      const delegation: DelegationRule = {
        id: `del-${Date.now()}`,
        fromUserId,
        fromUserName: fromUser.displayName,
        fromRole: fromUser.role,
        toUserId,
        toUserName: toUser.displayName,
        toRole: toUser.role,
        startDate: delegationRule.startDate || new Date(),
        endDate: delegationRule.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days default
        maxAmount: delegationRule.maxAmount,
        allowedTransactionTypes: delegationRule.allowedTransactionTypes,
        active: true,
        reason: delegationRule.reason || 'Temporary delegation',
        createdAt: new Date(),
        createdBy: fromUserId
      };

      await this.databaseService.createDelegationRule(delegation);
      
      // Notify both parties
      await this.notificationService.sendDelegationNotification(delegation);
      
      this.logger.log(`Created delegation from ${fromUserId} to ${toUserId}`);
      
      return delegation;
    } catch (error) {
      this.logger.error('Error creating delegation:', error);
      throw error;
    }
  }

  /**
   * Process bulk approval actions
   */
  async processBulkApprovals(
    bulkRequest: BulkApprovalRequest,
    context: ApprovalContext
  ): Promise<BulkApprovalResponse> {
    const response: BulkApprovalResponse = {
      totalRequests: bulkRequest.requestIds.length,
      successful: 0,
      failed: 0,
      errors: [],
      summary: {
        approved: 0,
        rejected: 0,
        delegated: 0,
        escalated: 0
      }
    };

    for (const requestId of bulkRequest.requestIds) {
      try {
        await this.processApprovalAction(
          requestId,
          bulkRequest.action,
          context,
          bulkRequest.comment,
          bulkRequest.delegateToUserId,
          bulkRequest.escalateToLevel
        );
        
        response.successful++;
        response.summary[bulkRequest.action === 'approve' ? 'approved' : 
                        bulkRequest.action === 'reject' ? 'rejected' :
                        bulkRequest.action === 'delegate' ? 'delegated' : 'escalated']++;
        
      } catch (error) {
        response.failed++;
        response.errors.push({
          requestId,
          error: error.message,
          reason: error.stack?.split('\n')[0] || 'Unknown error'
        });
      }
    }

    this.logger.log(`Processed bulk approval: ${response.successful}/${response.totalRequests} successful`);
    
    return response;
  }

  /**
   * Get approval requests for a specific user based on their role and delegations
   */
  async getUserApprovalQueue(
    userId: string,
    userRole: UserRole,
    filters?: {
      status?: ApprovalStatus[];
      priority?: string[];
      workflowId?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<ApprovalRequest[]> {
    try {
      // Get direct assignments
      const directRequests = await this.databaseService.getApprovalRequestsByRole(userRole, filters);
      
      // Get delegated requests
      const delegatedRequests = await this.databaseService.getDelegatedApprovalRequests(userId, filters);
      
      // Combine and deduplicate
      const allRequests = [...directRequests, ...delegatedRequests];
      const uniqueRequests = allRequests.reduce((acc, current) => {
        const exists = acc.find(item => item.id === current.id);
        if (!exists) {
          acc.push(current);
        }
        return acc;
      }, [] as ApprovalRequest[]);

      // Sort by priority and deadline
      return uniqueRequests.sort((a, b) => {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        
        return a.deadline.getTime() - b.deadline.getTime();
      });
    } catch (error) {
      this.logger.error('Error getting user approval queue:', error);
      throw error;
    }
  }

  // Private helper methods

  private async evaluateWorkflowConditions(
    workflow: ApprovalWorkflow,
    transactionData: any,
    requesterRole: UserRole
  ): Promise<boolean> {
    for (const condition of workflow.conditions) {
      const result = await this.evaluateCondition(condition, transactionData, requesterRole);
      if (!result) return false;
    }
    return true;
  }

  private async evaluateCondition(condition: any, transactionData: any, requesterRole: UserRole): Promise<boolean> {
    const { type, operator, value, secondaryValue } = condition;
    let fieldValue: any;

    switch (type) {
      case 'amount_range':
        fieldValue = transactionData.amount;
        break;
      case 'user_role':
        fieldValue = requesterRole;
        break;
      case 'venue_type':
        fieldValue = transactionData.venueType;
        break;
      case 'payment_method':
        fieldValue = transactionData.paymentMethod;
        break;
      case 'time_range':
        fieldValue = new Date().getHours();
        break;
      default:
        fieldValue = transactionData[type];
    }

    return this.evaluateOperator(operator, fieldValue, value, secondaryValue);
  }

  private evaluateOperator(operator: string, fieldValue: any, value: any, secondaryValue?: any): boolean {
    switch (operator) {
      case 'equals':
        return fieldValue === value;
      case 'not_equals':
        return fieldValue !== value;
      case 'greater_than':
        return fieldValue > value;
      case 'less_than':
        return fieldValue < value;
      case 'between':
        return fieldValue >= value && fieldValue <= secondaryValue;
      case 'in':
        return Array.isArray(value) && value.includes(fieldValue);
      case 'not_in':
        return Array.isArray(value) && !value.includes(fieldValue);
      default:
        return false;
    }
  }

  private async assessWorkflowComplexity(workflow: ApprovalWorkflow, transactionData: any) {
    const risks: string[] = [];
    const recommendations: string[] = [];
    let estimatedTime = 0;

    // Calculate estimated time based on levels
    for (const level of workflow.levels) {
      estimatedTime += level.timeoutHours;
    }

    // Assess risks
    if (transactionData.amount > 50000) {
      risks.push('High-value transaction requires careful review');
    }
    
    if (workflow.levels.length > 2) {
      risks.push('Multi-level approval may cause delays');
    }

    if (!workflow.allowParallelApprovals && workflow.levels.length > 1) {
      risks.push('Sequential approvals will increase processing time');
      recommendations.push('Consider enabling parallel approvals for faster processing');
    }

    return { estimatedTime, risks, recommendations };
  }

  private calculatePriority(transactionData: any, workflow: ApprovalWorkflow): 'low' | 'medium' | 'high' | 'urgent' {
    const amount = transactionData.amount || 0;
    
    if (amount > 75000) return 'urgent';
    if (amount > 25000) return 'high';
    if (amount > 10000) return 'medium';
    return 'low';
  }

  private calculateLevelDeadline(level: ApprovalLevel): Date {
    return new Date(Date.now() + level.timeoutHours * 60 * 60 * 1000);
  }

  private calculateGlobalDeadline(workflow: ApprovalWorkflow): Date {
    return new Date(Date.now() + workflow.globalTimeoutHours * 60 * 60 * 1000);
  }

  private generateTags(transactionData: any, workflow: ApprovalWorkflow): string[] {
    const tags: string[] = [];
    
    tags.push(transactionData.type);
    tags.push(workflow.name.toLowerCase().replace(/\s+/g, '-'));
    
    if (transactionData.amount > 50000) tags.push('high-value');
    if (transactionData.venueId) tags.push(`venue-${transactionData.venueId}`);
    
    return tags;
  }

  private async validateApprovalAuthorization(
    request: ApprovalRequest,
    context: ApprovalContext
  ): Promise<{ authorized: boolean; reason?: string; approverName?: string; delegatedFrom?: string; escalatedFrom?: number }> {
    const currentLevel = request.currentLevel;
    const workflow = await this.databaseService.getApprovalWorkflow(request.workflowId);
    
    if (!workflow) {
      return { authorized: false, reason: 'Workflow not found' };
    }

    const level = workflow.levels.find(l => l.level === currentLevel);
    if (!level) {
      return { authorized: false, reason: 'Invalid approval level' };
    }

    // Check if user already approved at this level
    const existingApproval = request.approvals.find(
      a => a.level === currentLevel && a.approverId === context.currentUserId
    );
    
    if (existingApproval) {
      return { authorized: false, reason: 'User has already acted on this level' };
    }

    // Check direct role authorization
    if (this.hasRequiredRole(context.userRole, level.requiredRole)) {
      const user = await this.databaseService.getUser(context.currentUserId);
      return { 
        authorized: true, 
        approverName: user?.displayName || 'Unknown'
      };
    }

    // Check delegation authorization
    const activeDelegations = await this.databaseService.getActiveDelegationsForUser(context.currentUserId);
    for (const delegation of activeDelegations) {
      if (this.hasRequiredRole(delegation.fromRole, level.requiredRole)) {
        // Validate delegation conditions
        if (this.validateDelegationConditions(delegation, request)) {
          return { 
            authorized: true, 
            approverName: delegation.toUserName,
            delegatedFrom: delegation.fromUserId
          };
        }
      }
    }

    return { authorized: false, reason: 'Insufficient permissions for this approval level' };
  }

  private hasRequiredRole(userRole: UserRole, requiredRole: UserRole): boolean {
    const roleHierarchy = {
      [UserRole.ADMIN]: 4,
      [UserRole.VENUE_MANAGER]: 3,
      [UserRole.RP]: 2,
      [UserRole.CLIENT]: 1
    };

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }

  private validateDelegationConditions(delegation: DelegationRule, request: ApprovalRequest): boolean {
    // Check time validity
    const now = new Date();
    if (now < delegation.startDate || now > delegation.endDate) {
      return false;
    }

    // Check amount limits
    if (delegation.maxAmount && request.amount > delegation.maxAmount) {
      return false;
    }

    // Check transaction types
    if (delegation.allowedTransactionTypes && 
        !delegation.allowedTransactionTypes.includes(request.type)) {
      return false;
    }

    return true;
  }

  private async validateDelegationPermissions(
    fromRole: UserRole,
    toRole: UserRole,
    delegationRule: Partial<DelegationRule>
  ): Promise<void> {
    // Only allow delegation to same or higher roles
    if (!this.hasRequiredRole(toRole, fromRole)) {
      throw new Error('Cannot delegate to a user with lower permissions');
    }

    // Check delegation limits
    if (delegationRule.maxAmount && delegationRule.maxAmount > 100000) {
      if (fromRole !== UserRole.ADMIN) {
        throw new Error('Only admins can delegate high-value approvals');
      }
    }
  }

  private async handleApprovalAction(
    request: ApprovalRequest,
    action: ApprovalAction,
    level: ApprovalLevel
  ): Promise<void> {
    // Count approvals at current level
    const currentLevelApprovals = request.approvals.filter(
      a => a.level === request.currentLevel && a.action === 'approve'
    );

    // Check if we have enough approvals for this level
    if (currentLevelApprovals.length >= level.requiredApprovers) {
      // Move to next level or complete
      if (request.currentLevel < request.totalLevels) {
        request.currentLevel++;
        request.status = 'in_progress';
        request.deadline = this.calculateLevelDeadline(
          request.levels?.find(l => l.level === request.currentLevel) || level
        );
        
        // Send notifications for next level
        await this.sendLevelNotifications(request, request.currentLevel);
      } else {
        // All levels approved - complete the request
        request.status = 'approved';
        await this.completeApprovalRequest(request);
      }
    }
  }

  private async handleRejectionAction(
    request: ApprovalRequest,
    action: ApprovalAction
  ): Promise<void> {
    request.status = 'rejected';
    await this.sendRejectionNotifications(request, action);
  }

  private async handleDelegationAction(
    request: ApprovalRequest,
    action: ApprovalAction,
    delegateToUserId: string
  ): Promise<void> {
    const delegationRecord = {
      id: `delrec-${Date.now()}`,
      originalApproverId: action.approverId,
      delegateApproverId: delegateToUserId,
      level: request.currentLevel,
      startTime: new Date(),
      reason: action.comment || 'Approval delegated',
      status: 'active' as const,
      createdBy: action.approverId
    };

    request.delegations.push(delegationRecord);
    await this.sendDelegationNotifications(request, delegationRecord);
  }

  private async handleEscalationAction(
    request: ApprovalRequest,
    action: ApprovalAction,
    escalateToLevel?: number
  ): Promise<void> {
    const targetLevel = escalateToLevel || request.currentLevel + 1;
    
    if (targetLevel > request.totalLevels) {
      throw new Error('Cannot escalate beyond maximum level');
    }

    const escalation = {
      id: `esc-${Date.now()}`,
      fromLevel: request.currentLevel,
      toLevel: targetLevel,
      triggerReason: action.comment || 'Manual escalation',
      escalatedBy: action.approverId,
      escalatedAt: new Date(),
      newDeadline: this.calculateLevelDeadline(
        request.levels?.find(l => l.level === targetLevel) || { timeoutHours: 24 } as ApprovalLevel
      ),
      notifiedUsers: [],
      automatedAction: false
    };

    request.escalations.push(escalation);
    request.currentLevel = targetLevel;
    request.status = 'escalated';
    request.deadline = escalation.newDeadline;

    await this.sendEscalationNotifications(request, escalation);
  }

  private async handleInfoRequestAction(
    request: ApprovalRequest,
    action: ApprovalAction
  ): Promise<void> {
    request.status = 'on_hold';
    await this.sendInfoRequestNotifications(request, action);
  }

  private async sendLevelNotifications(request: ApprovalRequest, level: number): Promise<void> {
    // Implementation for sending notifications to approvers at the specified level
    this.logger.log(`Sending level ${level} notifications for request ${request.id}`);
  }

  private async sendActionNotifications(request: ApprovalRequest, action: ApprovalAction): Promise<void> {
    // Implementation for sending action-specific notifications
    this.logger.log(`Sending ${action.action} notification for request ${request.id}`);
  }

  private async sendRejectionNotifications(request: ApprovalRequest, action: ApprovalAction): Promise<void> {
    // Implementation for sending rejection notifications
    this.logger.log(`Sending rejection notification for request ${request.id}`);
  }

  private async sendDelegationNotifications(request: ApprovalRequest, delegation: any): Promise<void> {
    // Implementation for sending delegation notifications
    this.logger.log(`Sending delegation notification for request ${request.id}`);
  }

  private async sendEscalationNotifications(request: ApprovalRequest, escalation: any): Promise<void> {
    // Implementation for sending escalation notifications
    this.logger.log(`Sending escalation notification for request ${request.id}`);
  }

  private async sendInfoRequestNotifications(request: ApprovalRequest, action: ApprovalAction): Promise<void> {
    // Implementation for sending info request notifications
    this.logger.log(`Sending info request notification for request ${request.id}`);
  }

  private async completeApprovalRequest(request: ApprovalRequest): Promise<void> {
    // Implementation for completing the approval request
    this.logger.log(`Completing approval request ${request.id}`);
    // Here you would typically:
    // 1. Execute the approved transaction
    // 2. Update transaction status
    // 3. Send completion notifications
    // 4. Update metrics and audit logs
  }
} 