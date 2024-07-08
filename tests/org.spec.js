const request = require('supertest');
const app = require('../src/app.js');
const { sequelize } = require('../src/models/index.js');

describe('Organisation API', () => {
  let token;
  let userId;
  let orgId;
  let newUserId;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    const user = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      phone: '1234567890',
    };

    const res = await request(app).post('/api/auth/register').send(user);

    if (res.body.data && res.body.data.accessToken) {
      token = res.body.data.accessToken;
    } else {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: user.email, password: user.password });
      token = loginRes.body.data.accessToken;
    }

    userId = res.body.data.user.userId;

    const newUser = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      password: 'password456',
      phone: '0987654321',
    };

    const newUserRes = await request(app).post('/api/auth/register').send(newUser);
    newUserId = newUserRes.body.data.user.userId;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('GET /api/orgs', () => {
    it('should get all organisations for the user', async () => {
      const res = await request(app)
        .get('/api/orgs')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(Array.isArray(res.body.data.organisations)).toBeTruthy();
    });
  });

  describe('POST /api/orgs', () => {
    it('should create a new organisation', async () => {
      const org = {
        name: 'Test Organisation',
        description: 'This is a test organisation',
      };

      const res = await request(app)
        .post('/api/orgs')
        .set('Authorization', `Bearer ${token}`)
        .send(org);

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.orgId).toBeDefined();

      orgId = res.body.data.orgId;
    });
  });

  describe('POST /api/orgs/:orgId/addUser', () => {
    it('should add a user to an organisation', async () => {
      const res = await request(app)
        .post(`/api/orgs/${orgId}/addUser`)
        .set('Authorization', `Bearer ${token}`)
        .send({ userId: newUserId });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
    });
  });
});
