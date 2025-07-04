import { Injectable, Logger } from '@nestjs/common';
import { 
  ApprovalRequest, 
  ApprovalWorkflow, 
  UserRole,
  ApprovalStatus
} from '@mandala/shared-types';
import { DatabaseService } from '../database/database.service';
import { NotificationService } from '../notification/notification.service';
import { MultiLevelApprovalService } from './multi-level-approval.service';

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
    userHistory?: {
      minSuccessfulTransactions: number;
      maxRejectedInPeriod: number;
      periodDays: number;
    };
  };
  actions: {
    autoApprove?: boolean;
    autoReject?: boolean;
    escalateToLevel?: number;
    escalateToRole?: UserRole;
    requireAdditionalApproval?: boolean;
    notifyUsers?: string[];
    addTags?: string[];
  };
  businessRules: {
    skipLevels?: number[];
    requireAllApprovers?: boolean;
    allowWeekendProcessing?: boolean;
    requireTwoFactor?: boolean;
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
    escalationLevel?: number;
    userInactivity?: number;
    systemLoad?: number;
  };
  escalationActions: {
    notifyUsers: string[];
    escalateToRole: UserRole;
    newDeadline: number; // hours
    skipToLevel?: number;
    autoApproveAfterDelay?: number; // minutes
    requireManagerOverride?: boolean;
  };
}

@Injectable()
export class AutomatedApprovalService {
  private readonly logger = new Logger(AutomatedApprovalService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly notificationService: NotificationService,
    private readonly multiLevelApprovalService: MultiLevelApprovalService
  ) {
    // Start background processes
    this.startAutomatedProcessing();
  }

  /**
   * Process a request through automated approval rules
   */
  async processAutomatedApproval(request: ApprovalRequest): Promise<{
    action: 'approve' | 'reject' | 'escalate' | 'continue' | 'hold';
    reason: string;
    ruleId?: string;
    newDeadline?: Date;
    skipToLevel?: number;
  }> {
    try {
      const automationRules = await this.getActiveAutomationRules();
      
      // Sort by priority
      const sortedRules = automationRules.sort((a, b) => a.priority - b.priority);
      
      for (const rule of sortedRules) {
        const evaluation = await this.evaluateAutomationRule(rule, request);
        
        if (evaluation.matches) {
          this.logger.log(`Automation rule matched: ${rule.name} for request ${request.id}`);
          
          // Execute the rule actions
          const result = await this.executeAutomationActions(rule, request);
          
          // Log the automated action
          await this.logAutomatedAction(request.id, rule, result);
          
          return result;
        }
      }
      
      // No automation rules matched, continue with normal process
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
          const shouldEscalate = await this.evaluateEscalationTrigger(trigger, request);
          
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
   * Create intelligent automation rules based on historical data
   */
  async generateIntelligentRules(): Promise<AutomationRule[]> {
    try {
      const historicalData = await this.getHistoricalApprovalData();
      const suggestions: AutomationRule[] = [];
      
      // Analyze patterns for VIP customers
      const vipPattern = this.analyzeVIPPattern(historicalData);
      if (vipPattern.confidence > 0.8) {
        suggestions.push({
          id: `auto-vip-${Date.now()}`,
          name: 'Auto-approve VIP Small Transactions',
          description: `Auto-approve transactions under $${vipPattern.safeAmount} for VIP customers`,
          priority: 1,
          enabled: false, // Require manual approval to enable
          conditions: {
            amountRange: { min: 0, max: vipPattern.safeAmount },
            userTiers: ['gold', 'black']
          },
          actions: {
            autoApprove: true,
            addTags: ['auto-approved', 'vip-pattern']
          },
          businessRules: {
            skipLevels: [1], // Skip first level for VIP
            allowWeekendProcessing: true
          }
        });
      }
      
      // Analyze patterns for time-based approvals
      const timePattern = this.analyzeTimePattern(historicalData);
      if (timePattern.confidence > 0.7) {
        suggestions.push({
          id: `auto-time-${Date.now()}`,
          name: 'Escalate Off-Hours Transactions',
          description: 'Automatically escalate transactions outside business hours',
          priority: 2,
          enabled: false,
          conditions: {
            timeRestrictions: {
              allowedHours: timePattern.businessHours,
              allowedDays: [1, 2, 3, 4, 5] // Monday to Friday
            }
          },
          actions: {
            escalateToRole: UserRole.ADMIN,
            notifyUsers: timePattern.onCallUsers
          },
          businessRules: {
            requireTwoFactor: true
          }
        });
      }
      
      this.logger.log(`Generated ${suggestions.length} intelligent automation rules`);
      return suggestions;
    } catch (error) {
      this.logger.error('Error generating intelligent rules:', error);
      return [];
    }
  }

  /**
   * Monitor and optimize existing automation rules
   */
  async optimizeAutomationRules(): Promise<{
    optimizations: Array<{
      ruleId: string;
      suggestion: string;
      impact: 'performance' | 'security' | 'compliance';
      confidence: number;
    }>;
    performance: {
      automationRate: number;
      errorRate: number;
      averageProcessingTime: number;
    };
  }> {
    try {
      const rules = await this.getActiveAutomationRules();
      const optimizations = [];
      
      for (const rule of rules) {
        const performance = await this.analyzeRulePerformance(rule);
        
        // Check for high error rates
        if (performance.errorRate > 0.05) {
          optimizations.push({
            ruleId: rule.id,
            suggestion: `Rule has high error rate (${(performance.errorRate * 100).toFixed(1)}%). Consider refining conditions.`,
            impact: 'performance',
            confidence: 0.9
          });
        }
        
        // Check for security concerns
        if (rule.actions.autoApprove && rule.conditions.amountRange?.max && rule.conditions.amountRange.max > 25000) {
          optimizations.push({
            ruleId: rule.id,
            suggestion: 'High-value auto-approvals detected. Consider adding additional security checks.',
            impact: 'security',
            confidence: 0.8
          });
        }
        
        // Check for compliance issues
        if (rule.businessRules.allowWeekendProcessing && !rule.businessRules.requireTwoFactor) {
          optimizations.push({
            ruleId: rule.id,
            suggestion: 'Weekend processing without two-factor authentication may violate compliance policies.',
            impact: 'compliance',
            confidence: 0.7
          });
        }
      }
      
      // Calculate overall performance
      const allRulePerformance = await Promise.all(rules.map(r => this.analyzeRulePerformance(r)));
      const avgAutomationRate = allRulePerformance.reduce((sum, p) => sum + p.automationRate, 0) / allRulePerformance.length;
      const avgErrorRate = allRulePerformance.reduce((sum, p) => sum + p.errorRate, 0) / allRulePerformance.length;
      const avgProcessingTime = allRulePerformance.reduce((sum, p) => sum + p.processingTime, 0) / allRulePerformance.length;
      
      return {
        optimizations,
        performance: {
          automationRate: avgAutomationRate,
          errorRate: avgErrorRate,
          averageProcessingTime: avgProcessingTime
        }
      };
    } catch (error) {
      this.logger.error('Error optimizing automation rules:', error);
      return {
        optimizations: [],
        performance: {
          automationRate: 0,
          errorRate: 0,
          averageProcessingTime: 0
        }
      };
    }
  }

  // Private helper methods

  private async getActiveAutomationRules(): Promise<AutomationRule[]> {
    // In real implementation, this would fetch from database
    return [
      {
        id: 'auto-rule-1',
        name: 'VIP Auto-Approval',
        description: 'Auto-approve transactions under $20K for Gold/Black tier users',
        priority: 1,
        enabled: true,
        conditions: {
          amountRange: { min: 0, max: 20000 },
          userTiers: ['gold', 'black'],
          venueTypes: ['beach_club', 'nightclub']
        },
        actions: {
          autoApprove: true,
          addTags: ['auto-approved', 'vip']
        },
        businessRules: {
          skipLevels: [1],
          allowWeekendProcessing: true
        }
      },
      {
        id: 'auto-rule-2',
        name: 'Small Transaction Auto-Approval',
        description: 'Auto-approve transactions under $1K for users with good history',
        priority: 2,
        enabled: true,
        conditions: {
          amountRange: { min: 0, max: 1000 },
          userHistory: {
            minSuccessfulTransactions: 10,
            maxRejectedInPeriod: 2,
            periodDays: 30
          }
        },
        actions: {
          autoApprove: true,
          addTags: ['auto-approved', 'small-amount']
        },
        businessRules: {
          allowWeekendProcessing: true
        }
      }
    ];
  }

  private async getActiveEscalationTriggers(): Promise<EscalationTrigger[]> {
    return [
      {
        id: 'escalation-1',
        name: 'Timeout Escalation',
        description: 'Escalate requests that timeout at any level',
        enabled: true,
        triggerConditions: {
          timeoutMinutes: 120 // 2 hours
        },
        escalationActions: {
          notifyUsers: ['admin1', 'admin2'],
          escalateToRole: UserRole.ADMIN,
          newDeadline: 4, // 4 hours
          requireManagerOverride: true
        }
      },
      {
        id: 'escalation-2',
        name: 'High Value Urgent',
        description: 'Immediate escalation for high-value urgent transactions',
        enabled: true,
        triggerConditions: {
          timeoutMinutes: 30
        },
        escalationActions: {
          notifyUsers: ['admin1'],
          escalateToRole: UserRole.ADMIN,
          newDeadline: 1,
          autoApproveAfterDelay: 60 // Auto-approve after 1 hour if no response
        }
      }
    ];
  }

  private async evaluateAutomationRule(rule: AutomationRule, request: ApprovalRequest): Promise<{ matches: boolean; confidence: number }> {
    let score = 0;
    let maxScore = 0;
    
    // Check amount range
    if (rule.conditions.amountRange) {
      maxScore += 25;
      if (request.amount >= rule.conditions.amountRange.min && request.amount <= rule.conditions.amountRange.max) {
        score += 25;
      }
    }
    
    // Check user tier
    if (rule.conditions.userTiers) {
      maxScore += 20;
      const userTier = await this.getUserTier(request.requesterId);
      if (rule.conditions.userTiers.includes(userTier)) {
        score += 20;
      }
    }
    
    // Check venue type
    if (rule.conditions.venueTypes && request.venueId) {
      maxScore += 15;
      const venueType = await this.getVenueType(request.venueId);
      if (rule.conditions.venueTypes.includes(venueType)) {
        score += 15;
      }
    }
    
    // Check time restrictions
    if (rule.conditions.timeRestrictions) {
      maxScore += 15;
      const now = new Date();
      const currentHour = now.getHours();
      const currentDay = now.getDay();
      
      if (rule.conditions.timeRestrictions.allowedHours?.includes(currentHour) &&
          rule.conditions.timeRestrictions.allowedDays?.includes(currentDay)) {
        score += 15;
      }
    }
    
    // Check user history
    if (rule.conditions.userHistory) {
      maxScore += 25;
      const userHistory = await this.getUserHistory(request.requesterId, rule.conditions.userHistory.periodDays);
      
      if (userHistory.successfulTransactions >= rule.conditions.userHistory.minSuccessfulTransactions &&
          userHistory.rejectedTransactions <= rule.conditions.userHistory.maxRejectedInPeriod) {
        score += 25;
      }
    }
    
    const confidence = maxScore > 0 ? score / maxScore : 0;
    return {
      matches: confidence >= 0.8, // 80% confidence threshold
      confidence
    };
  }

  private async executeAutomationActions(rule: AutomationRule, request: ApprovalRequest): Promise<{
    action: 'approve' | 'reject' | 'escalate' | 'continue' | 'hold';
    reason: string;
    ruleId: string;
    newDeadline?: Date;
    skipToLevel?: number;
  }> {
    const result = {
      ruleId: rule.id,
      reason: `Automated action by rule: ${rule.name}`
    };
    
    if (rule.actions.autoApprove) {
      // Auto-approve the request
      await this.autoApproveRequest(request, rule);
      return {
        ...result,
        action: 'approve' as const
      };
    }
    
    if (rule.actions.autoReject) {
      // Auto-reject the request
      await this.autoRejectRequest(request, rule);
      return {
        ...result,
        action: 'reject' as const
      };
    }
    
    if (rule.actions.escalateToLevel || rule.actions.escalateToRole) {
      // Escalate the request
      const escalationResult = await this.autoEscalateRequest(request, rule);
      return {
        ...result,
        action: 'escalate' as const,
        newDeadline: escalationResult.newDeadline,
        skipToLevel: rule.actions.escalateToLevel
      };
    }
    
    return {
      ...result,
      action: 'continue' as const
    };
  }

  private async evaluateEscalationTrigger(trigger: EscalationTrigger, request: ApprovalRequest): Promise<boolean> {
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
    // Update request with escalation
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
    await this.notificationService.sendEscalationNotifications(request, trigger.escalationActions.notifyUsers);
    
    // Update database
    await this.databaseService.updateApprovalRequest(request);
    
    this.logger.log(`Executed escalation trigger: ${trigger.name} for request ${request.id}`);
  }

  private async autoApproveRequest(request: ApprovalRequest, rule: AutomationRule): Promise<void> {
    // Add automated approval action
    request.approvals.push({
      id: `auto-approval-${Date.now()}`,
      level: request.currentLevel,
      approverId: 'system',
      approverName: 'Automated System',
      approverRole: UserRole.ADMIN,
      action: 'approve',
      comment: `Auto-approved by rule: ${rule.name}`,
      timestamp: new Date()
    });
    
    request.status = 'approved';
    
    // Add tags if specified
    if (rule.actions.addTags) {
      request.tags = [...(request.tags || []), ...rule.actions.addTags];
    }
    
    // Update database
    await this.databaseService.updateApprovalRequest(request);
    
    // Send notifications
    await this.notificationService.sendAutoApprovalNotification(request, rule);
    
    this.logger.log(`Auto-approved request ${request.id} using rule: ${rule.name}`);
  }

  private async autoRejectRequest(request: ApprovalRequest, rule: AutomationRule): Promise<void> {
    request.approvals.push({
      id: `auto-rejection-${Date.now()}`,
      level: request.currentLevel,
      approverId: 'system',
      approverName: 'Automated System',
      approverRole: UserRole.ADMIN,
      action: 'reject',
      comment: `Auto-rejected by rule: ${rule.name}`,
      timestamp: new Date()
    });
    
    request.status = 'rejected';
    
    await this.databaseService.updateApprovalRequest(request);
    await this.notificationService.sendAutoRejectionNotification(request, rule);
    
    this.logger.log(`Auto-rejected request ${request.id} using rule: ${rule.name}`);
  }

  private async autoEscalateRequest(request: ApprovalRequest, rule: AutomationRule): Promise<{ newDeadline: Date }> {
    const newDeadline = new Date(Date.now() + 4 * 60 * 60 * 1000); // 4 hours default
    
    request.escalations.push({
      id: `auto-escalation-${Date.now()}`,
      fromLevel: request.currentLevel,
      toLevel: rule.actions.escalateToLevel || request.currentLevel + 1,
      triggerReason: `Auto-escalated by rule: ${rule.name}`,
      escalatedBy: 'system',
      escalatedAt: new Date(),
      newDeadline,
      notifiedUsers: rule.actions.notifyUsers || [],
      automatedAction: true
    });
    
    request.status = 'escalated';
    request.deadline = newDeadline;
    
    if (rule.actions.escalateToLevel) {
      request.currentLevel = rule.actions.escalateToLevel;
    }
    
    await this.databaseService.updateApprovalRequest(request);
    
    if (rule.actions.notifyUsers) {
      await this.notificationService.sendEscalationNotifications(request, rule.actions.notifyUsers);
    }
    
    return { newDeadline };
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

  private async getUserTier(userId: string): Promise<string> {
    const user = await this.databaseService.getUser(userId);
    return user?.tier || 'bronze';
  }

  private async getVenueType(venueId: string): Promise<string> {
    const venue = await this.databaseService.getVenue(venueId);
    return venue?.type || 'unknown';
  }

  private async getUserHistory(userId: string, periodDays: number): Promise<{
    successfulTransactions: number;
    rejectedTransactions: number;
  }> {
    const startDate = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000);
    const history = await this.databaseService.getUserTransactionHistory(userId, startDate);
    
    return {
      successfulTransactions: history.filter(t => t.status === 'approved').length,
      rejectedTransactions: history.filter(t => t.status === 'rejected').length
    };
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

    // Generate intelligent rules every hour
    setInterval(async () => {
      try {
        const suggestions = await this.generateIntelligentRules();
        if (suggestions.length > 0) {
          await this.notificationService.sendRuleSuggestions(suggestions);
        }
      } catch (error) {
        this.logger.error('Error generating intelligent rules:', error);
      }
    }, 60 * 60 * 1000);

    this.logger.log('Automated approval processing started');
  }

  private async getHistoricalApprovalData(): Promise<any[]> {
    // Get last 90 days of approval data
    const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    return await this.databaseService.getApprovalRequestsByDateRange(startDate, new Date());
  }

  private analyzeVIPPattern(data: any[]): { confidence: number; safeAmount: number } {
    const vipTransactions = data.filter(t => ['gold', 'black'].includes(t.userTier));
    const approvedVIP = vipTransactions.filter(t => t.status === 'approved');
    
    const confidence = vipTransactions.length > 0 ? approvedVIP.length / vipTransactions.length : 0;
    const amounts = approvedVIP.map(t => t.amount).sort((a, b) => a - b);
    const safeAmount = amounts[Math.floor(amounts.length * 0.8)] || 10000; // 80th percentile
    
    return { confidence, safeAmount };
  }

  private analyzeTimePattern(data: any[]): { confidence: number; businessHours: number[]; onCallUsers: string[] } {
    const businessHours = [9, 10, 11, 12, 13, 14, 15, 16, 17];
    const businessHourTransactions = data.filter(t => 
      businessHours.includes(new Date(t.submittedAt).getHours())
    );
    
    const confidence = data.length > 0 ? businessHourTransactions.length / data.length : 0;
    
    return {
      confidence,
      businessHours,
      onCallUsers: ['admin1', 'admin2'] // Would be configurable
    };
  }

  private async analyzeRulePerformance(rule: AutomationRule): Promise<{
    automationRate: number;
    errorRate: number;
    processingTime: number;
  }> {
    // Analyze rule performance over last 30 days
    const performance = await this.databaseService.getRulePerformanceMetrics(rule.id, 30);
    
    return {
      automationRate: performance.automationRate || 0,
      errorRate: performance.errorRate || 0,
      processingTime: performance.avgProcessingTime || 0
    };
  }
} 