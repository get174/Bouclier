import { API_BASE_URL } from '../constants/Config';
import authService from './authService';

interface LocationInfo {
  blockName?: string;
  apartmentName?: string;
  apartmentNumber?: string;
}

class LocationService {
  private static instance: LocationService;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.CACHE_DURATION;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async getBlockName(blockId: string): Promise<string | null> {
    if (!blockId) return null;

    const cacheKey = `block_${blockId}`;
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey)?.data?.name || null;
    }

    try {
      const headers = await authService.getAuthenticatedHeaders();
      const response = await fetch(`${API_BASE_URL}/api/blocks/${blockId}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        console.error('Failed to fetch block data:', response.status);
        return null;
      }

      const data = await response.json();

      if (data.success && data.block) {
        const blockName = data.block.name;
        this.setCache(cacheKey, data.block);
        return blockName;
      }

      return null;
    } catch (error) {
      console.error('Error fetching block name:', error);
      return null;
    }
  }

  async getApartmentInfo(apartmentId: string): Promise<{ name?: string; number?: string } | null> {
    if (!apartmentId) return null;

    const cacheKey = `apartment_${apartmentId}`;
    if (this.isCacheValid(cacheKey)) {
      const cached = this.cache.get(cacheKey)?.data;
      return {
        name: cached?.name,
        number: cached?.number
      };
    }

    try {
      const headers = await authService.getAuthenticatedHeaders();
      const response = await fetch(`${API_BASE_URL}/api/apartments/${apartmentId}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        console.error('Failed to fetch apartment data:', response.status);
        return null;
      }

      const data = await response.json();

      if (data.success && data.apartment) {
        const apartmentInfo = {
          name: data.apartment.name,
          number: data.apartment.number
        };
        this.setCache(cacheKey, data.apartment);
        return apartmentInfo;
      }

      return null;
    } catch (error) {
      console.error('Error fetching apartment info:', error);
      return null;
    }
  }

  async getLocationInfo(userData: {
    blockId?: string;
    appartementId?: string;
  }): Promise<LocationInfo> {
    const locationInfo: LocationInfo = {};

    // Fetch block name
    if (userData.blockId) {
      const blockName = await this.getBlockName(userData.blockId);
      if (blockName) {
        locationInfo.blockName = blockName;
      }
    }

    // Fetch apartment info
    if (userData.appartementId) {
      const apartmentInfo = await this.getApartmentInfo(userData.appartementId);
      if (apartmentInfo) {
        if (apartmentInfo.name) {
          locationInfo.apartmentName = apartmentInfo.name;
        }
        if (apartmentInfo.number) {
          locationInfo.apartmentNumber = apartmentInfo.number;
        }
      }
    }

    return locationInfo;
  }

  // Clear cache when needed (e.g., after profile update)
  clearCache(): void {
    this.cache.clear();
  }
}

export default LocationService.getInstance();
