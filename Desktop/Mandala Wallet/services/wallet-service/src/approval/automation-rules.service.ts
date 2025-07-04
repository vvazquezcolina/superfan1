import { Injectable, Logger } from '@nestjs/common';
import { 
  ApprovalRequest, 
  ApprovalWorkflow, 
  UserRole
} from '@mandala/shared-types';
import { DatabaseService } from '../database/database.service';
import { NotificationService } from '../notification/notification.service';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  priority: number;
  enabled: boolean;
  conditions: {
    amountRange?: { min: number; max: number };
    userTiers?: string[];
    venueTypes?: string[];
    timeRestrictions?: {
      allowedHours: number[];
      allowedDays: number[];
    };
  };
  actions: {
    autoApprove?: boolean;
    autoReject?: boolean;
    escalateToLevel?: number;
    escalateToRole?: UserRole;
    notifyUsers?: string[];
    addTags?: string[];
  };
}

interface EscalationTrigger {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  triggerConditions: {
    timeoutMinutes?: number;
    rejectionCount?: number;
  };
  escalationActions: {
    notifyUsers: string[];
    escalateToRole: UserRole;
    newDeadline: number;
  };
}

@Injectable()
export class AutomationRulesService {
  private readonly logger = new Logger(AutomationRulesService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly notificationService: NotificationService
  ) {
    this.startAutomatedProcessing();
  }

  /**
   * Process a request through automated approval rules
   */
  async processAutomatedApproval(request: ApprovalRequest): Promise<{
    action: 'approve' | 'reject' | 'escalate' | 'continue';
    reason: string;
    ruleId?: string;
  }> {
    try {
      const automationRules = await this.getActiveAutomationRules();
      
      // Sort by priority (lower number = higher priority)
      const sortedRules = automationRules.sort((a, b) => a.priority - b.priority);
      
      for (const rule of sortedRules) {
        const matches = await this.evaluateRule(rule, request);
        
        if (matches) {
          this.logger.log(`Automation rule matched: ${rule.name} for request ${request.id}`);
          
          const result = await this.executeRuleActions(rule, request);
          
          await this.logAutomatedAction(request.id, rule, result);
          
          return { ...result, ruleId: rule.id };
        }
      }
      
      return {
        action: 'continue',
        reason: 'No automation rules matched - proceeding with manual approval'
      };
    } catch (error) {
      this.logger.error('Error processing automated approval:', error);
      return {
        action: 'continue',
        reason: 'Error in automation - fallback to manual approval'
      };
    }
  }

  /**
   * Process escalation triggers for overdue requests
   */
  async processEscalationTriggers(): Promise<void> {
    try {
      const overdueRequests = await this.getOverdueRequests();
      const escalationTriggers = await this.getActiveEscalationTriggers();
      
      for (const request of overdueRequests) {
        for (const trigger of escalationTriggers) {
          const shouldEscalate = await this.shouldTriggerEscalation(trigger, request);
          
          if (shouldEscalate) {
            await this.executeEscalation(trigger, request);
            break; // Only apply first matching trigger
          }
        }
      }
    } catch (error) {
      this.logger.error('Error processing escalation triggers:', error);
    }
  }

  /**
   * Get automation performance metrics
   */
  async getAutomationMetrics(): Promise<{
    totalRules: number;
    activeRules: number;
    automationRate: number;
    errorRate: number;
    recentActions: Array<{
      id: string;
      action: string;
      ruleId: string;
      ruleName: string;
      timestamp: Date;
      success: boolean;
    }>;
  }> {
    try {
      const rules = await this.getActiveAutomationRules();
      const totalRules = rules.length;
      const activeRules = rules.filter(r => r.enabled).length;

      // Get recent automation actions
      const recentActions = await this.getRecentAutomationActions();

      // Calculate automation rate (percentage of requests automated)
      const totalRequests = await this.getTotalRecentRequests();
      const automatedRequests = recentActions.length;
      const automationRate = totalRequests > 0 ? automatedRequests / totalRequests : 0;

      // Calculate error rate
      const errorCount = recentActions.filter(a => !a.success).length;
      const errorRate = automatedRequests > 0 ? errorCount / automatedRequests : 0;

      return {
        totalRules,
        activeRules,
        automationRate,
        errorRate,
        recentActions
      };
    } catch (error) {
      this.logger.error('Error getting automation metrics:', error);
      return {
        totalRules: 0,
        activeRules: 0,
        automationRate: 0,
        errorRate: 0,
        recentActions: []
      };
    }
  }

  // Private helper methods

  private async getActiveAutomationRules(): Promise<AutomationRule[]> {
    return [
      {
        id: 'rule-vip-auto',
        name: 'VIP Auto-Approval',
        description: 'Automatically approve small transactions for VIP users',
        priority: 1,
        enabled: true,
        conditions: {
          amountRange: { min: 0, max: 15000 },
          userTiers: ['gold', 'black']
        },
        actions: {
          autoApprove: true,
          addTags: ['auto-approved', 'vip']
        }
      },
      {
        id: 'rule-small-auto',
        name: 'Small Transaction Auto-Approval',
        description: 'Automatically approve small transactions under $1000',
        priority: 2,
        enabled: true,
        conditions: {
          amountRange: { min: 0, max: 1000 }
        },
        actions: {
          autoApprove: true,
          addTags: ['auto-approved', 'small-amount']
        }
      },
      {
        id: 'rule-after-hours',
        name: 'After Hours Escalation',
        description: 'Escalate transactions outside business hours',
        priority: 3,
        enabled: true,
        conditions: {
          timeRestrictions: {
            allowedHours: [9, 10, 11, 12, 13, 14, 15, 16, 17],
            allowedDays: [1, 2, 3, 4, 5]
          }
        },
        actions: {
          escalateToRole: UserRole.ADMIN,
          notifyUsers: ['admin@mandala.mx']
        }
      }
    ];
  }

  private async getActiveEscalationTriggers(): Promise<EscalationTrigger[]> {
    return [
      {
        id: 'trigger-timeout',
        name: 'Timeout Escalation',
        description: 'Escalate requests that exceed deadline',
        enabled: true,
        triggerConditions: {
          timeoutMinutes: 120
        },
        escalationActions: {
          notifyUsers: ['admin@mandala.mx'],
          escalateToRole: UserRole.ADMIN,
          newDeadline: 4
        }
      },
      {
        id: 'trigger-multiple-rejections',
        name: 'Multiple Rejection Escalation',
        description: 'Escalate after multiple rejections',
        enabled: true,
        triggerConditions: {
          rejectionCount: 2
        },
        escalationActions: {
          notifyUsers: ['admin@mandala.mx'],
          escalateToRole: UserRole.ADMIN,
          newDeadline: 2
        }
      }
    ];
  }

  private async evaluateRule(rule: AutomationRule, request: ApprovalRequest): Promise<boolean> {
    // Check amount range
    if (rule.conditions.amountRange) {
      const { min, max } = rule.conditions.amountRange;
      if (request.amount < min || request.amount > max) {
        return false;
      }
    }

    // Check user tier
    if (rule.conditions.userTiers) {
      const userTier = await this.getUserTier(request.requesterId);
      if (!rule.conditions.userTiers.includes(userTier)) {
        return false;
      }
    }

    // Check venue type
    if (rule.conditions.venueTypes && request.venueId) {
      const venueType = await this.getVenueType(request.venueId);
      if (!rule.conditions.venueTypes.includes(venueType)) {
        return false;
      }
    }

    // Check time restrictions
    if (rule.conditions.timeRestrictions) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentDay = now.getDay();

      const { allowedHours, allowedDays } = rule.conditions.timeRestrictions;
      
      // If outside allowed hours/days, rule doesn't match
      if (allowedHours && !allowedHours.includes(currentHour)) {
        return false;
      }
      
      if (allowedDays && !allowedDays.includes(currentDay)) {
        return false;
      }
    }

    return true;
  }

  private async executeRuleActions(rule: AutomationRule, request: ApprovalRequest): Promise<{
    action: 'approve' | 'reject' | 'escalate';
    reason: string;
  }> {
    if (rule.actions.autoApprove) {
      await this.autoApproveRequest(request, rule);
      return {
        action: 'approve',
        reason: `Auto-approved by rule: ${rule.name}`
      };
    }

    if (rule.actions.autoReject) {
      await this.autoRejectRequest(request, rule);
      return {
        action: 'reject',
        reason: `Auto-rejected by rule: ${rule.name}`
      };
    }

    if (rule.actions.escalateToRole) {
      await this.autoEscalateRequest(request, rule);
      return {
        action: 'escalate',
        reason: `Auto-escalated by rule: ${rule.name}`
      };
    }

    throw new Error('No valid action specified in rule');
  }

  private async shouldTriggerEscalation(trigger: EscalationTrigger, request: ApprovalRequest): Promise<boolean> {
    const now = new Date();

    // Check timeout
    if (trigger.triggerConditions.timeoutMinutes) {
      const timeElapsed = (now.getTime() - request.deadline.getTime()) / (1000 * 60);
      if (timeElapsed >= trigger.triggerConditions.timeoutMinutes) {
        return true;
      }
    }

    // Check rejection count
    if (trigger.triggerConditions.rejectionCount) {
      const rejections = request.approvals.filter(a => a.action === 'reject').length;
      if (rejections >= trigger.triggerConditions.rejectionCount) {
        return true;
      }
    }

    return false;
  }

  private async executeEscalation(trigger: EscalationTrigger, request: ApprovalRequest): Promise<void> {
    // Update request status
    request.status = 'escalated';
    request.currentLevel = Math.min(request.currentLevel + 1, request.totalLevels);
    request.deadline = new Date(Date.now() + trigger.escalationActions.newDeadline * 60 * 60 * 1000);

    // Add escalation record
    request.escalations.push({
      id: `esc-${Date.now()}`,
      fromLevel: request.currentLevel - 1,
      toLevel: request.currentLevel,
      triggerReason: trigger.description,
      escalatedBy: 'system',
      escalatedAt: new Date(),
      newDeadline: request.deadline,
      notifiedUsers: trigger.escalationActions.notifyUsers,
      automatedAction: true
    });

    // Send notifications
    await this.notificationService.sendNotification({
      type: 'escalation_triggered',
      title: 'Solicitud Escalada Automáticamente',
      message: `La solicitud ${request.id} ha sido escalada: ${trigger.description}`,
      data: {
        requestId: request.id,
        triggerName: trigger.name,
        newDeadline: request.deadline
      }
    }, trigger.escalationActions.notifyUsers);

    // Update database
    await this.databaseService.updateApprovalRequest(request);

    this.logger.log(`Executed escalation: ${trigger.name} for request ${request.id}`);
  }

  private async autoApproveRequest(request: ApprovalRequest, rule: AutomationRule): Promise<void> {
    // Add automated approval
    request.approvals.push({
      id: `auto-approval-${Date.now()}`,
      level: request.currentLevel,
      approverId: 'system',
      approverName: 'Sistema Automático',
      approverRole: UserRole.ADMIN,
      action: 'approve',
      comment: `Aprobado automáticamente por regla: ${rule.name}`,
      timestamp: new Date()
    });

    request.status = 'approved';

    // Add tags if specified
    if (rule.actions.addTags) {
      request.tags = [...(request.tags || []), ...rule.actions.addTags];
    }

    // Update database
    await this.databaseService.updateApprovalRequest(request);

    // Send notification
    await this.notificationService.sendNotification({
      type: 'approval_automated',
      title: 'Transacción Aprobada Automáticamente',
      message: `Su transacción de ${request.amount} MXN ha sido aprobada automáticamente`,
      data: {
        requestId: request.id,
        amount: request.amount,
        ruleName: rule.name
      }
    }, [request.requesterId]);

    this.logger.log(`Auto-approved request ${request.id} using rule: ${rule.name}`);
  }

  private async autoRejectRequest(request: ApprovalRequest, rule: AutomationRule): Promise<void> {
    request.approvals.push({
      id: `auto-rejection-${Date.now()}`,
      level: request.currentLevel,
      approverId: 'system',
      approverName: 'Sistema Automático',
      approverRole: UserRole.ADMIN,
      action: 'reject',
      comment: `Rechazado automáticamente por regla: ${rule.name}`,
      timestamp: new Date()
    });

    request.status = 'rejected';

    await this.databaseService.updateApprovalRequest(request);

    // Send notification
    await this.notificationService.sendNotification({
      type: 'rejection_automated',
      title: 'Transacción Rechazada Automáticamente',
      message: `Su transacción de ${request.amount} MXN ha sido rechazada automáticamente`,
      data: {
        requestId: request.id,
        amount: request.amount,
        ruleName: rule.name
      }
    }, [request.requesterId]);

    this.logger.log(`Auto-rejected request ${request.id} using rule: ${rule.name}`);
  }

  private async autoEscalateRequest(request: ApprovalRequest, rule: AutomationRule): Promise<void> {
    const newDeadline = new Date(Date.now() + 4 * 60 * 60 * 1000); // 4 hours

    request.escalations.push({
      id: `auto-escalation-${Date.now()}`,
      fromLevel: request.currentLevel,
      toLevel: request.currentLevel + 1,
      triggerReason: `Escalado automáticamente por regla: ${rule.name}`,
      escalatedBy: 'system',
      escalatedAt: new Date(),
      newDeadline,
      notifiedUsers: rule.actions.notifyUsers || [],
      automatedAction: true
    });

    request.status = 'escalated';
    request.currentLevel = Math.min(request.currentLevel + 1, request.totalLevels);
    request.deadline = newDeadline;

    await this.databaseService.updateApprovalRequest(request);

    // Send notifications
    if (rule.actions.notifyUsers) {
      await this.notificationService.sendNotification({
        type: 'escalation_automated',
        title: 'Solicitud Escalada Automáticamente',
        message: `La solicitud ${request.id} ha sido escalada automáticamente`,
        data: {
          requestId: request.id,
          amount: request.amount,
          ruleName: rule.name,
          newDeadline
        }
      }, rule.actions.notifyUsers);
    }

    this.logger.log(`Auto-escalated request ${request.id} using rule: ${rule.name}`);
  }

  private async getUserTier(userId: string): Promise<string> {
    const user = await this.databaseService.getUser(userId);
    return user?.tier || 'bronze';
  }

  private async getVenueType(venueId: string): Promise<string> {
    const venue = await this.databaseService.getVenue(venueId);
    return venue?.type || 'unknown';
  }

  private async getOverdueRequests(): Promise<ApprovalRequest[]> {
    return await this.databaseService.getOverdueApprovalRequests();
  }

  private async logAutomatedAction(requestId: string, rule: AutomationRule, result: any): Promise<void> {
    await this.databaseService.createAuditRecord({
      id: `audit-auto-${Date.now()}`,
      action: `Automated ${result.action}`,
      performedBy: 'system',
      performedAt: new Date(),
      details: {
        requestId,
        ruleId: rule.id,
        ruleName: rule.name,
        action: result.action,
        reason: result.reason
      },
      changeType: result.action
    });
  }

  private async getRecentAutomationActions(): Promise<Array<{
    id: string;
    action: string;
    ruleId: string;
    ruleName: string;
    timestamp: Date;
    success: boolean;
  }>> {
    // Mock data - in real implementation, would query from database
    return [
      {
        id: 'action-1',
        action: 'Auto-Approved',
        ruleId: 'rule-vip-auto',
        ruleName: 'VIP Auto-Approval',
        timestamp: new Date('2024-01-20T15:30:00Z'),
        success: true
      },
      {
        id: 'action-2',
        action: 'Escalated',
        ruleId: 'rule-after-hours',
        ruleName: 'After Hours Escalation',
        timestamp: new Date('2024-01-20T20:15:00Z'),
        success: true
      }
    ];
  }

  private async getTotalRecentRequests(): Promise<number> {
    // Mock data - in real implementation, would query from database
    return 50;
  }

  private startAutomatedProcessing(): void {
    // Process escalation triggers every 5 minutes
    setInterval(async () => {
      try {
        await this.processEscalationTriggers();
      } catch (error) {
        this.logger.error('Error in automated escalation processing:', error);
      }
    }, 5 * 60 * 1000);

    this.logger.log('Automated approval processing started');
  }
} 