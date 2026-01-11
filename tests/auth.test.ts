import request from 'supertest';
import app from '../src/index';

describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      username: 'authtester',
      email: 'auth@test.com',
      pwd: 'password123',
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should login existing user', async () => {
    await request(app).post('/api/v1/auth/register').send({
      username: 'logintester',
      email: 'login@test.com',
      pwd: 'password123',
    });
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'login@test.com',
      pwd: 'password123',
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should reject invalid credentials', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'nonexistent@test.com',
      pwd: 'wrongpassword',
    });
    expect(res.status).toBe(401);
  });
});
