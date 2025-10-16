import { getApiUrl } from '../constants/Config';
import AuthService from './authService';

export interface Delivery {
  id: string;
  deliveryPersonName: string;
  packageType: string;
  estimatedTime: string;
  qrCode?: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'refused' | 'cancelled';
  photo?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  residentId: string;
  buildingId: string;
  apartmentId: string;
  trackingHistory?: TrackingEvent[];
}

export interface TrackingEvent {
  id: string;
  status: Delivery['status'];
  timestamp: string;
  description?: string;
  location?: string;
}

export interface CreateDeliveryData {
  deliveryPersonName: string;
  packageType: string;
  estimatedTime: string;
  qrCode?: string;
  description?: string;
  photo?: string;
}

// Utility function to validate MongoDB ObjectId format
export function isValidObjectId(id: string): boolean {
  if (!id || typeof id !== 'string') {
    return false;
  }

  // MongoDB ObjectId is a 24-character hexadecimal string
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id.trim());
}

// Utility function to validate delivery ID before operations
export function validateDeliveryId(id: string): void {
  if (!id || typeof id !== 'string' || id === 'undefined' || id === 'null' || id.trim() === '') {
    throw new Error('ID de livraison invalide.');
  }

  if (!isValidObjectId(id)) {
    throw new Error('ID de livraison invalide: format incorrect.');
  }
}

class DeliveryService {
  private baseURL = `${getApiUrl()}/api/deliveries`;

  // Récupérer toutes les livraisons d'un résident
  async getDeliveries(residentId: string): Promise<Delivery[]> {
    try {
      const authService = AuthService;
      const headers = await authService.getAuthenticatedHeaders();

      const response = await fetch(this.baseURL, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          throw new Error('SESSION_EXPIRED');
        }
        throw new Error(errorData.message || 'Erreur lors de la récupération des livraisons');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur getDeliveries:', error);
      if (error instanceof Error && error.message === 'SESSION_EXPIRED') {
        throw new Error('Votre session a expiré. Veuillez vous reconnecter.');
      }
      throw error;
    }
  }

  // Récupérer les livraisons par statut
  async getDeliveriesByStatus(residentId: string, status: Delivery['status']): Promise<Delivery[]> {
    try {
      const authService = AuthService;
      const headers = await authService.getAuthenticatedHeaders();

      const response = await fetch(`${this.baseURL}?status=${status}`, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          throw new Error('SESSION_EXPIRED');
        }
        throw new Error(errorData.message || 'Erreur lors de la récupération des livraisons');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur getDeliveriesByStatus:', error);
      if (error instanceof Error && error.message === 'SESSION_EXPIRED') {
        throw new Error('Votre session a expiré. Veuillez vous reconnecter.');
      }
      throw error;
    }
  }

  // Récupérer une livraison par ID
  async getDeliveryById(id: string): Promise<Delivery> {
    // Validate delivery ID using the utility function
    validateDeliveryId(id);

    try {
      const authService = AuthService;
      const headers = await authService.getAuthenticatedHeaders();

      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          throw new Error('SESSION_EXPIRED');
        }
        throw new Error(errorData.message || 'Erreur lors de la récupération de la livraison');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur getDeliveryById:', error);
      if (error instanceof Error && error.message === 'SESSION_EXPIRED') {
        throw new Error('Votre session a expiré. Veuillez vous reconnecter.');
      }
      throw error;
    }
  }

  // Créer une nouvelle livraison
  async createDelivery(data: CreateDeliveryData, residentId: string, buildingId: string, apartmentId: string): Promise<Delivery> {
    try {
      const authService = AuthService;
      const headers = await authService.getAuthenticatedHeaders();

      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          residentId,
          buildingId,
          apartmentId,
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          throw new Error('SESSION_EXPIRED');
        }
        throw new Error(errorData.message || 'Erreur lors de la création de la livraison');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur createDelivery:', error);
      if (error instanceof Error && error.message === 'SESSION_EXPIRED') {
        throw new Error('Votre session a expiré. Veuillez vous reconnecter.');
      }
      throw error;
    }
  }

  // Mettre à jour le statut d'une livraison
  async updateDeliveryStatus(id: string, status: Delivery['status'], description?: string): Promise<Delivery> {
    // Validate delivery ID using the utility function
    validateDeliveryId(id);

    try {
      const authService = AuthService;
      const headers = await authService.getAuthenticatedHeaders();

      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'PATCH',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          updatedAt: new Date().toISOString(),
          description,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          throw new Error('SESSION_EXPIRED');
        }
        throw new Error(errorData.message || 'Erreur lors de la mise à jour de la livraison');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur updateDeliveryStatus:', error);
      if (error instanceof Error && error.message === 'SESSION_EXPIRED') {
        throw new Error('Votre session a expiré. Veuillez vous reconnecter.');
      }
      throw error;
    }
  }

  // Confirmer une livraison
  async confirmDelivery(id: string): Promise<Delivery> {
    return this.updateDeliveryStatus(id, 'delivered', 'Livraison confirmée par le résident');
  }

  // Refuser une livraison
  async refuseDelivery(id: string, reason?: string): Promise<Delivery> {
    return this.updateDeliveryStatus(id, 'refused', reason || 'Livraison refusée par le résident');
  }

  // Supprimer une livraison
  async deleteDelivery(id: string): Promise<void> {
    // Validate delivery ID using the utility function
    validateDeliveryId(id);

    try {
      const authService = AuthService;
      const headers = await authService.getAuthenticatedHeaders();

      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'DELETE',
        headers: headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          throw new Error('SESSION_EXPIRED');
        }
        throw new Error(errorData.message || 'Erreur lors de la suppression de la livraison');
      }
    } catch (error) {
      console.error('Erreur deleteDelivery:', error);
      if (error instanceof Error && error.message === 'SESSION_EXPIRED') {
        throw new Error('Votre session a expiré. Veuillez vous reconnecter.');
      }
      throw error;
    }
  }

  // Ajouter une photo à une livraison
  async addDeliveryPhoto(id: string, photo: string): Promise<Delivery> {
    // Validate delivery ID using the utility function
    validateDeliveryId(id);

    try {
      const authService = AuthService;
      const headers = await authService.getAuthenticatedHeaders();

      const response = await fetch(`${this.baseURL}/${id}/photo`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          photo,
          updatedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          throw new Error('SESSION_EXPIRED');
        }
        throw new Error(errorData.message || 'Erreur lors de l\'ajout de la photo');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur addDeliveryPhoto:', error);
      if (error instanceof Error && error.message === 'SESSION_EXPIRED') {
        throw new Error('Votre session a expiré. Veuillez vous reconnecter.');
      }
      throw error;
    }
  }
}

export const deliveryService = new DeliveryService();
