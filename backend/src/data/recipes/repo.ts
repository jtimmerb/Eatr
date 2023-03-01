import {Recipe, RecipeEntity} from './entity';
import {Repo} from '..';
import {RecipeMapper as Mapper} from './mapper';
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
    const result = await conn.query(query);
    return result.rows[0].exists;
  }

  /** Deletes user in DB */
  public async delete(recipe: Recipe): Promise<void> {
    const recipeEnt = Mapper.toDB(recipe);
    const query = `DELETE FROM recipes WHERE recipe_id=${recipeEnt.recipe_id}`;
    await this.psql.query(query);
  }

  /** Creates recipe in DB*/
  public async create(recipe: Recipe): Promise<Recipe> {
    const conn = this.psql;
    const recipeEnt = Mapper.toDB(recipe);
    const query = `INSERT INTO recipes (name, steps) VALUES ('${recipeEnt.name}', '${recipeEnt.steps}')`;
    const result = await conn.query(query);
    return {
      recipeId: JSON.parse(JSON.stringify(result)).insertId,
      name: recipe.name,
      steps: recipe.steps,
    };
  }

  public async update(recipe: Recipe): Promise<Recipe> {
    const conn = this.psql;
    const recipeEnt = Mapper.toDB(recipe);
    const query = `UPDATE recipes SET name='${recipeEnt.name}', steps='${recipeEnt.steps}' WHERE recipe_id='${recipeEnt.recipe_id}'`;
    conn.query(query);
    return recipe;
  }

  /** Get user by userID */
  public async get(recipe: Recipe): Promise<Recipe> {
    const conn = this.psql;
    const recipeEnt = Mapper.toDB(recipe);
    const query = `SELECT * FROM recipes WHERE recipe_id=${recipeEnt.recipe_id}`;
    const result = await conn.query(query);
    return Mapper.fromDB(result.rows[0] as RecipeEntity);
  }

  async getRecipesTable() {
    const query = 'SELECT * FROM recipes';
    const conn = this.psql;
    const result = await conn.query(query);
    console.log(result.rows);
  }
}
