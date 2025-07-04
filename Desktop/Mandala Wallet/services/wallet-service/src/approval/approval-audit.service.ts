import { Injectable, Logger } from '@nestjs/common';
import { 
  ApprovalRequest, 
  ApprovalAction, 
  AuditRecord,
  UserRole,
  ApprovalMetrics
} from '@mandala/shared-types';
import { DatabaseService } from '../database/database.service';

interface AuditContext {
  userId: string;
  userRole: UserRole;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface AuditQuery {
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  userRole?: UserRole;
  action?: string;
  transactionId?: string;
  requestId?: string;
  changeType?: AuditRecord['changeType'];
  ipAddress?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'timestamp' | 'action' | 'userId';
  sortOrder?: 'asc' | 'desc';
}

interface ComplianceReport {
  reportId: string;
  generatedAt: Date;
  generatedBy: string;
  period: {
    startDate: Date;
    endDate: Date;
  };
  summary: {
    totalActions: number;
    uniqueUsers: number;
    approvalRequests: number;
    successfulApprovals: number;
    rejectedApprovals: number;
    escalatedApprovals: number;
    delegatedActions: number;
  };
  violations: Array<{
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    affectedRequests: string[];
    recommendedAction: string;
  }>;
  userActivity: Array<{
    userId: string;
    userName: string;
    role: UserRole;
    totalActions: number;
    approvalRate: number;
    averageResponseTime: number;
    riskScore: number;
  }>;
  anomalies: Array<{
    type: string;
    description: string;
    detectedAt: Date;
    affectedUsers: string[];
    impact: string;
  }>;
}

@Injectable()
export class ApprovalAuditService {
  private readonly logger = new Logger(ApprovalAuditService.name);

  constructor(
    private readonly databaseService: DatabaseService
  ) {}

  /**
   * Log an approval-related action with full audit details
   */
  async logApprovalAction(
    requestId: string,
    action: string,
    context: AuditContext,
    details: Record<string, any> = {},
    previousValue?: any,
    newValue?: any
  ): Promise<AuditRecord> {
    try {
      const auditRecord: AuditRecord = {
        id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        action,
        performedBy: context.userId,
        performedAt: context.timestamp,
        details: {
          requestId,
          userRole: context.userRole,
          sessionId: context.sessionId,
          ...details,
          ...context.metadata
        },
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        previousValue,
        newValue,
        changeType: this.determineChangeType(action)
      };

      await this.databaseService.createAuditRecord(auditRecord);
      
      // Check for suspicious activity
      await this.detectAnomalousActivity(context, auditRecord);
      
      this.logger.log(`Audit record created: ${auditRecord.id} for action: ${action}`);
      
      return auditRecord;
    } catch (error) {
      this.logger.error('Error creating audit record:', error);
      throw error;
    }
  }

  /**
   * Get comprehensive audit trail with advanced filtering
   */
  async getAuditTrail(query: AuditQuery): Promise<{
    records: AuditRecord[];
    total: number;
    summary: {
      totalActions: number;
      uniqueUsers: number;
      actionBreakdown: Record<string, number>;
      timeRange: { start: Date; end: Date };
    };
  }> {
    try {
      const { records, total } = await this.databaseService.getAuditRecords(query);
      
      // Calculate summary statistics
      const uniqueUsers = new Set(records.map(r => r.performedBy)).size;
      const actionBreakdown = records.reduce((acc, record) => {
        acc[record.action] = (acc[record.action] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const timeRange = {
        start: query.startDate || new Date(Math.min(...records.map(r => r.performedAt.getTime()))),
        end: query.endDate || new Date(Math.max(...records.map(r => r.performedAt.getTime())))
      };

      return {
        records,
        total,
        summary: {
          totalActions: total,
          uniqueUsers,
          actionBreakdown,
          timeRange
        }
      };
    } catch (error) {
      this.logger.error('Error retrieving audit trail:', error);
      throw error;
    }
  }

  /**
   * Generate comprehensive approval metrics
   */
  async generateApprovalMetrics(
    startDate: Date,
    endDate: Date,
    filters?: {
      userRole?: UserRole;
      venueId?: string;
      amountRange?: { min: number; max: number };
    }
  ): Promise<ApprovalMetrics> {
    try {
      const requests = await this.databaseService.getApprovalRequestsByDateRange(startDate, endDate, filters);
      const auditRecords = await this.databaseService.getAuditRecords({
        startDate,
        endDate,
        changeType: 'approve'
      });

      const totalRequests = requests.length;
      const pendingRequests = requests.filter(r => r.status === 'pending').length;
      const approvedRequests = requests.filter(r => r.status === 'approved').length;
      const rejectedRequests = requests.filter(r => r.status === 'rejected').length;
      const expiredRequests = requests.filter(r => r.status === 'expired').length;
      const escalatedRequests = requests.filter(r => r.status === 'escalated').length;

      // Calculate average approval time
      const completedRequests = requests.filter(r => ['approved', 'rejected'].includes(r.status));
      const averageApprovalTime = completedRequests.length > 0
        ? completedRequests.reduce((sum, req) => {
            const completionTime = req.approvals.length > 0 
              ? req.approvals[req.approvals.length - 1].timestamp.getTime() - req.submittedAt.getTime()
              : 0;
            return sum + completionTime;
          }, 0) / completedRequests.length / (1000 * 60 * 60) // Convert to hours
        : 0;

      // Calculate average time per level
      const averageTimePerLevel: Record<number, number> = {};
      requests.forEach(request => {
        for (let level = 1; level <= request.totalLevels; level++) {
          const levelApprovals = request.approvals.filter(a => a.level === level);
          if (levelApprovals.length > 0) {
            const levelTime = levelApprovals[0].timestamp.getTime() - request.submittedAt.getTime();
            averageTimePerLevel[level] = (averageTimePerLevel[level] || 0) + levelTime;
          }
        }
      });

      // Calculate approvals by role
      const approvalsByRole: Record<UserRole, number> = {
        [UserRole.ADMIN]: 0,
        [UserRole.VENUE_MANAGER]: 0,
        [UserRole.RP]: 0,
        [UserRole.CLIENT]: 0
      };

      auditRecords.records.forEach(record => {
        if (record.details.userRole) {
          approvalsByRole[record.details.userRole as UserRole]++;
        }
      });

      // Calculate approvals by user
      const approvalsByUser: Record<string, number> = {};
      auditRecords.records.forEach(record => {
        approvalsByUser[record.performedBy] = (approvalsByUser[record.performedBy] || 0) + 1;
      });

      // Calculate rates
      const timeoutRate = totalRequests > 0 ? (expiredRequests / totalRequests) * 100 : 0;
      const escalationRate = totalRequests > 0 ? (escalatedRequests / totalRequests) * 100 : 0;
      const delegationRate = await this.calculateDelegationRate(startDate, endDate);

      // Get most common rejection reasons
      const rejectionReasons = await this.getMostCommonRejectionReasons(startDate, endDate);

      // Get peak hours
      const peakHours = await this.calculatePeakHours(startDate, endDate);

      // Get workflow performance
      const workflowPerformance = await this.calculateWorkflowPerformance(startDate, endDate);

      return {
        totalRequests,
        pendingRequests,
        approvedRequests,
        rejectedRequests,
        expiredRequests,
        escalatedRequests,
        averageApprovalTime,
        averageTimePerLevel,
        approvalsByRole,
        approvalsByUser,
        timeoutRate,
        escalationRate,
        delegationRate,
        mostCommonRejectionReasons: rejectionReasons,
        peakHours,
        workflowPerformance
      };
    } catch (error) {
      this.logger.error('Error generating approval metrics:', error);
      throw error;
    }
  }

  /**
   * Generate compliance report with violations and anomalies
   */
  async generateComplianceReport(
    startDate: Date,
    endDate: Date,
    generatedBy: string
  ): Promise<ComplianceReport> {
    try {
      const reportId = `compliance-${Date.now()}`;
      const metrics = await this.generateApprovalMetrics(startDate, endDate);
      
      // Detect compliance violations
      const violations = await this.detectComplianceViolations(startDate, endDate);
      
      // Analyze user activity for risk assessment
      const userActivity = await this.analyzeUserActivity(startDate, endDate);
      
      // Detect anomalies
      const anomalies = await this.detectSystemAnomalies(startDate, endDate);

      const report: ComplianceReport = {
        reportId,
        generatedAt: new Date(),
        generatedBy,
        period: { startDate, endDate },
        summary: {
          totalActions: metrics.totalRequests,
          uniqueUsers: Object.keys(metrics.approvalsByUser).length,
          approvalRequests: metrics.totalRequests,
          successfulApprovals: metrics.approvedRequests,
          rejectedApprovals: metrics.rejectedRequests,
          escalatedApprovals: metrics.escalatedRequests,
          delegatedActions: Math.round(metrics.delegationRate * metrics.totalRequests / 100)
        },
        violations,
        userActivity,
        anomalies
      };

      // Store the report
      await this.databaseService.storeComplianceReport(report);
      
      this.logger.log(`Compliance report generated: ${reportId}`);
      
      return report;
    } catch (error) {
      this.logger.error('Error generating compliance report:', error);
      throw error;
    }
  }

  /**
   * Export audit data in various formats
   */
  async exportAuditData(
    query: AuditQuery,
    format: 'json' | 'csv' | 'xlsx',
    includeDetails: boolean = true
  ): Promise<{
    data: any;
    filename: string;
    mimeType: string;
  }> {
    try {
      const auditData = await this.getAuditTrail(query);
      const timestamp = new Date().toISOString().split('T')[0];
      
      let exportData: any;
      let filename: string;
      let mimeType: string;

      switch (format) {
        case 'json':
          exportData = includeDetails ? auditData : auditData.records.map(this.sanitizeRecord);
          filename = `approval-audit-${timestamp}.json`;
          mimeType = 'application/json';
          break;
          
        case 'csv':
          exportData = this.convertToCSV(auditData.records, includeDetails);
          filename = `approval-audit-${timestamp}.csv`;
          mimeType = 'text/csv';
          break;
          
        case 'xlsx':
          exportData = await this.convertToXLSX(auditData.records, includeDetails);
          filename = `approval-audit-${timestamp}.xlsx`;
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          break;
          
        default:
          throw new Error('Unsupported export format');
      }

      this.logger.log(`Audit data exported: ${filename}, ${auditData.records.length} records`);
      
      return { data: exportData, filename, mimeType };
    } catch (error) {
      this.logger.error('Error exporting audit data:', error);
      throw error;
    }
  }

  /**
   * Get approval timeline for a specific request
   */
  async getApprovalTimeline(requestId: string): Promise<{
    request: ApprovalRequest;
    timeline: Array<{
      timestamp: Date;
      action: string;
      actor: string;
      details: string;
      level?: number;
      duration?: number;
    }>;
    metrics: {
      totalDuration: number;
      levelDurations: Record<number, number>;
      averageResponseTime: number;
      escalations: number;
      delegations: number;
    };
  }> {
    try {
      const request = await this.databaseService.getApprovalRequest(requestId);
      if (!request) {
        throw new Error('Approval request not found');
      }

      const auditRecords = await this.databaseService.getAuditRecords({
        requestId,
        sortBy: 'timestamp',
        sortOrder: 'asc'
      });

      // Build timeline
      const timeline = [];
      let previousTimestamp = request.submittedAt;

      // Add submission
      timeline.push({
        timestamp: request.submittedAt,
        action: 'Request Submitted',
        actor: request.requesterName,
        details: `Request submitted for ${request.description}`,
        duration: 0
      });

      // Add all audit records
      auditRecords.records.forEach(record => {
        const duration = record.performedAt.getTime() - previousTimestamp.getTime();
        timeline.push({
          timestamp: record.performedAt,
          action: record.action,
          actor: record.performedBy,
          details: this.formatAuditDetails(record),
          level: record.details.level,
          duration: duration / (1000 * 60) // Convert to minutes
        });
        previousTimestamp = record.performedAt;
      });

      // Calculate metrics
      const totalDuration = timeline.length > 1 
        ? timeline[timeline.length - 1].timestamp.getTime() - timeline[0].timestamp.getTime()
        : 0;

      const levelDurations: Record<number, number> = {};
      request.approvals.forEach(approval => {
        const levelTime = approval.timestamp.getTime() - request.submittedAt.getTime();
        levelDurations[approval.level] = levelTime / (1000 * 60 * 60); // Convert to hours
      });

      const averageResponseTime = timeline.length > 1
        ? timeline.slice(1).reduce((sum, item) => sum + (item.duration || 0), 0) / (timeline.length - 1)
        : 0;

      const escalations = request.escalations.length;
      const delegations = request.delegations.length;

      return {
        request,
        timeline,
        metrics: {
          totalDuration: totalDuration / (1000 * 60 * 60), // Convert to hours
          levelDurations,
          averageResponseTime,
          escalations,
          delegations
        }
      };
    } catch (error) {
      this.logger.error('Error getting approval timeline:', error);
      throw error;
    }
  }

  // Private helper methods

  private determineChangeType(action: string): AuditRecord['changeType'] {
    const actionMap: Record<string, AuditRecord['changeType']> = {
      'Request Created': 'create',
      'Request Updated': 'update',
      'Request Deleted': 'delete',
      'Approval Action': 'approve',
      'Rejection Action': 'reject',
      'Escalation Action': 'escalate',
      'Delegation Action': 'delegate'
    };
    
    return actionMap[action] || 'update';
  }

  private async detectAnomalousActivity(context: AuditContext, record: AuditRecord): Promise<void> {
    try {
      // Check for rapid-fire approvals
      const recentActions = await this.databaseService.getRecentUserActions(context.userId, 24);
      const rapidApprovals = recentActions.filter(a => 
        a.action.includes('Approval') && 
        a.performedAt.getTime() > Date.now() - 60 * 1000 // Last minute
      );
      
      if (rapidApprovals.length > 10) {
        await this.flagSuspiciousActivity(context.userId, 'rapid_approvals', {
          count: rapidApprovals.length,
          timeframe: '1 minute'
        });
      }

      // Check for unusual IP addresses
      if (context.ipAddress) {
        const userIPs = await this.databaseService.getUserIPHistory(context.userId, 30);
        if (!userIPs.includes(context.ipAddress)) {
          await this.flagSuspiciousActivity(context.userId, 'unusual_ip', {
            newIP: context.ipAddress,
            knownIPs: userIPs
          });
        }
      }
    } catch (error) {
      this.logger.warn('Error detecting anomalous activity:', error);
    }
  }

  private async flagSuspiciousActivity(userId: string, type: string, details: any): Promise<void> {
    try {
      await this.databaseService.createSecurityAlert({
        id: `alert-${Date.now()}`,
        type,
        userId,
        details,
        severity: 'medium',
        createdAt: new Date(),
        resolved: false
      });
      
      this.logger.warn(`Suspicious activity detected: ${type} for user ${userId}`);
    } catch (error) {
      this.logger.error('Error flagging suspicious activity:', error);
    }
  }

  private async calculateDelegationRate(startDate: Date, endDate: Date): Promise<number> {
    const totalActions = await this.databaseService.countAuditRecords({
      startDate,
      endDate,
      action: 'Approval Action'
    });
    
    const delegatedActions = await this.databaseService.countAuditRecords({
      startDate,
      endDate,
      action: 'Delegation Action'
    });
    
    return totalActions > 0 ? (delegatedActions / totalActions) * 100 : 0;
  }

  private async getMostCommonRejectionReasons(startDate: Date, endDate: Date): Promise<Array<{
    reason: string;
    count: number;
    percentage: number;
  }>> {
    const rejections = await this.databaseService.getRejectedApprovals(startDate, endDate);
    const reasonCounts: Record<string, number> = {};
    
    rejections.forEach(rejection => {
      const reason = rejection.comment || 'No reason provided';
      reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
    });
    
    const total = rejections.length;
    return Object.entries(reasonCounts)
      .map(([reason, count]) => ({
        reason,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private async calculatePeakHours(startDate: Date, endDate: Date): Promise<Array<{
    hour: number;
    count: number;
  }>> {
    const auditRecords = await this.databaseService.getAuditRecords({
      startDate,
      endDate,
      action: 'Request Created'
    });
    
    const hourCounts: Record<number, number> = {};
    auditRecords.records.forEach(record => {
      const hour = record.performedAt.getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    return Array.from({ length: 24 }, (_, hour) => ({
      hour,
      count: hourCounts[hour] || 0
    }));
  }

  private async calculateWorkflowPerformance(startDate: Date, endDate: Date): Promise<Array<{
    workflowId: string;
    workflowName: string;
    averageTime: number;
    successRate: number;
    timeoutRate: number;
  }>> {
    const requests = await this.databaseService.getApprovalRequestsByDateRange(startDate, endDate);
    const workflowStats: Record<string, any> = {};
    
    requests.forEach(request => {
      if (!workflowStats[request.workflowId]) {
        workflowStats[request.workflowId] = {
          total: 0,
          successful: 0,
          timeouts: 0,
          totalTime: 0
        };
      }
      
      const stats = workflowStats[request.workflowId];
      stats.total++;
      
      if (request.status === 'approved') stats.successful++;
      if (request.status === 'expired') stats.timeouts++;
      
      if (['approved', 'rejected'].includes(request.status) && request.approvals.length > 0) {
        const completionTime = request.approvals[request.approvals.length - 1].timestamp.getTime() - request.submittedAt.getTime();
        stats.totalTime += completionTime;
      }
    });
    
    return Object.entries(workflowStats).map(([workflowId, stats]: [string, any]) => ({
      workflowId,
      workflowName: `Workflow ${workflowId}`, // Would fetch from database in real implementation
      averageTime: stats.total > 0 ? stats.totalTime / stats.total / (1000 * 60 * 60) : 0, // Hours
      successRate: stats.total > 0 ? (stats.successful / stats.total) * 100 : 0,
      timeoutRate: stats.total > 0 ? (stats.timeouts / stats.total) * 100 : 0
    }));
  }

  private async detectComplianceViolations(startDate: Date, endDate: Date): Promise<ComplianceReport['violations']> {
    const violations: ComplianceReport['violations'] = [];
    
    // Check for same-user approvals (self-approval)
    const selfApprovals = await this.databaseService.findSelfApprovals(startDate, endDate);
    if (selfApprovals.length > 0) {
      violations.push({
        type: 'self_approval',
        description: 'Users approving their own requests',
        severity: 'high',
        affectedRequests: selfApprovals.map(a => a.requestId),
        recommendedAction: 'Review and strengthen approval workflow rules'
      });
    }
    
    // Check for approvals outside business hours without proper authorization
    const afterHoursApprovals = await this.databaseService.findAfterHoursApprovals(startDate, endDate);
    if (afterHoursApprovals.length > 5) {
      violations.push({
        type: 'after_hours_approval',
        description: 'Excessive after-hours approvals without proper authorization',
        severity: 'medium',
        affectedRequests: afterHoursApprovals.map(a => a.requestId),
        recommendedAction: 'Implement stricter after-hours approval controls'
      });
    }
    
    return violations;
  }

  private async analyzeUserActivity(startDate: Date, endDate: Date): Promise<ComplianceReport['userActivity']> {
    const users = await this.databaseService.getActiveApprovalUsers(startDate, endDate);
    
    return Promise.all(users.map(async user => {
      const userActions = await this.databaseService.getUserApprovalActions(user.id, startDate, endDate);
      const approvals = userActions.filter(a => a.action === 'approve');
      const rejections = userActions.filter(a => a.action === 'reject');
      
      const totalActions = userActions.length;
      const approvalRate = totalActions > 0 ? (approvals.length / totalActions) * 100 : 0;
      
      const responseTimes = userActions.map(a => a.responseTime || 0);
      const averageResponseTime = responseTimes.length > 0
        ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
        : 0;
      
      const riskScore = this.calculateUserRiskScore(user, userActions);
      
      return {
        userId: user.id,
        userName: user.name,
        role: user.role,
        totalActions,
        approvalRate,
        averageResponseTime,
        riskScore
      };
    }));
  }

  private async detectSystemAnomalies(startDate: Date, endDate: Date): Promise<ComplianceReport['anomalies']> {
    const anomalies: ComplianceReport['anomalies'] = [];
    
    // Check for unusual approval patterns
    const hourlyActivity = await this.calculatePeakHours(startDate, endDate);
    const avgActivity = hourlyActivity.reduce((sum, h) => sum + h.count, 0) / 24;
    const spikes = hourlyActivity.filter(h => h.count > avgActivity * 3);
    
    if (spikes.length > 0) {
      anomalies.push({
        type: 'activity_spike',
        description: `Unusual activity spikes detected at hours: ${spikes.map(s => s.hour).join(', ')}`,
        detectedAt: new Date(),
        affectedUsers: [],
        impact: 'Potential system stress or coordinated activity'
      });
    }
    
    return anomalies;
  }

  private calculateUserRiskScore(user: any, actions: any[]): number {
    let riskScore = 0;
    
    // High approval rate might indicate rubber-stamping
    const approvalRate = actions.filter(a => a.action === 'approve').length / actions.length;
    if (approvalRate > 0.95) riskScore += 30;
    
    // Very fast response times might indicate lack of proper review
    const avgResponseTime = actions.reduce((sum, a) => sum + (a.responseTime || 0), 0) / actions.length;
    if (avgResponseTime < 60) riskScore += 20; // Less than 1 minute average
    
    // Check for after-hours activity
    const afterHoursActions = actions.filter(a => {
      const hour = new Date(a.timestamp).getHours();
      return hour < 6 || hour > 22;
    });
    if (afterHoursActions.length > actions.length * 0.3) riskScore += 25;
    
    return Math.min(riskScore, 100);
  }

  private sanitizeRecord(record: AuditRecord): Partial<AuditRecord> {
    return {
      id: record.id,
      action: record.action,
      performedBy: record.performedBy,
      performedAt: record.performedAt,
      changeType: record.changeType
    };
  }

  private convertToCSV(records: AuditRecord[], includeDetails: boolean): string {
    const headers = includeDetails
      ? ['ID', 'Action', 'Performed By', 'Performed At', 'Change Type', 'IP Address', 'Details']
      : ['ID', 'Action', 'Performed By', 'Performed At', 'Change Type'];
    
    const rows = records.map(record => includeDetails
      ? [
          record.id,
          record.action,
          record.performedBy,
          record.performedAt.toISOString(),
          record.changeType,
          record.ipAddress || '',
          JSON.stringify(record.details)
        ]
      : [
          record.id,
          record.action,
          record.performedBy,
          record.performedAt.toISOString(),
          record.changeType
        ]
    );
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  private async convertToXLSX(records: AuditRecord[], includeDetails: boolean): Promise<Buffer> {
    // Implementation would use a library like ExcelJS
    // For now, return a placeholder
    return Buffer.from('XLSX data would be generated here');
  }

  private formatAuditDetails(record: AuditRecord): string {
    const details = record.details;
    if (details.comment) {
      return `${record.action}: ${details.comment}`;
    }
    return record.action;
  }
} 