const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const Organisation = require('../src/models/Organisation');

describe('Authentication Endpoints', () => {
  beforeEach(async () => {
    await User.deleteMany();
    await Organisation.deleteMany();
  });

  it('Should Register User Successfully with Default Organisation', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '1234567890',
      });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Registration successful');
    expect(response.body.data).toH