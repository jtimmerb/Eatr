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
    const conn = this.psql;
    const result = await conn.query(query);
    return result.rows[0].exists;
  }

  /** Deletes user in DB */
  public async delete(userPantry: UserPantry): Promise<void> {
    const userPantryEnt = Mapper.toDB(userPantry);
    const conn = this.psql;
    const query = `DELETE FROM user_pantries WHERE up_membership_id=${userPantryEnt.up_membership_id}`;
    await conn.query(query);
  }

  /** Creates recipe in DB*/
  public async create(userPantry: UserPantry): Promise<UserPantry> {
    const conn = this.psql;
    const userPantryEnt = Mapper.toDB(userPantry);
    const query = `INSERT INTO user_pantries (user_id, ingredient_id, ingredient_amount) VALUES ('${userPantryEnt.user_id}',
    '${userPantryEnt.ingredient_id}, '${userPantryEnt.ingredient_amount}')`;
    const result = await conn.query(query);
    return {
      upMembershipId: JSON.parse(JSON.stringify(result)).insertId,
      userId: userPantry.userId,
      ingredientId: userPantry.ingredientId,
      ingredientAmount: userPantry.ingredientAmount,
    };
  }

  public async update(userPantry: UserPantry): Promise<UserPantry> {
    const conn = this.psql;
    const userPantryEnt = Mapper.toDB(userPantry);
    const query = `UPDATE user_pantries SET (user_id, ingredient_id, ingredient_amount) VALUES ('${userPantryEnt.user_id}',
    '${userPantryEnt.ingredient_id}, '${userPantryEnt.ingredient_amount}') WHERE up_membership_id='${userPantryEnt.up_membership_id}'`;
    conn.query(query);
    return userPantry;
  }

  /** Get user by userID */
  public async get(userPantry: UserPantry): Promise<UserPantry> {
    const conn = this.psql;
    const userPantryEnt = Mapper.toDB(userPantry);
    const query = `SELECT * FROM user_pantries WHERE up_membershipId=${userPantryEnt.up_membership_id}`;
    const result = conn.query(query);
    return Mapper.fromDB(result.rows[0] as UserPantryEntity);
  }
}
