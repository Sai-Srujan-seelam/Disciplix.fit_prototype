import request from 'supertest'
import { app } from '../server'

describe('Authentication Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({})
        
      expect(response.status).toBe(400)
    })

    it('should validate email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
          name: 'Test User',
          agreeToTerms: true
        })
        
      expect(response.status).toBe(400)
    })

    it('should validate password length', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: '123',
          name: 'Test User',
          agreeToTerms: true
        })
        
      expect(response.status).toBe(400)
    })
  })

  describe('POST /api/auth/login', () => {
    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({})
        
      expect(response.status).toBe(400)
    })

    it('should validate email format', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: 'password123'
        })
        
      expect(response.status).toBe(400)
    })
  })

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('status', 'OK')
      expect(response.body).toHaveProperty('timestamp')
    })
  })
})