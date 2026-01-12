import request from 'supertest';
import app from '../src/index';

describe('Board API', () => {
  let token: string;
  let boardId: string;

  beforeAll(async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      username: 'boardtester',
      email: 'board@test.com',
      pwd: 'password123',
    });
    token = res.body.token;
  });

  it('should create a board with default columns', async () => {
    const res = await request(app).post('/api/v1/boards').set('Authorization', `Bearer ${token}`).send({
      title: 'My Project Board',
      description: 'Managing project tasks',
    });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('My Project Board');
    expect(res.body.columns.length).toBe(4);
    boardId = res.body._id;
  });

  it('should get all boards', async () => {
    const res = await request(app).get('/api/v1/boards').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get board by id', async () => {
    const res = await request(app).get(`/api/v1/boards/${boardId}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(boardId);
  });

  it('should update board', async () => {
    const res = await request(app).put(`/api/v1/boards/${boardId}`).set('Authorization', `Bearer ${token}`).send({
      title: 'Updated Board Title',
    });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Board Title');
  });
});
