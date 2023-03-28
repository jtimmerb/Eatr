import request from 'supertest';
import app from '../../app';
import {API_VERSION} from '../../utility/config/config';

describe('Test the database routes', () => {
  it('should create a new user', async () => {
    const response = await request(app)
      .post(API_VERSION + '/users')
      .send({
        name: 'Test User',
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('userId');
    expect(response.body.name).toBe('Test User');
    const userId = response.body.userId;
    request(app).delete(API_VERSION + `/users/${userId}`);
  });

  it('should get a user by id', async () => {
    const newUserResponse = await request(app)
      .post(API_VERSION + '/users')
      .send({
        name: 'Test User',
      });
    const userId = newUserResponse.body.userId;
    const response = await request(app).get(API_VERSION + `/users/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('userId');
    expect(response.body.name).toBe('Test User');
    request(app).delete(API_VERSION + `/users/${userId}`);
  });
});
