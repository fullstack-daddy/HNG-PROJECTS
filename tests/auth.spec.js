import { jest } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';

let app, User, Organisation;

beforeAll(async () => {
  const appModule = await import('../src/app.js');
  app = appModule.default;
  const UserModule = await import('../src/models/User.js');
  User = UserModule.default;
  const OrganisationModule = await import('../src/models/Organisation.js');
  Organisation = OrganisationModule.default;

  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  await User.deleteMany();
  await Organisation.deleteMany();
});

describe('Authentication Endpoints', () => {
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
    expect(response.body.data.user).toHaveProperty('userId');
    expect(response.body.data.user.firstName).toBe('John');
    expect(response.body.data.user.lastName).toBe('Doe');
    expect(response.body.data.user.email).toBe('john@example.com');
    expect(response.body.data.accessToken).toBeDefined();

    // Check if the organisation was created
    const org = await Organisation.findOne({ name: "John's Organisation" });
    expect(org).toBeTruthy();
  });

  it('Should Fail If Required Fields Are Missing', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        // email is missing
        password: 'password123',
      });

    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors[0].field).toBe('email');
  });

  it('Should Fail if there\'s Duplicate Email', async () => {
    // First registration
    await request(app)
      .post('/auth/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      });

    // Second registration with the same email
    const response = await request(app)
      .post('/auth/register')
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password456',
      });

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('Bad request');
    expect(response.body.message).toBe('Registration unsuccessful');
  });

  it('Should Log the user in successfully', async () => {
    // Register a user first
    await request(app)
      .post('/auth/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      });

    // Try to log in
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'john@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Login successful');
    expect(response.body.data).toHaveProperty('accessToken');
    expect(response.body.data.user).toHaveProperty('userId');
  });

  it('Should Fail to Log in with Wrong Credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'wrong@example.com',
        password: 'wrongpassword',
      });

    expect(response.status).toBe(401);
    expect(response.body.status).toBe('Bad request');
    expect(response.body.message).toBe('Authentication failed');
  });
});