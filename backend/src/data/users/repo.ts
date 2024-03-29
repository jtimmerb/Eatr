import pg from 'pg';
import {User} from './entity';
import {Repo} from '..';
import {UserMapper as Mapper} from './mapper';
import NotFound from '../../utility/error/notFound';

/** This Interface extends the base Repo and implement new methods uniqe to User Entity */
type InterfaceUserRepo = Repo<User>;

/** The User Repo persists and fetches object from DB */
export default class UserRepo implements InterfaceUserRepo {
  private psql: pg.Client;

  constructor(psql: pg.Client) {
    this.psql = psql;
  }

  /** DB INTERACTIONS */
  /** Checks if user exists in DB */
  public async exists(user: User): Promise<boolean> {
    const userEnt = Mapper.toDB(user);
    const query = `SELECT EXISTS (SELECT 1 FROM users WHERE user_id='${userEnt.user_id}')`;
    const result = await this.psql.query(query);
    return result.rows[0].exists;
  }

  public async existsByName(user: User): Promise<boolean> {
    const userEnt = Mapper.toDB(user);
    const query = `SELECT EXISTS (SELECT 1 FROM users WHERE name='${userEnt.name}')`;
    const result = await this.psql.query(query);
    return result.rows[0].exists;
  }

  /** Deletes user in DB */
  public async delete(user: User): Promise<void> {
    const query = `DELETE FROM users WHERE user_id=${user.userId}`;
    await this.psql.query(query);
  }

  /** Creates user in DB*/
  public async create(user: User): Promise<User> {
    console.log('Data create', user.name);
    const query = `INSERT INTO users (name) VALUES ('${user.name}') RETURNING user_id`;
    const result = await this.psql.query(query);

    const newUser = {
      userId: result.rows[0].user_id,
      name: user.name,
    };

    console.log('New user created: ' + JSON.stringify(newUser));
    return newUser;
  }

  public async update(user: User): Promise<User> {
    const query = `UPDATE users SET name='${user.name}' WHERE user_id='${user.userId}'`;
    this.psql.query(query);
    return user;
  }

  /** Get user by userID */
  public async getById(userId: number): Promise<User> {
    const query = 'SELECT * FROM users WHERE user_id=$1';
    const result = await this.psql.query(query, [userId]);
    // Throw error if user is not found
    if (result.rowCount === 0) throw new NotFound('' + userId, 'userId');

    return Mapper.fromDB(result.rows[0]);
  }

  public async getbyName(name: string): Promise<User[]> {
    const query = 'SELECT * FROM users WHERE name=$1';
    const result = await this.psql.query(query, [name]);
    return result.rows.map(row => Mapper.fromDB(row));
  }

  async getUsersTable() {
    const query = 'SELECT * FROM users';
    const result = await this.psql.query(query);
    console.log(result.rows);
  }
}
