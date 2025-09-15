const { CacheManager } = require('../cache');

describe('Cache Manager', () => {
  let cache;

  beforeAll(() => {
    cache = new CacheManager();
  });

  afterAll(async () => {
    await cache.close();
  });

  describe('Basic Operations', () => {
    test('should set and get values', async () => {
      const testKey = 'test-key';
      const testValue = { data: 'test-data', timestamp: Date.now() };

      await cache.set(testKey, testValue, 60);
      const retrieved = await cache.get(testKey);

      expect(retrieved).toEqual(testValue);
    });

    test('should return null for non-existent keys', async () => {
      const result = await cache.get('non-existent-key');
      expect(result).toBeNull();
    });

    test('should delete values', async () => {
      const testKey = 'delete-test-key';
      const testValue = { data: 'delete-test' };

      await cache.set(testKey, testValue, 60);
      await cache.del(testKey);

      const retrieved = await cache.get(testKey);
      expect(retrieved).toBeNull();
    });

    test('should check if key exists', async () => {
      const testKey = 'exists-test-key';
      const testValue = { data: 'exists-test' };

      await cache.set(testKey, testValue, 60);
      const exists = await cache.exists(testKey);
      expect(exists).toBe(true);

      await cache.del(testKey);
      const existsAfterDelete = await cache.exists(testKey);
      expect(existsAfterDelete).toBe(false);
    });
  });

  describe('Counter Operations', () => {
    test('should increment counters', async () => {
      const testKey = 'counter-test';

      const count1 = await cache.incr(testKey, 60);
      expect(count1).toBe(1);

      const count2 = await cache.incr(testKey, 60);
      expect(count2).toBe(2);

      const count3 = await cache.incr(testKey, 60);
      expect(count3).toBe(3);
    });
  });

  describe('Session Management', () => {
    test('should manage user sessions', async () => {
      const sessionId = 'test-session-id';
      const userData = {
        userId: 'user123',
        email: 'test@example.com',
        role: 'user'
      };

      await cache.setUserSession(sessionId, userData, 3600);
      const retrieved = await cache.getUserSession(sessionId);

      expect(retrieved).toEqual(userData);

      await cache.deleteUserSession(sessionId);
      const afterDelete = await cache.getUserSession(sessionId);
      expect(afterDelete).toBeNull();
    });
  });

  describe('Rate Limiting', () => {
    test('should track rate limits', async () => {
      const identifier = 'rate-limit-test';

      const count1 = await cache.incrementRateLimit(identifier, 60);
      expect(count1).toBe(1);

      const count2 = await cache.incrementRateLimit(identifier, 60);
      expect(count2).toBe(2);

      const currentCount = await cache.getRateLimitCount(identifier);
      expect(currentCount).toBe(2);
    });
  });

  describe('Health Check', () => {
    test('should return health status', async () => {
      const health = await cache.healthCheck();

      expect(health).toHaveProperty('status');
      expect(health).toHaveProperty('cache_type');
      expect(health).toHaveProperty('test_passed');
      expect(['healthy', 'unhealthy']).toContain(health.status);
    });
  });
});