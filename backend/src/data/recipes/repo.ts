import {Recipe} from './entity';
import {Repo} from '..';
import {RecipeMapper} from './mapper';
import PG from 'pg';
import db_conn from '../db_conn';

/** This Interface extends the base Repo and implement new methods uniqe to User Entity */
interface InterfaceUserRepo extends Repo<Recipe> {}

/** The User Repo persists and fetches object from DB */
export default class RecipeRepo implements InterfaceUserRepo {
  public psql: db_conn;

  constructor(psql: db_conn) {
    this.psql = psql;
  }
  /** DB INTERACTIONS */
  /** Checks if user exists in DB */
  public async exists(recipe: Recipe): Promise<boolean> {
    let query = `SELECT EXISTS (SELECT 1 FROM recipes WHERE name='${recipe.name}')`;
    let conn = this.psql;
    return new Promise(resolve => {
      conn.query(query, function (err: Error, result: PG.QueryResult) {
        if (err) console.log(err);
        resolve(result.rows[0].exists);
      });
    });
  }

  /** Deletes user in DB */
  public async delete(recipe: Recipe): Promise<void> {
    let query = `DELETE FROM recipes WHERE recipe_id=${recipe.recipeID}`;
    await this.psql.query(query, function (err: Error) {
      if (err) throw err;
    });
  }

  /** Creates recipe in DB*/
  public async create(recipe: Recipe): Promise<Recipe> {
    let conn = this.psql;
    let query = `INSERT INTO recipes (name, steps) VALUES ('${recipe.name}', '${JSON.stringify(recipe.steps)}')`;
    return new Promise(resolve => {
      conn.query(query, function (err: Error, result: PG.QueryResult) {
        if (err) throw err;
        resolve({
          recipeID: JSON.parse(JSON.stringify(result)).insertId,
          name: recipe.name,
          steps: recipe.steps,
        });
      });
    });
  }

  public async update(recipe: Recipe): Promise<Recipe> {
    let conn = this.psql;
    let query = `UPDATE recipes SET name='${recipe.name}', steps='${recipe.steps}' WHERE recipe_id='${recipe.recipeID}'`;
    conn.query(query, null);
    return recipe;
  }

  /** Get user by userID */
  public async getRecipeByID(recipe: Recipe): Promise<Recipe> {
    let conn = this.psql;
    return new Promise(function (resolve, reject) {
      let query = `SELECT * FROM recipes WHERE recipe_id=${recipe.recipeID}`;
      conn.query(query, (err: Error, results: PG.QueryResult) => {
        if (err) {
          return reject(err);
        }
        resolve(RecipeMapper.fromDB(results.rows));
      });
    });
  }

  async getRecipesTable() {
    this.psql.query('SELECT * FROM recipes', function (err: Error, result: PG.QueryResult) {
      if (err) throw err;
      console.log(result.rows);
    });
  }
}
