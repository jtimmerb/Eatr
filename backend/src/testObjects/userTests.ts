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
        return userId;
        // Call the function to delete the user
        //request(app).delete(API_VERSION + `/users/${userId}`);
      };
    
    public testCreateUserPantry = async (userID : number, userIngr : any) => {
        let response = await request(app)
          .post(API_VERSION + `/users/ingredients/${userID}`)
          .send(userIngr);
        expect(response.body).toHaveProperty('upMembershipId');
        expect(response.body).toHaveProperty('userId');
        expect(response.body).toHaveProperty('ingredientId');
        expect(response.body).toHaveProperty('ingredientAmount');
        expect(response.body.userId).toBe(userID);
        expect(response.body.ingredientId).toBe(userIngr.ingredientId);
        expect(response.body.ingredientAmount).toBe(userIngr.ingredientAmount);
        const upMembershipId = response.body.upMembershipId;

    }

    public testGetUserPantry = async (userID : number) => {
      let response = await request(app).get(API_VERSION + `/users/ingredients/${userID}`);
      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(3)
      response.body.forEach((pantryItem : any) => {
        expect(pantryItem).toHaveProperty('userPantry.upMembershipId');
        expect(pantryItem).toHaveProperty('userPantry.userId');
        expect(pantryItem).toHaveProperty('userPantry.ingredientId');
        expect(pantryItem).toHaveProperty('userPantry.ingredientAmount');
        expect(pantryItem).toHaveProperty('ingredient.ingredientId');
        expect(pantryItem).toHaveProperty('ingredient.name');
        expect(pantryItem).toHaveProperty('ingredient.servingSize');
        expect(pantryItem).toHaveProperty('ingredient.calories');
        expect(pantryItem).toHaveProperty('ingredient.proteins');
        expect(pantryItem).toHaveProperty('ingredient.carbohydrates');
        expect(pantryItem).toHaveProperty('ingredient.fats');
      });
    }
  
    public testCreateUserRecipe = async (userID : number, recipeID: number) => {
      let response = await request(app)
          .post(API_VERSION + `/users/recipes/${userID}`)
          .send({recipeId : recipeID});
      expect(response.body).toHaveProperty('userRecipeMembershipId')
      expect(response.body.recipeId).toBe(recipeID)
      expect(response.body.userId).toBe(userID)
    }

    public testGetUserRecipe = async (userID : number) => {
      let response = await request(app).get(API_VERSION + `/users/recipes/${userID}`);
      expect(response.statusCode).toBe(200)
      expect(response.body[0]).toHaveProperty('userRecipe')
      expect(response.body[0]).toHaveProperty('recipe')     
    }    
}