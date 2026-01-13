import request from 'supertest';
import app from '../src/index';

describe('Notification API', () => {
  let token: string;

  beforeAll(async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      username: 'notiftester',
      email: 'notif@test.com',
      pwd: 'password123',
    });
    token = res.body.token;
  });

  it('should get notifications', async () => {
    const res = await request(app).get('/api/v1/notifications').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('notifications');
  });

  it('should get unread count', async () => {
    const res = await request(app).get('/api/v1/notifications/unread-count').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('count');
  });
});
