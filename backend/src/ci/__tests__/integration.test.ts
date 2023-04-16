import request from 'supertest';
import {getApp} from '../../testObjects/app'
import {API_VERSION} from '../../utility/config/config';
import userAPITests from '../../testObjects/userTests';
import ingredientAPITests from '../../testObjects/ingredientTests';
import recipeAPITests from '../../testObjects/recipeTests';
import { userOne, userTwo, userThree} from '../../testObjects/testObjects';
import { ingredientOnion, ingredientTomato, ingredientCucumber } from '../../testObjects/testObjects';
import { userOnePantryCucumber, userOnePantryOnion, userOnePantryTomato } from '../../testObjects/testObjects';
import { recipePasta, recipeBurger, recipePie } from '../../testObjects/testObjects';

const userTests = new userAPITests();
const ingredientTests = new ingredientAPITests()
const recipeTests = new recipeAPITests()
let userIdOne : number;
let userIdTwo: number;
let userIdThree : number;
let ingredientIdOne : number;
let ingredientIdTwo : number;
let ingredientIdThree : number;
let recipeIdOne: number;
let recipeIdTwo: number;
let recipeIdThree: number;

describe('Test the database routes', () => {
  it('Check create and Get User', async () => {
    userIdOne = await userTests.testCreateAndGetUser(userOne);
    userIdTwo= await userTests.testCreateAndGetUser(userTwo);
    userIdThree = await userTests.testCreateAndGetUser(userThree);
  });

  it('Check create and get ingredients', async () => {
    ingredientIdOne = await ingredientTests.testCreateAndGetIngredient(ingredientOnion);
    ingredientIdTwo = await ingredientTests.testCreateAndGetIngredient(ingredientTomato);
    ingredientIdThree =  await ingredientTests.testCreateAndGetIngredient(ingredientCucumber);
  });

  it('Check create and get user pantries', async () => {
    userOnePantryCucumber.ingredientId = ingredientIdThree
    userOnePantryOnion.ingredientId = ingredientIdOne
    userOnePantryTomato.ingredientId = ingredientIdTwo
    await userTests.testCreateUserPantry(userIdOne, userOnePantryCucumber)
    await userTests.testCreateUserPantry(userIdOne, userOnePantryTomato)
    await userTests.testCreateUserPantry(userIdOne, userOnePantryOnion)
    await userTests.testGetUserPantry(userIdOne)
  });

  it('Check create and get recipe', async () => {
    recipePasta.recipeIngredients[0].ingredientId = ingredientIdOne
    recipePasta.recipeIngredients[1].ingredientId = ingredientIdTwo
    recipeIdOne = await recipeTests.testCreateRecipe(recipePasta)

    recipeBurger.recipeIngredients[0].ingredientId = ingredientIdTwo
    recipeBurger.recipeIngredients[1].ingredientId = ingredientIdThree
    recipeIdTwo = await recipeTests.testCreateRecipe(recipeBurger)
    
    recipePie.recipeIngredients[0].ingredientId = ingredientIdOne
    recipePie.recipeIngredients[1].ingredientId = ingredientIdThree
    recipeIdThree = await recipeTests.testCreateRecipe(recipePie)

    await recipeTests.testGetRecipe(recipeIdOne)
    await recipeTests.testGetRecipe(recipeIdTwo)
    await recipeTests.testGetRecipe(recipeIdThree)
  });

  it('Check create and get user recipe', async () => {
    await userTests.testCreateUserRecipe(userIdOne,recipeIdOne)
    await userTests.testCreateUserRecipe(userIdOne,recipeIdTwo)

    await userTests.testGetUserRecipe(userIdOne)

  });
  (async () => {
    const app = await getApp()
    request(app).delete(API_VERSION + `/users/${userIdOne}`);
    request(app).delete(API_VERSION + `/users/${userIdTwo}`);
    request(app).delete(API_VERSION + `/users/${userIdThree}`);
    request(app).delete(API_VERSION + `/ingredients/${ingredientIdOne}`);
    request(app).delete(API_VERSION + `/ingredients/${ingredientIdTwo}`);
    request(app).delete(API_VERSION + `/ingredients/${ingredientIdThree}`);
  })();


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