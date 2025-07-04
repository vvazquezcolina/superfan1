import {
  NotificationType,
  NotificationChannel,
  NotificationPriority,
  NotificationRequest,
  NotificationResponse,
  NotificationTemplate,
  PaymentConfirmation,
  TransactionStatus,
  BalanceType,
  PaymentMethod,
  User
} from '@mandala/shared-types';

export interface FirebaseNotification {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  badge?: number;
}

export interface EmailNotification {
  to: string;
  subject: string;
  html: string;
  attachments?: any[];
}

export interface SMSNotification {
  to: string;
  message: string;
}

export class NotificationService {
  private fcmServerKey: string;
  private smtpConfig: any;
  private templates: Map<string, NotificationTemplate> = new Map();

  constructor() {
    // Configuration from environment variables
    this.fcmServerKey = 'development-fcm-key';
    this.smtpConfig = {
      host: 'localhost',
      port: 1025,
      secure: false,
      auth: {
        user: '',
        pass: ''
      }
    };

    this.initializeTemplates();
  }

  // Initialize notification templates
  private initializeTemplates(): void {
    const templates: NotificationTemplate[] = [
      // Payment Success
      {
        type: NotificationType.PAYMENT_SUCCESS,
        channel: NotificationChannel.PUSH,
        title: '💳 Pago Exitoso',
        body: 'Tu pago de ${amount} MXN ha sido procesado exitosamente en ${venue}',
        actionUrl: '/wallet/transactions/${transactionId}',
        actionLabel: 'Ver Detalles',
        variables: ['amount', 'venue', 'transactionId']
      },
      {
        type: NotificationType.PAYMENT_SUCCESS,
        channel: NotificationChannel.EMAIL,
        title: 'Confirmación de Pago - Mandala Wallet',
        body: `
          <h2>¡Pago Exitoso!</h2>
          <p>Tu pago ha sido procesado exitosamente.</p>
          <ul>
            <li><strong>Monto:</strong> $\${amount} MXN</li>
            <li><strong>Lugar:</strong> \${venue}</li>
            <li><strong>Fecha:</strong> \${date}</li>
            <li><strong>Código de Confirmación:</strong> \${confirmationCode}</li>
          </ul>
          <p><a href="\${receiptUrl}">Ver Recibo Digital</a></p>
        `,
        variables: ['amount', 'venue', 'date', 'confirmationCode', 'receiptUrl']
      },

      // Payment Failed
      {
        type: NotificationType.PAYMENT_FAILED,
        channel: NotificationChannel.PUSH,
        title: '❌ Pago Fallido',
        body: 'Tu pago de ${amount} MXN no pudo ser procesado. ${reason}',
        actionUrl: '/wallet/retry/${transactionId}',
        actionLabel: 'Reintentar',
        variables: ['amount', 'reason', 'transactionId']
      },

      // Payment Pending
      {
        type: NotificationType.PAYMENT_PENDING,
        channel: NotificationChannel.PUSH,
        title: '⏳ Pago Pendiente',
        body: 'Tu pago de ${amount} MXN está siendo procesado. Te notificaremos cuando esté listo.',
        variables: ['amount']
      },

      // Partial Payment Created
      {
        type: NotificationType.PARTIAL_PAYMENT_CREATED,
        channel: NotificationChannel.PUSH,
        title: '📊 Pago Parcial Creado',
        body: 'Pago parcial de ${paidAmount} MXN procesado. Restante: ${remainingAmount} MXN',
        actionUrl: '/wallet/partial-payments/${partialPaymentId}',
        actionLabel: 'Completar Pago',
        variables: ['paidAmount', 'remainingAmount', 'partialPaymentId']
      },

      // Refund Processed
      {
        type: NotificationType.REFUND_PROCESSED,
        channel: NotificationChannel.PUSH,
        title: '💸 Reembolso Procesado',
        body: 'Reembolso de ${amount} MXN procesado exitosamente a tu ${balanceType}',
        variables: ['amount', 'balanceType']
      },

      // Balance Low Warning
      {
        type: NotificationType.BALANCE_LOW,
        channel: NotificationChannel.PUSH,
        title: '⚠️ Saldo Bajo',
        body: 'Tu saldo está bajo: ${balance} MXN. Recarga tu billetera para seguir disfrutando.',
        actionUrl: '/wallet/recharge',
        actionLabel: 'Recargar',
        variables: ['balance']
      },

      // RP Allocation
      {
        type: NotificationType.RP_ALLOCATION_RECEIVED,
        channel: NotificationChannel.PUSH,
        title: '🎉 Asignación Mensual',
        body: 'Has recibido ${amount} MXN en crédito mensual para invitar huéspedes',
        variables: ['amount']
      },

      // Balance Expiring
      {
        type: NotificationType.BALANCE_EXPIRING,
        channel: NotificationChannel.PUSH,
        title: '⏰ Saldo por Expirar',
        body: '${amount} MXN en ${balanceType} expiran el ${expiryDate}. ¡Úsalo pronto!',
        variables: ['amount', 'balanceType', 'expiryDate']
      }
    ];

    templates.forEach(template => {
      const key = `${template.type}_${template.channel}`;
      this.templates.set(key, template);
    });
  }

  // Send notification using specified channels
  async sendNotification(request: NotificationRequest): Promise<NotificationResponse> {
    const notificationId = `notif_${Date.now()}`;
    const response: NotificationResponse = {
      id: notificationId,
      status: 'sent',
      channels: {},
      createdAt: new Date()
    };

    try {
      // Send to each requested channel
      for (const channel of request.channels) {
        try {
          let channelResult;

          switch (channel) {
            case NotificationChannel.PUSH:
              channelResult = await this.sendPushNotification(request);
              break;
            case NotificationChannel.EMAIL:
              channelResult = await this.sendEmailNotification(request);
              break;
            case NotificationChannel.SMS:
              channelResult = await this.sendSMSNotification(request);
              break;
            case NotificationChannel.IN_APP:
              channelResult = await this.sendInAppNotification(request);
              break;
          }

          response.channels[channel] = {
            status: 'sent',
            messageId: channelResult?.messageId,
            sentAt: new Date()
          };

        } catch (error) {
          response.channels[channel] = {
            status: 'failed',
            error: (error as Error).message,
            sentAt: new Date()
          };
          response.status = 'failed';
        }
      }

      response.sentAt = new Date();
      return response;

    } catch (error) {
      console.error('Notification sending failed:', error);
      response.status = 'failed';
      response.failedAt = new Date();
      return response;
    }
  }

  // Send payment confirmation notification
  async sendPaymentConfirmation(confirmation: PaymentConfirmation, user: User): Promise<NotificationResponse> {
    const channels = this.getPreferredChannels(user);
    
    // Determine notification type based on payment status
    let notificationType: NotificationType;
    let priority: NotificationPriority = NotificationPriority.NORMAL;

    switch (confirmation.status) {
      case TransactionStatus.COMPLETED:
        notificationType = NotificationType.PAYMENT_SUCCESS;
        priority = NotificationPriority.HIGH;
        break;
      case TransactionStatus.FAILED:
        notificationType = NotificationType.PAYMENT_FAILED;
        priority = NotificationPriority.HIGH;
        break;
      case TransactionStatus.PENDING:
        notificationType = NotificationType.PAYMENT_PENDING;
        break;
      default:
        notificationType = NotificationType.PAYMENT_PENDING;
    }

    // Get template and build message
    const pushTemplate = this.templates.get(`${notificationType}_${NotificationChannel.PUSH}`);
    
    if (!pushTemplate) {
      throw new Error(`Template not found for ${notificationType}`);
    }

    // Replace template variables
    const variables = {
      amount: confirmation.amount.toString(),
      venue: 'Mandala Beach Club', // Would be fetched from venue service
      transactionId: confirmation.transactionId,
      confirmationCode: confirmation.confirmationCode,
      date: new Date().toLocaleDateString('es-MX'),
      receiptUrl: confirmation.receiptUrl || '',
      balanceType: this.translateBalanceType(confirmation.balanceType),
      reason: 'Saldo insuficiente' // Would be dynamic based on actual error
    };

    const title = this.replaceVariables(pushTemplate.title, variables);
    const body = this.replaceVariables(pushTemplate.body, variables);

    const request: NotificationRequest = {
      userId: confirmation.userId,
      type: notificationType,
      channels: channels,
      priority: priority,
      title: title,
      body: body,
      data: {
        transactionId: confirmation.transactionId,
        amount: confirmation.amount.toString(),
        status: confirmation.status,
        confirmationCode: confirmation.confirmationCode
      },
      actionUrl: pushTemplate.actionUrl ? 
        this.replaceVariables(pushTemplate.actionUrl, variables) : undefined,
      actionLabel: pushTemplate.actionLabel
    };

    return await this.sendNotification(request);
  }

  // Send partial payment notification
  async sendPartialPaymentNotification(
    userId: string,
    paidAmount: number,
    remainingAmount: number,
    partialPaymentId: string,
    user: User
  ): Promise<NotificationResponse> {
    const channels = this.getPreferredChannels(user);
    const template = this.templates.get(`${NotificationType.PARTIAL_PAYMENT_CREATED}_${NotificationChannel.PUSH}`);
    
    if (!template) {
      throw new Error('Partial payment template not found');
    }

    const variables = {
      paidAmount: paidAmount.toString(),
      remainingAmount: remainingAmount.toString(),
      partialPaymentId: partialPaymentId
    };

    const request: NotificationRequest = {
      userId: userId,
      type: NotificationType.PARTIAL_PAYMENT_CREATED,
      channels: channels,
      priority: NotificationPriority.HIGH,
      title: template.title,
      body: this.replaceVariables(template.body, variables),
      data: {
        partialPaymentId: partialPaymentId,
        paidAmount: paidAmount.toString(),
        remainingAmount: remainingAmount.toString()
      },
      actionUrl: template.actionUrl ? 
        this.replaceVariables(template.actionUrl, variables) : undefined,
      actionLabel: template.actionLabel
    };

    return await this.sendNotification(request);
  }

  // Send refund notification
  async sendRefundNotification(
    userId: string,
    amount: number,
    balanceType: BalanceType,
    user: User
  ): Promise<NotificationResponse> {
    const channels = this.getPreferredChannels(user);
    const template = this.templates.get(`${NotificationType.REFUND_PROCESSED}_${NotificationChannel.PUSH}`);
    
    if (!template) {
      throw new Error('Refund template not found');
    }

    const variables = {
      amount: amount.toString(),
      balanceType: this.translateBalanceType(balanceType)
    };

    const request: NotificationRequest = {
      userId: userId,
      type: NotificationType.REFUND_PROCESSED,
      channels: channels,
      priority: NotificationPriority.NORMAL,
      title: template.title,
      body: this.replaceVariables(template.body, variables),
      data: {
        amount: amount.toString(),
        balanceType: balanceType,
        type: 'refund'
      }
    };

    return await this.sendNotification(request);
  }

  // Channel-specific implementations
  private async sendPushNotification(request: NotificationRequest): Promise<{ messageId: string }> {
    // Mock Firebase Cloud Messaging implementation
    console.log('Sending push notification:', {
      userId: request.userId,
      title: request.title,
      body: request.body,
      data: request.data
    });

    // In production, this would use Firebase Admin SDK
    return { messageId: `fcm_${Date.now()}` };
  }

  private async sendEmailNotification(request: NotificationRequest): Promise<{ messageId: string }> {
    // Mock email implementation
    const template = this.templates.get(`${request.type}_${NotificationChannel.EMAIL}`);
    
    console.log('Sending email notification:', {
      to: 'user@example.com', // Would get from user data
      subject: request.title,
      html: template ? template.body : request.body
    });

    return { messageId: `email_${Date.now()}` };
  }

  private async sendSMSNotification(request: NotificationRequest): Promise<{ messageId: string }> {
    // Mock SMS implementation
    console.log('Sending SMS notification:', {
      to: '+52-xxx-xxx-xxxx', // Would get from user data
      message: `${request.title}: ${request.body}`
    });

    return { messageId: `sms_${Date.now()}` };
  }

  private async sendInAppNotification(request: NotificationRequest): Promise<{ messageId: string }> {
    // Mock in-app notification (would store in database for user to see)
    console.log('Storing in-app notification:', {
      userId: request.userId,
      title: request.title,
      body: request.body,
      actionUrl: request.actionUrl
    });

    return { messageId: `inapp_${Date.now()}` };
  }

  // Helper methods
  private getPreferredChannels(user: User): NotificationChannel[] {
    // Default channels - in production, would check user preferences
    return [NotificationChannel.PUSH, NotificationChannel.IN_APP];
  }

  private replaceVariables(template: string, variables: Record<string, string>): string {
    let result = template;
    
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `\${${key}}`;
      result = result.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
    });

    return result;
  }

  private translateBalanceType(balanceType: BalanceType): string {
    switch (balanceType) {
      case BalanceType.CASH:
        return 'efectivo';
      case BalanceType.CREDIT:
        return 'crédito';
      case BalanceType.REWARDS:
        return 'recompensas';
      default:
        return 'saldo';
    }
  }

  // Template management
  getTemplate(type: NotificationType, channel: NotificationChannel): NotificationTemplate | undefined {
    return this.templates.get(`${type}_${channel}`);
  }

  updateTemplate(template: NotificationTemplate): void {
    const key = `${template.type}_${template.channel}`;
    this.templates.set(key, template);
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      // Check if all services are available
      return this.templates.size > 0;
    } catch (error) {
      console.error('Notification service health check failed:', error);
      return false;
    }
  }
} 