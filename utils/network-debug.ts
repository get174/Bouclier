/**
 * Network debugging utilities for the Bouclier app
 */

import { getApiUrl } from '../constants/Config';

export const NetworkDebugger = {
  /**
   * Test network connectivity to the API server
   */
  async testConnection(): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    try {
      const apiUrl = getApiUrl();
      console.log('Testing connection to:', apiUrl);
      
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${apiUrl}/api/buildings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        return {
          success: true,
          message: 'Connection successful',
          details: {
            status: response.status,
            url: apiUrl,
          },
        };
      } else {
        return {
          success: false,
          message: `Server returned status: ${response.status}`,
          details: {
            status: response.status,
            url: apiUrl,
          },
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Network request failed',
        details: {
          error: error.toString(),
          url: getApiUrl(),
        },
      };
    }
  },

  /**
   * Get current network configuration
   */
  getNetworkConfig() {
    return {
      apiUrl: getApiUrl(),
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Log network error with context
   */
  logNetworkError(context: string, error: any) {
    console.error(`[Network Error - ${context}]`, {
      error: error?.message || error,
      apiUrl: getApiUrl(),
      timestamp: new Date().toISOString(),
    });
  },
};
