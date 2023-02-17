import {Recipe} from './entity';
import {Repo} from '..';
import {RecipeMapper} from './mapper';
import {Request} from 'express';
import PG from 'pg';

/** This Interface extends the base Repo and implement new methods uniqe to User Entity */
interface InterfaceUserRepo extends Repo<Recipe> {
  getRecipeByID(recipeID: Request): Promise<Recipe>;
}

/** The User Repo persists and fetches object from DB */
export default class RecipeRepo implements InterfaceUserRepo {
  public psql: any;

  constructor(psql: any) {
    this.psql = psql;
  }
  /** DB INTERACTIONS */
  /** Checks if user exists in DB */
  public async exists(name: Request): Promise<boolean> {
    let query = `SELECT EXISTS (SELECT 1 FROM users WHERE name='${name}')`;
    let conn = this.psql;
    return new Promise(resolve => {
      conn.query(query, function (err: Error, result: PG.QueryResult) {
        if (err) console.log(err);
        resolve(result.rows[0].exists);
      });
    });
  }

  /** Deletes user in DB */
  public async delete(recipeID: Request): Promise<void> {
    let query = `DELETE FROM users WHERE user_id=${recipeID}`;
    await this.psql.query(query, function (err: Error) {
      if (err) throw err;
    });
  }

  /** Creates user in DB*/
  public async create(name: Request): Promise<Recipe> {
    let conn = this.psql;
    let query = `INSERT INTO users (name) VALUES ('${name}')`;
    return new Promise(resolve => {
      conn.query(query, function (err: Error, result: PG.QueryResult) {
        if (err) throw err;
        resolve({
          recipeID: JSON.parse(JSON.stringify(result)).insertId,
          name: JSON.stringify(name),
        });
      });
    });
  }

  public async update(name: Request, id: Request): Promise<Recipe> {
    let conn = this.psql;
    let query = `UPDATE users SET name='${name}' WHERE recipe_id='${id}'`;
    conn.query(query);
    return await this.getRecipeByID(id);
  }

  /** Get user by userID */
  public async getRecipeByID(recipeID: Request): Promise<Recipe> {
    let conn = this.psql;
    return new Promise(function (resolve, reject) {
      let query = `SELECT * FROM users WHERE recipe_id=${recipeID}`;
      conn.query(query, (err: Error, results: PG.QueryResult) => {
        if (err) {
          return reject(err);
        }
        resolve(RecipeMapper.fromDB(results.rows));
      });
    });
  }

  async getRecipesTable() {
    this.psql.query('SELECT * FROM users', function (err: Error, result: PG.QueryResult) {
      if (err) throw err;
      console.log(result.rows);
    });
  }
}
