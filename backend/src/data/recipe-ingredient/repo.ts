import pg from 'pg';

import {RecipeIngredient, RecipeIngredientEntity} from './entity';
import {RecipeIngredientMapper as Mapper} from './mapper';
import {Repo} from '..';
import {Ingredient} from '../ingredient/entity';

import {Recipe} from '../recipes/entity';

interface IngredientAmount {
  ingredientId: number;
  ingredientAmount: string;
}

type RecipeIngredientRepoInterface = Repo<RecipeIngredient>;

export default class RecipeIngredientRepo implements RecipeIngredientRepoInterface {
  private psql: pg.Client;

  constructor(psql: pg.Client) {
    this.psql = psql;
  }
  public async exists(recipeIngredient: RecipeIngredient): Promise<boolean> {
    const recipeIngredientEnt = Mapper.toDB(recipeIngredient);
    const query = `SELECT EXISTS (SELECT 1 FROM recipe_ingredients WHERE recipe_ingredient_membership_id='${recipeIngredientEnt.recipe_ingredient_membership_id}')`;
    const result = await this.psql.query(query);
    return result.rows[0].exists;
  }

  /** Deletes RecipeIngredient in DB */
  public async delete(recipeIngredient: RecipeIngredient): Promise<void> {
    const recipeIngredientEnt = Mapper.toDB(recipeIngredient);
    const query = `DELETE FROM recipe_ingredients WHERE recipe_ingredient_membership_id=${recipeIngredientEnt.recipe_ingredient_membership_id}`;
    await this.psql.query(query);
  }

  public async deleteByRecipeId(recipeIngredient: RecipeIngredient): Promise<void> {
    const recipeIngredientEnt = Mapper.toDB(recipeIngredient);
    const query = `DELETE FROM recipe_ingredients WHERE recipe_id=${recipeIngredientEnt.recipe_id}`;
    await this.psql.query(query);
  }

  public async deleteByIngrId(recipeIngredient: RecipeIngredient): Promise<void> {
    const recipeIngredientEnt = Mapper.toDB(recipeIngredient);
    const query = `DELETE FROM recipe_ingredients WHERE ingredient_id=${recipeIngredientEnt.ingredient_id}`;
    await this.psql.query(query);
  }

  /** Creates RecipeIngredient in DB*/
  public async create(recipeIngredient: RecipeIngredient): Promise<RecipeIngredient> {
    const recipeIngredientEnt = Mapper.toDB(recipeIngredient);
    const query = `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, ingredient_amount) VALUES ('${recipeIngredientEnt.recipe_id}',
    '${recipeIngredientEnt.ingredient_id}','${recipeIngredientEnt.ingredient_amount}') RETURNING recipe_ingredient_membership_id`;
    const result = await this.psql.query(query);
    return {
      recipeIngredientMembershipId: result.rows[0].recipe_ingredient_membership_id,
      recipeId: recipeIngredient.recipeId,
      ingredientId: recipeIngredient.ingredientId,
      ingredientAmount: recipeIngredient.ingredientAmount,
    };
  }

  public async update(recipeIngredient: RecipeIngredient): Promise<RecipeIngredient> {
    const recipeIngredientEnt = Mapper.toDB(recipeIngredient);
    const query = `UPDATE recipe_ingredients SET (recipe_id, ingredient_id, ingredient_amount) VALUES ('${recipeIngredientEnt.recipe_id}',
    '${recipeIngredientEnt.ingredient_id}','${recipeIngredientEnt.ingredient_amount}') WHERE recipe_ingredient_membership_id='${recipeIngredientEnt.recipe_ingredient_membership_id}'`;
    await this.psql.query(query);
    return recipeIngredient;
  }

  /** Get RecipeIngredient by membershipId */
  public async get(recipeIngredient: RecipeIngredient): Promise<RecipeIngredient> {
    const recipeIngredientEnt = Mapper.toDB(recipeIngredient);
    const query = `SELECT * FROM recipe_ingredients WHERE recipe_ingredient_membership_id=${recipeIngredientEnt.recipe_ingredient_membership_id}`;
    const result = await this.psql.query(query);
    return Mapper.fromDB(result.rows[0] as RecipeIngredientEntity);
  }

  public async getByIngredientID(ingredient: Ingredient): Promise<RecipeIngredient[]> {
    const query = `SELECT * FROM recipe_ingredients WHERE ingredient_id=${ingredient.ingredientId} LIMIT 20`;
    const result = await this.psql.query(query);
    const entityList = [];
    for (let i = 0; i < result.rowCount; i++) {
      const ent = Mapper.fromDB(result.rows[i] as RecipeIngredientEntity);
      entityList.push(ent);
    }
    return entityList;
  }

  public async getByRecipeID(recipe: Recipe): Promise<RecipeIngredient[]> {
    const query = `SELECT * FROM recipe_ingredients WHERE recipe_id=${recipe.recipeId}`;
    const result = await this.psql.query(query);
    const entityList = [];
    for (let i = 0; i < result.rowCount; i++) {
      const ent = Mapper.fromDB(result.rows[i] as RecipeIngredientEntity);
      entityList.push(ent);
    }
    return entityList;
  }

  async getTable() {
    const query = 'SELECT * FROM recipe_ingredients';
    const result = await this.psql.query(query);
    console.log(result.rows);
  }
}
