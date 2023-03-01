import {Ingredient, IngredientEntity} from './entity';
import {IngredientMapper as Mapper} from './mapper';
import {Repo} from '..';
import PG from 'pg';

interface IngredientRepoInterface extends Repo<Ingredient> {}

export default class IngredientRepo implements IngredientRepoInterface {
  private psql: any;

  constructor(psql: any) {
    this.psql = psql;
  }

  public async exists(ingredient: Ingredient): Promise<boolean> {
    const ingredientEnt = Mapper.toDB(ingredient);
    const query = `SELECT EXISTS (SELECT 1 FROM ingredients WHERE name='${ingredientEnt.name}')`;
    const conn = this.psql;
    return await conn.query(query).rows[0].exists;
  }

  /** Deletes user in DB */
  public async delete(ingredient: Ingredient): Promise<void> {
    const ingredientEnt = Mapper.toDB(ingredient);
    const query = `DELETE FROM ingredients WHERE ingredient_id=${ingredientEnt.ingredient_id}`;
    const conn = this.psql;
    await conn.query(query);
  }

  /** Creates recipe in DB*/
  public async create(ingredient: Ingredient): Promise<Ingredient> {
    const conn = this.psql;
    const ingredientEnt = Mapper.toDB(ingredient);
    const query = `INSERT INTO ingredients (name, serving_size, calories, proteins, carbohydrates, fats) VALUES ('${ingredientEnt.name}', '${ingredientEnt.serving_size}',
    '${ingredientEnt.calories}','${ingredientEnt.proteins}','${ingredientEnt.carbohydrates}','${ingredientEnt.fats}',)`;
    const result = await conn.query(query);
    return {
      ingredientId: JSON.parse(JSON.stringify(result)).insertId,
      name: ingredient.name,
      servingSize: ingredient.servingSize,
      calories: ingredient.calories,
      proteins: ingredient.proteins,
      carbohydrates: ingredient.carbohydrates,
      fats: ingredient.fats,
    };
  }

  public async update(ingredient: Ingredient): Promise<Ingredient> {
    const conn = this.psql;
    const ingredientEnt = Mapper.toDB(ingredient);
    const query = `UPDATE ingredients SET (name, serving_size, calories, proteins, carbohydrates, fats) VALUES ('${ingredientEnt.name}', '${ingredientEnt.serving_size}',
    '${ingredientEnt.calories}','${ingredientEnt.proteins}','${ingredientEnt.carbohydrates}','${ingredientEnt.fats}',) WHERE ingredient_id='${ingredientEnt.ingredient_id}'`;
    conn.query(query, null);
    return ingredient;
  }

  /** Get user by userID */
  public async get(ingredient: Ingredient): Promise<Ingredient> {
    const conn = this.psql;
    const ingredientEnt = Mapper.toDB(ingredient);
    const query = `SELECT * FROM ingredients WHERE ingredient_id=${ingredientEnt.ingredient_id}`;
    const result = conn.query(query);
    return await Mapper.fromDB(result.rows[0] as IngredientEntity);
  }

  async getIngredientTable() {
    const query = 'SELECT * FROM ingredients';
    this.psql.query(query);
  }
}
