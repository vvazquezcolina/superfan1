'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '@mandala/shared-types';

interface AuthUser extends User {
  token?: string;
  refreshToken?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state from localStorage or Firebase
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setLoading(true);
      
      // Check for stored auth token
      const storedToken = localStorage.getItem('mandala-auth-token');
      const storedUser = localStorage.getItem('mandala-user');
      
      if (storedToken && storedUser) {
        const userData = JSON.parse(storedUser);
        
        // Validate token with backend
        const isValidToken = await validateToken(storedToken);
        
        if (isValidToken) {
          setUser({
            ...userData,
            token: storedToken,
          });
        } else {
          // Clear invalid credentials
          localStorage.removeItem('mandala-auth-token');
          localStorage.removeItem('mandala-user');
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateToken = async (token: string): Promise<boolean> => {
    try {
      // Mock validation - in production, would call API
      const response = await fetch('/api/auth/validate', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Mock login - in production, would use Firebase Auth
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const { user: userData, token } = await response.json();
      
      // Store credentials
      localStorage.setItem('mandala-auth-token', token);
      localStorage.setItem('mandala-user', JSON.stringify(userData));
      
      setUser({
        ...userData,
        token,
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // Clear local storage
      localStorage.removeItem('mandala-auth-token');
      localStorage.removeItem('mandala-user');
      
      // Call logout API
      if (user?.token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
      }
      
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.roles?.includes(role) ?? false;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.some(role => hasRole(role));
  };

  const isAuthenticated = !!user && !!user.token;

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    hasRole,
    hasAnyRole,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock auth data for development
export const mockAdminUser: AuthUser = {
  id: 'admin-1',
  email: 'admin@mandala.mx',
  displayName: 'Administrador Mandala',
  roles: [UserRole.ADMIN],
  isActive: true,
  emailVerified: true,
  phoneNumber: '+52-998-123-4567',
  createdAt: new Date(),
  updatedAt: new Date(),
  token: 'mock-admin-token',
};

export const mockVenueManagerUser: AuthUser = {
  id: 'manager-1',
  email: 'manager@mandala.mx',
  displayName: 'Manager Venue',
  roles: [UserRole.VENUE_MANAGER],
  isActive: true,
  emailVerified: true,
  phoneNumber: '+52-998-123-4568',
  createdAt: new Date(),
  updatedAt: new Date(),
  token: 'mock-manager-token',
}; 