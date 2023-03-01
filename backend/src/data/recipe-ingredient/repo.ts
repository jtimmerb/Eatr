import {RecipeIngredient, RecipeIngredientEntity} from './entity';
import {RecipeIngredientMapper as Mapper} from './mapper';
import {Repo} from '..';
import {Ingredient} from '../ingredient/entity';
import db_conn from '../db_conn';

interface IngredientAmount {
  ingredientId: number;
  ingredientAmount: string;
}

interface RecipeIngredientRepoInterface extends Repo<RecipeIngredient> {}

export default class RecipeIngredientRepo implements RecipeIngredientRepoInterface {
  private psql: db_conn;

  constructor(psql: db_conn) {
    this.psql = psql;
  }
  public async exists(recipeIngredient: RecipeIngredient): Promise<boolean> {
    const recipeIngredientEnt = Mapper.toDB(recipeIngredient);
    const query = `SELECT EXISTS (SELECT 1 FROM recipe_ingredients WHERE recipe_ingredient_membership_id='${recipeIngredientEnt.recipe_ingredient_membership_id}')`;
    const conn = this.psql;
    const result = await conn.query(query);
    return result.rows[0].exists;
  }

  /** Deletes RecipeIngredient in DB */
  public async delete(recipeIngredient: RecipeIngredient): Promise<void> {
    const recipeIngredientEnt = Mapper.toDB(recipeIngredient);
    const query = `DELETE FROM recipe_ingredients WHERE recipe_ingredient_membership_id=${recipeIngredientEnt.recipe_ingredient_membership_id}`;
    await this.psql.query(query);
  }

  /** Creates RecipeIngredient in DB*/
  public async create(recipeIngredient: RecipeIngredient): Promise<RecipeIngredient> {
    const conn = this.psql;
    const recipeIngredientEnt = Mapper.toDB(recipeIngredient);
    const query = `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, ingredient_amount) VALUES ('${recipeIngredientEnt.recipe_id}',
    '${recipeIngredientEnt.ingredient_id}','${recipeIngredientEnt.ingredient_amount}')`;
    const result = await conn.query(query);
    return {
      recipeIngredientMembershipId: JSON.parse(JSON.stringify(result)).insertId,
      recipeId: recipeIngredient.recipeId,
      ingredientId: recipeIngredient.ingredientId,
      ingredientAmount: recipeIngredient.ingredientAmount,
    };
  }

  public async update(recipeIngredient: RecipeIngredient): Promise<RecipeIngredient> {
    const conn = this.psql;
    const recipeIngredientEnt = Mapper.toDB(recipeIngredient);
    const query = `UPDATE recipe_ingredients SET (recipe_id, ingredient_id, ingredient_amount) VALUES ('${recipeIngredientEnt.recipe_id}',
    '${recipeIngredientEnt.ingredient_id}','${recipeIngredientEnt.ingredient_amount}') WHERE recipe_ingredient_membership_id='${recipeIngredientEnt.recipe_ingredient_membership_id}'`;
    conn.query(query);
    return recipeIngredient;
  }

  /** Get RecipeIngredient by membershipId */
  public async get(recipeIngredient: RecipeIngredient): Promise<RecipeIngredient> {
    const conn = this.psql;
    const recipeIngredientEnt = Mapper.toDB(recipeIngredient);
    const query = `SELECT * FROM recipe_ingredients WHERE recipe_ingredient_membership_id=${recipeIngredientEnt.recipe_ingredient_membership_id}`;
    const result = await conn.query(query);
    return Mapper.fromDB(result.rows[0] as RecipeIngredientEntity);
  }

  public async getByIngredientID(ingredient: Ingredient): Promise<RecipeIngredient[]> {
    const conn = this.psql;
    const query = `SELECT * FROM recipe_ingredients WHERE ingredient_id=${ingredient.ingredientId} LIMIT 20`;
    const result = await conn.query(query);
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
