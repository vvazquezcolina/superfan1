import { NotificationService } from './notification.service';

export class NotificationModule {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  // Get notification service instance
  getNotificationService(): NotificationService {
    return this.notificationService;
  }

  // Initialize module
  async onModuleInit() {
    console.log('Initializing Notification Module...');
    await this.notificationService.healthCheck();
    console.log('Notification Module initialized successfully');
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      return await this.notificationService.healthCheck();
    } catch (error) {
      console.error('Notification Module health check failed:', error);
      return false;
    }
  }

  // Export providers for NestJS when dependencies are installed
  static getProviders() {
    return [
      NotificationService
    ];
  }
} 