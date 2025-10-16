import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../constants/Config';

interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

interface UserData {
  id: string;
  email: string;
  fullName?: string;
  buildingId?: string;
  blockId?: string;
  appartementId?: string;
  role?: string;
}

class AuthService {
  private static instance: AuthService;
  private tokenRefreshPromise: Promise<string> | null = null;

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async storeTokens(accessToken: string, refreshToken: string, expiresIn: number): Promise<void> {
    const expiresAt = Date.now() + (expiresIn * 1000);
    const tokenData: TokenData = {
      accessToken,
      refreshToken,
      expiresAt
    };
    await SecureStore.setItemAsync('authTokens', JSON.stringify(tokenData));
  }

  async getStoredTokens(): Promise<TokenData | null> {
    try {
      const tokens = await SecureStore.getItemAsync('authTokens');
      return tokens ? JSON.parse(tokens) : null;
    } catch (error) {
      console.error('Error retrieving tokens:', error);
      return null;
    }
  }

  async clearTokens(): Promise<void> {
    await SecureStore.deleteItemAsync('authTokens');
    await SecureStore.deleteItemAsync('userData');
  }

  async refreshAccessToken(): Promise<string> {
    if (this.tokenRefreshPromise) {
      return this.tokenRefreshPromise;
    }

    this.tokenRefreshPromise = this.performTokenRefresh();

    try {
      const newToken = await this.tokenRefreshPromise;
      return newToken;
    } finally {
      this.tokenRefreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<string> {
    const tokens = await this.getStoredTokens();
    if (!tokens) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: tokens.refreshToken }),
    });

    if (!response.ok) {
      await this.clearTokens();
      throw new Error('SESSION_EXPIRED');
    }

    const data = await response.json();
    await this.storeTokens(data.accessToken, data.refreshToken || tokens.refreshToken, data.expiresIn);

    return data.accessToken;
  }

  async isTokenExpired(): Promise<boolean> {
    const tokens = await this.getStoredTokens();
    if (!tokens) return true;
    return Date.now() >= tokens.expiresAt - 60000; // 1 minute buffer
  }

  async getValidAccessToken(): Promise<string | null> {
    const tokens = await this.getStoredTokens();
    if (!tokens) return null;

    if (await this.isTokenExpired()) {
      try {
        return await this.refreshAccessToken();
      } catch (error) {
        await this.clearTokens();
        return null;
      }
    }

    return tokens.accessToken;
  }

  async getAuthenticatedHeaders(): Promise<Record<string, string>> {
    const token = await this.getValidAccessToken();

    if (!token) {
      throw new Error('SESSION_EXPIRED');
    }

    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async storeUserData(userData: UserData): Promise<void> {
    await SecureStore.setItemAsync('userData', JSON.stringify(userData));
  }

  async getUserData(): Promise<UserData | null> {
    try {
      const userData = await SecureStore.getItemAsync('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  }

  async updateUserData(updates: Partial<UserData>): Promise<void> {
    const currentData = await this.getUserData();
    const updatedData: UserData = {
      id: currentData?.id || '',
      email: currentData?.email || '',
      fullName: updates.fullName ?? currentData?.fullName,
      buildingId: updates.buildingId ?? currentData?.buildingId,
      blockId: updates.blockId ?? currentData?.blockId,
      appartementId: updates.appartementId ?? currentData?.appartementId,
      role: updates.role ?? currentData?.role,
    };

    await this.storeUserData(updatedData);
  }

  async getBuildingId(): Promise<string | null> {
    const userData = await this.getUserData();
    return userData?.buildingId || null;
  }

  async setBuildingId(buildingId: string): Promise<void> {
    await this.updateUserData({ buildingId });
  }

  async getUserRole(): Promise<string | null> {
    const userData = await this.getUserData();
    return userData?.role || null;
  }

  async fetchUserProfile(): Promise<UserData | null> {
    try {
      const headers = await this.getAuthenticatedHeaders();
      const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Profile fetch failed:', response.status, errorData);
        throw new Error(`Failed to fetch user profile: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.user) {
        const userData: UserData = {
          id: data.user.id,
          email: data.user.email,
          fullName: data.user.fullName,
          buildingId: data.user.buildingId,
          blockId: data.user.blockId,
          appartementId: data.user.appartementId,
          role: data.user.role,
        };

        await this.storeUserData(userData);
        console.log('User profile fetched and stored:', userData);
        return userData;
      }

      console.error('Invalid profile response format:', data);
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }
}

export default AuthService.getInstance();
