import request from 'supertest';
import app from '../../app';
import {API_VERSION} from '../../utility/config/config';

describe('Test the database routes', () => {
  it('Check create and Get User', async () => {
    let response = await request(app)
      .post(API_VERSION + '/users')
      .send({
        name: 'Test User',
      });
    expect(response.body).toHaveProperty('userId');
    expect(response.body.name).toBe('Test User');
    const userId = response.body.userId;
    response = await request(app).get(API_VERSION + `/users/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('userId');
    expect(response.body.name).toBe('Test User');
    request(app).delete(API_VERSION + `/users/${userId}`);
  });

  it('Check create and Get Recipe', async () => {
    let response = await request(app)
      .post(API_VERSION + '/recipes')
      .send({
        recipe: {
          recipeId: 0,
          name: 'pasta',
          steps: ['Step1', 'Step2', 'Step3', 'Step4', 'Step5'],
        },
        recipeIngredients: [
          {
            recipeIngredientMembershipId: 0,
            recipeId: 0,
            ingredientId: 22,
            ingredientAmount: '300 grams',
          },
          {
            recipeIngredientMembershipId: 0,
            recipeId: 0,
            ingredientId: 23,
            ingredientAmount: '',
          },
          {
            recipeIngredientMembershipId: 0,
            recipeId: 0,
            ingredientId: 20,
            ingredientAmount: '',
          },
        ],
      });
    expect(response.body).toHaveProperty('db_recipe');
    expect(response.body.db_recipe.name).toBe('pasta');
    const recipeId = response.body.db_recipe.recipeId;
    response = await request(app).get(API_VERSION + `/recipes/${recipeId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('db_recipeIngredients');
    expect(response.body.db_recipeIngredients[0].ingredientAmount).toBe('300 grams');
  });
});
