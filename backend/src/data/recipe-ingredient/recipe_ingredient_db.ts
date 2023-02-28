import {RecipeIngredient} from './entity';
import EatrService from '../../service/service';
import {Ingredient} from '../ingredient/entity';

export default class recipeIngredientCmnds {
  async create(user: RecipeIngredient, service: EatrService): Promise<RecipeIngredient> {
    const userDB = await service.recipeIngredientRepo.create(user);
    //res.send(JSON.stringify(user) + '\n');
    return userDB;
  }

  async update(user: RecipeIngredient, service: EatrService): Promise<RecipeIngredient> {
    const userDB = await service.recipeIngredientRepo.update(user);
    //res.send(JSON.stringify(user) + '\n');
    return userDB;
  }

  async get(user: RecipeIngredient, service: EatrService): Promise<RecipeIngredient> {
    const userDB = await service.recipeIngredientRepo.get(user).catch(err => {
      throw err;
    });
    //res.send(JSON.stringify(user) + '\n');
    return userDB;
  }

  async delete(user: RecipeIngredient, service: EatrService) {
    service.recipeIngredientRepo.delete(user).catch(err => {
      throw err;
    });
    //res.send('Deleted User #' + user.userID + '\n');
  }

  async exists(user: RecipeIngredient, service: EatrService): Promise<boolean> {
    return await service.recipeIngredientRepo.exists(user).catch(err => {
      throw err;
    });
    //res.send(result + '\n');
  }

  async getRecipesById(obj: Ingredient, service: EatrService): Promise<RecipeIngredient[]> {
    const recipeIngrList = await service.recipeIngredientRepo.getByIngredientID(obj).catch(err => {
      throw err;
    });
    console.log(recipeIngrList);
    return recipeIngrList;
  }

  async getTable(service: EatrService) {
    service.recipeIngredientRepo.getTable();
  }
}
