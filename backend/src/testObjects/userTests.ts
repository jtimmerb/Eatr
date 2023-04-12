import request from 'supertest';
import app from '../app';
import {API_VERSION} from '../utility/config/config';

export default class userAPITests {
    public testCreateAndGetUser = async (user : any) => {
        let response = await request(app)
          .post(API_VERSION + '/users')
          .send(user);
        expect(response.body).toHaveProperty('userId');
        expect(response.body.name).toBe(user.name);
        const userId = response.body.userId;
        response = await request(app).get(API_VERSION + `/users/${userId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('userId');
        expect(response.body.name).toBe(user.name);
      
        // Call the function to delete the user
        request(app).delete(API_VERSION + `/users/${userId}`);
      };
}