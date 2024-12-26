const request = require('supertest');
const express = require('express');
const app = express();

describe('API Tests', () => {
  it('GET /api/health returns status ok', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.status).toBe('ok');
  });
});
