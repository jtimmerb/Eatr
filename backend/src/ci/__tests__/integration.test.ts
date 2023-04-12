import request from 'supertest';
import app from '../../app';
import {API_VERSION} from '../../utility/config/config';
import userAPITests from '../../testObjects/userTests';
import ingredientAPITests from '../../testObjects/ingredientTests';
import { userOne, userTwo, userThree } from '../../testObjects/testObjects';
import { ingredientOnion, ingredientTomato, ingredientCucumber } from '../../testObjects/testObjects';

const userTests = new userAPITests();
const ingredientTests = new ingredientAPITests()

describe('Test the database routes', () => {
  it('Check create and Get User', async () => {
    await userTests.testCreateAndGetUser(userOne);
    await userTests.testCreateAndGetUser(userTwo);
    await userTests.testCreateAndGetUser(userThree);
  });

  it('Check create and get ingredients', async () => {
    await ingredientTests.testCreateAndGetIngredient(ingredientOnion);
    await ingredientTests.testCreateAndGetIngredient(ingredientTomato);
    await ingredientTests.testCreateAndGetIngredient(ingredientCucumber);
  });
});

//let response = await request(app)
  //     .post(API_VERSION + '/recipes')
  //     .send({
  //       recipe: {
  //         recipeId: 0,
  //         name: 'pasta',
  //         steps: ['Step1', 'Step2', 'Step3', 'Step4', 'Step5'],
  //       },
  //       recipeIngredients: [
  //         {
  //           recipeIngredientMembershipId: 0,
  //           recipeId: 0,
  //           ingredientId: 22,
  //           ingredientAmount: '300 grams',
  //         },
  //         {
  //           recipeIngredientMembershipId: 0,
  //           recipeId: 0,
  //           ingredientId: 23,
  //           ingredientAmount: '',
  //         },
  //       ],
  //     });
  //   expect(response.body).toHaveProperty('db_recipe');
  //   expect(response.body.db_recipe.name).toBe('pasta');
  //   const recipeId = response.body.db_recipe.recipeId;
  //   response = await request(app).get(API_VERSION + `/recipes/${recipeId}`);
  //   expect(response.status).toBe(200);
  //   expect(response.body).toHaveProperty('db_recipeIngredients');
  //   expect(response.body.db_recipe.steps[1]).toBe('Step2');
  //   expect(response.body.db_recipeIngredients[0].ingredientAmount).toBe('300 grams');
  //   request(app).delete(API_VERSION + `/recipes/${recipeId}`);
  // });