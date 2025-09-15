// App Configuration Constants
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3001/api', // Backend API URL
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
};

export const APP_CONFIG = {
  NAME: 'Forkable AI',
  VERSION: '1.0.0',
  LAUNCH_TIME_TARGET: 3000, // 3 seconds max launch time
};

export const UI_CONFIG = {
  COLORS: {
    PRIMARY: '#007AFF', // iOS blue
    SECONDARY: '#5856D6', // iOS indigo
    SUCCESS: '#34C759', // iOS green
    WARNING: '#FF9500', // iOS orange
    ERROR: '#FF3B30', // iOS red
    BACKGROUND: '#F2F2F7', // iOS background
    CARD_BACKGROUND: '#FFFFFF',
    TEXT_PRIMARY: '#000000',
    TEXT_SECONDARY: '#8E8E93',
    BORDER: '#C6C6C8',
  },
  SPACING: {
    XS: 4,
    SM: 8,
    MD: 16,
    LG: 24,
    XL: 32,
  },
  BORDER_RADIUS: {
    SM: 8,
    MD: 12,
    LG: 16,
  },
};

export const CAMERA_CONFIG = {
  QUALITY: 0.8, // Image quality (0-1)
  MAX_WIDTH: 1920,
  MAX_HEIGHT: 1920,
  ASPECT_RATIO: [4, 3] as [number, number],
  ALLOW_EDITING: true,
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  CACHED_IMAGES: 'cached_images',
};