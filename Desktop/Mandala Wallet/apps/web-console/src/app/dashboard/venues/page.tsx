'use client';

import React, { useState } from 'react';
import { VenueCatalog } from '@/components/venues/venue-catalog';
import { VenueForm } from '@/components/venues/venue-form';
import { useAuth } from '@/providers/auth-provider';
import { UserRole } from '@mandala/shared-types';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function VenuesPage() {
  const { hasAnyRole } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingVenue, setEditingVenue] = useState<any>(null);

  // Only allow admins to access venue management
  if (!hasAnyRole([UserRole.ADMIN])) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Acceso Restringido
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Solo los administradores pueden acceder a la gestión de venues.
          </p>
        </div>
      </div>
    );
  }

  const handleCreateVenue = (venueData: any) => {
    // Mock implementation - in real app, this would call an API
    console.log('Creating venue:', venueData);
    
    // Simulate API call
    setTimeout(() => {
      setShowCreateForm(false);
      // In real app, refresh the venues list
      alert('Venue creado exitosamente. Está pendiente de aprobación.');
    }, 1000);
  };

  const handleUpdateVenue = (venueData: any) => {
    // Mock implementation - in real app, this would call an API
    console.log('Updating venue:', venueData);
    
    // Simulate API call
    setTimeout(() => {
      setEditingVenue(null);
      // In real app, refresh the venues list
      alert('Venue actualizado exitosamente.');
    }, 1000);
  };

  const handleCancelForm = () => {
    setShowCreateForm(false);
    setEditingVenue(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestión de Venues
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Administra todos los venues del sistema Mandala Wallet
        </p>
      </div>

      {/* Venue Catalog */}
      <VenueCatalog />

      {/* Create Venue Form */}
      {showCreateForm && (
        <VenueForm
          onSubmit={handleCreateVenue}
          onCancel={handleCancelForm}
        />
      )}

      {/* Edit Venue Form */}
      {editingVenue && (
        <VenueForm
          venue={editingVenue}
          onSubmit={handleUpdateVenue}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  );
} 