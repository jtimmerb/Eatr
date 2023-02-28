import {RecipeIngredient, RecipeIngredientEntity} from './entity';
import {RecipeIngredientMapper as Mapper} from './mapper';
import {Repo} from '..';
import PG from 'pg';

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
    const query = `SELECT EXISTS (SELECT 1 FROM recipe_ingredients WHERE recipeIngredientMembershipId='${recipeIngredient.recipeIngredientMembershipId}')`;
    const conn = this.psql;
    return new Promise(resolve => {
      conn.query(query, function (err: Error, result: PG.QueryResult) {
        if (err) console.log(err);
        resolve(result.rows[0].exists);
      });
    });
  }

  /** Deletes user in DB */
  public async delete(recipeIngredient: RecipeIngredient): Promise<void> {
    const query = `DELETE FROM recipe_ingredients WHERE recipeIngredientMembershipId=${recipeIngredient.recipeIngredientMembershipId}`;
    await this.psql.query(query, function (err: Error) {
      if (err) throw err;
    });
  }

  /** Creates recipe in DB*/
  public async create(recipeIngredient: RecipeIngredient): Promise<RecipeIngredient> {
    const conn = this.psql;
    const recipeIngredientEnt = Mapper.toDB(recipeIngredient);
    const query = `INSERT INTO recipe_ingredients (recipeId, ingredientId, ingredientAmount) VALUES ('${recipeIngredientEnt.recipeId}',
    '${recipeIngredientEnt.ingredientId}','${recipeIngredientEnt.ingredientAmount}')`;
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
    const query = `UPDATE recipe_ingredients SET (recipeId, ingredientId, ingredientAmount) VALUES ('${recipeIngredientEnt.recipeId}',
    '${recipeIngredientEnt.ingredientId}','${recipeIngredientEnt.ingredientAmount}') WHERE recipeIngredientMembershipId='${recipeIngredientEnt.recipeIngredientMembershipId}'`;
    conn.query(query, null);
    return recipeIngredient;
  }

  /** Get user by userID */
  public async get(recipeIngredient: RecipeIngredient): Promise<RecipeIngredient> {
    const conn = this.psql;
    const recipeIngredientEnt = Mapper.toDB(recipeIngredient);
    return new Promise(function (resolve, reject) {
      const query = `SELECT * FROM recipe_ingredients WHERE recipeIngredientMembershipId=${recipeIngredientEnt.recipeIngredientMembershipId}`;
      conn.query(query, (err: Error, results: PG.QueryResult) => {
        if (err) {
          return reject(err);
        }
        resolve(Mapper.fromDB(results.rows[0] as RecipeIngredientEntity));
      });
    });
  }

  public async getByIngredientID(recipeIngredient: RecipeIngredient): Promise<RecipeIngredient[]> {
    const conn = this.psql;
    const recipeIngredientEnt = Mapper.toDB(recipeIngredient);
    return new Promise(function (resolve, reject) {
      const query = `SELECT 10 FROM recipe_ingredients WHERE ingredientId=${recipeIngredientEnt.ingredientId}`;
      conn.query(query, (err: Error, results: PG.QueryResult) => {
        if (err) {
          return reject(err);
        }
        //console.log(results.rows.length);
        let entityList = [];
        for (let i = 0; i < results.rows.length; i++) {
          entityList.push(Mapper.fromDB(results.rows[i] as RecipeIngredientEntity));
        }
        resolve(entityList);
      });
    });
  }
}
