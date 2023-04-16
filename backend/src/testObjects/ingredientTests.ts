import request from 'supertest';
import { getApp } from './app'
import { API_VERSION } from '../utility/config/config';

export default class ingredientAPITests {
  public testCreateAndGetIngredient = async (ingredient: any): Promise<number> => {
    const app = await getApp()
    let response = await request(app)
      .post(API_VERSION + '/ingredients')
      .send(ingredient);

    expect(response.body).toHaveProperty('ingredientId');
    expect(response.body.name).toBe(ingredient.name);
    expect(response.body.servingSize).toBe(ingredient.servingSize);
    expect(response.body.fats).toBe(ingredient.fats);
    expect(response.body.calories).toBe(ingredient.calories);
    expect(response.body.carbohydrates).toBe(ingredient.carbohydrates);
    const ingredientId = response.body.ingredientId;
    response = await request(app).get(API_VERSION + `/ingredients/${ingredientId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('ingredientId');
    expect(response.body.name).toBe(ingredient.name);
    expect(response.body.servingSize).toBe(ingredient.servingSize);
    expect(response.body.fats).toBe(ingredient.fats);
    expect(response.body.calories).toBe(ingredient.calories);
    expect(response.body.carbohydrates).toBe(ingredient.carbohydrates);
    return ingredientId;

    // Call the function to delete the ingredient
    //request(app).delete(API_VERSION + `/ingredients/${ingredientId}`);
  };
}