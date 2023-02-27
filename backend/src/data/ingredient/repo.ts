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
    const query = `SELECT EXISTS (SELECT 1 FROM ingredients WHERE name='${ingredient.name}')`;
    const conn = this.psql;
    return new Promise(resolve => {
      conn.query(query, function (err: Error, result: PG.QueryResult) {
        if (err) console.log(err);
        resolve(result.rows[0].exists);
      });
    });
  }

  /** Deletes user in DB */
  public async delete(ingredient: Ingredient): Promise<void> {
    const query = `DELETE FROM ingredients WHERE ingredient_id=${ingredient.ingredientId}`;
    await this.psql.query(query, function (err: Error) {
      if (err) throw err;
    });
  }

  /** Creates recipe in DB*/
  public async create(ingredient: Ingredient): Promise<Ingredient> {
    const conn = this.psql;
    const ingredientEnt = Mapper.toDB(ingredient);
    const query = `INSERT INTO ingredients (name, servingSize, calories, proteins, carbohydrates, fats) VALUES ('${ingredientEnt.name}', '${ingredientEnt.servingSize}',
    '${ingredientEnt.calories}','${ingredientEnt.proteins}','${ingredientEnt.carbohydrates}','${ingredientEnt.fats}',)`;
    return new Promise(resolve => {
      conn.query(query, function (err: Error, result: PG.QueryResult) {
        if (err) throw err;
        resolve({
          ingredientId: JSON.parse(JSON.stringify(result)).insertId,
          name: ingredient.name,
          servingSize: ingredient.servingSize,
          calories: ingredient.calories,
          proteins: ingredient.proteins,
          carbohydrates: ingredient.carbohydrates,
          fats: ingredient.fats,
        });
      });
    });
  }

  public async update(ingredient: Ingredient): Promise<Ingredient> {
    const conn = this.psql;
    const ingredientEnt = Mapper.toDB(ingredient);
    const query = `UPDATE ingredients SET (name, servingSize, calories, proteins, carbohydrates, fats) VALUES ('${ingredientEnt.name}', '${ingredientEnt.servingSize}',
    '${ingredientEnt.calories}','${ingredientEnt.proteins}','${ingredientEnt.carbohydrates}','${ingredientEnt.fats}',) WHERE ingredient_id='${ingredient.ingredientId}'`;
    conn.query(query, null);
    return ingredient;
  }

  /** Get user by userID */
  public async get(ingredient: Ingredient): Promise<Ingredient> {
    const conn = this.psql;
    return new Promise(function (resolve, reject) {
      const query = `SELECT * FROM ingredients WHERE ingredient_id=${ingredient.ingredientId}`;
      conn.query(query, (err: Error, results: PG.QueryResult) => {
        if (err) {
          return reject(err);
        }
        resolve(Mapper.fromDB(results.rows[0] as IngredientEntity));
      });
    });
  }

  async getIngredientTable() {
    this.psql.query('SELECT * FROM ingredients', function (err: Error, result: PG.QueryResult) {
      if (err) throw err;
      console.log(result.rows);
    });
  }
}