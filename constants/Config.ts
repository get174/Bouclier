/**
 * Configuration file for the application
 * Update the API_BASE_URL when changing WiFi networks
 */

// Obtenez l'adresse IP actuelle pour le développement
// Vous pouvez trouver votre IP en exécutant 'ipconfig' (Windows) ou 'ifconfig' (Mac / Linux)
// IPS de développement commun:
// - 192.168.1.xxx (WiFi à domicile)
// - 10.0.0.xxx (hotspot mobile)
// - 172.20.10.xxx (hotspot mobile)

// pour le développement - changez ceci à votre actuel IP
const DEV_IP = '192.168.1.101'; // Changez ceci à votre actuel IP

// pour la production - ce serait votre URL du serveur déployé
const PROD_URL = 'https://your-production-server.com';

// Environment detection
const isDevelopment = __DEV__;
0
export const API_BASE_URL = isDevelopment 
  ? `http://${DEV_IP}:5000`
  : PROD_URL;

// Alternative: Use a more dynamic approach
export const getApiUrl = () => {
  // For development, you can override with environment variable
  if (__DEV__) {
    // Try to get from environment variable first
    const envUrl = process.env.EXPO_PUBLIC_API_URL;
    if (envUrl) {
      return envUrl;
    }
    
    // Fallback to the configured DEV_IP
    return `http://${DEV_IP}:5000`;
  }
  
  return PROD_URL;
};

// Network configuration
export const NETWORK_CONFIG = {
  timeout: 10000, // 10 seconds
  retries: 3,
  retryDelay: 1000, // 1 second
};
