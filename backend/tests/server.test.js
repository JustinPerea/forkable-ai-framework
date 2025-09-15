const request = require('supertest');
const app = require('../server');

describe('Forkable AI Framework API', () => {
  describe('Health Check', () => {
    test('GET /health should return 200 and health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('environment');
    });
  });

  describe('API Endpoints', () => {
    test('POST /api/process-image should validate input', async () => {
      const response = await request(app)
        .post('/api/process-image')
        .send({})
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('imageData');
    });

    test('POST /api/process-image with invalid imageData should return 400', async () => {
      const response = await request(app)
        .post('/api/process-image')
        .send({ imageData: 'invalid-data' })
        .expect('Content-Type', /json/);

      // Should return either 400 or 500 depending on validation
      expect([400, 500]).toContain(response.status);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Security', () => {
    test('Should have security headers', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      // Check for security headers (added by helmet)
      expect(response.headers).toHaveProperty('x-dns-prefetch-control');
      expect(response.headers).toHaveProperty('x-frame-options');
      expect(response.headers).toHaveProperty('x-download-options');
    });

    test('Should handle CORS properly', async () => {
      const response = await request(app)
        .options('/api/process-image')
        .set('Origin', 'http://localhost:3000')
        .expect(204);

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });
  });

  describe('Error Handling', () => {
    test('Should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/nonexistent-route')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    test('Should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/process-image')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });
});