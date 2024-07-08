const request = require('supertest');
const app = require('../src/app.js');
const { sequelize } = require('../src/models/index.js');

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/auth/register', () => {
    it('should register user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'password123',
          phone: '1234567890',
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.user).toBeDefined();
    });

    it('should fail if there’s duplicate email or userId', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'password123',
          phone: '0987654321',
        });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'password123',
          phone: '0987654321',
        });

      expect(res.statusCode).toEqual(422);
      expect(res.body).toHaveProperty('errors');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should log user in successfully', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.accessToken).toBeDefined();
    });
  });
});
