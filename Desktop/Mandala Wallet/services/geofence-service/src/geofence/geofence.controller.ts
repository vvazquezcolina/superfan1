import { RadarService, RadarWebhookPayload } from '../radar/radar.service';
import { RadarWebhookHandler } from '../webhooks/radar-webhook.handler';
import { NotificationService } from '../notification/notification.service';
import { DatabaseService } from '../database/database.service';
import {
  User,
  UserRole,
  Venue,
  Geofence,
  LocationEvent,
  GeofenceNotification,
  ApiResponse as MandalaApiResponse
} from '@mandala/shared-types';

// Mock HTTP framework interfaces (would use actual framework in production)
interface Request {
  body: any;
  params: Record<string, string>;
  query: Record<string, string>;
  headers: Record<string, string>;
  user?: User;
}

interface Response {
  status(code: number): Response;
  json(data: any): Response;
  send(data: any): Response;
}

export class GeofenceController {
  private radarService: RadarService;
  private webhookHandler: RadarWebhookHandler;
  private notificationService: NotificationService;
  private databaseService: DatabaseService;

  constructor() {
    this.databaseService = new DatabaseService();
    this.notificationService = new NotificationService();
    this.radarService = new RadarService();
    this.webhookHandler = new RadarWebhookHandler(
      this.radarService,
      this.notificationService,
      this.databaseService
    );
  }

  // Initialize geofence service
  async initialize(): Promise<boolean> {
    try {
      const radarInitialized = await this.radarService.initialize();
      if (!radarInitialized) {
        console.error('Failed to initialize Radar.io service');
        return false;
      }

      // Set up geofences for all active venues
      const venues = await this.databaseService.getAllActiveVenues();
      console.log(`Setting up geofences for ${venues.length} venues`);

      for (const venue of venues) {
        if (venue.settings.geofenceEnabled) {
          try {
            await this.radarService.createVenueGeofence(venue);
            console.log(`Created geofence for venue: ${venue.name}`);
          } catch (error) {
            console.error(`Failed to create geofence for venue ${venue.name}:`, error);
          }
        }
      }

      console.log('Geofence service initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize geofence service:', error);
      return false;
    }
  }

  // Radar.io webhook endpoint
  async handleRadarWebhook(req: Request, res: Response): Promise<Response> {
    try {
      const payload: RadarWebhookPayload = req.body;
      const signature = req.headers['radar-signature'] as string;

      console.log(`Received Radar webhook: ${payload.type} for user ${payload.user?.userId}`);

      const result = await this.webhookHandler.processWebhook(payload, signature);

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error('Error handling Radar webhook:', error);
      return res.status(500).json({
        success: false,
        error: (error as Error).message,
        message: 'Internal server error processing webhook',
        timestamp: new Date()
      });
    }
  }

  // Create geofence for venue
  async createVenueGeofence(req: Request, res: Response): Promise<Response> {
    try {
      const { venueId } = req.params;
      
      if (!this.isAuthorized(req.user, UserRole.ADMIN, UserRole.VENUE_MANAGER)) {
        return res.status(403).json({
          success: false,
          error: 'Insufficient permissions',
          message: 'Admin or Venue Manager role required',
          timestamp: new Date()
        });
      }

      const venue = await this.databaseService.findVenueById(venueId);
      if (!venue) {
        return res.status(404).json({
          success: false,
          error: 'Venue not found',
          message: `Venue with ID ${venueId} not found`,
          timestamp: new Date()
        });
      }

      const geofence = await this.radarService.createVenueGeofence(venue);

      return res.status(201).json({
        success: true,
        data: geofence,
        message: `Geofence created for venue ${venue.name}`,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error creating venue geofence:', error);
      return res.status(500).json({
        success: false,
        error: (error as Error).message,
        message: 'Failed to create venue geofence',
        timestamp: new Date()
      });
    }
  }

  // Update venue geofence
  async updateVenueGeofence(req: Request, res: Response): Promise<Response> {
    try {
      const { venueId, geofenceId } = req.params;
      
      if (!this.isAuthorized(req.user, UserRole.ADMIN, UserRole.VENUE_MANAGER)) {
        return res.status(403).json({
          success: false,
          error: 'Insufficient permissions',
          timestamp: new Date()
        });
      }

      const venue = await this.databaseService.findVenueById(venueId);
      if (!venue) {
        return res.status(404).json({
          success: false,
          error: 'Venue not found',
          timestamp: new Date()
        });
      }

      const geofence = await this.radarService.updateVenueGeofence(venue, geofenceId);

      return res.status(200).json({
        success: true,
        data: geofence,
        message: `Geofence updated for venue ${venue.name}`,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error updating venue geofence:', error);
      return res.status(500).json({
        success: false,
        error: (error as Error).message,
        message: 'Failed to update venue geofence',
        timestamp: new Date()
      });
    }
  }

  // Delete venue geofence
  async deleteVenueGeofence(req: Request, res: Response): Promise<Response> {
    try {
      const { geofenceId } = req.params;
      
      if (!this.isAuthorized(req.user, UserRole.ADMIN)) {
        return res.status(403).json({
          success: false,
          error: 'Insufficient permissions',
          message: 'Admin role required',
          timestamp: new Date()
        });
      }

      const success = await this.radarService.deleteVenueGeofence(geofenceId);

      if (success) {
        return res.status(200).json({
          success: true,
          message: 'Geofence deleted successfully',
          timestamp: new Date()
        });
      } else {
        return res.status(400).json({
          success: false,
          error: 'Failed to delete geofence',
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.error('Error deleting venue geofence:', error);
      return res.status(500).json({
        success: false,
        error: (error as Error).message,
        message: 'Failed to delete venue geofence',
        timestamp: new Date()
      });
    }
  }

  // Track user location
  async trackUserLocation(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
          timestamp: new Date()
        });
      }

      const { latitude, longitude, accuracy } = req.body;

      if (!latitude || !longitude) {
        return res.status(400).json({
          success: false,
          error: 'Latitude and longitude are required',
          timestamp: new Date()
        });
      }

      // Check user's location preferences
      const preferences = await this.databaseService.getUserLocationPreferences(user.id);
      if (!preferences.trackingEnabled) {
        return res.status(403).json({
          success: false,
          error: 'Location tracking disabled',
          message: 'User has disabled location tracking',
          timestamp: new Date()
        });
      }

      // Track location with Radar.io
      const events = await this.radarService.trackUserLocation(
        user.id,
        latitude,
        longitude,
        accuracy || 10
      );

      return res.status(200).json({
        success: true,
        data: {
          locationTracked: true,
          eventsTriggered: events.length,
          events: events
        },
        message: 'Location tracked successfully',
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error tracking user location:', error);
      return res.status(500).json({
        success: false,
        error: (error as Error).message,
        message: 'Failed to track user location',
        timestamp: new Date()
      });
    }
  }

  // Get user's current location and nearby venues
  async getUserLocation(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
          timestamp: new Date()
        });
      }

      const locationData = await this.radarService.getUserLocation(user.id);

      return res.status(200).json({
        success: true,
        data: locationData,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error getting user location:', error);
      return res.status(500).json({
        success: false,
        error: (error as Error).message,
        message: 'Failed to get user location',
        timestamp: new Date()
      });
    }
  }

  // Register user for location tracking
  async registerUserTracking(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
          timestamp: new Date()
        });
      }

      const success = await this.radarService.registerUser(user);

      if (success) {
        return res.status(200).json({
          success: true,
          message: 'User registered for location tracking',
          timestamp: new Date()
        });
      } else {
        return res.status(500).json({
          success: false,
          error: 'Failed to register user',
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.error('Error registering user for tracking:', error);
      return res.status(500).json({
        success: false,
        error: (error as Error).message,
        message: 'Failed to register user for tracking',
        timestamp: new Date()
      });
    }
  }

  // Get location events for user
  async getUserLocationEvents(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
          timestamp: new Date()
        });
      }

      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      const events = await this.databaseService.getLocationEventsByUser(user.id, limit, offset);

      return res.status(200).json({
        success: true,
        data: events,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error getting user location events:', error);
      return res.status(500).json({
        success: false,
        error: (error as Error).message,
        message: 'Failed to get location events',
        timestamp: new Date()
      });
    }
  }

  // Get venue analytics
  async getVenueAnalytics(req: Request, res: Response): Promise<Response> {
    try {
      if (!this.isAuthorized(req.user, UserRole.ADMIN, UserRole.VENUE_MANAGER)) {
        return res.status(403).json({
          success: false,
          error: 'Insufficient permissions',
          timestamp: new Date()
        });
      }

      const { venueId } = req.params;
      const days = parseInt(req.query.days as string) || 7;

      const analytics = await this.radarService.getVenueAnalytics(venueId, days);

      return res.status(200).json({
        success: true,
        data: analytics,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error getting venue analytics:', error);
      return res.status(500).json({
        success: false,
        error: (error as Error).message,
        message: 'Failed to get venue analytics',
        timestamp: new Date()
      });
    }
  }

  // Get user notifications
  async getUserNotifications(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
          timestamp: new Date()
        });
      }

      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      const notifications = await this.databaseService.getNotificationsByUser(user.id, limit, offset);

      return res.status(200).json({
        success: true,
        data: notifications,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error getting user notifications:', error);
      return res.status(500).json({
        success: false,
        error: (error as Error).message,
        message: 'Failed to get notifications',
        timestamp: new Date()
      });
    }
  }

  // Mark notification as read
  async markNotificationRead(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
          timestamp: new Date()
        });
      }

      const { notificationId } = req.params;
      const success = await this.databaseService.markNotificationAsRead(notificationId);

      if (success) {
        return res.status(200).json({
          success: true,
          message: 'Notification marked as read',
          timestamp: new Date()
        });
      } else {
        return res.status(400).json({
          success: false,
          error: 'Failed to mark notification as read',
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return res.status(500).json({
        success: false,
        error: (error as Error).message,
        message: 'Failed to mark notification as read',
        timestamp: new Date()
      });
    }
  }

  // Send test notification
  async sendTestNotification(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
          timestamp: new Date()
        });
      }

      const success = await this.notificationService.sendTestNotification(user.id);

      if (success) {
        return res.status(200).json({
          success: true,
          message: 'Test notification sent successfully',
          timestamp: new Date()
        });
      } else {
        return res.status(500).json({
          success: false,
          error: 'Failed to send test notification',
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
      return res.status(500).json({
        success: false,
        error: (error as Error).message,
        message: 'Failed to send test notification',
        timestamp: new Date()
      });
    }
  }

  // Get Radar.io client configuration
  async getClientConfig(req: Request, res: Response): Promise<Response> {
    try {
      const config = this.radarService.getClientConfig();

      return res.status(200).json({
        success: true,
        data: config,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error getting client config:', error);
      return res.status(500).json({
        success: false,
        error: (error as Error).message,
        message: 'Failed to get client configuration',
        timestamp: new Date()
      });
    }
  }

  // Health check endpoint
  async healthCheck(req: Request, res: Response): Promise<Response> {
    try {
      const radarHealth = await this.radarService.healthCheck();
      const notificationHealth = await this.notificationService.healthCheck();
      const databaseHealth = await this.databaseService.healthCheck();
      const webhookHealth = await this.webhookHandler.healthCheck();

      const overall = radarHealth && notificationHealth && databaseHealth && webhookHealth;

      return res.status(overall ? 200 : 503).json({
        success: overall,
        data: {
          status: overall ? 'healthy' : 'unhealthy',
          services: {
            radar: radarHealth,
            notifications: notificationHealth,
            database: databaseHealth,
            webhook: webhookHealth
          },
          timestamp: new Date()
        },
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Health check failed:', error);
      return res.status(503).json({
        success: false,
        error: (error as Error).message,
        message: 'Health check failed',
        timestamp: new Date()
      });
    }
  }

  // Helper methods
  private isAuthorized(user: User | undefined, ...allowedRoles: UserRole[]): boolean {
    if (!user) return false;
    return user.roles.some(role => allowedRoles.includes(role));
  }

  // Route setup helper (would be used with actual framework)
  setupRoutes(): Array<{ method: string; path: string; handler: string }> {
    return [
      { method: 'POST', path: '/webhooks/radar', handler: 'handleRadarWebhook' },
      { method: 'POST', path: '/venues/:venueId/geofence', handler: 'createVenueGeofence' },
      { method: 'PUT', path: '/venues/:venueId/geofence/:geofenceId', handler: 'updateVenueGeofence' },
      { method: 'DELETE', path: '/geofences/:geofenceId', handler: 'deleteVenueGeofence' },
      { method: 'POST', path: '/location/track', handler: 'trackUserLocation' },
      { method: 'GET', path: '/location/current', handler: 'getUserLocation' },
      { method: 'POST', path: '/tracking/register', handler: 'registerUserTracking' },
      { method: 'GET', path: '/location/events', handler: 'getUserLocationEvents' },
      { method: 'GET', path: '/venues/:venueId/analytics', handler: 'getVenueAnalytics' },
      { method: 'GET', path: '/notifications', handler: 'getUserNotifications' },
      { method: 'PUT', path: '/notifications/:notificationId/read', handler: 'markNotificationRead' },
      { method: 'POST', path: '/notifications/test', handler: 'sendTestNotification' },
      { method: 'GET', path: '/config/client', handler: 'getClientConfig' },
      { method: 'GET', path: '/health', handler: 'healthCheck' }
    ];
  }
} 