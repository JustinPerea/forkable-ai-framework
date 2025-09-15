/**
 * Monitoring Service - Usage Tracking and Performance Monitoring
 *
 * Provides comprehensive monitoring for API usage, performance metrics,
 * and business analytics for the forkable AI framework.
 */

const { config } = require('../config/app-config');

class MonitoringService {
  constructor() {
    this.metrics = {
      // Request metrics
      requests: {
        total: 0,
        successful: 0,
        failed: 0,
        byEndpoint: {},
        byUser: {}
      },

      // Performance metrics
      performance: {
        responseTimeSum: 0,
        responseTimeCount: 0,
        averageResponseTime: 0,
        slowRequests: [],
        errors: []
      },

      // Business metrics
      business: {
        totalGenerations: 0,
        freeGenerations: 0,
        paidGenerations: 0,
        revenue: 0,
        activeUsers: new Set()
      },

      // AI provider metrics
      aiProvider: {
        requests: 0,
        successful: 0,
        failed: 0,
        totalCost: 0,
        averageResponseTime: 0
      }
    };

    // Store recent activity for analytics
    this.recentActivity = [];
    this.maxActivityHistory = 1000;

    this.startTime = Date.now();
  }

  /**
   * Track API request
   */
  trackRequest(req, res, next) {
    const startTime = Date.now();
    const endpoint = req.path;
    const userId = req.user?.id || 'anonymous';

    // Increment request counters
    this.metrics.requests.total++;

    // Track by endpoint
    if (!this.metrics.requests.byEndpoint[endpoint]) {
      this.metrics.requests.byEndpoint[endpoint] = { count: 0, success: 0, failed: 0 };
    }
    this.metrics.requests.byEndpoint[endpoint].count++;

    // Track by user
    if (!this.metrics.requests.byUser[userId]) {
      this.metrics.requests.byUser[userId] = { count: 0, success: 0, failed: 0 };
    }
    this.metrics.requests.byUser[userId].count++;

    // Add to active users
    if (userId !== 'anonymous') {
      this.metrics.business.activeUsers.add(userId);
    }

    // Capture original end method
    const originalEnd = res.end;

    // Override end method to capture response
    res.end = (...args) => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      const statusCode = res.statusCode;

      // Track response time
      this.updateResponseTime(responseTime);

      // Track success/failure
      const isSuccess = statusCode >= 200 && statusCode < 400;
      if (isSuccess) {
        this.metrics.requests.successful++;
        this.metrics.requests.byEndpoint[endpoint].success++;
        this.metrics.requests.byUser[userId].success++;
      } else {
        this.metrics.requests.failed++;
        this.metrics.requests.byEndpoint[endpoint].failed++;
        this.metrics.requests.byUser[userId].failed++;

        // Track error
        this.trackError({
          endpoint,
          statusCode,
          userId,
          responseTime,
          timestamp: new Date().toISOString()
        });
      }

      // Track slow requests
      if (responseTime > config.monitoring.performanceThresholds.apiResponseTime) {
        this.trackSlowRequest({
          endpoint,
          responseTime,
          userId,
          timestamp: new Date().toISOString()
        });
      }

      // Add to recent activity
      this.addToRecentActivity({
        type: 'request',
        endpoint,
        statusCode,
        responseTime,
        userId,
        timestamp: new Date().toISOString()
      });

      // Call original end method
      originalEnd.apply(res, args);
    };

    next();
  }

  /**
   * Track AI generation
   */
  trackGeneration(userId, cost, isFree = false) {
    this.metrics.business.totalGenerations++;

    if (isFree) {
      this.metrics.business.freeGenerations++;
    } else {
      this.metrics.business.paidGenerations++;
      this.metrics.business.revenue += cost;
    }

    // Add to recent activity
    this.addToRecentActivity({
      type: 'generation',
      userId,
      cost,
      isFree,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track AI provider metrics
   */
  trackAIProvider(success, responseTime, cost, error = null) {
    this.metrics.aiProvider.requests++;

    if (success) {
      this.metrics.aiProvider.successful++;
    } else {
      this.metrics.aiProvider.failed++;

      // Track AI provider error
      if (error) {
        this.trackError({
          type: 'ai_provider',
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }

    this.metrics.aiProvider.totalCost += cost || 0;

    // Update average response time
    const totalTime = (this.metrics.aiProvider.averageResponseTime * (this.metrics.aiProvider.requests - 1)) + responseTime;
    this.metrics.aiProvider.averageResponseTime = totalTime / this.metrics.aiProvider.requests;
  }

  /**
   * Update response time metrics
   */
  updateResponseTime(responseTime) {
    this.metrics.performance.responseTimeSum += responseTime;
    this.metrics.performance.responseTimeCount++;
    this.metrics.performance.averageResponseTime =
      this.metrics.performance.responseTimeSum / this.metrics.performance.responseTimeCount;
  }

  /**
   * Track error
   */
  trackError(errorInfo) {
    this.metrics.performance.errors.push({
      ...errorInfo,
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });

    // Keep only recent errors (last 100)
    if (this.metrics.performance.errors.length > 100) {
      this.metrics.performance.errors = this.metrics.performance.errors.slice(-100);
    }
  }

  /**
   * Track slow request
   */
  trackSlowRequest(requestInfo) {
    this.metrics.performance.slowRequests.push({
      ...requestInfo,
      id: `slow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });

    // Keep only recent slow requests (last 50)
    if (this.metrics.performance.slowRequests.length > 50) {
      this.metrics.performance.slowRequests = this.metrics.performance.slowRequests.slice(-50);
    }
  }

  /**
   * Add to recent activity
   */
  addToRecentActivity(activity) {
    this.recentActivity.push(activity);

    // Keep only recent activity
    if (this.recentActivity.length > this.maxActivityHistory) {
      this.recentActivity = this.recentActivity.slice(-this.maxActivityHistory);
    }
  }

  /**
   * Get comprehensive metrics
   */
  getMetrics() {
    const uptime = Date.now() - this.startTime;
    const uptimeSeconds = Math.floor(uptime / 1000);

    return {
      uptime: {
        milliseconds: uptime,
        seconds: uptimeSeconds,
        formatted: this.formatUptime(uptimeSeconds)
      },
      requests: {
        ...this.metrics.requests,
        activeUsers: this.metrics.business.activeUsers.size,
        requestsPerSecond: this.metrics.requests.total / (uptimeSeconds || 1),
        successRate: (this.metrics.requests.successful / (this.metrics.requests.total || 1)) * 100
      },
      performance: {
        ...this.metrics.performance,
        averageResponseTime: Math.round(this.metrics.performance.averageResponseTime * 100) / 100
      },
      business: {
        ...this.metrics.business,
        activeUsers: this.metrics.business.activeUsers.size,
        conversionRate: (this.metrics.business.paidGenerations / (this.metrics.business.totalGenerations || 1)) * 100
      },
      aiProvider: {
        ...this.metrics.aiProvider,
        successRate: (this.metrics.aiProvider.successful / (this.metrics.aiProvider.requests || 1)) * 100,
        averageResponseTime: Math.round(this.metrics.aiProvider.averageResponseTime * 100) / 100,
        averageCost: this.metrics.aiProvider.totalCost / (this.metrics.aiProvider.requests || 1)
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get health status
   */
  getHealthStatus() {
    const metrics = this.getMetrics();

    // Determine health status based on thresholds
    const checks = {
      responseTime: {
        status: metrics.performance.averageResponseTime < config.monitoring.performanceThresholds.apiResponseTime ? 'healthy' : 'warning',
        value: metrics.performance.averageResponseTime,
        threshold: config.monitoring.performanceThresholds.apiResponseTime
      },
      errorRate: {
        status: (100 - metrics.requests.successRate) < 5 ? 'healthy' : 'warning', // 5% error threshold
        value: 100 - metrics.requests.successRate,
        threshold: 5
      },
      aiProvider: {
        status: metrics.aiProvider.successRate > 95 ? 'healthy' : 'warning',
        value: metrics.aiProvider.successRate,
        threshold: 95
      }
    };

    // Overall health
    const hasWarnings = Object.values(checks).some(check => check.status === 'warning');
    const overallStatus = hasWarnings ? 'warning' : 'healthy';

    return {
      status: overallStatus,
      checks,
      uptime: metrics.uptime,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get recent activity
   */
  getRecentActivity(limit = 50) {
    return this.recentActivity
      .slice(-limit)
      .reverse(); // Most recent first
  }

  /**
   * Get user statistics
   */
  getUserStats(userId) {
    const userRequests = this.metrics.requests.byUser[userId] || { count: 0, success: 0, failed: 0 };

    // Count user generations from recent activity
    const userGenerations = this.recentActivity
      .filter(activity => activity.type === 'generation' && activity.userId === userId)
      .length;

    return {
      userId,
      requests: userRequests,
      generations: userGenerations,
      isActive: this.metrics.business.activeUsers.has(userId)
    };
  }

  /**
   * Format uptime in human readable format
   */
  formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (remainingSeconds > 0 || parts.length === 0) parts.push(`${remainingSeconds}s`);

    return parts.join(' ');
  }

  /**
   * Reset metrics (for testing or periodic resets)
   */
  resetMetrics() {
    this.metrics = {
      requests: { total: 0, successful: 0, failed: 0, byEndpoint: {}, byUser: {} },
      performance: { responseTimeSum: 0, responseTimeCount: 0, averageResponseTime: 0, slowRequests: [], errors: [] },
      business: { totalGenerations: 0, freeGenerations: 0, paidGenerations: 0, revenue: 0, activeUsers: new Set() },
      aiProvider: { requests: 0, successful: 0, failed: 0, totalCost: 0, averageResponseTime: 0 }
    };

    this.recentActivity = [];
    this.startTime = Date.now();
  }
}

module.exports = new MonitoringService();