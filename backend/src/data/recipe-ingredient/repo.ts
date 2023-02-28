import {RecipeIngredient, RecipeIngredientEntity} from './entity';
import {RecipeIngredientMapper as Mapper} from './mapper';
import {Repo} from '..';
import PG from 'pg';
import {Ingredient} from '../ingredient/entity';

interface IngredientAmount {
  ingredientId: number;
  ingredientAmount: string;
}

interface RecipeIngredientRepoInterface extends Repo<RecipeIngredient> {}

export default class RecipeIngredientRepo implements RecipeIngredientRepoInterface {
  private psql: any;

  constructor(psql: any) {
    this.psql = psql;
  }
  public async exists(recipeIngredient: RecipeIngredient): Promise<boolean> {
    const recipeIngredientEnt = Mapper.toDB(recipeIngredient);
    const query = `SELECT EXISTS (SELECT 1 FROM recipe_ingredients WHERE recipe_ingredient_membership_id='${recipeIngredientEnt.recipe_ingredient_membership_id}')`;
    const conn = this.psql;
    return new Promise(resolve => {
      conn.query(query, function (err: Error, result: PG.QueryResult) {
        if (err) console.log(err);
        resolve(result.rows[0].exists);
      });
    });
  }

  /** Deletes RecipeIngredient in DB */
  public async delete(recipeIngredient: RecipeIngredient): Promise<void> {
    const recipeIngredientEnt = Mapper.toDB(recipeIngredient);
    const query = `DELETE FROM recipe_ingredients WHERE recipe_ingredient_membership_id=${recipeIngredientEnt.recipe_ingredient_membership_id}`;
    await this.psql.query(query, function (err: Error) {
      if (err) throw err;
    });
  }

  /** Creates RecipeIngredient in DB*/
  public async create(recipeIngredient: RecipeIngredient): Promise<RecipeIngredient> {
    const conn = this.psql;
    const recipeIngredientEnt = Mapper.toDB(recipeIngredient);
    const query = `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, ingredient_amount) VALUES ('${recipeIngredientEnt.recipe_id}',
    '${recipeIngredientEnt.ingredient_id}','${recipeIngredientEnt.ingredient_amount}')`;
    return new Promise(resolve => {
      conn.query(query, function (err: Error, result: PG.QueryResult) {
        if (err) throw err;
        resolve({
          recipeIngredientMembershipId: JSON.parse(JSON.stringify(result)).insertId,
          recipeId: recipeIngredient.recipeId,
          ingredientId: recipeIngredient.ingredientId,
          ingredientAmount: recipeIngredient.ingredientAmount,
        });
      });
    });
  }

  public async update(recipeIngredient: RecipeIngredient): Promise<RecipeIngredient> {
    const conn = this.psql;
    const recipeIngredientEnt = Mapper.toDB(recipeIngredient);
    const query = `UPDATE recipe_ingredients SET (recipe_id, ingredient_id, ingredient_amount) VALUES ('${recipeIngredientEnt.recipe_id}',
    '${recipeIngredientEnt.ingredient_id}','${recipeIngredientEnt.ingredient_amount}') WHERE recipe_ingredient_membership_id='${recipeIngredientEnt.recipe_ingredient_membership_id}'`;
    conn.query(query, null);
    return recipeIngredient;
  }

  /** Get RecipeIngredient by membershipId */
  public async get(recipeIngredient: RecipeIngredient): Promise<RecipeIngredient> {
    const conn = this.psql;
    const recipeIngredientEnt = Mapper.toDB(recipeIngredient);
    return new Promise(function (resolve, reject) {
      const query = `SELECT * FROM recipe_ingredients WHERE recipe_ingredient_membership_id=${recipeIngredientEnt.recipe_ingredient_membership_id}`;
      conn.query(query, (err: Error, results: PG.QueryResult) => {
        if (err) {
          return reject(err);
        }
        resolve(Mapper.fromDB(results.rows[0] as RecipeIngredientEntity));
      });
    });
  }

  public async getByIngredientID(ingredient: Ingredient): Promise<RecipeIngredient[]> {
    const conn = this.psql;
    return new Promise(function (resolve, reject) {
      const query = `SELECT * FROM recipe_ingredients WHERE ingredient_id=${ingredient.ingredientId} LIMIT 20`;
      conn.query(query, (err: Error, results: PG.QueryResult) => {
        if (err) {
          return reject(err);
        }
        let entityList = [];
        for (let i = 0; i < results.rowCount; i++) {
          let ent = Mapper.fromDB(results.rows[i] as RecipeIngredientEntity);
          entityList.push(ent);
        }
        resolve(entityList);
      });
    });
  }

  async getTable() {
    const query = 'SELECT * FROM recipe_ingredients';
    this.psql.query(query, function (err: Error, result: PG.QueryResult) {
      if (err) throw err;
      console.log(result.rows);
    });
  }
}
