import {User} from './entity';
import {Repo} from '..';
import {UserMapper as Mapper} from './mapper';
import db_conn from '../db_conn';

/** This Interface extends the base Repo and implement new methods uniqe to User Entity */
type InterfaceUserRepo = Repo<User>;

/** The User Repo persists and fetches object from DB */
export default class UserRepo implements InterfaceUserRepo {
  public psql: db_conn;

  constructor(psql: db_conn) {
    this.psql = psql;
  }
  /** DB INTERACTIONS */
  /** Checks if user exists in DB */
  public async exists(user: User): Promise<boolean> {
    const query = `SELECT EXISTS (SELECT 1 FROM users WHERE name='${user.name}')`;
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
    const query = `INSERT INTO users (name) VALUES ('${user.name}')`;
    const result = await this.psql.query(query);
    return {
      userId: JSON.parse(JSON.stringify(result)).insertId,
      name: user.name,
    };
  }

  public async update(user: User): Promise<User> {
    const query = `UPDATE users SET name='${user.name}' WHERE user_id='${user.userId}'`;
    this.psql.query(query);
    return user;
  }

  /** Get user by userID */
  public async get(user: User): Promise<User> {
    const query = `SELECT * FROM users WHERE user_id=${user.userId}`;
    const result = await this.psql.query(query);
    return Mapper.fromDB(result.rows[0]);
  }

  async getUsersTable() {
    const query = 'SELECT * FROM users';
    const result = await this.psql.query(query);
    console.log(result.rows);
  }
}
