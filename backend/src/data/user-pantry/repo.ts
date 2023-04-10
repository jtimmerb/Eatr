import {UserPantry, UserPantryEntity} from './entity';
import {UserPantryMapper as Mapper} from './mapper';
import {Repo} from '..';

type UserRecipeRepoInterface = Repo<UserPantry>;

export default class UserPantryRepo implements UserRecipeRepoInterface {
  private psql: any;

  constructor(psql: any) {
    this.psql = psql;
  }
  public async exists(userPantry: UserPantry): Promise<boolean> {
    const userPantryEnt = Mapper.toDB(userPantry);
    const query = `SELECT EXISTS (SELECT 1 FROM user_pantries WHERE up_membership_id='${userPantryEnt.up_membership_id}')`;
    const result = await this.psql.query(query);
    return result.rows[0].exists;
  }

  /** Deletes user in DB */
  public async delete(userPantry: UserPantry): Promise<void> {
    const userPantryEnt = Mapper.toDB(userPantry);
    const query = `DELETE FROM user_pantries WHERE up_membership_id=${userPantryEnt.up_membership_id}`;
    await this.psql.query(query);
  }

  public async deleteByUserAndIngr(userPantry: UserPantry): Promise<void> {
    const userPantryEnt = Mapper.toDB(userPantry);
    const query = `DELETE FROM user_pantries WHERE user_id=${userPantryEnt.user_id} AND ingredient_id=${userPantryEnt.ingredient_id}`;
    await this.psql.query(query);
  }

  public async deleteByIngr(userPantry: UserPantry): Promise<void> {
    const userPantryEnt = Mapper.toDB(userPantry);
    const query = `DELETE FROM user_pantries WHERE ingredient_id=${userPantryEnt.ingredient_id}`;
    await this.psql.query(query);
  }

  public async deleteByUser(userPantry: UserPantry): Promise<void> {
    const userPantryEnt = Mapper.toDB(userPantry);
    const query = `DELETE FROM user_pantries WHERE user_id=${userPantryEnt.user_id}`;
    await this.psql.query(query);
  }

  /** Creates recipe in DB*/
  public async create(userPantry: UserPantry): Promise<UserPantry> {
    const userPantryEnt = Mapper.toDB(userPantry);
    const query = `INSERT INTO user_pantries (user_id, ingredient_id, ingredient_amount) VALUES ('${userPantryEnt.user_id}',
    '${userPantryEnt.ingredient_id}', '${userPantryEnt.ingredient_amount}') RETURNING up_membership_id`;
    const result = await this.psql.query(query);
    return {
      upMembershipId: result.rows[0].up_membership_id,
      userId: userPantry.userId,
      ingredientId: userPantry.ingredientId,
      ingredientAmount: userPantry.ingredientAmount,
    };
  }

  public async update(userPantry: UserPantry): Promise<UserPantry> {
    const userPantryEnt = Mapper.toDB(userPantry);
    const query = `UPDATE user_pantries SET user_id='${userPantryEnt.user_id}', ingredient_id='${userPantryEnt.ingredient_id}', ingredient_amount='${userPantryEnt.ingredient_amount}' WHERE up_membership_id='${userPantryEnt.up_membership_id}'`;
    this.psql.query(query);
    return userPantry;
  }

  /** Get user by upID */
  public async get(userPantry: UserPantry): Promise<UserPantry> {
    const userPantryEnt = Mapper.toDB(userPantry);
    const query = `SELECT * FROM user_pantries WHERE up_membershipId=${userPantryEnt.up_membership_id}`;
    const result = this.psql.query(query);
    return Mapper.fromDB(result.rows[0] as UserPantryEntity);
  }

  public async getByUserId(userPantry: UserPantry): Promise<UserPantry[]> {
    const userPantryEnt = Mapper.toDB(userPantry);
    const query = `SELECT * FROM user_pantries WHERE user_id=${userPantryEnt.user_id}`;
    const result = await this.psql.query(query);
    const entityList = [];
    for (let i = 0; i < result.rowCount; i++) {
      const ent = Mapper.fromDB(result.rows[i] as UserPantryEntity);
      entityList.push(ent);
    }
    return entityList;
  }
}
