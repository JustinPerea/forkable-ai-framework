/**
 * Forkable AI Framework - Configuration Management System
 *
 * This is the heart of the forkable system - the SINGLE configuration file
 * that defines all app behavior. Change this file to create a new app!
 */

const path = require('path');

// Default base configuration (can be overridden by fork-specific configs)
const baseConfig = {
  // App Identity
  app: {
    name: "Forkable AI Framework",
    version: "1.0.0",
    description: "Base forkable AI application framework"
  },

  // AI Configuration - CORE FORKABLE FEATURE
  ai: {
    provider: "gemini",
    model: "gemini-2.5-flash", // Updated to latest Gemini 2.5 model
    prompt: "Analyze this image and describe how it would look as a high-contrast, black and white pencil sketch with detailed shading. Provide a detailed description of the sketch version.",
    parameters: {
      temperature: 0.7,
      maxTokens: 1000,
      topP: 0.9,
      timeout: 30000, // 30 seconds
      retryAttempts: 3,
      retryDelay: 1000 // 1 second
    },
    imageSettings: {
      maxWidth: 1024,
      maxHeight: 1024,
      maxFileSize: 10485760, // 10MB
      allowedFormats: ['image/jpeg', 'image/png', 'image/webp']
    }
  },

  // Business Configuration
  business: {
    freeGenerations: 3,
    tokenPrice: 0.10, // $0.10 per generation
    minDeposit: 5.00, // $5.00 minimum deposit
    currency: "USD"
  },

  // Server Configuration
  server: {
    port: process.env.PORT || 3001,
    corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3000'],
    jsonLimit: '10mb',
    rateLimitWindow: 15 * 60 * 1000, // 15 minutes
    rateLimitMax: 100 // requests per window
  },

  // Database Configuration
  database: {
    provider: "vercel-postgres",
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production',
    pool: {
      min: 2,
      max: 10,
      idleTimeoutMillis: 30000
    }
  },

  // Authentication Configuration
  auth: {
    provider: "clerk",
    apiKey: process.env.CLERK_API_KEY,
    jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret-change-this',
    sessionDuration: '7d',
    refreshDuration: '30d'
  },

  // Payment Configuration
  payments: {
    provider: "polar",
    apiKey: process.env.POLAR_API_KEY,
    webhookSecret: process.env.POLAR_WEBHOOK_SECRET,
    currency: "USD"
  },

  // Monitoring Configuration
  monitoring: {
    logLevel: process.env.LOG_LEVEL || 'info',
    enableMetrics: true,
    enableErrorTracking: true,
    performanceThresholds: {
      apiResponseTime: 2000, // 2 seconds
      geminiResponseTime: 10000, // 10 seconds
      databaseQueryTime: 100 // 100ms
    }
  },

  // Security Configuration
  security: {
    encryption: {
      algorithm: 'aes-256-gcm',
      key: process.env.ENCRYPTION_KEY
    },
    apiKeys: {
      gemini: process.env.GEMINI_API_KEY
    }
  }
};

/**
 * Load configuration from environment-specific file or use base config
 * This enables the forkable pattern: different configs = different apps
 */
function loadConfig() {
  // Check for fork-specific configuration
  const forkConfigPath = process.env.FORK_CONFIG || null;

  if (forkConfigPath) {
    try {
      const forkConfig = require(path.resolve(forkConfigPath));
      console.log(`🔧 Loading fork configuration from: ${forkConfigPath}`);
      return mergeConfigs(baseConfig, forkConfig);
    } catch (error) {
      console.warn(`⚠️  Failed to load fork config from ${forkConfigPath}:`, error.message);
      console.log('📝 Falling back to base configuration');
    }
  }

  return baseConfig;
}

/**
 * Deep merge configuration objects
 */
function mergeConfigs(base, override) {
  const merged = { ...base };

  for (const key in override) {
    if (override[key] && typeof override[key] === 'object' && !Array.isArray(override[key])) {
      merged[key] = mergeConfigs(merged[key] || {}, override[key]);
    } else {
      merged[key] = override[key];
    }
  }

  return merged;
}

/**
 * Validate configuration
 */
function validateConfig(config) {
  const errors = [];

  // Validate required fields
  if (!config.security?.apiKeys?.gemini) {
    errors.push('GEMINI_API_KEY is required');
  }

  if (!config.ai?.prompt) {
    errors.push('AI prompt is required');
  }

  if (config.business?.tokenPrice <= 0) {
    errors.push('Token price must be greater than 0');
  }

  if (config.business?.minDeposit <= 0) {
    errors.push('Minimum deposit must be greater than 0');
  }

  // Validate AI parameters
  if (config.ai?.parameters?.temperature < 0 || config.ai?.parameters?.temperature > 1) {
    errors.push('AI temperature must be between 0 and 1');
  }

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
  }

  return true;
}

// Load and validate configuration
const config = loadConfig();
validateConfig(config);

// Export configuration and utilities
module.exports = {
  config,
  loadConfig,
  validateConfig,
  mergeConfigs
};