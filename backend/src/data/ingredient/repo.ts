import pg from 'pg';

import {Ingredient, IngredientEntity} from './entity';
import {IngredientMapper as Mapper} from './mapper';
import {Repo} from '..';
import NotFound from '../../utility/error/notFound';

type IngredientRepoInterface = Repo<Ingredient>;

export default class IngredientRepo implements IngredientRepoInterface {
  private psql: pg.Client;

  constructor(psql: pg.Client) {
    this.psql = psql;
  }

  public async exists(ingredient: Ingredient): Promise<boolean> {
    const ingredientEnt = Mapper.toDB(ingredient);
    const query = `SELECT EXISTS (SELECT 1 FROM ingredients WHERE ingredient_id='${ingredientEnt.ingredient_id}')`;
    const result = await this.psql.query(query);
    return result.rows[0].exists;
  }

  /** Deletes user in DB */
  public async delete(ingredient: Ingredient): Promise<void> {
    const ingredientEnt = Mapper.toDB(ingredient);
    const query = `DELETE FROM ingredients WHERE ingredient_id=${ingredientEnt.ingredient_id}`;
    await this.psql.query(query);
  }

  /** Creates recipe in DB*/
  public async create(ingredient: Ingredient): Promise<Ingredient> {
    const ingredientEnt = Mapper.toDB(ingredient);
    const query = `INSERT INTO ingredients (name, serving_size, calories, proteins, carbohydrates, fats) VALUES ('${ingredientEnt.name}', '${ingredientEnt.serving_size}',
    '${ingredientEnt.calories}','${ingredientEnt.proteins}','${ingredientEnt.carbohydrates}','${ingredientEnt.fats}') RETURNING ingredient_id`;
    const result = await this.psql.query(query);
    return {
      ingredientId: result.rows[0].ingredient_id,
      name: ingredient.name,
      servingSize: ingredient.servingSize,
      calories: ingredient.calories,
      proteins: ingredient.proteins,
      carbohydrates: ingredient.carbohydrates,
      fats: ingredient.fats,
    };
  }

  public async update(ingredient: Ingredient): Promise<Ingredient> {
    const ingredientEnt = Mapper.toDB(ingredient);
    const query = `UPDATE ingredients SET (name, serving_size, calories, proteins, carbohydrates, fats) VALUES ('${ingredientEnt.name}', '${ingredientEnt.serving_size}',
    '${ingredientEnt.calories}','${ingredientEnt.proteins}','${ingredientEnt.carbohydrates}','${ingredientEnt.fats}',) WHERE ingredient_id='${ingredientEnt.ingredient_id}'`;
    await this.psql.query(query);
    return ingredient;
  }

  /** Get user by userID */
  public async getById(ingredientId: number): Promise<Ingredient> {
    const query = `SELECT * FROM ingredients WHERE ingredient_id=$1`;
    const result = await this.psql.query(query, [ingredientId]);
    if (result.rowCount === 0) throw new NotFound(ingredientId + '', 'ingredientId');
    return Mapper.fromDB(result.rows[0] as IngredientEntity);
  }

  public async listIngredients(searchQuery: string): Promise<Ingredient[]> {
    const query = 'SELECT * FROM ingredients WHERE name=$1';
    const result = await this.psql.query(query, [searchQuery]);
    return result.rows.map(row => Mapper.fromDB(row));
  }

  async getIngredientTable() {
    const query = 'SELECT * FROM ingredients';
    const result = await this.psql.query(query);
    console.log(result.rows);
  }

  public async getByName(name: string): Promise<Ingredient[]> {
    const query = 'SELECT * FROM ingredients WHERE name=$1';
    const result = await this.psql.query(query, [name]);
    return result.rows.map(row => Mapper.fromDB(row));
  }
}
