/**
 * Enhanced Forkable AI Framework Server
 *
 * Upgraded server with Gemini 2.5 nano integration, service layer architecture,
 * comprehensive monitoring, and business infrastructure foundation.
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import configuration and services
const { config } = require('./config/app-config');
const aiService = require('./services/ai-service');
const monitoringService = require('./services/monitoring-service');
const databaseService = require('./services/database-service');

// Import middleware
const { errorHandler, notFoundHandler, asyncHandler, createValidationError } = require('./middleware/error-handler');
const { createRateLimit, createAIRateLimit } = require('./middleware/rate-limit');

class ForkableAIServer {
  constructor() {
    this.app = express();
    this.server = null;
  }

  /**
   * Initialize the server
   */
  async initialize() {
    try {
      console.log('🚀 Initializing Forkable AI Framework Server...');

      // Initialize services
      await this.initializeServices();

      // Setup middleware
      this.setupMiddleware();

      // Setup routes
      this.setupRoutes();

      // Setup error handling
      this.setupErrorHandling();

      console.log('✅ Server initialization completed');
    } catch (error) {
      console.error('❌ Server initialization failed:', error.message);
      throw error;
    }
  }

  /**
   * Initialize all services
   */
  async initializeServices() {
    console.log('🔧 Initializing services...');

    // Initialize database
    await databaseService.initialize();

    console.log('📊 Services initialized successfully');
  }

  /**
   * Setup middleware
   */
  setupMiddleware() {
    console.log('⚙️ Setting up middleware...');

    // Trust proxy (important for Vercel)
    this.app.set('trust proxy', 1);

    // CORS configuration
    this.app.use(cors({
      origin: config.server.corsOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }));

    // Body parsing
    this.app.use(express.json({ limit: config.server.jsonLimit }));
    this.app.use(express.urlencoded({ extended: true, limit: config.server.jsonLimit }));

    // Add request ID for tracking
    this.app.use((req, res, next) => {
      req.id = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      res.set('X-Request-ID', req.id);
      next();
    });

    // Monitoring middleware
    this.app.use(monitoringService.trackRequest.bind(monitoringService));

    // Rate limiting
    this.app.use('/api/', createRateLimit());
    this.app.use('/api/process-image', createAIRateLimit());

    console.log('✅ Middleware setup completed');
  }

  /**
   * Setup API routes
   */
  setupRoutes() {
    console.log('🛣️ Setting up routes...');

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      const health = {
        status: 'OK',
        message: `${config.app.name} is running!`,
        version: config.app.version,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        config: {
          provider: config.ai.provider,
          model: config.ai.model,
          freeGenerations: config.business.freeGenerations
        }
      };

      res.json(health);
    });

    // Detailed health endpoint for monitoring
    this.app.get('/health/detailed', asyncHandler(async (req, res) => {
      const [aiStats, dbHealth, monitoringStats] = await Promise.all([
        aiService.getHealthStats(),
        databaseService.healthCheck(),
        Promise.resolve(monitoringService.getHealthStatus())
      ]);

      res.json({
        status: 'OK',
        services: {
          ai: aiStats,
          database: dbHealth,
          monitoring: monitoringStats
        },
        timestamp: new Date().toISOString()
      });
    }));

    // Configuration endpoint (shows current config without secrets)
    this.app.get('/api/config', (req, res) => {
      const safeConfig = {
        app: config.app,
        ai: {
          provider: config.ai.provider,
          model: config.ai.model,
          parameters: {
            temperature: config.ai.parameters.temperature,
            maxTokens: config.ai.parameters.maxTokens
          }
        },
        business: config.business,
        features: {
          freeGenerations: config.business.freeGenerations,
          tokenPrice: config.business.tokenPrice
        }
      };

      res.json(safeConfig);
    });

    // Main AI image processing endpoint
    this.app.post('/api/process-image', asyncHandler(async (req, res) => {
      const startTime = Date.now();

      // Validate request
      const { imageData, options = {} } = req.body;
      if (!imageData) {
        throw createValidationError('Missing imageData in request body');
      }

      // For MVP, we'll use anonymous user
      const userId = req.user?.id || 'anonymous';

      try {
        // Check user limits (for future authentication integration)
        if (userId !== 'anonymous') {
          const usage = await databaseService.getUserUsage(userId);
          if (usage && usage.freeGenerationsRemaining <= 0 && usage.tokenBalance <= 0) {
            throw createValidationError('No remaining free generations or tokens');
          }
        }

        // Process image with AI
        const result = await aiService.processImage(imageData, options);

        // Track generation
        const isFree = userId === 'anonymous' || true; // For MVP, all generations are free
        const cost = isFree ? 0 : config.business.tokenPrice;

        if (userId !== 'anonymous') {
          // Record in database
          await databaseService.recordGeneration({
            userId,
            prompt: config.ai.prompt,
            cost,
            isFree,
            provider: config.ai.provider,
            model: config.ai.model,
            processingTime: result.metadata.processingTime
          });

          if (isFree) {
            await databaseService.incrementFreeGenerations(userId);
          } else {
            await databaseService.updateUserTokens(userId, -cost);
          }
        }

        // Track in monitoring
        monitoringService.trackGeneration(userId, cost, isFree);
        monitoringService.trackAIProvider(true, result.metadata.processingTime, cost);

        // Return enhanced response
        const response = {
          success: true,
          description: result.description,
          metadata: {
            ...result.metadata,
            cost,
            isFree,
            remainingFreeGenerations: userId !== 'anonymous' ?
              await databaseService.getUserUsage(userId).then(u => u?.freeGenerationsRemaining) : null
          }
        };

        console.log(`✅ Image processed successfully for ${userId} in ${Date.now() - startTime}ms`);
        res.json(response);

      } catch (error) {
        // Track failed AI request
        monitoringService.trackAIProvider(false, Date.now() - startTime, 0, error);
        throw error;
      }
    }));

    // Metrics endpoint (for admin/monitoring)
    this.app.get('/api/metrics', (req, res) => {
      const metrics = monitoringService.getMetrics();
      res.json(metrics);
    });

    // User usage endpoint (for future user dashboard)
    this.app.get('/api/user/usage', asyncHandler(async (req, res) => {
      const userId = req.user?.id || 'anonymous';

      if (userId === 'anonymous') {
        return res.json({
          freeGenerationsRemaining: config.business.freeGenerations,
          tokenBalance: 0,
          totalGenerations: 0
        });
      }

      const usage = await databaseService.getUserUsage(userId);
      res.json(usage || {
        freeGenerationsRemaining: config.business.freeGenerations,
        tokenBalance: 0,
        totalGenerations: 0
      });
    }));

    console.log('✅ Routes setup completed');
  }

  /**
   * Setup error handling
   */
  setupErrorHandling() {
    console.log('🛡️ Setting up error handling...');

    // 404 handler
    this.app.use(notFoundHandler);

    // Global error handler
    this.app.use(errorHandler);

    console.log('✅ Error handling setup completed');
  }

  /**
   * Start the server
   */
  async start() {
    const port = config.server.port;

    return new Promise((resolve, reject) => {
      this.server = this.app.listen(port, (error) => {
        if (error) {
          reject(error);
        } else {
          console.log('\n🎉 Forkable AI Framework Server Started Successfully!');
          console.log('=' .repeat(60));
          console.log(`📱 App Name: ${config.app.name}`);
          console.log(`🤖 AI Provider: ${config.ai.provider} (${config.ai.model})`);
          console.log(`📝 Current Prompt: "${config.ai.prompt.substring(0, 60)}..."`);
          console.log(`🌐 Server: http://localhost:${port}`);
          console.log(`💊 Health Check: http://localhost:${port}/health`);
          console.log(`📊 Metrics: http://localhost:${port}/api/metrics`);
          console.log(`🔧 Configuration: http://localhost:${port}/api/config`);
          console.log('=' .repeat(60));
          console.log('🚀 Ready to accept requests!');
          console.log('\n🔀 TO FORK THIS APP:');
          console.log('   1. Create a new config file (see examples/coloringbook-config.js)');
          console.log('   2. Set FORK_CONFIG environment variable to your config path');
          console.log('   3. Restart the server');
          console.log('\n');

          resolve(this.server);
        }
      });

      // Handle server errors
      this.server.on('error', (error) => {
        console.error('❌ Server error:', error.message);
        reject(error);
      });
    });
  }

  /**
   * Stop the server
   */
  async stop() {
    if (this.server) {
      await new Promise((resolve) => {
        this.server.close(resolve);
      });
      console.log('🛑 Server stopped');
    }

    // Close database connection
    await databaseService.close();
  }
}

module.exports = ForkableAIServer;