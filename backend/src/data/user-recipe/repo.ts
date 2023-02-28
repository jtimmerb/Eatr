import {UserRecipe, UserRecipeEntity} from './entity';
import {UserRecipeMapper as Mapper} from './mapper';
import {Repo} from '..';
import PG from 'pg';

interface UserRecipeRepoInterface extends Repo<UserRecipe> {}

export default class UserRecipeRepo implements UserRecipeRepoInterface {
  private psql: any;

  constructor(psql: any) {
    this.psql = psql;
  }
  public async exists(userRecipe: UserRecipe): Promise<boolean> {
    const userRecipeEnt = Mapper.toDB(userRecipe);
    const query = `SELECT EXISTS (SELECT 1 FROM user_recipes WHERE user_recipe_membership_id='${userRecipeEnt.user_recipe_membership_id}')`;
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
    const userRecipeEnt = Mapper.toDB(userRecipe);
    const query = `DELETE FROM user_recipes WHERE user_recipe_membership_id=${userRecipeEnt.user_recipe_membership_id}`;
    await this.psql.query(query, function (err: Error) {
      if (err) throw err;
    });
  }

  /** Creates recipe in DB*/
  public async create(userRecipe: UserRecipe): Promise<UserRecipe> {
    const conn = this.psql;
    const userRecipeEnt = Mapper.toDB(userRecipe);
    const query = `INSERT INTO user_recipes (user_id, recipe_id) VALUES ('${userRecipeEnt.user_id}',
    '${userRecipeEnt.recipe_id}')`;
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
    const query = `UPDATE user_recipes SET (user_id, recipe_id) VALUES ('${userRecipeEnt.user_id}',
    '${userRecipeEnt.recipe_id}') WHERE user_recipe_membership_id='${userRecipeEnt.user_recipe_membership_id}'`;
    conn.query(query, null);
    return userRecipe;
  }

  /** Get user by userID */
  public async get(userRecipe: UserRecipe): Promise<UserRecipe> {
    const conn = this.psql;
    const userRecipeEnt = Mapper.toDB(userRecipe);
    return new Promise(function (resolve, reject) {
      const query = `SELECT * FROM user_recipes WHERE user_recipe_membership_id=${userRecipeEnt.user_recipe_membership_id}`;
      conn.query(query, (err: Error, results: PG.QueryResult) => {
        if (err) {
          return reject(err);
        }
        resolve(Mapper.fromDB(results.rows[0] as UserRecipeEntity));
      });
    });
  }
}
