/**
 * Rate Limiting Middleware
 *
 * Provides intelligent rate limiting for the forkable AI framework
 * with user-based limits, endpoint-specific rules, and monitoring integration.
 */

const { config } = require('../config/app-config');
const { createRateLimitError } = require('./error-handler');

class RateLimitService {
  constructor() {
    // In-memory store for rate limiting
    // In production, this would use Redis
    this.store = new Map();
    this.cleanup();
  }

  /**
   * Create rate limiting middleware
   */
  createRateLimit(options = {}) {
    const windowMs = options.windowMs || config.server.rateLimitWindow;
    const maxRequests = options.max || config.server.rateLimitMax;
    const keyGenerator = options.keyGenerator || this.defaultKeyGenerator.bind(this);

    return (req, res, next) => {
      const key = keyGenerator(req);
      const now = Date.now();
      const windowStart = now - windowMs;

      // Get or create rate limit data
      let rateData = this.store.get(key);
      if (!rateData) {
        rateData = {
          requests: [],
          resetTime: now + windowMs
        };
        this.store.set(key, rateData);
      }

      // Remove old requests outside the window
      rateData.requests = rateData.requests.filter(time => time > windowStart);

      // Check if limit exceeded
      if (rateData.requests.length >= maxRequests) {
        const retryAfter = Math.ceil((rateData.resetTime - now) / 1000);

        // Set rate limit headers
        res.set({
          'X-RateLimit-Limit': maxRequests,
          'X-RateLimit-Remaining': 0,
          'X-RateLimit-Reset': Math.ceil(rateData.resetTime / 1000),
          'Retry-After': retryAfter
        });

        console.warn(`⚠️ Rate limit exceeded for ${key}:`, {
          requests: rateData.requests.length,
          limit: maxRequests,
          resetTime: new Date(rateData.resetTime).toISOString()
        });

        return next(createRateLimitError(`Rate limit exceeded. Try again in ${retryAfter} seconds.`));
      }

      // Add current request
      rateData.requests.push(now);

      // Set rate limit headers
      res.set({
        'X-RateLimit-Limit': maxRequests,
        'X-RateLimit-Remaining': maxRequests - rateData.requests.length,
        'X-RateLimit-Reset': Math.ceil(rateData.resetTime / 1000)
      });

      next();
    };
  }

  /**
   * AI generation rate limiting (stricter limits)
   */
  createAIRateLimit() {
    return this.createRateLimit({
      windowMs: 60 * 1000, // 1 minute
      max: 10, // 10 requests per minute
      keyGenerator: (req) => {
        const userId = this.getUserId(req);
        return `ai_${userId}`;
      }
    });
  }

  /**
   * User-specific rate limiting
   */
  createUserRateLimit(maxRequests = 100) {
    return this.createRateLimit({
      max: maxRequests,
      keyGenerator: (req) => {
        const userId = this.getUserId(req);
        return `user_${userId}`;
      }
    });
  }

  /**
   * IP-based rate limiting (for anonymous users)
   */
  createIPRateLimit(maxRequests = 50) {
    return this.createRateLimit({
      max: maxRequests,
      keyGenerator: (req) => {
        const ip = this.getClientIP(req);
        return `ip_${ip}`;
      }
    });
  }

  /**
   * Default key generator
   */
  defaultKeyGenerator(req) {
    const userId = this.getUserId(req);
    const ip = this.getClientIP(req);
    return userId !== 'anonymous' ? `user_${userId}` : `ip_${ip}`;
  }

  /**
   * Get user ID from request
   * Handles both Clerk authentication (getUserId method) and simple user objects (id property)
   */
  getUserId(req) {
    if (!req.user) {
      return 'anonymous';
    }

    // Handle Clerk authentication (getUserId method)
    if (typeof req.user.getUserId === 'function') {
      try {
        return req.user.getUserId();
      } catch (error) {
        console.warn('⚠️ Error getting user ID from getUserId():', error.message);
        return 'anonymous';
      }
    }

    // Handle simple user object (id property)
    return req.user.id || 'anonymous';
  }

  /**
   * Get client IP address
   * Handles various proxy configurations including Vercel's setup
   */
  getClientIP(req) {
    // First try standard Express IP (works with trust proxy)
    if (req.ip && req.ip !== '::1' && req.ip !== '127.0.0.1') {
      return req.ip;
    }

    // Try various forwarded header formats
    const forwarded = req.get('x-forwarded-for') ||
                     req.get('x-real-ip') ||
                     req.get('cf-connecting-ip'); // Cloudflare

    if (forwarded) {
      // x-forwarded-for can be a comma-separated list, take the first one
      const firstIP = forwarded.split(',')[0].trim();
      if (firstIP && firstIP !== '::1' && firstIP !== '127.0.0.1') {
        return firstIP;
      }
    }

    // Fallback to connection-based IP
    const connectionIP = req.connection?.remoteAddress ||
                        req.socket?.remoteAddress ||
                        req.connection?.socket?.remoteAddress;

    if (connectionIP && connectionIP !== '::1' && connectionIP !== '127.0.0.1') {
      return connectionIP;
    }

    // Last resort
    return 'unknown';
  }

  /**
   * Get rate limit status for a key
   */
  getStatus(key) {
    const rateData = this.store.get(key);
    if (!rateData) {
      return {
        requests: 0,
        remaining: config.server.rateLimitMax,
        resetTime: Date.now() + config.server.rateLimitWindow
      };
    }

    const now = Date.now();
    const windowStart = now - config.server.rateLimitWindow;
    const validRequests = rateData.requests.filter(time => time > windowStart);

    return {
      requests: validRequests.length,
      remaining: Math.max(0, config.server.rateLimitMax - validRequests.length),
      resetTime: rateData.resetTime
    };
  }

  /**
   * Clear rate limit for a key
   */
  clearLimit(key) {
    this.store.delete(key);
  }

  /**
   * Get all rate limit stats (for monitoring)
   */
  getStats() {
    const stats = {
      totalKeys: this.store.size,
      keysByType: {
        user: 0,
        ip: 0,
        ai: 0,
        other: 0
      },
      topUsers: [],
      timestamp: new Date().toISOString()
    };

    // Analyze keys
    for (const [key, data] of this.store.entries()) {
      if (key.startsWith('user_')) {
        stats.keysByType.user++;
      } else if (key.startsWith('ip_')) {
        stats.keysByType.ip++;
      } else if (key.startsWith('ai_')) {
        stats.keysByType.ai++;
      } else {
        stats.keysByType.other++;
      }

      // Track top users by request count
      const requestCount = data.requests.length;
      stats.topUsers.push({ key, requests: requestCount });
    }

    // Sort top users
    stats.topUsers.sort((a, b) => b.requests - a.requests);
    stats.topUsers = stats.topUsers.slice(0, 10); // Top 10

    return stats;
  }

  /**
   * Clean up expired entries
   */
  cleanup() {
    setInterval(() => {
      const now = Date.now();
      const keysToDelete = [];

      for (const [key, data] of this.store.entries()) {
        // Remove entries that are completely expired
        if (data.resetTime < now) {
          keysToDelete.push(key);
        }
      }

      keysToDelete.forEach(key => this.store.delete(key));

      if (keysToDelete.length > 0) {
        console.log(`🧹 Cleaned up ${keysToDelete.length} expired rate limit entries`);
      }
    }, 60000); // Clean up every minute
  }
}

// Create singleton instance
const rateLimitService = new RateLimitService();

module.exports = {
  rateLimitService,
  createRateLimit: (options) => rateLimitService.createRateLimit(options),
  createAIRateLimit: () => rateLimitService.createAIRateLimit(),
  createUserRateLimit: (max) => rateLimitService.createUserRateLimit(max),
  createIPRateLimit: (max) => rateLimitService.createIPRateLimit(max)
};