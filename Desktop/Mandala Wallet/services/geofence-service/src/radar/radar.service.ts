import {
  Venue,
  Geofence,
  LocationEvent,
  GeofenceNotification,
  User,
  ApiResponse
} from '@mandala/shared-types';

// Radar.io API interfaces
export interface RadarGeofence {
  _id: string;
  tag: string;
  description: string;
  type: 'circle' | 'polygon';
  coordinates: number[][];
  radius?: number;
  metadata?: Record<string, any>;
}

export interface RadarLocation {
  coordinates: [number, number]; // [longitude, latitude]
  accuracy: number;
  timestamp: string;
}

export interface RadarUser {
  userId: string;
  deviceId?: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface RadarWebhookPayload {
  _id: string;
  createdAt: string;
  actualCreatedAt: string;
  live: boolean;
  type: 'user.entered_geofence' | 'user.exited_geofence' | 'user.location';
  user: RadarUser;
  location: RadarLocation;
  geofence?: RadarGeofence;
  confidence: 'high' | 'medium' | 'low';
  duration?: number;
  replayed?: boolean;
}

export interface RadarApiResponse<T = any> {
  meta: {
    code: number;
  };
  data?: T;
  error?: {
    message: string;
    type: string;
  };
}

export class RadarService {
  private apiKey: string;
  private baseUrl: string = 'https://api.radar.io/v1';
  private publishableKey: string;

  constructor() {
    this.apiKey = this.getEnvVar('RADAR_SECRET_KEY') || 'your-radar-secret-key';
    this.publishableKey = this.getEnvVar('RADAR_PUBLISHABLE_KEY') || 'your-radar-publishable-key';
  }

  private getEnvVar(name: string): string | undefined {
    // Environment variable access - would be properly configured in production
    return undefined;
  }

  // Initialize Radar.io service
  async initialize(): Promise<boolean> {
    try {
      // Test API connection
      const response = await this.makeRequest('GET', '/users');
      return response.meta.code === 200;
    } catch (error) {
      console.error('Failed to initialize Radar service:', error);
      return false;
    }
  }

  // Create geofence for venue (500m radius)
  async createVenueGeofence(venue: Venue): Promise<Geofence> {
    const radarGeofence: Partial<RadarGeofence> = {
      tag: `venue_${venue.id}`,
      description: `Geofence for ${venue.name}`,
      type: 'circle',
      coordinates: [[venue.location.longitude, venue.location.latitude]],
      radius: venue.location.geofenceRadius || 500, // Default 500m
      metadata: {
        venueId: venue.id,
        venueName: venue.name,
        managerial: venue.managerId,
        acceptsPayments: venue.settings.acceptsQRPayments,
        pushNotifications: venue.settings.pushNotificationsEnabled
      }
    };

    try {
      const response = await this.makeRequest<RadarGeofence>('POST', '/geofences', radarGeofence);
      
      if (response.meta.code === 200 && response.data) {
        const geofence: Geofence = {
          id: response.data._id,
          venueId: venue.id,
          name: `${venue.name} - 500m radius`,
          latitude: venue.location.latitude,
          longitude: venue.location.longitude,
          radius: venue.location.geofenceRadius || 500,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        console.log(`Created geofence for venue ${venue.name} with ${geofence.radius}m radius`);
        return geofence;
      } else {
        throw new Error(`Failed to create geofence: ${response.error?.message}`);
      }
    } catch (error) {
      console.error('Error creating venue geofence:', error);
      throw error;
    }
  }

  // Update geofence radius or location
  async updateVenueGeofence(venue: Venue, geofenceId: string): Promise<Geofence> {
    const updateData: Partial<RadarGeofence> = {
      coordinates: [[venue.location.longitude, venue.location.latitude]],
      radius: venue.location.geofenceRadius || 500,
      metadata: {
        venueId: venue.id,
        venueName: venue.name,
        lastUpdated: new Date().toISOString()
      }
    };

    try {
      const response = await this.makeRequest<RadarGeofence>(
        'PUT', 
        `/geofences/${geofenceId}`, 
        updateData
      );

      if (response.meta.code === 200 && response.data) {
        return {
          id: response.data._id,
          venueId: venue.id,
          name: `${venue.name} - ${venue.location.geofenceRadius || 500}m radius`,
          latitude: venue.location.latitude,
          longitude: venue.location.longitude,
          radius: venue.location.geofenceRadius || 500,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      } else {
        throw new Error(`Failed to update geofence: ${response.error?.message}`);
      }
    } catch (error) {
      console.error('Error updating venue geofence:', error);
      throw error;
    }
  }

  // Delete geofence
  async deleteVenueGeofence(geofenceId: string): Promise<boolean> {
    try {
      const response = await this.makeRequest('DELETE', `/geofences/${geofenceId}`);
      return response.meta.code === 200;
    } catch (error) {
      console.error('Error deleting venue geofence:', error);
      return false;
    }
  }

  // Track user location
  async trackUserLocation(
    userId: string, 
    latitude: number, 
    longitude: number, 
    accuracy: number = 10
  ): Promise<LocationEvent[]> {
    const trackingData = {
      userId: userId,
      latitude: latitude,
      longitude: longitude,
      accuracy: accuracy,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await this.makeRequest<any>('POST', '/track', trackingData);
      
      if (response.meta.code === 200 && response.data) {
        const events: LocationEvent[] = [];
        
        // Process any geofence events from the tracking response
        if (response.data.events) {
          for (const event of response.data.events) {
            if (event.type === 'user.entered_geofence' || event.type === 'user.exited_geofence') {
              events.push({
                id: event._id,
                userId: userId,
                venueId: event.geofence?.metadata?.venueId || '',
                type: event.type === 'user.entered_geofence' ? 'enter' : 'exit',
                latitude: latitude,
                longitude: longitude,
                accuracy: accuracy,
                timestamp: new Date(),
                metadata: {
                  confidence: event.confidence,
                  geofenceId: event.geofence?._id,
                  geofenceName: event.geofence?.description,
                  duration: event.duration
                }
              });
            }
          }
        }

        return events;
      } else {
        throw new Error(`Failed to track location: ${response.error?.message}`);
      }
    } catch (error) {
      console.error('Error tracking user location:', error);
      return [];
    }
  }

  // Get user's current location and nearby venues
  async getUserLocation(userId: string): Promise<{
    location?: { latitude: number; longitude: number; accuracy: number };
    nearbyVenues: string[];
    insideVenues: string[];
  }> {
    try {
      const response = await this.makeRequest<any>('GET', `/users/${userId}`);
      
      if (response.meta.code === 200 && response.data) {
        const location = response.data.location ? {
          latitude: response.data.location.coordinates[1],
          longitude: response.data.location.coordinates[0],
          accuracy: response.data.location.accuracy || 10
        } : undefined;

        const nearbyVenues: string[] = [];
        const insideVenues: string[] = [];

        if (response.data.geofences) {
          for (const geofence of response.data.geofences) {
            const venueId = geofence.metadata?.venueId;
            if (venueId) {
              if (geofence.inside) {
                insideVenues.push(venueId);
              } else {
                nearbyVenues.push(venueId);
              }
            }
          }
        }

        return { location, nearbyVenues, insideVenues };
      } else {
        throw new Error(`Failed to get user location: ${response.error?.message}`);
      }
    } catch (error) {
      console.error('Error getting user location:', error);
      return { nearbyVenues: [], insideVenues: [] };
    }
  }

  // Process webhook payload from Radar.io
  async processWebhookPayload(payload: RadarWebhookPayload): Promise<{
    locationEvent?: LocationEvent;
    shouldNotify: boolean;
    notificationType?: 'welcome' | 'promotion' | 'reminder' | 'farewell';
  }> {
    console.log(`Processing Radar webhook: ${payload.type} for user ${payload.user.userId}`);

    let locationEvent: LocationEvent | undefined;
    let shouldNotify = false;
    let notificationType: 'welcome' | 'promotion' | 'reminder' | 'farewell' | undefined;

    // Process geofence entry/exit events
    if (payload.type === 'user.entered_geofence' && payload.geofence) {
      const venueId = payload.geofence.metadata?.venueId;
      
      if (venueId) {
        locationEvent = {
          id: payload._id,
          userId: payload.user.userId,
          venueId: venueId,
          type: 'enter',
          latitude: payload.location.coordinates[1],
          longitude: payload.location.coordinates[0],
          accuracy: payload.location.accuracy,
          timestamp: new Date(payload.createdAt),
          metadata: {
            confidence: payload.confidence,
            geofenceId: payload.geofence._id,
            geofenceName: payload.geofence.description,
            radarEventId: payload._id
          }
        };

        shouldNotify = true;
        notificationType = 'welcome';
        
        console.log(`User ${payload.user.userId} entered venue ${venueId}`);
      }
    } else if (payload.type === 'user.exited_geofence' && payload.geofence) {
      const venueId = payload.geofence.metadata?.venueId;
      
      if (venueId) {
        locationEvent = {
          id: payload._id,
          userId: payload.user.userId,
          venueId: venueId,
          type: 'exit',
          latitude: payload.location.coordinates[1],
          longitude: payload.location.coordinates[0],
          accuracy: payload.location.accuracy,
          timestamp: new Date(payload.createdAt),
          metadata: {
            confidence: payload.confidence,
            geofenceId: payload.geofence._id,
            geofenceName: payload.geofence.description,
            duration: payload.duration,
            radarEventId: payload._id
          }
        };

        shouldNotify = true;
        notificationType = 'farewell';
        
        console.log(`User ${payload.user.userId} exited venue ${venueId} after ${payload.duration}s`);
      }
    }

    return { locationEvent, shouldNotify, notificationType };
  }

  // Register user with Radar.io for location tracking
  async registerUser(user: User): Promise<boolean> {
    const radarUser: RadarUser = {
      userId: user.id,
      description: `${user.displayName} (${user.email})`,
      metadata: {
        email: user.email,
        displayName: user.displayName,
        roles: user.roles,
        registeredAt: new Date().toISOString()
      }
    };

    try {
      const response = await this.makeRequest<RadarUser>('PUT', `/users/${user.id}`, radarUser);
      
      if (response.meta.code === 200) {
        console.log(`Registered user ${user.id} with Radar.io`);
        return true;
      } else {
        console.error(`Failed to register user: ${response.error?.message}`);
        return false;
      }
    } catch (error) {
      console.error('Error registering user with Radar:', error);
      return false;
    }
  }

  // Unregister user from Radar.io
  async unregisterUser(userId: string): Promise<boolean> {
    try {
      const response = await this.makeRequest('DELETE', `/users/${userId}`);
      
      if (response.meta.code === 200) {
        console.log(`Unregistered user ${userId} from Radar.io`);
        return true;
      } else {
        console.error(`Failed to unregister user: ${response.error?.message}`);
        return false;
      }
    } catch (error) {
      console.error('Error unregistering user from Radar:', error);
      return false;
    }
  }

  // Get all geofences for monitoring
  async getAllGeofences(): Promise<RadarGeofence[]> {
    try {
      const response = await this.makeRequest<RadarGeofence[]>('GET', '/geofences');
      
      if (response.meta.code === 200 && response.data) {
        return response.data;
      } else {
        console.error(`Failed to get geofences: ${response.error?.message}`);
        return [];
      }
    } catch (error) {
      console.error('Error getting geofences:', error);
      return [];
    }
  }

  // Calculate distance between two coordinates (Haversine formula)
  calculateDistance(
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  }

  // Check if user is within venue radius (fallback for disabled GPS)
  isUserInVenueRadius(
    userLat: number,
    userLon: number,
    venueLat: number,
    venueLon: number,
    radiusMeters: number = 500
  ): boolean {
    const distance = this.calculateDistance(userLat, userLon, venueLat, venueLon);
    return distance <= radiusMeters;
  }

  // Get venue analytics from location events
  async getVenueAnalytics(venueId: string, days: number = 7): Promise<{
    totalVisitors: number;
    uniqueVisitors: number;
    averageVisitDuration: number;
    peakHours: Record<string, number>;
    retentionRate: number;
  }> {
    // Mock implementation - in production would aggregate location events
    return {
      totalVisitors: Math.floor(Math.random() * 200) + 50,
      uniqueVisitors: Math.floor(Math.random() * 150) + 30,
      averageVisitDuration: Math.floor(Math.random() * 7200) + 1800, // 30min - 2.5hrs
      peakHours: {
        '18': 45, '19': 67, '20': 89, '21': 95, '22': 78, '23': 56
      },
      retentionRate: Math.floor(Math.random() * 30) + 70 // 70-100%
    };
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.makeRequest('GET', '/geofences?limit=1');
      return response.meta.code === 200;
    } catch (error) {
      console.error('Radar service health check failed:', error);
      return false;
    }
  }

  // Private helper method for API requests
  private async makeRequest<T = any>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any
  ): Promise<RadarApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      method,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);
      const result = await response.json();
      
      // Log API calls for debugging (remove in production)
      console.log(`Radar API ${method} ${endpoint}:`, {
        status: response.status,
        data: data ? 'included' : 'none',
        response: result.meta
      });

      return result;
    } catch (error) {
      console.error(`Radar API request failed:`, error);
      throw error;
    }
  }

  // Get SDK configuration for frontend
  getClientConfig(): {
    publishableKey: string;
    baseUrl: string;
    defaultSettings: Record<string, any>;
  } {
    return {
      publishableKey: this.publishableKey,
      baseUrl: this.baseUrl,
      defaultSettings: {
        desiredAccuracy: 'high',
        stopDuration: 180, // 3 minutes
        stopDistance: 50, // 50 meters
        sync: 'all',
        showBlueBar: true,
        useStoppedGeofence: true,
        useMovingGeofence: false,
        startTrackingAfter: 30000, // 30 seconds
        stopTrackingAfter: 300000 // 5 minutes
      }
    };
  }
} 