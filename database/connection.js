const { Pool } = require('pg');
require('dotenv').config();

// Database connection configuration
const dbConfig = {
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  maxUses: 7500, // Close (and replace) a connection after it has been used 7500 times
};

// Create connection pool
const pool = new Pool(dbConfig);

// Handle pool errors
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Database utility functions
class DatabaseManager {
  constructor() {
    this.pool = pool;
  }

  // Execute a query
  async query(text, params) {
    const start = Date.now();
    try {
      const res = await this.pool.query(text, params);
      const duration = Date.now() - start;
      console.log('Database query executed:', {
        query: text.substring(0, 100) + '...',
        duration: duration + 'ms',
        rows: res.rowCount
      });
      return res;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  // Get a client for transactions
  async getClient() {
    return await this.pool.connect();
  }

  // Initialize database (run schema)
  async initialize() {
    const fs = require('fs');
    const path = require('path');

    try {
      const schemaPath = path.join(__dirname, 'schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');

      console.log('Initializing database schema...');
      await this.query(schema);
      console.log('Database schema initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database schema:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    try {
      const result = await this.query('SELECT NOW() as current_time');
      return {
        status: 'healthy',
        timestamp: result.rows[0].current_time,
        pool_status: {
          total_connections: this.pool.totalCount,
          idle_connections: this.pool.idleCount,
          waiting_clients: this.pool.waitingCount
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }

  // User management functions
  async createUser(userData) {
    const { email, username, password_hash, full_name } = userData;
    const query = `
      INSERT INTO users (email, username, password_hash, full_name)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, username, full_name, created_at
    `;
    const result = await this.query(query, [email, username, password_hash, full_name]);

    // Create initial token allocation
    await this.query(
      'INSERT INTO user_tokens (user_id, tokens) VALUES ($1, $2)',
      [result.rows[0].id, 100]
    );

    return result.rows[0];
  }

  async getUserByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
    const result = await this.query(query, [email]);
    return result.rows[0];
  }

  async getUserTokens(userId) {
    const query = 'SELECT * FROM user_tokens WHERE user_id = $1';
    const result = await this.query(query, [userId]);
    return result.rows[0];
  }

  // Usage logging
  async logUsage(logData) {
    const {
      user_id,
      action,
      tokens_used,
      processing_time_ms,
      image_size_bytes,
      prompt_used,
      success,
      error_message,
      ip_address,
      user_agent
    } = logData;

    const query = `
      INSERT INTO usage_logs
      (user_id, action, tokens_used, processing_time_ms, image_size_bytes, prompt_used, success, error_message, ip_address, user_agent)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, created_at
    `;

    const result = await this.query(query, [
      user_id, action, tokens_used, processing_time_ms, image_size_bytes,
      prompt_used, success, error_message, ip_address, user_agent
    ]);

    return result.rows[0];
  }

  // Fork management
  async createFork(forkData) {
    const { user_id, fork_name, description, gemini_prompt, domain_name, is_public } = forkData;
    const query = `
      INSERT INTO fork_configs (user_id, fork_name, description, gemini_prompt, domain_name, is_public)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await this.query(query, [user_id, fork_name, description, gemini_prompt, domain_name, is_public]);
    return result.rows[0];
  }

  async getUserForks(userId) {
    const query = 'SELECT * FROM fork_configs WHERE user_id = $1 AND is_active = true ORDER BY created_at DESC';
    const result = await this.query(query, [userId]);
    return result.rows;
  }

  // Analytics
  async recordMetric(metricData) {
    const { fork_id, metric_name, metric_value, metric_data } = metricData;
    const query = `
      INSERT INTO analytics (fork_id, metric_name, metric_value, metric_data)
      VALUES ($1, $2, $3, $4)
      RETURNING id, recorded_at
    `;
    const result = await this.query(query, [fork_id, metric_name, metric_value, JSON.stringify(metric_data)]);
    return result.rows[0];
  }

  // Close all connections
  async close() {
    await this.pool.end();
  }
}

// Export singleton instance
const db = new DatabaseManager();

module.exports = {
  db,
  pool,
  DatabaseManager
};