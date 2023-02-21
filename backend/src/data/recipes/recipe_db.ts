import {Recipe} from './entity';
import EatrService from '../../service/service';

export default class recipeCmnds {
  async create(recipe: Recipe, service: EatrService): Promise<Recipe> {
    let recipeRet = await service.recipeRepo.create(recipe);
    service.recipeRepo.getRecipesTable();
    return recipeRet;
  }

  async update(recipe: Recipe, service: EatrService): Promise<Recipe> {
    let recipeRet = await service.recipeRepo.update(recipe);
    //res.send(JSON.stringify(recipe) + '\n');
    service.recipeRepo.getRecipesTable();
    return recipeRet;
  }

  async get(recipe: Recipe, service: EatrService): Promise<Recipe> {
    let recipeRet = await service.recipeRepo.get(recipe).catch(err => {
      throw err;
    });
    //res.send(JSON.stringify(recipe) + '\n');
    return recipeRet;
  }

  async delete(recipe: Recipe, service: EatrService) {
    service.recipeRepo.delete(recipe).catch(err => {
      throw err;
    });
    //res.send('Deleted User #' + recipe.recipeID + '\n');
  }

  async exists(recipe: Recipe, service: EatrService): Promise<boolean> {
    let result = await service.recipeRepo.exists(recipe).catch(err => {
      throw err;
    });
    return result;
    //res.send(result + '\n');
  }
}
