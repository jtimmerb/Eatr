import {UserRecipe, UserRecipeEntity} from './entity';
import {UserRecipeMapper as Mapper} from './mapper';
import {Repo} from '..';

type UserRecipeRepoInterface = Repo<UserRecipe>;

export default class UserRecipeRepo implements UserRecipeRepoInterface {
  private psql: any;

  constructor(psql: any) {
    this.psql = psql;
  }
  public async exists(userRecipe: UserRecipe): Promise<boolean> {
    const userRecipeEnt = Mapper.toDB(userRecipe);
    const query = `SELECT EXISTS (SELECT 1 FROM user_recipes WHERE user_recipe_membership_id='${userRecipeEnt.user_recipe_membership_id}')`;
    const result = await this.psql.query(query);
    return result.rows[0].exists;
  }

  /** Deletes user in DB */
  public async delete(userRecipe: UserRecipe): Promise<void> {
    const userRecipeEnt = Mapper.toDB(userRecipe);
    const query = `DELETE FROM user_recipes WHERE user_recipe_membership_id=${userRecipeEnt.user_recipe_membership_id}`;
    await this.psql.query(query);
  }

  /** Creates recipe in DB*/
  public async create(userRecipe: UserRecipe): Promise<UserRecipe> {
    const userRecipeEnt = Mapper.toDB(userRecipe);
    const query = `INSERT INTO user_recipes (user_id, recipe_id) VALUES ('${userRecipeEnt.user_id}',
    '${userRecipeEnt.recipe_id}') RETURNING user_recipe_membership_id`;
    const result = this.psql.query(query);
    return {
      userRecipeMembershipId: result.rows[0].user_recipe_membership_id,
      recipeId: userRecipe.recipeId,
      userId: userRecipe.userId,
    };
  }

  public async update(userRecipe: UserRecipe): Promise<UserRecipe> {
    const userRecipeEnt = Mapper.toDB(userRecipe);
    const query = `UPDATE user_recipes SET (user_id, recipe_id) VALUES ('${userRecipeEnt.user_id}',
    '${userRecipeEnt.recipe_id}') WHERE user_recipe_membership_id='${userRecipeEnt.user_recipe_membership_id}'`;
    this.psql.query(query);
    return userRecipe;
  }

  /** Get user by userID */
  public async get(userRecipe: UserRecipe): Promise<UserRecipe> {
    const userRecipeEnt = Mapper.toDB(userRecipe);
    const query = `SELECT * FROM user_recipes WHERE user_recipe_membership_id=${userRecipeEnt.user_recipe_membership_id}`;
    const result = await this.psql.query(query);
    return Mapper.fromDB(result.rows[0] as UserRecipeEntity);
  }

  public async getByUserId(userRecipe: UserRecipe): Promise<UserRecipe[]> {
    const userRecipeEnt = Mapper.toDB(userRecipe);
    const query = `SELECT * FROM user_recipes WHERE user_id=${userRecipeEnt.user_id}`;
    const result = await this.psql.query(query);
    const entityList = [];
    for (let i = 0; i < result.rowCount; i++) {
      const ent = Mapper.fromDB(result.rows[i] as UserRecipeEntity);
      entityList.push(ent);
    }
    return entityList;
  }
}
