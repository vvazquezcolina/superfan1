import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpStatus,
  HttpException,
  Query
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { DatabaseService } from '../database/database.service';
import {
  User,
  UserRole,
  ApiResponse as MandalaApiResponse
} from '@mandala/shared-types';

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
    escalationLevel?: number;
  };
  escalationActions: {
    notifyUsers: string[];
    escalateToRole: UserRole;
    newDeadline: number;
    skipToLevel?: number;
  };
}

interface AutomationMetrics {
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
}

@ApiTags('Approval Automation')
@Controller('approval/automation')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AutomationController {
  constructor(
    private readonly databaseService: DatabaseService
  ) {}

  @Get('rules')
  @ApiOperation({ summary: 'Get all automation rules' })
  @ApiResponse({ status: 200, description: 'Automation rules retrieved successfully' })
  @Roles(UserRole.ADMIN, UserRole.VENUE_MANAGER)
  @UseGuards(RolesGuard)
  async getAutomationRules(): Promise<MandalaApiResponse<AutomationRule[]>> {
    try {
      const rules = await this.getDefaultAutomationRules();
      return {
        success: true,
        data: rules,
        timestamp: new Date()
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: (error as Error).message,
          message: 'Failed to retrieve automation rules',
          timestamp: new Date()
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('rules')
  @ApiOperation({ summary: 'Create new automation rule' })
  @ApiResponse({ status: 201, description: 'Automation rule created successfully' })
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  async createAutomationRule(
    @CurrentUser() user: User,
    @Body() rule: Omit<AutomationRule, 'id'>
  ): Promise<MandalaApiResponse<AutomationRule>> {
    try {
      const newRule: AutomationRule = {
        ...rule,
        id: `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };

      // Validate rule
      this.validateAutomationRule(newRule);

      // Save rule (in real implementation)
      await this.databaseService.createAutomationRule(newRule);

      return {
        success: true,
        data: newRule,
        message: 'Automation rule created successfully',
        timestamp: new Date()
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: (error as Error).message,
          message: 'Failed to create automation rule',
          timestamp: new Date()
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Put('rules/:id')
  @ApiOperation({ summary: 'Update automation rule' })
  @ApiResponse({ status: 200, description: 'Automation rule updated successfully' })
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  async updateAutomationRule(
    @Param('id') id: string,
    @Body() updates: Partial<AutomationRule>
  ): Promise<MandalaApiResponse<AutomationRule>> {
    try {
      const existingRule = await this.databaseService.getAutomationRule(id);
      if (!existingRule) {
        throw new Error('Automation rule not found');
      }

      const updatedRule: AutomationRule = {
        ...existingRule,
        ...updates,
        id // Preserve original ID
      };

      this.validateAutomationRule(updatedRule);
      await this.databaseService.updateAutomationRule(updatedRule);

      return {
        success: true,
        data: updatedRule,
        message: 'Automation rule updated successfully',
        timestamp: new Date()
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: (error as Error).message,
          message: 'Failed to update automation rule',
          timestamp: new Date()
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Delete('rules/:id')
  @ApiOperation({ summary: 'Delete automation rule' })
  @ApiResponse({ status: 200, description: 'Automation rule deleted successfully' })
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  async deleteAutomationRule(
    @Param('id') id: string
  ): Promise<MandalaApiResponse<void>> {
    try {
      const existingRule = await this.databaseService.getAutomationRule(id);
      if (!existingRule) {
        throw new Error('Automation rule not found');
      }

      await this.databaseService.deleteAutomationRule(id);

      return {
        success: true,
        message: 'Automation rule deleted successfully',
        timestamp: new Date()
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: (error as Error).message,
          message: 'Failed to delete automation rule',
          timestamp: new Date()
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get('escalation-triggers')
  @ApiOperation({ summary: 'Get escalation triggers' })
  @ApiResponse({ status: 200, description: 'Escalation triggers retrieved successfully' })
  @Roles(UserRole.ADMIN, UserRole.VENUE_MANAGER)
  @UseGuards(RolesGuard)
  async getEscalationTriggers(): Promise<MandalaApiResponse<EscalationTrigger[]>> {
    try {
      const triggers = await this.getDefaultEscalationTriggers();
      return {
        success: true,
        data: triggers,
        timestamp: new Date()
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: (error as Error).message,
          message: 'Failed to retrieve escalation triggers',
          timestamp: new Date()
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('escalation-triggers')
  @ApiOperation({ summary: 'Create escalation trigger' })
  @ApiResponse({ status: 201, description: 'Escalation trigger created successfully' })
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  async createEscalationTrigger(
    @Body() trigger: Omit<EscalationTrigger, 'id'>
  ): Promise<MandalaApiResponse<EscalationTrigger>> {
    try {
      const newTrigger: EscalationTrigger = {
        ...trigger,
        id: `trigger-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };

      await this.databaseService.createEscalationTrigger(newTrigger);

      return {
        success: true,
        data: newTrigger,
        message: 'Escalation trigger created successfully',
        timestamp: new Date()
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: (error as Error).message,
          message: 'Failed to create escalation trigger',
          timestamp: new Date()
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get automation metrics' })
  @ApiResponse({ status: 200, description: 'Automation metrics retrieved successfully' })
  @Roles(UserRole.ADMIN, UserRole.VENUE_MANAGER)
  @UseGuards(RolesGuard)
  async getAutomationMetrics(): Promise<MandalaApiResponse<AutomationMetrics>> {
    try {
      const metrics = await this.calculateAutomationMetrics();
      return {
        success: true,
        data: metrics,
        timestamp: new Date()
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: (error as Error).message,
          message: 'Failed to retrieve automation metrics',
          timestamp: new Date()
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('test-rule/:id')
  @ApiOperation({ summary: 'Test automation rule with sample data' })
  @ApiResponse({ status: 200, description: 'Rule test completed successfully' })
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  async testAutomationRule(
    @Param('id') id: string,
    @Body() testData: {
      amount: number;
      userTier: string;
      venueType: string;
      timestamp: Date;
    }
  ): Promise<MandalaApiResponse<{
    matches: boolean;
    confidence: number;
    wouldExecute: string;
    explanation: string;
  }>> {
    try {
      const rule = await this.databaseService.getAutomationRule(id);
      if (!rule) {
        throw new Error('Automation rule not found');
      }

      const result = await this.testRule(rule, testData);

      return {
        success: true,
        data: result,
        timestamp: new Date()
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: (error as Error).message,
          message: 'Failed to test automation rule',
          timestamp: new Date()
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('generate-suggestions')
  @ApiOperation({ summary: 'Generate intelligent automation rule suggestions' })
  @ApiResponse({ status: 200, description: 'Rule suggestions generated successfully' })
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  async generateRuleSuggestions(): Promise<MandalaApiResponse<{
    suggestions: AutomationRule[];
    insights: Array<{
      pattern: string;
      confidence: number;
      impact: string;
      recommendation: string;
    }>;
  }>> {
    try {
      const suggestions = await this.generateIntelligentSuggestions();
      const insights = await this.generateBusinessInsights();

      return {
        success: true,
        data: {
          suggestions,
          insights
        },
        timestamp: new Date()
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: (error as Error).message,
          message: 'Failed to generate rule suggestions',
          timestamp: new Date()
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // Private helper methods

  private async getDefaultAutomationRules(): Promise<AutomationRule[]> {
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

  private async getDefaultEscalationTriggers(): Promise<EscalationTrigger[]> {
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

  private validateAutomationRule(rule: AutomationRule): void {
    if (!rule.name || rule.name.trim().length === 0) {
      throw new Error('Rule name is required');
    }

    if (!rule.description || rule.description.trim().length === 0) {
      throw new Error('Rule description is required');
    }

    if (rule.priority < 1 || rule.priority > 100) {
      throw new Error('Rule priority must be between 1 and 100');
    }

    if (!rule.conditions || Object.keys(rule.conditions).length === 0) {
      throw new Error('Rule must have at least one condition');
    }

    if (!rule.actions || Object.keys(rule.actions).length === 0) {
      throw new Error('Rule must have at least one action');
    }

    // Validate amount range
    if (rule.conditions.amountRange) {
      const { min, max } = rule.conditions.amountRange;
      if (min < 0 || max < 0 || min > max) {
        throw new Error('Invalid amount range');
      }
    }

    // Validate conflicting actions
    if (rule.actions.autoApprove && rule.actions.autoReject) {
      throw new Error('Cannot have both auto-approve and auto-reject actions');
    }
  }

  private async calculateAutomationMetrics(): Promise<AutomationMetrics> {
    const rules = await this.getDefaultAutomationRules();
    const totalRules = rules.length;
    const activeRules = rules.filter(r => r.enabled).length;

    // Mock metrics - in real implementation, would query database
    const recentActions = [
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

    return {
      totalRules,
      activeRules,
      automationRate: 0.65, // 65% of transactions automated
      errorRate: 0.02, // 2% error rate
      recentActions
    };
  }

  private async testRule(rule: AutomationRule, testData: any): Promise<{
    matches: boolean;
    confidence: number;
    wouldExecute: string;
    explanation: string;
  }> {
    let score = 0;
    let maxScore = 0;
    const explanations = [];

    // Check amount range
    if (rule.conditions.amountRange) {
      maxScore += 40;
      if (testData.amount >= rule.conditions.amountRange.min && 
          testData.amount <= rule.conditions.amountRange.max) {
        score += 40;
        explanations.push(`Amount ${testData.amount} is within range ${rule.conditions.amountRange.min}-${rule.conditions.amountRange.max}`);
      } else {
        explanations.push(`Amount ${testData.amount} is outside range ${rule.conditions.amountRange.min}-${rule.conditions.amountRange.max}`);
      }
    }

    // Check user tier
    if (rule.conditions.userTiers) {
      maxScore += 30;
      if (rule.conditions.userTiers.includes(testData.userTier)) {
        score += 30;
        explanations.push(`User tier ${testData.userTier} matches required tiers`);
      } else {
        explanations.push(`User tier ${testData.userTier} does not match required tiers`);
      }
    }

    // Check venue type
    if (rule.conditions.venueTypes) {
      maxScore += 20;
      if (rule.conditions.venueTypes.includes(testData.venueType)) {
        score += 20;
        explanations.push(`Venue type ${testData.venueType} matches required types`);
      } else {
        explanations.push(`Venue type ${testData.venueType} does not match required types`);
      }
    }

    // Check time restrictions
    if (rule.conditions.timeRestrictions) {
      maxScore += 10;
      const testTime = new Date(testData.timestamp);
      const hour = testTime.getHours();
      const day = testTime.getDay();

      if (rule.conditions.timeRestrictions.allowedHours?.includes(hour) &&
          rule.conditions.timeRestrictions.allowedDays?.includes(day)) {
        score += 10;
        explanations.push(`Time ${hour}:00 on day ${day} is within allowed time restrictions`);
      } else {
        explanations.push(`Time ${hour}:00 on day ${day} is outside allowed time restrictions`);
      }
    }

    const confidence = maxScore > 0 ? score / maxScore : 0;
    const matches = confidence >= 0.8;

    let wouldExecute = 'No action';
    if (matches) {
      if (rule.actions.autoApprove) wouldExecute = 'Auto-approve';
      else if (rule.actions.autoReject) wouldExecute = 'Auto-reject';
      else if (rule.actions.escalateToRole) wouldExecute = `Escalate to ${rule.actions.escalateToRole}`;
    }

    return {
      matches,
      confidence,
      wouldExecute,
      explanation: explanations.join('; ')
    };
  }

  private async generateIntelligentSuggestions(): Promise<AutomationRule[]> {
    // Mock suggestions based on historical data analysis
    return [
      {
        id: 'suggestion-1',
        name: 'Weekend VIP Express',
        description: 'Auto-approve weekend transactions for VIP users under $5K',
        priority: 1,
        enabled: false,
        conditions: {
          amountRange: { min: 0, max: 5000 },
          userTiers: ['gold', 'black'],
          timeRestrictions: {
            allowedHours: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
            allowedDays: [0, 6] // Saturday and Sunday
          }
        },
        actions: {
          autoApprove: true,
          addTags: ['auto-approved', 'weekend-vip']
        }
      }
    ];
  }

  private async generateBusinessInsights(): Promise<Array<{
    pattern: string;
    confidence: number;
    impact: string;
    recommendation: string;
  }>> {
    return [
      {
        pattern: 'VIP User Approval Rate',
        confidence: 0.92,
        impact: 'VIP users have 92% approval rate for transactions under $20K',
        recommendation: 'Consider auto-approving VIP transactions under $15K to improve user experience'
      },
      {
        pattern: 'Weekend Transaction Volume',
        confidence: 0.78,
        impact: 'Weekend transactions take 3x longer to approve on average',
        recommendation: 'Implement weekend automation rules or assign dedicated weekend approvers'
      },
      {
        pattern: 'After-Hours Rejections',
        confidence: 0.85,
        impact: '85% of after-hours submissions are rejected due to insufficient information',
        recommendation: 'Add validation rules to prevent incomplete after-hours submissions'
      }
    ];
  }
} 