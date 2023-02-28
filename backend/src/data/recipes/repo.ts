import {Recipe, RecipeEntity} from './entity';
import {Repo} from '..';
import {RecipeMapper as Mapper} from './mapper';
import PG from 'pg';
import db_conn from '../db_conn';

/** This Interface extends the base Repo and implement new methods uniqe to User Entity */

interface RecipeRepoInterface extends Repo<Recipe> {}
/** The Recipe Repo persists and fetches object from DB */
export default class RecipeRepo implements RecipeRepoInterface {
  public psql: db_conn;

  constructor(psql: db_conn) {
    this.psql = psql;
  }
  /** DB INTERACTIONS */
  /** Checks if user exists in DB */
  public async exists(recipe: Recipe): Promise<boolean> {
    const recipeEnt = Mapper.toDB(recipe);
    const query = `SELECT EXISTS (SELECT 1 FROM recipes WHERE name='${recipeEnt.name}')`;
    const conn = this.psql;
    return new Promise(resolve => {
      conn.query(query, function (err: Error, result: PG.QueryResult) {
        if (err) console.log(err);
        resolve(result.rows[0].exists);
      });
    });
  }

  /** Deletes user in DB */
  public async delete(recipe: Recipe): Promise<void> {
    const recipeEnt = Mapper.toDB(recipe);
    const query = `DELETE FROM recipes WHERE recipe_id=${recipeEnt.recipe_id}`;
    await this.psql.query(query, function (err: Error) {
      if (err) throw err;
    });
  }

  /** Creates recipe in DB*/
  public async create(recipe: Recipe): Promise<Recipe> {
    const conn = this.psql;
    const recipeEnt = Mapper.toDB(recipe);
    const query = `INSERT INTO recipes (name, steps) VALUES ('${recipeEnt.name}', '${recipeEnt.steps}')`;
    return new Promise(resolve => {
      conn.query(query, function (err: Error, result: PG.QueryResult) {
        if (err) throw err;
        resolve({
          recipeId: JSON.parse(JSON.stringify(result)).insertId,
          name: recipe.name,
          steps: recipe.steps,
        });
      });
    });
  }

  public async update(recipe: Recipe): Promise<Recipe> {
    const conn = this.psql;
    const recipeEnt = Mapper.toDB(recipe);
    const query = `UPDATE recipes SET name='${recipeEnt.name}', steps='${recipeEnt.steps}' WHERE recipe_id='${recipeEnt.recipe_id}'`;
    conn.query(query, null);
    return recipe;
  }

  /** Get user by userID */
  public async get(recipe: Recipe): Promise<Recipe> {
    const conn = this.psql;
    const recipeEnt = Mapper.toDB(recipe);
    return new Promise(function (resolve, reject) {
      const query = `SELECT * FROM recipes WHERE recipe_id=${recipeEnt.recipe_id}`;
      conn.query(query, (err: Error, results: PG.QueryResult) => {
        if (err) {
          return reject(err);
        }
        resolve(Mapper.fromDB(results.rows[0] as RecipeEntity));
      });
    });
  }

  async getRecipesTable() {
    const query = 'SELECT * FROM recipes';
    this.psql.query(query, function (err: Error, result: PG.QueryResult) {
      if (err) throw err;
      console.log(result.rows);
    });
  }
}
