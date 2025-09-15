/**
 * Database Service - Vercel Postgres Integration
 *
 * Provides database connectivity, user management, and usage tracking
 * for the forkable AI framework.
 */

const { config } = require('../config/app-config');

class DatabaseService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.connectionRetries = 0;
    this.maxRetries = 5;
  }

  /**
   * Initialize database connection
   */
  async initialize() {
    try {
      // For now, we'll use a simple in-memory store
      // In production, this would connect to Vercel Postgres
      console.log('🗄️ Initializing database connection...');

      if (config.database.connectionString) {
        // TODO: Implement actual Vercel Postgres connection
        console.log('📊 Database connection string found, connecting to Postgres...');
        // this.client = new Pool(config.database);
        // await this.client.connect();
      }

      // Initialize in-memory storage for MVP
      this.initializeInMemoryStore();

      this.isConnected = true;
      console.log('✅ Database initialized successfully');

    } catch (error) {
      console.error('❌ Database initialization failed:', error.message);
      throw error;
    }
  }

  /**
   * Initialize in-memory store (for MVP development)
   */
  initializeInMemoryStore() {
    this.store = {
      users: new Map(),
      usage: new Map(),
      generations: []
    };

    // Create indexes for common queries
    this.indexes = {
      usersByEmail: new Map(),
      generationsByUser: new Map()
    };

    console.log('💾 Using in-memory store for MVP development');
  }

  /**
   * Create or update user
   */
  async upsertUser(userData) {
    try {
      const userId = userData.id || this.generateId();
      const timestamp = new Date().toISOString();

      const user = {
        id: userId,
        email: userData.email,
        name: userData.name || '',
        createdAt: userData.createdAt || timestamp,
        updatedAt: timestamp,
        freeGenerationsUsed: userData.freeGenerationsUsed || 0,
        tokenBalance: userData.tokenBalance || 0,
        subscriptionTier: userData.subscriptionTier || 'free',
        isActive: userData.isActive !== undefined ? userData.isActive : true
      };

      // Store user
      this.store.users.set(userId, user);

      // Update indexes
      this.indexes.usersByEmail.set(userData.email, userId);

      console.log(`👤 User ${userData.email} upserted successfully`);
      return user;

    } catch (error) {
      console.error('Error upserting user:', error.message);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    try {
      const user = this.store.users.get(userId);
      return user || null;
    } catch (error) {
      console.error('Error getting user by ID:', error.message);
      throw error;
    }
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email) {
    try {
      const userId = this.indexes.usersByEmail.get(email);
      if (!userId) return null;

      return this.store.users.get(userId);
    } catch (error) {
      console.error('Error getting user by email:', error.message);
      throw error;
    }
  }

  /**
   * Update user token balance
   */
  async updateUserTokens(userId, tokenChange) {
    try {
      const user = this.store.users.get(userId);
      if (!user) {
        throw new Error('User not found');
      }

      user.tokenBalance += tokenChange;
      user.updatedAt = new Date().toISOString();

      this.store.users.set(userId, user);

      console.log(`💰 User ${userId} token balance updated: ${tokenChange > 0 ? '+' : ''}${tokenChange}`);
      return user;

    } catch (error) {
      console.error('Error updating user tokens:', error.message);
      throw error;
    }
  }

  /**
   * Increment user free generations
   */
  async incrementFreeGenerations(userId) {
    try {
      const user = this.store.users.get(userId);
      if (!user) {
        throw new Error('User not found');
      }

      user.freeGenerationsUsed++;
      user.updatedAt = new Date().toISOString();

      this.store.users.set(userId, user);

      console.log(`🆓 User ${userId} free generations used: ${user.freeGenerationsUsed}/${config.business.freeGenerations}`);
      return user;

    } catch (error) {
      console.error('Error incrementing free generations:', error.message);
      throw error;
    }
  }

  /**
   * Record generation
   */
  async recordGeneration(generationData) {
    try {
      const generation = {
        id: this.generateId(),
        userId: generationData.userId,
        prompt: generationData.prompt,
        cost: generationData.cost || 0,
        isFree: generationData.isFree || false,
        provider: generationData.provider || config.ai.provider,
        model: generationData.model || config.ai.model,
        processingTime: generationData.processingTime,
        status: generationData.status || 'completed',
        createdAt: new Date().toISOString()
      };

      // Store generation
      this.store.generations.push(generation);

      // Update user index
      if (!this.indexes.generationsByUser.has(generationData.userId)) {
        this.indexes.generationsByUser.set(generationData.userId, []);
      }
      this.indexes.generationsByUser.get(generationData.userId).push(generation.id);

      // Store usage record
      const usageId = this.generateId();
      this.store.usage.set(usageId, {
        id: usageId,
        userId: generationData.userId,
        type: 'generation',
        cost: generation.cost,
        metadata: generation,
        createdAt: generation.createdAt
      });

      console.log(`📝 Generation recorded for user ${generationData.userId}`);
      return generation;

    } catch (error) {
      console.error('Error recording generation:', error.message);
      throw error;
    }
  }

  /**
   * Get user generations
   */
  async getUserGenerations(userId, limit = 50, offset = 0) {
    try {
      const generationIds = this.indexes.generationsByUser.get(userId) || [];
      const generations = generationIds
        .slice(offset, offset + limit)
        .map(id => this.store.generations.find(g => g.id === id))
        .filter(Boolean)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return generations;
    } catch (error) {
      console.error('Error getting user generations:', error.message);
      throw error;
    }
  }

  /**
   * Get user usage summary
   */
  async getUserUsage(userId) {
    try {
      const user = await this.getUserById(userId);
      if (!user) return null;

      const generations = await this.getUserGenerations(userId);
      const totalGenerations = generations.length;
      const freeGenerationsRemaining = Math.max(0, config.business.freeGenerations - user.freeGenerationsUsed);
      const totalCost = generations.reduce((sum, gen) => sum + gen.cost, 0);

      return {
        userId,
        totalGenerations,
        freeGenerationsUsed: user.freeGenerationsUsed,
        freeGenerationsRemaining,
        tokenBalance: user.tokenBalance,
        totalCost,
        subscriptionTier: user.subscriptionTier,
        recentGenerations: generations.slice(0, 10) // Last 10 generations
      };
    } catch (error) {
      console.error('Error getting user usage:', error.message);
      throw error;
    }
  }

  /**
   * Get all users (for admin)
   */
  async getAllUsers(limit = 100, offset = 0) {
    try {
      const allUsers = Array.from(this.store.users.values())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(offset, offset + limit);

      return allUsers;
    } catch (error) {
      console.error('Error getting all users:', error.message);
      throw error;
    }
  }

  /**
   * Get database statistics
   */
  async getStats() {
    try {
      const userCount = this.store.users.size;
      const generationCount = this.store.generations.length;
      const totalRevenue = Array.from(this.store.usage.values())
        .filter(usage => usage.type === 'generation' && !usage.metadata.isFree)
        .reduce((sum, usage) => sum + usage.cost, 0);

      const activeUsers = Array.from(this.store.users.values())
        .filter(user => user.isActive).length;

      return {
        userCount,
        activeUsers,
        generationCount,
        totalRevenue,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting database stats:', error.message);
      throw error;
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      // For in-memory store, just check if it's initialized
      const isHealthy = this.isConnected && this.store !== null;

      return {
        status: isHealthy ? 'healthy' : 'unhealthy',
        connection: this.isConnected,
        storeInitialized: this.store !== null,
        userCount: this.store?.users?.size || 0,
        generationCount: this.store?.generations?.length || 0,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Database health check failed:', error.message);
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Close database connection
   */
  async close() {
    if (this.client) {
      await this.client.end();
    }
    this.isConnected = false;
    console.log('🔌 Database connection closed');
  }
}

module.exports = new DatabaseService();