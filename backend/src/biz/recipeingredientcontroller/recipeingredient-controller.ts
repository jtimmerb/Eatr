import {RecipeIngredient} from '../../data/recipe-ingredient/entity';
import {Recipe} from '../../data/recipes/entity';
import {Ingredient} from '../../data/ingredient/entity';
import IngredientRepo from '../../data/ingredient/repo';
import RecipeRepo from '../../data/recipes/repo';
import RecipeIngredientRepo from '../../data/recipe-ingredient/repo';
import RepoController from '../repoController';
import  RecipeController  from '../recipe-controller/recipe-controller';

export default class RecipeIngredientController{

    private repo: RecipeIngredientRepo
  
    private recipeController : RecipeController

  constructor(repo: RecipeIngredientRepo, recipeController: RecipeController) {    
    this.repo = repo
    this.recipeController = recipeController
  }

  public createRecipeIngredient = async (newRecipeIngredient: RecipeIngredient): Promise<RecipeIngredient> => {
    const recipeIngredient = await this.getRepo().create(newRecipeIngredient);
    return recipeIngredient;
  };

  public deleteRecipe = async (recipeIngredient: RecipeIngredient): Promise<void> => {
    const res = await this.getRepo().delete(recipeIngredient);
  };

  public updateRecipe = async (newRecipeIngredient: RecipeIngredient): Promise<void> => {
    const res = await this.getRepo().update(newRecipeIngredient);
  };

  public getRecipeIngredient = async (recipeIngredientMembershipID: number): Promise<RecipeIngredient> => {
    const recipeIngredient: RecipeIngredient = {
        recipeIngredientMembershipId: recipeIngredientMembershipID,
        recipeId: 0,
        ingredientId: 0,
        ingredientAmount: ""
    }
    const recipeReceivedIngredient = await this.getRepo().get(recipeIngredient);
    return recipeReceivedIngredient
  };

  public getFiveRandomRecipes = async (ingredientID: number): Promise<Recipe[]> => {
    const ingredient: Ingredient = {
        ingredientId: ingredientID,
        name: "",
        servingSize: "",
        calories: 0,
        proteins: 0,
        carbohydrates: 0,
        fats: 0,
      }
    const recipeReceivedIngredient = await this.getRepo().getByIngredientID(ingredient);
    const randomNums = new Array(5)
    const randomRecipes = new Array(5)
    let i = 0
    while(i <= 5){
        const randomInt = (randomIntFromInterval(0 ,randomRecipes.length))
        if(randomNums.includes(randomInt) == false){
            randomNums.push(randomInt)
            randomRecipes.push(this.recipeController.getRecipe())
            i += 1
        }
    }

    return randomRecipes
  };
}

function randomIntFromInterval(min : number, max : number) { 
  return Math.floor(Math.random() * (max - min + 1) + min)
}