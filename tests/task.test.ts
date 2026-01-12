import request from 'supertest';
import app from '../src/index';

describe('Task API', () => {
  let token: string;

  beforeAll(async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      username: 'tasktester',
      email: 'task@test.com',
      pwd: 'password123',
    });
    token = res.body.token;
  });

  it('should create a task', async () => {
    const boardRes = await request(app).post('/api/v1/boards').set('Authorization', `Bearer ${token}`).send({
      title: 'Task Test Board',
    });
    const boardId = boardRes.body._id;
    const columnId = boardRes.body.columns[0]._id;

    const res = await request(app).post('/api/v1/tasks').set('Authorization', `Bearer ${token}`).send({
      title: 'Test Task',
      board: boardId,
      column: columnId,
      priority: 'high',
    });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test Task');
    expect(res.body.priority).toBe('high');
  });

  it('should filter tasks by priority', async () => {
    const res = await request(app).get('/api/v1/tasks?priority=high').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.tasks)).toBe(true);
  });

  it('should add a comment to task', async () => {
    const boardRes = await request(app).post('/api/v1/boards').set('Authorization', `Bearer ${token}`).send({
      title: 'Comment Test Board',
    });
    const taskRes = await request(app).post('/api/v1/tasks').set('Authorization', `Bearer ${token}`).send({
      title: 'Comment Task',
      board: boardRes.body._id,
      column: boardRes.body.columns[0]._id,
    });
    const res = await request(app).post(`/api/v1/tasks/${taskRes.body._id}/comments`).set('Authorization', `Bearer ${token}`).send({
      content: 'This is a test comment',
    });
    expect(res.status).toBe(200);
  });

  it('should track time on task', async () => {
    const boardRes = await request(app).post('/api/v1/boards').set('Authorization', `Bearer ${token}`).send({
      title: 'Time Test Board',
    });
    const taskRes = await request(app).post('/api/v1/tasks').set('Authorization', `Bearer ${token}`).send({
      title: 'Time Task',
      board: boardRes.body._id,
      column: boardRes.body.columns[0]._id,
    });
    const res = await request(app).post(`/api/v1/tasks/${taskRes.body._id}/time`).set('Authorization', `Bearer ${token}`).send({
      duration: 3600,
      description: 'Worked on feature',
      startedAt: new Date().toISOString(),
    });
    expect(res.status).toBe(200);
  });
});
