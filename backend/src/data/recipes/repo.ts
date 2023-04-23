import pg from 'pg';

import {Recipe, RecipeEntity} from './entity';
import {Repo} from '..';
import {RecipeMapper as Mapper} from './mapper';

/** This Interface extends the base Repo and implement new methods uniqe to User Entity */

type RecipeRepoInterface = Repo<Recipe>;
/** The Recipe Repo persists and fetches object from DB */
export default class RecipeRepo implements RecipeRepoInterface {
  public psql: pg.Client;

  constructor(psql: pg.Client) {
    this.psql = psql;
  }
  /** DB INTERACTIONS */
  /** Checks if user exists in DB */
  public async exists(recipe: Recipe): Promise<boolean> {
    const recipeEnt = Mapper.toDB(recipe);
    const query = `SELECT EXISTS (SELECT 1 FROM recipes WHERE recipe_id='${recipeEnt.recipe_id}')`;
    const result = await this.psql.query(query);
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
    const recipeEnt = Mapper.toDB(recipe);
    const query = `INSERT INTO recipes (name, steps) VALUES ('${recipeEnt.name}', '${recipeEnt.steps}') RETURNING recipe_id`;
    const result = await this.psql.query(query);
    return {
      recipeId: result.rows[0].recipe_id,
      name: recipe.name,
      steps: recipe.steps,
    };
  }

  public async update(recipe: Recipe): Promise<Recipe> {
    const recipeEnt = Mapper.toDB(recipe);
    const query = `UPDATE recipes SET name='${recipeEnt.name}', steps='${recipeEnt.steps}' WHERE recipe_id='${recipeEnt.recipe_id}'`;
    await this.psql.query(query);
    return recipe;
  }

  public async get(recipe: Recipe): Promise<Recipe> {
    const recipeEnt = Mapper.toDB(recipe);
    const query = `SELECT * FROM recipes WHERE recipe_id=${recipeEnt.recipe_id}`;
    const result = await this.psql.query(query);
    const db_recipe: RecipeEntity = {
      recipe_id: result.rows[0].recipe_id,
      name: result.rows[0].name,
      steps: JSON.stringify(result.rows[0].steps),
    };
    return Mapper.fromDB(db_recipe as RecipeEntity);
  }

  async getRecipesTable() {
    const query = 'SELECT * FROM recipes';
    const result = await this.psql.query(query);
    console.log(result.rows);
  }
}
