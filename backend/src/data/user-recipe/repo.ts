import {UserRecipe, UserRecipeEntity} from './entity';
import {UserRecipeMapper as Mapper} from './mapper';
import {Repo} from '..';
import PG from 'pg';

interface UserRecipeRepoInterface extends Repo<UserRecipe> {}

export default class RecipeIngredientRepo implements UserRecipeRepoInterface {
  private psql: any;

  constructor(psql: any) {
    this.psql = psql;
  }
  public async exists(userRecipe: UserRecipe): Promise<boolean> {
    const query = `SELECT EXISTS (SELECT 1 FROM user_recipes WHERE userRecipeMembershipId='${userRecipe.userRecipeMembershipId}')`;
    const conn = this.psql;
    return new Promise(resolve => {
      conn.query(query, function (err: Error, result: PG.QueryResult) {
        if (err) console.log(err);
        resolve(result.rows[0].exists);
      });
    });
  }

  /** Deletes user in DB */
  public async delete(userRecipe: UserRecipe): Promise<void> {
    const query = `DELETE FROM user_recipes WHERE userRecipeMembershipId=${userRecipe.userRecipeMembershipId}`;
    await this.psql.query(query, function (err: Error) {
      if (err) throw err;
    });
  }

  /** Creates recipe in DB*/
  public async create(userRecipe: UserRecipe): Promise<UserRecipe> {
    const conn = this.psql;
    const userRecipeEnt = Mapper.toDB(userRecipe);
    const query = `INSERT INTO user_recipes (userId, recipeId) VALUES ('${userRecipeEnt.userId}',
    '${userRecipeEnt.recipeId}')`;
    return new Promise(resolve => {
      conn.query(query, function (err: Error, result: PG.QueryResult) {
        if (err) throw err;
        resolve({
          userRecipeMembershipId: JSON.parse(JSON.stringify(result)).insertId,
          recipeId: userRecipe.recipeId,
          userId: userRecipe.userId,
        });
      });
    });
  }

  public async update(userRecipe: UserRecipe): Promise<UserRecipe> {
    const conn = this.psql;
    const userRecipeEnt = Mapper.toDB(userRecipe);
    const query = `UPDATE user_recipes SET (userId, recipeId) VALUES ('${userRecipeEnt.userId}',
    '${userRecipeEnt.recipeId}') WHERE userRecipeMembershipId='${userRecipeEnt.userRecipeMembershipId}'`;
    conn.query(query, null);
    return userRecipe;
  }

  /** Get user by userID */
  public async get(userRecipe: UserRecipe): Promise<UserRecipe> {
    const conn = this.psql;
    const userRecipeEnt = Mapper.toDB(userRecipe);
    return new Promise(function (resolve, reject) {
      const query = `SELECT * FROM user_recipes WHERE userRecipeMembershipId=${userRecipeEnt.userRecipeMembershipId}`;
      conn.query(query, (err: Error, results: PG.QueryResult) => {
        if (err) {
          return reject(err);
        }
        resolve(Mapper.fromDB(results.rows[0] as UserRecipeEntity));
      });
    });
  }
}
