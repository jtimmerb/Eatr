import {Response, Request} from 'express';
import {RecipeMapper} from './mapper';
import EatrService from '../../service/service';

export async function createRecipe(name: Request, res: Response, service: EatrService) {
  let recipe = await service.recipeRepo.create(name);
  res.send(JSON.stringify(recipe) + '\n');
  service.userRepo.getUsersTable();
}

export async function updateRecipe(name: Request, recipe_id: Request, res: Response, service: EatrService) {
  let recipe = await service.userRepo.update(name, recipe_id);
  res.send(JSON.stringify(recipe) + '\n');
  service.userRepo.getUsersTable();
}

export async function getUser(recipe_id: Request, res: Response, service: EatrService) {
  let recipe = await service.recipeRepo.getRecipeByID(recipe_id).catch(err => {
    throw err;
  });
  res.send(JSON.stringify(recipe) + '\n');
}

export async function deleteUser(recipe_id: Request, res: Response, service: EatrService) {
  service.recipeRepo.delete(recipe_id).catch(err => {
    throw err;
  });
  res.send('Deleted User #' + recipe_id + '\n');
}

export async function getUserExists(name: Request, res: Response, service: EatrService) {
  let result = await service.recipeRepo.exists(name).catch(err => {
    throw err;
  });
  res.send(result + '\n');
}
