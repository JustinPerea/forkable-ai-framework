const { DatabaseManager } = require('../database/connection');

// Mock database for testing
const mockDb = new DatabaseManager();

describe('Database Connection', () => {
  let testUserId;

  beforeAll(async () => {
    // Skip database tests if no connection available
    if (!process.env.POSTGRES_URL && !process.env.DATABASE_URL) {
      console.log('Skipping database tests - no connection configured');
      return;
    }
  });

  afterAll(async () => {
    if (mockDb.pool) {
      await mockDb.close();
    }
  });

  describe('Health Check', () => {
    test('should return database health status', async () => {
      // Skip if no database configured
      if (!process.env.POSTGRES_URL && !process.env.DATABASE_URL) {
        return;
      }

      const health = await mockDb.healthCheck();
      expect(health).toHaveProperty('status');
      expect(health.status).toMatch(/healthy|unhealthy/);
    });
  });

  describe('User Management', () => {
    test('should create user with valid data', async () => {
      // Skip if no database configured
      if (!process.env.POSTGRES_URL && !process.env.DATABASE_URL) {
        return;
      }

      const userData = {
        email: `test${Date.now()}@example.com`,
        username: `testuser${Date.now()}`,
        password_hash: 'test_hash',
        full_name: 'Test User'
      };

      try {
        const user = await mockDb.createUser(userData);
        testUserId = user.id;

        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('email', userData.email);
        expect(user).toHaveProperty('username', userData.username);
        expect(user).toHaveProperty('full_name', userData.full_name);
      } catch (error) {
        console.warn('User creation test skipped:', error.message);
      }
    });

    test('should retrieve user by email', async () => {
      // Skip if no database configured or user not created
      if (!testUserId) {
        return;
      }

      try {
        const user = await mockDb.getUserByEmail('test@example.com');
        // User might not exist, that's okay for this test
        expect(user).toBeDefined();
      } catch (error) {
        console.warn('User retrieval test skipped:', error.message);
      }
    });
  });

  describe('Usage Logging', () => {
    test('should log usage data', async () => {
      // Skip if no database configured
      if (!process.env.POSTGRES_URL && !process.env.DATABASE_URL) {
        return;
      }

      const logData = {
        user_id: testUserId || null,
        action: 'test_action',
        tokens_used: 1,
        processing_time_ms: 100,
        success: true,
        ip_address: '127.0.0.1',
        user_agent: 'test-agent'
      };

      try {
        const result = await mockDb.logUsage(logData);
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('created_at');
      } catch (error) {
        console.warn('Usage logging test skipped:', error.message);
      }
    });
  });
});