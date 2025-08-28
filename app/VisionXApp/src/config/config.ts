// Configuration file for the VisionX mobile app
export const config = {
  // Backend API configuration
  api: {
    // Production API URL
    baseUrl: 'https://unicred-portal-api.debarghaya.in/api',
    
    // Timeout for API requests (in milliseconds)
    timeout: 10000,
    
    // Retry configuration
    retries: 3,
    retryDelay: 1000,
  },
  
  // App configuration
  app: {
    name: 'UniCred',
    version: '1.0.0',
    
    // Feature flags
    features: {
      biometricAuth: false,
      pushNotifications: false,
      offlineMode: false,
    },
  },
  
  // Development configuration
  development: {
    // Enable mock data fallback when API fails
    enableMockFallback: false,
    
    // Log API requests and responses
    logApiCalls: __DEV__,
    
    // Show development warnings
    showDevWarnings: __DEV__,
  },
};

// Helper function to get API URL
export const getApiUrl = (endpoint: string): string => {
  return `${config.api.baseUrl}${endpoint}`;
};

// Helper function to check if running in development
export const isDevelopment = (): boolean => {
  return __DEV__;
};
