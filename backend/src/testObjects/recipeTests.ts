import request from 'supertest';
import app from '../app';
import {API_VERSION} from '../utility/config/config';

export default class recipeAPITests {
    public testCreateRecipe = async (recipe: any) : Promise<number> => {
        let response = await request(app)
          .post(API_VERSION + '/recipes')
          .send(recipe);
        expect(response.body).toHaveProperty('db_recipe')
        expect(response.body.db_recipe.name).toBe(recipe.recipe.name)
        expect(response.body).toHaveProperty('db_recipeIngredient')
        expect(response.body.db_recipeIngredient.length).toBe(2)
        const recipeId = response.body.db_recipe.recipeId;
        return recipeId
      
        // Call the function to delete the ingredient
        //request(app).delete(API_VERSION + `/ingredients/${ingredientId}`);
      };

    public testGetRecipe = async (recipeId: number) =>{
        let response = await request(app).get(API_VERSION + `/recipes/${recipeId}`);
        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('db_recipe')
        expect(response.body).toHaveProperty('db_recipeIngredient')
        expect(response.body.db_recipeIngredient.length).toBe(2)
    }
}