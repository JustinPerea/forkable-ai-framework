const Redis = require('ioredis');
require('dotenv').config();

// Redis/KV Cache Configuration
class CacheManager {
  constructor() {
    // Use Vercel KV configuration or fallback to Redis
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      // Vercel KV configuration
      this.useVercelKV = true;
      this.kvUrl = process.env.KV_REST_API_URL;
      this.kvToken = process.env.KV_REST_API_TOKEN;
      console.log('Using Vercel KV for caching');
    } else if (process.env.REDIS_URL) {
      // Redis configuration
      this.redis = new Redis(process.env.REDIS_URL);
      this.useVercelKV = false;
      console.log('Using Redis for caching');

      this.redis.on('error', (err) => {
        console.error('Redis connection error:', err);
      });

      this.redis.on('connect', () => {
        console.log('Connected to Redis');
      });
    } else {
      // In-memory fallback for development
      this.memoryCache = new Map();
      this.useMemory = true;
      console.log('Using in-memory cache (development only)');
    }

    // Default TTL (Time To Live) in seconds
    this.defaultTTL = 3600; // 1 hour
  }

  // Set cache value
  async set(key, value, ttl = this.defaultTTL) {
    try {
      if (this.useVercelKV) {
        return await this.setVercelKV(key, value, ttl);
      } else if (this.redis) {
        if (ttl > 0) {
          return await this.redis.setex(key, ttl, JSON.stringify(value));
        } else {
          return await this.redis.set(key, JSON.stringify(value));
        }
      } else if (this.useMemory) {
        this.memoryCache.set(key, { value, expiry: Date.now() + (ttl * 1000) });
        return 'OK';
      }
    } catch (error) {
      console.error('Cache set error:', error);
      return null;
    }
  }

  // Get cache value
  async get(key) {
    try {
      if (this.useVercelKV) {
        return await this.getVercelKV(key);
      } else if (this.redis) {
        const value = await this.redis.get(key);
        return value ? JSON.parse(value) : null;
      } else if (this.useMemory) {
        const cached = this.memoryCache.get(key);
        if (cached && cached.expiry > Date.now()) {
          return cached.value;
        } else if (cached) {
          this.memoryCache.delete(key);
        }
        return null;
      }
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  // Delete cache value
  async del(key) {
    try {
      if (this.useVercelKV) {
        return await this.deleteVercelKV(key);
      } else if (this.redis) {
        return await this.redis.del(key);
      } else if (this.useMemory) {
        return this.memoryCache.delete(key);
      }
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  // Check if key exists
  async exists(key) {
    try {
      if (this.useVercelKV) {
        const value = await this.getVercelKV(key);
        return value !== null;
      } else if (this.redis) {
        return await this.redis.exists(key) === 1;
      } else if (this.useMemory) {
        const cached = this.memoryCache.get(key);
        return cached && cached.expiry > Date.now();
      }
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  // Increment counter (for rate limiting)
  async incr(key, ttl = this.defaultTTL) {
    try {
      if (this.useVercelKV) {
        return await this.incrVercelKV(key, ttl);
      } else if (this.redis) {
        const count = await this.redis.incr(key);
        if (count === 1) {
          await this.redis.expire(key, ttl);
        }
        return count;
      } else if (this.useMemory) {
        const cached = this.memoryCache.get(key);
        if (cached && cached.expiry > Date.now()) {
          cached.value += 1;
          return cached.value;
        } else {
          this.memoryCache.set(key, { value: 1, expiry: Date.now() + (ttl * 1000) });
          return 1;
        }
      }
    } catch (error) {
      console.error('Cache increment error:', error);
      return 0;
    }
  }

  // Vercel KV REST API methods
  async setVercelKV(key, value, ttl) {
    const response = await fetch(`${this.kvUrl}/set/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.kvToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ value: JSON.stringify(value), ex: ttl })
    });

    if (!response.ok) {
      throw new Error(`KV set failed: ${response.statusText}`);
    }

    return await response.text();
  }

  async getVercelKV(key) {
    const response = await fetch(`${this.kvUrl}/get/${encodeURIComponent(key)}`, {
      headers: {
        'Authorization': `Bearer ${this.kvToken}`
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`KV get failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result ? JSON.parse(result) : null;
  }

  async deleteVercelKV(key) {
    const response = await fetch(`${this.kvUrl}/del/${encodeURIComponent(key)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.kvToken}`
      }
    });

    return response.ok;
  }

  async incrVercelKV(key, ttl) {
    const response = await fetch(`${this.kvUrl}/incr/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.kvToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ex: ttl })
    });

    if (!response.ok) {
      throw new Error(`KV incr failed: ${response.statusText}`);
    }

    return await response.json();
  }

  // User session management
  async setUserSession(sessionId, userData, ttl = 86400) { // 24 hours
    return await this.set(`session:${sessionId}`, userData, ttl);
  }

  async getUserSession(sessionId) {
    return await this.get(`session:${sessionId}`);
  }

  async deleteUserSession(sessionId) {
    return await this.del(`session:${sessionId}`);
  }

  // Rate limiting helpers
  async getRateLimitCount(identifier) {
    return await this.get(`rate_limit:${identifier}`) || 0;
  }

  async incrementRateLimit(identifier, windowMs = 900000) { // 15 minutes
    return await this.incr(`rate_limit:${identifier}`, Math.floor(windowMs / 1000));
  }

  // Cache health check
  async healthCheck() {
    try {
      const testKey = 'health_check_test';
      const testValue = { timestamp: Date.now() };

      await this.set(testKey, testValue, 60);
      const retrieved = await this.get(testKey);
      await this.del(testKey);

      return {
        status: 'healthy',
        cache_type: this.useVercelKV ? 'vercel_kv' : (this.redis ? 'redis' : 'memory'),
        test_passed: retrieved && retrieved.timestamp === testValue.timestamp
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }

  // Cleanup and close connections
  async close() {
    if (this.redis) {
      await this.redis.quit();
    }
    if (this.useMemory) {
      this.memoryCache.clear();
    }
  }
}

// Export singleton instance
const cache = new CacheManager();

module.exports = {
  cache,
  CacheManager
};