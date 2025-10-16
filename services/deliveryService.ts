import { getApiUrl } from '../constants/Config';
import AuthService from './authService';
import * as FileSystem from 'expo-file-system';
import { manipulateAsync, SaveFormat, ActionResize } from 'expo-image-manipulator';

export interface Delivery {
  _id: string; // Changed from id to _id to match MongoDB
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
  _id: string; // Changed from id to _id
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
  photo?: string; // This will be a base64 string
}

// Utility function to validate MongoDB ObjectId format
export function isValidObjectId(id: string): boolean {
  if (!id || typeof id !== 'string') {
    return false;
  }
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
  private authService = AuthService;

  private async convertImageToBase64(uri: string): Promise<string | null> {
    try {
      const manipResult = await manipulateAsync(
        uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: SaveFormat.JPEG }
      );

      const base64 = await FileSystem.readAsStringAsync(manipResult.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.error("Erreur lors de la compression ou conversion de l'image:", error);
      return null;
    }
  }

  // Récupérer toutes les livraisons d'un résident
  async getDeliveries(): Promise<Delivery[]> {
    try {
      const headers = await this.authService.getAuthenticatedHeaders();
      const response = await fetch(this.baseURL, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) throw new Error('SESSION_EXPIRED');
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

  // Récupérer une livraison par ID
  async getDeliveryById(id: string): Promise<Delivery> {
    validateDeliveryId(id);
    try {
      const headers = await this.authService.getAuthenticatedHeaders();
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) throw new Error('SESSION_EXPIRED');
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
  async createDelivery(data: CreateDeliveryData): Promise<Delivery> {
    try {
      const headers = await this.authService.getAuthenticatedHeaders();
      let userData = await this.authService.getUserData();

      // If user data is missing, try to fetch it from the server
      if (!userData || !userData.buildingId || !userData.appartementId) {
        console.log('User data missing, attempting to fetch from server...');
        userData = await this.authService.fetchUserProfile();

        if (!userData || !userData.buildingId || !userData.appartementId) {
          throw new Error("Les informations de l'utilisateur (bâtiment, appartement) sont manquantes. Veuillez vous reconnecter ou contacter le support.");
        }
      }

      let photoBase64: string | undefined = undefined;
      if (data.photo) {
          const base64 = await this.convertImageToBase64(data.photo);
          if(base64) {
            photoBase64 = base64;
          }
      }

      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          photo: photoBase64, // Send base64 string
          buildingId: userData.buildingId,
          apartmentId: userData.appartementId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) throw new Error('SESSION_EXPIRED');
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
  async updateDeliveryStatus(id: string, status: 'delivered' | 'refused', reason?: string): Promise<Delivery> {
    validateDeliveryId(id);
    const endpoint = status === 'delivered' ? 'confirm' : 'refuse';
    
    try {
      const headers = await this.authService.getAuthenticatedHeaders();
      const response = await fetch(`${this.baseURL}/${id}/${endpoint}`, {
        method: 'PATCH',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) throw new Error('SESSION_EXPIRED');
        throw new Error(errorData.message || 'Erreur lors de la mise à jour de la livraison');
      }
      return (await response.json()).delivery;
    } catch (error) {
      console.error('Erreur updateDeliveryStatus:', error);
      if (error instanceof Error && error.message === 'SESSION_EXPIRED') {
        throw new Error('Votre session a expiré. Veuillez vous reconnecter.');
      }
      throw error;
    }
  }
}

export const deliveryService = new DeliveryService();